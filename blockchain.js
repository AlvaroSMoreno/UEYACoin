var SHA256 = require('crypto-js/sha256');
var Transaction = require('./transaction').Transaction;
var Block = require('./block').Block;

class Blockchain {
	constructor() {
		this.chain = [];
		this.chain.push(this.createGenesisBlock());
		this.difficulty = 1;
		this.pendingTransactions = [];
		this.miningReward = 5;
		this.miners = [];
		this.numOfBlocks = 1;
	}

	createGenesisBlock() {
		return new Block(new Date().getTime().toString(), {transactions:[]}, "");
	}

	getLastBlock() {
		return this.chain[this.chain.length - 1];
	}

	minePendingTransactions(miningRewardAddress) {
		var block = new Block(new Date().getTime().toString(), this.pendingTransactions);
		block.mineBlock(this.difficulty);
		console.log("Block successfully mined!");
		this.chain.push(block);
		checkIfMiner(miningRewardAddress);
		this.pendingTransactions = [
			new Transaction(null, miningRewardAddress, this.miningReward)
		];
	}

	checkIfMiner(address) {
		var flag = false;
		for(var miner of this.miners) {
			if(miner.miner === address) {
				miner.counter++;
				flag = true;
			}
		}
		if(!false) {
			this.miners.push({miner: address, counter: 0});
		}
	}

	addTransaction(transaction) {
		if(!transaction.fromAddress || !transaction.toAddress) {
			throw new Error('Transaction not including addresses!');
		}

		if(!transaction.isValid()) {
			throw new Error('Cannot add to the Block!');
		}

		this.pendingTransactions.push(transaction);
	}

	getBalanceOf(address) {
		var balance = 0;

		for(var block of this.chain) {
			if(block.transactions.length > 0) {
				for(var trans of block.transactions) {
					if(trans.fromAddress === address) {
						balance -= trans.amount;
					}
					if(trans.toAddress === address) {
						balance += trans.amount;
					}
				}
			}
		}
		return balance;
	}

	isChainValid() {
		for( var i = 1; i < this.chain.length; i++) {
			var currentBlock = this.chain[i];
			var previousBlock = this.chain[i-1];

			if(!currentBlock.hasValidTransactions()) {
				return false;
			}

			if(currentBlock.hash !== currentBlock.calculateHash()) {
				return false;
			}
			if(currentBlock.previousHash !== previousBlock.hash) {
				return false;
			}
		}
		return true;
	}

	monopolyMiner() {
		for(var miner of this.miners) {
			if(miner.counter/this.numOfBlocks > 0.33) {
				this.difficulty++;
			}
		}
	}

}

module.exports.Blockchain = Blockchain;