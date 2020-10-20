import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IUserPartialData} from '../../../../shared/models/IUser.model';

@Component({
  selector: 'app-listed-users',
  templateUrl: './listed-users.component.html',
  styleUrls: ['./listed-users.component.scss']
})
export class ListedUsersComponent implements OnInit {
  @Output() removeUser: EventEmitter<IUserPartialData> = new EventEmitter<IUserPartialData>();
  @Input() users: IUserPartialData[];
  @Input() title: string;
  @Input() subTitle: string;

  constructor() {
  }

  ngOnInit(): void {
  }

  removeItem(user: IUserPartialData) {
    this.removeUser.emit(user);
  }

}
