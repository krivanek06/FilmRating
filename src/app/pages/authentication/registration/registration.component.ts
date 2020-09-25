import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LoginIUser, RegisterIUser} from '../../../shared/models/IUser.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IonicDialogService} from '../../../shared/services/ionic-dialog.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrationComponent implements OnInit {

  @Output() registrationEmitter: EventEmitter<RegisterIUser> = new EventEmitter<RegisterIUser>();
  registrationForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private ionicDialogService: IonicDialogService) {

  }

  ngOnInit() {
    this.registrationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password1: ['', Validators.required],
      password2: ['', Validators.required]
    });
  }


  register() {
    if (this.registrationForm.invalid) {
      return;
    }
    if (this.password1.value !== this.password2.value) {
      this.password1.patchValue(null);
      this.password2.patchValue(null);
      this.password1.updateValueAndValidity();
      this.password2.updateValueAndValidity();
      this.ionicDialogService.presentToast('Passwords do not match!');
      return;
    }

    this.registrationEmitter.emit({
      email: this.email.value,
      password1: this.password1.value,
      password2: this.password2.value
    });
  }

  get email() {
    return this.registrationForm.get('email');
  }

  get password1() {
    return this.registrationForm.get('password1');
  }

  get password2() {
    return this.registrationForm.get('password2');
  }

}
