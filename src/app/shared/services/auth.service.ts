import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
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

    const user = JSON.parse(localStorage.getItem(this.USER_KEY)); // check if already logged in
    this.userSubject$.next(user);
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
        email: credential.user.email
      };
      await this.firestore.collection('users').doc(credential.user.uid).set(user);
    } else {
      const data = await this.firestore.collection('users').doc(credential.user.uid).get().toPromise();
      user = data.data() as IUser;
    }

    this.userSubject$.next(user);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }


}
