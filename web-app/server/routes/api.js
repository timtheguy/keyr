const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const axios = require('axios');

const fs = require("fs");

var openpgp = require('openpgp');

openpgp.initWorker({
  path: 'openpgp.worker.js'
}) // set the relative web worker path

openpgp.config.aead_protect = true // activate fast AES-GCM mode (not yet OpenPGP standard)

var orgKeys = require("../keys.json");

/**
 * Default method for routing web requests
 */
router.get('/', (req, res) => {
  res.send('api works');
});

/**
 * Defines the connection for the MongoDB database
 */
const connection = (closure) => {
  return MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/keyr-code', (err, client) => {
    if (err) return console.log(err);

    let db = client.db();
    console.log("Database connection is good!");
    closure(db);
  });
};

/**
 * Gracefully handle errors in requests
 */
const sendError = (err, res) => {
  response.status = 501;
  response.message = typeof err == 'object' ? err.message : err;
  res.status(501).json(response);
};

// Handle responses gracefully 
let response = {
  status: 200,
  data: [],
  message: null
};

/**
 * The request route to get the details of the organization
 */
router.get('/api/organization', (req, res) => {
  var organization = {};
  organization.name = "Bank of ERAU"; //default, hardcoded org name for now
  organization.keys = orgKeys;
  res.json(organization);
});

/**
 * The route returning a message based on a provided ID 
 */
router.get('/msg', function (req, res) {
  connection((db) => {
    db.collection('messages')
      .findOne({
        id: req.query.id
      })
      .then((data) => {
        if (data == null) {
          res.json({
            "error": "not found"
          });
        } else {
          res.json(data);
        }
      })
      .catch((err) => {});
  });

});

/**
 * Adds a message to be stored in the server for later retrieval
 */
router.post('/api/addMessage', (req, res) => {
  var message = req.body.message;

  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++) //Generate a 6 character "unique" ID
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  var messageObject = {
    id: text, //the randomly generated alphanumeric ID 
    message: message //the encrypted and signed content to be returned from the server
  }

  connection((db) => {
    db.collection('messages').insertOne(messageObject, function (err, doc) {
      if (err) {
        res.send(err.message);
      } else {
        res.status(201).json({
          "id_of_message": text
        });
      }
    });
  });
});


/**
 * Returns all users in the system along with their public key
 */
router.get('/api/users', (req, res) => {
  connection((db) => {
    db.collection('users')
      .find()
      .toArray()
      .then((users) => {
        response.data = users;
        res.json(response);
      })
      .catch((err) => {
        sendError(err, res);
      });
  });
});

/**
 * Enrolls a user into the system, generating private and public keys
 * 
 * TODO: Obtain the passphrase for the private key from the enroll request, not hard code
 */
router.post('/api/enroll', (req, res) => {
  var newUser = req.body;

  var options = {
    userIds: [{
      name: '',
      email: ''
    }], // at least one user id
    numBits: 512, // RSA key size, shorter = faster
    passphrase: 'my secret that only the user knows' // protects private key
  };

  openpgp.generateKey(options).then(function (key) {
    var privkey = key.privateKeyArmored; // '-----BEGIN PGP PRIVATE KEY BLOCK ... '
    var pubkey = key.publicKeyArmored; // '-----BEGIN PGP PUBLIC KEY BLOCK ... '

    //only add public key to db, return everything back to user
    newUser.publickey = pubkey;

    var keyStrings = {
      "private": privkey,
      "public": pubkey
    }

    connection((db) => {
      db.collection('users').insertOne(newUser, function (err, doc) { //store new user
        if (err) {
          res.send(err.message);
        } else {
          // show user their new private + public key
          res.status(201).json({
            "user_keys": keyStrings,
            "org_public": orgKeys.public
          });
        }
      });
    })
  });
});

module.exports = router;
