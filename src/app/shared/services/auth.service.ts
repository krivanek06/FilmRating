import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, pipe} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {IUser, LoginIUser, RegisterIUser} from '../models/IUser.model';
import {auth} from 'firebase/app';
import UserCredential = firebase.auth.UserCredential;
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_KEY = 'USER_KEY';
  private userSubject$: BehaviorSubject<IUser> = new BehaviorSubject<IUser>(null);

  constructor(private afAuth: AngularFireAuth,
              private firestore: AngularFirestore) {

    const user = JSON.parse(localStorage.getItem(this.USER_KEY)) as IUser; // check if already logged in
    if (!!user) {
      this.getUserFromFirestore(user.uid);
    }

  }

  get IUser(): IUser {
    return this.userSubject$.getValue();
  }

  getUser(): Observable<IUser> {
    return this.userSubject$.asObservable();
  }

  async googleSignIn() {
    const provider = new auth.GoogleAuthProvider();
    const credentials = await this.afAuth.signInWithPopup(provider);

    this.formatAndSaveUser(credentials);
  }

  async normalRegistration(registerIUser: RegisterIUser) {
    const user = await this.afAuth.createUserWithEmailAndPassword(registerIUser.email, registerIUser.password1);
    this.formatAndSaveUser(user);
  }

  async normalLogin(loginIUser: LoginIUser) {
    const user = await this.afAuth.signInWithEmailAndPassword(loginIUser.email, loginIUser.password);
    this.formatAndSaveUser(user);
  }

  logout() {
    this.afAuth.signOut();
    localStorage.removeItem(this.USER_KEY);
    this.userSubject$.next(null);
  }

  private async formatAndSaveUser(credential: UserCredential) {
    let user: IUser;

    if (credential.additionalUserInfo.isNewUser) {
      user = {
        displayName: credential.user.email.split('@')[0],
        uid: credential.user.uid,
        email: credential.user.email,
        photoUrl: !!credential.user.photoURL ? credential.user.photoURL : 'https://cdn2.iconfinder.com/data/icons/avatar-profile/434/avatar_contact_starwars_user_default_yoda-512.png',
        notifications: [],
        usersFollowI: [],
        usersFollowMe: [],
        points: 100
      };
      await this.firestore.collection('users').doc(credential.user.uid).set(user);
    }

    this.getUserFromFirestore(credential.user.uid);
  }

  private getUserFromFirestore(uid: string) {
    this.firestore.collection<IUser>('users').doc(uid).valueChanges()
      .subscribe((savedUser: IUser) => {
        // console.log('savedUser', savedUser);
        localStorage.setItem(this.USER_KEY, JSON.stringify(savedUser));
        this.userSubject$.next(savedUser);
      });
  }


}
