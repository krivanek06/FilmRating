import {Injectable} from '@angular/core';
import {AlertController, ToastController} from '@ionic/angular';
import {SharedModule} from '../shared.module';


@Injectable({
  providedIn: SharedModule
})
export class IonicDialogService {

  constructor(private alertController: AlertController,
              private toastController: ToastController) {
  }


  async presentAlertConfirm(message: string) {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-alert-class',
        // header: 'Confirm!',
        message,
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              resolve(true);
            }
          },
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              resolve(false);
            }
          }
        ]
      });
      await alert.present();
    });
  }


  async presentToast(header) {
    const toast = await this.toastController.create({
      header,
      duration: 2000,
      color: 'dark',
      position: 'bottom',
    });
    toast.present();
  }


}
