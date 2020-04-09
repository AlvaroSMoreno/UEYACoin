var Blockchain = require('./blockchain').Blockchain;
var Transaction = require('./transaction').Transaction;
var EC = require('elliptic').ec;
var ec = new EC('secp256k1');

var myKey = ec.keyFromPrivate("964a46dd51c04d3ef9ff207f06a37095b3cd0bbcab6e5015e95bdbe265cf57b3");
var myWalletAddress = myKey.getPublic('hex');

var minerAddress = "04e9e2cfe28114df117c57fcb4702a9083e9a0696f51d2cd52d32beb0183b41e46744e8b027c44fd2ff9490a2f2a21fe559ca788698cb27e31d6beddd2cf9cd3fc";

var UEYAcoin = new Blockchain();

var addressToSend = "0433eb95ee0243823b5a8677546ddb19b9aec136f25ec077e5e12f95f0d13dd6524fd4b14fefb64fb423c48d27f1531b1d336c7c86ac2b37b5673b916f0e2ef949";

var tx = new Transaction(myWalletAddress, addressToSend, 100);
tx.signTransaction(myKey);
UEYAcoin.addTransaction(tx);

console.log("\nBalance of ad1(me): " + UEYAcoin.getBalanceOf(myWalletAddress));
console.log("\nBalance of ad2(you): " + UEYAcoin.getBalanceOf(addressToSend));
console.log("\nBalance of miner: " + UEYAcoin.getBalanceOf(minerAddress));


console.log('\nStarting miners...');
UEYAcoin.minePendingTransactions(minerAddress);

console.log("\nBalance of ad1(me): " + UEYAcoin.getBalanceOf(myWalletAddress));
console.log("\nBalance of ad2(you): " + UEYAcoin.getBalanceOf(addressToSend));
console.log("\nBalance of miner: " + UEYAcoin.getBalanceOf(minerAddress));

console.log('\nStarting miners...');
UEYAcoin.minePendingTransactions(minerAddress);

console.log("\nBalance of ad1(me): " + UEYAcoin.getBalanceOf(myWalletAddress));
console.log("\nBalance of ad2(you): " + UEYAcoin.getBalanceOf(addressToSend));
console.log("\nBalance of miner: " + UEYAcoin.getBalanceOf(minerAddress));
