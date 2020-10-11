import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService} from './auth.service';
import {IUserNotification} from '../models/IUser.model';
import {firestore} from 'firebase';
@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private USER_COLLECTION = 'users';


  constructor(private angularFirestore: AngularFirestore,
              private auth: AuthService) {

  }

  async sendNotification(userId: string, notification: IUserNotification): Promise<void> {
    return this.angularFirestore.collection(this.USER_COLLECTION)
      .doc(userId)
      .set({notifications: firestore.FieldValue.arrayUnion(notification)}, {merge: true});
  }

}
