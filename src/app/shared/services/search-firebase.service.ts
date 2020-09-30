import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {IUser} from '../models/IUser.model';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchFirebaseService {

  constructor(private firestore: AngularFirestore) {
  }


  getUsernameStartWithPrefix(prefix: string): Observable<any> {
    return this.firestore.collection<IUser>('users',
      (ref) => ref.where('displayName', '>=', prefix).limit(4)
    ).valueChanges().pipe(
      map(users => users.map(user => user.displayName)),
      shareReplay()
    );
  }
}
