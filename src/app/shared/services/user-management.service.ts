import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService} from './auth.service';
import {IUser, IUserNotification} from '../models/IUser.model';
import {firestore} from 'firebase';
import {Observable} from 'rxjs';
import {first, map, shareReplay} from 'rxjs/operators';

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

  // return list of usernames which start with prefix
  getUsernameStartWithPrefix(prefix: string): Observable<string[]> {
    return this.angularFirestore.collection<IUser>('users',
      (ref) => ref.where('displayName', '>=', prefix).limit(4)
    ).valueChanges().pipe(
      map(users => users.map(user => user.displayName)),
      shareReplay()
    );
  }

  async getIUserByUsername(username: string): Promise<IUser> {
    const ref = await this.angularFirestore.collection<IUser>('users',
      (r) => r.where('displayName', '==', username).limit(1)
    ).get().toPromise();
    const data = ref.docs.map(doc => doc.data() as IUser[]);
    return data.length === 0 ? null : data[0] as unknown as IUser;
  }

  async updateUser(updatedUser: IUser): Promise<any> {
    return this.angularFirestore.collection('users').doc(updatedUser.uid).set(updatedUser);
  }


}
