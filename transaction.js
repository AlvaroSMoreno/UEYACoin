var SHA256 = require('crypto-js/sha256');
var EC = require('elliptic').ec;
var ec = new EC('secp256k1');

class Transaction {
	constructor(fromAddress, toAddress, amount) {
		this.fromAddress = fromAddress;
		this.toAddress = toAddress;
		this.amount = amount;	
	}

	calculateHash() {
		return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
	}

	signTransaction(signInKey) {
		if(signInKey.getPublic('hex') !== this.fromAddress) {
			throw new Error('Cannot sign tx from other accounts!');
		}
		var hashTransaction = this.calculateHash();
		var signature = signInKey.sign(hashTransaction, 'base64');
		this.signature = signature.toDER('hex');
	}

	isValid() {
		if(this.fromAddress === null) {
			return true;
		}
		if(!this.signature || this.signature.length === 0) {
			throw new Error('No signature!');
		}

		var pk = ec.keyFromPublic(this.fromAddress, 'hex');
		return pk.verify(this.calculateHash(), this.signature);
	}
}

module.exports.Transaction = Transaction;