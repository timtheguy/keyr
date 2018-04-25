import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import * as openpgp from 'openpgp';
import * as QRCode from 'qrcode';

@Injectable()
export class SecureService {

  constructor() {}

  generateQRCode(message, user_public, org_private):Promise<any> {
    var promise = new Promise((resolve, reject) => {

      var key = openpgp.key.readArmored(org_private).keys[0];
      key.decrypt('testing');

      var options = {
          data: message,
          publicKeys: openpgp.key.readArmored(user_public).keys,
          privateKeys: [key]
      };

      openpgp.encrypt(options).then(encryptedData => {
          resolve(encryptedData.data);
      });
    });

    return promise;
  }
}
 