# KeyR Code
KeyR code is an implementation of QR code technology that allows the user to decrypt and decode securely generated QR codes from the server.

## Overview
This repository contains the source for a server and mobile application pair designed to demonstrate the implementation of public key cryptography primitives in securing the contents of a QR-encoded barcode.

### How It Works
1. The user enrolls in the mobile application, locally generating a PGP public and private key pair.
2. The public key of the user is exchanged with the public key of the organization.
3. The organization can then generate an encrypted for that specific user, using their public key.
4. The organization also signs the message with their private key, allowing the user to verify with the public key upon receipt.
5. The message is stored in the server and associated with a unique 6-character ID.
6. The ID is encoded with the URL and can be used to retrieve the message. The mobile application's barcode scanner capability enables this automatically.

### Demo
1. Visit the live deployment of the application on Heroku at [https://keyr.herokuapp.com](https://keyr.herokuapp.com).
2. Download the [Ionic View](https://ionicframework.com/pro/view) application and view the application with code `57db4331`
3. Enroll in the mobile application
4. Press "Refresh Users"
5. Select your enrollment name
6. Generate a QR code with your message
7. Scan the barcode from your mobile device

### Built With
* [Ionic Framework](https://ionicframework.com/)
* [MEAN Stack](http://mean.io/)
  * **M**ongoDB
  * **E**xpress
  * **A**ngular
  * **N**ode
* [Phonegap Barcode Scanner plugin](https://github.com/phonegap/phonegap-plugin-barcodescanner)
* [qrcode module](https://www.npmjs.com/package/qrcode)
* [openpgp.js](https://openpgpjs.org/)
   


---
###### Created for the final project of my cryptography class
