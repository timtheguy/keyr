import { Component } from '@angular/core';
import { DataService } from './data.service';
import { SecureService } from './secure.service';
import { ModalComponent } from './modal/modal.component';

import * as QRCode from 'qrcode';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  users: Array <any> ;
  organization: any = null;
  qrCode: any;
  urlText: any;

  constructor(private data: DataService, private secure: SecureService) {
    this.data.getOrganization().subscribe(res => {
      this.organization = res;
    });

    this.data.getUsers()
      .subscribe(res => {
        this.users = res;
      });
  }

  refreshUserList(){
    this.data.getUsers()
    .subscribe(res => {
      this.users = res;
    });
  }

  generateQR(form){
    var user = form.value.user;  
    var message = form.value.message;
    var user_public = user.publickey;
    var org_private = this.organization.keys.private;

    this.secure.generateQRCode(message, user_public, org_private).then(
      (res) => {
        var messageEnc = res;

        this.data.addMessage(messageEnc).subscribe(res => {
          var urlToEncode = "https://keyr.herokuapp.com/msg?id=" + res.id_of_message;

          QRCode.toDataURL(urlToEncode)
            .then(url => {
              console.log(url)
              this.urlText = urlToEncode;
              this.qrCode = url;
            })
            .catch(err => {
              console.error(err)
            })
        });

      },
      () => console.log("Task Errored!"),
    );
  }

  enrollUser(){
    var name = "a generic name";
    var publickey = "a users generic key";

    this.data.enrollUser(name).subscribe(res => {
      console.log(res);
      alert("Added user: " + name);
    });
  }
}


