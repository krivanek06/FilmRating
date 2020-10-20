import {Pipe, PipeTransform} from '@angular/core';
import {IUserNotification} from '../../../shared/models/IUser.model';

@Pipe({
  name: 'OrderIUserNotification'
})
export class OrderIUserNotificationPipe implements PipeTransform {

  transform(notifications: IUserNotification[]) {
    return notifications.sort((a, b) => b.timestamp - a.timestamp );
  }

}
