var SHA256 = require('crypto-js/sha256');

class Block {
	constructor(timestamp, transactions, previousHash='') {
		this.timestamp = timestamp;
		this.transactions = transactions;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
		this.nonce = 0;
	}

	calculateHash() {
		return SHA256(this.timestamp+JSON.stringify(this.transactions)+this.previousHash+this.nonce).toString();
	}

	mineBlock(difficulty) {
		while(this.hash.substring(0,difficulty) !== Array(difficulty+1).join("0")) {
			this.nonce++;
			this.hash = this.calculateHash();
		}
		console.log("Block Mined: " + this.hash);
	}

	posValidateBlock() {
		this.hash = this.calculateHash();
		console.log("Block Validated: " + this.hash);
	}

	hasValidTransactions() {
		if(this.transactions > 0) {
			for(var transaction of this.transactions) {
				if(!transaction.isValid()) {
					return false;
				}
			}
		}
		return true;
	}
}

module.exports.Block = Block;
