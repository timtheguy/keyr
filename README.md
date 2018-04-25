# KeyR Code
KeyR code is an implementation of QR code technology that allows the user to decrypt and decode securely generated QR codes from the server.

## Overview
This repository contains the source for a server and mobile application pair designed to demonstrate the implementation of public key cryptography primitives in securing the contents of a QR-encoded barcode.

## How it Works
1. The user enrolls in the mobile application, locally generating a PGP public and private key pair.
2. The public key of the user is exchanged with the public key of the organization.
3. The organization can then generate an encrypted for that specific user, using their public key.
4. The organization also signs the message with their private key, allowing the user to verify with the public key upon receipt.
5. The message is stored in the server and associated with a unique 6-character ID.
6. The ID is encoded with the URL and can be used to retrieve the message. The mobile application's barcode scanner capability enables this automatically.


---
###### Created for the final project of my cryptography class
