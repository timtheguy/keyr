import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Http, Response } from '@angular/http';

import * as openpgp from 'openpgp';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  host: any = "http://keyr.herokuapp.com";
 
  isEnrolled: boolean = false;
  userName;
  userPublic: any = "";
  userPrivate: any = "";
  orgPublic: any = "";

  constructor(public navCtrl: NavController, public http:Http, private barcodeScanner: BarcodeScanner, private alertCtrl: AlertController) {
  }

  enrollUser() {
    var name = this.userName;

    this.http.post(this.host + "/api/enroll", {
        "id": name
      })
      .subscribe((data: Response) => {
          var response = data.json();
          console.log("Cool! Added user!");
          console.log(response);

          this.showMessage("Success", "User enrolled successfully.");

          this.orgPublic = response.org_public;
          this.userPublic = response.user_keys.public;
          this.userPrivate = response.user_keys.private;

          this.isEnrolled = true;
        },
        (error: any) => {
          console.log("Error: ");
          console.log(error);
        });
  }

  scan() {
    this.barcodeScanner.scan().then((barcodeData) => {
      if (barcodeData) {
        this.http.get(barcodeData.text)
          .subscribe((data: Response) => {
              var response = data.json();
              this.decrypt(response.message);
            },
            (error: any) => {
              console.log("error");
            });
      }
    }, (err) => {
      console.log("ERROR: ");
      console.log(err);
    });

  }

  decrypt(encryptedData){ 
    console.log("Setting decrypt and verify options...");
    var privateKeyUser = openpgp.key.readArmored(this.userPrivate).keys[0];
    privateKeyUser.decrypt('my secret that only the user knows');
    var options = {
        message: openpgp.message.readArmored(encryptedData),
        //public key of org
        publicKeys: openpgp.key.readArmored(this.orgPublic).keys,
        privateKeys: [privateKeyUser]
    };
  
    console.log("Running decrypt...");
    openpgp.decrypt(options)
    .then(decryptedMessage => {
      this.showMessage("Decrypt: Success", (decryptedMessage.data + "<br><br>(Valid signature: " + decryptedMessage.signatures[0].valid + ")"));
    })
    .catch((err) => {
      console.log("Something didn't work...");
      this.showError(err);
    });
  }

  showMessage(title, content){
    let alert = this.alertCtrl.create({
      title: title,
      message: content,
      buttons: ['Dismiss']
    });

    alert.present();
  }

  showError(error){
    let alert = this.alertCtrl.create({
      title: 'Error',
      message: '' + error,
      buttons: ['Dismiss']
    });

    alert.present();
  }

}
