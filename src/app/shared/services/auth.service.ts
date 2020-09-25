import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {IUser, LoginIUser, RegisterIUser} from '../models/IUser.model';
import {auth} from 'firebase/app';
import UserCredential = firebase.auth.UserCredential;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_KEY = 'USER_KEY';
  private userSubject$: BehaviorSubject<IUser> = new BehaviorSubject<IUser>(null);

  constructor(private afAuth: AngularFireAuth) {

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

  private formatAndSaveUser(credential: UserCredential) {
    const formattedUser = {
      displayName: credential.user.email.split('@')[0],
      uid: credential.user.uid,
      email: credential.user.email
    };

    this.userSubject$.next(formattedUser);
    localStorage.setItem(this.USER_KEY, JSON.stringify(formattedUser));
  }


}
