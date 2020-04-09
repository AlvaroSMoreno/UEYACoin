var EC = require('elliptic').ec;
var ec = new EC('secp256k1');

var key = ec.genKeyPair();
var publicKey = key.getPublic('hex');
var secretKey = key.getPrivate('hex');

console.log("SK:",secretKey);
console.log("PK:",publicKey);