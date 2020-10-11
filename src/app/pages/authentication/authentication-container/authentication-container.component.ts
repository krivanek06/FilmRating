import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../shared/services/auth.service';
import {LoginIUser, RegisterIUser} from '../../../shared/models/IUser.model';
import {ComponentBaseComponent} from '../../../shared/components/component-base/component-base.component';
import {takeUntil} from 'rxjs/operators';
import {IonicDialogService} from '../../../shared/services/ionic-dialog.service';
import {LoginComponent} from '../login/login.component';
import {RegistrationComponent} from '../registration/registration.component';

@Component({
  selector: 'app-authentication-container',
  templateUrl: './authentication-container.component.html',
  styleUrls: ['./authentication-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthenticationContainerComponent extends ComponentBaseComponent implements OnInit {
  @ViewChild('loginComp') loginComp: LoginComponent;
  @ViewChild('registrationComp') registrationComp: RegistrationComponent;

  segmentValue = 'login';

  constructor(private authService: AuthService,
              private ionicDialogService: IonicDialogService,
              private router: Router,
              private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.segmentValue = res.params.type;
    });

  }

  segmentChanged(event: CustomEvent) {
    this.segmentValue = event.detail.value;
  }

  async normalLogin(data: LoginIUser) {
    try {
      await this.authService.normalLogin(data);
      this.router.navigate(['menu/dashboard']);
    } catch (e) {
      this.loginComp.loginForm.reset();
      this.ionicDialogService.presentToast(e.message);
    }
  }

  async registration(registerIUser: RegisterIUser) {
    try {
      await this.authService.normalRegistration(registerIUser);
      this.router.navigate(['menu/dashboard']);
    } catch (e) {
      this.registrationComp.registrationForm.reset();
      this.ionicDialogService.presentToast(e.message);
    }
  }

  async signInWithGoogle() {
    await this.authService.googleSignIn();
    await this.router.navigate(['menu/dashboard']);

  }

}
