var express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config()

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/balanceOf', function(req, res){
	balanceOf(req.body.addr).then(function(bal) {
        return bal
    });
 });

 app.get('/totalSupply', function(req, res){
	totalSupply().then(function(bal) {
        return bal
    });
 });


 app.post('/approve', function(req, res){
    var _delegate= req.body.delegate
    var _numofTokens = req.body.tokens
	approve(_delegate,_numofTokens).then(function(bal) {
        return bal
    });
 });

 app.post('/transferFrom', function(req, res){
    var _from= req.body.from
    var _to= req.body.to
    var _numofTokens = req.body.tokens

	transferTokens(_from,_to,_numofTokens).then(function(bal) {
        return bal
    });

 });

 app.post('/transferTo', function(req, res){
    var _to= req.body.to
    var _numofTokens = req.body.tokens

	transferTokens(_to,_numofTokens).then(function(bal) {
        return bal
    });

 });

 //utility functions 
app.post('/setContractAddr', function(req, res){
    process.env.contAddr = req.body.address
 });

app.post('/setAddress', function(req, res){
    process.env.address = req.body.address
 });

app.post('/setPrivateKey', function(req, res){
    process.env.address = req.body.privKey
 });

//web3 code
const web3 = new Web3(process.env.providerUrl);
const address = process.env.address  //need to modify to be found at the rumtime
const abi = require('../build/contracts/DCERC20.json');   
const contAddr = process.env.contAddr
const contract = new web3.eth.Contract(abi, contAddr)
const privKey = process.env.privKey


const transferTokens = async (fromAddr, toAddr,noOfTokens) => {

       // web3.eth.getTransactionCount(fromAddr, "pending").then((txnCount) => {
       web3.eth.getTransactionCount(fromAddr, (err, txnCount) => {
            // Create the transaction object
            const gasPrice =   await web3.eth.getGasPrice();
            const gasPriceLimit = await web3.eth.estimateGas({
                "from"      : address,    //from addr   
                "nonce"     : web3.utils.numberToHex(txnCount), //nonce
                "to"        : toAddr,     //
                "data"      : contract.methods.transferFrom(fromAddr,toAddr, noOfTokens).encodeABI()
            });

            const txObject = {
                nonce:    web3.utils.toHex(txCount),
                gasLimit: web3.utils.toHex(gasPriceLimit), // Raise the gas limit to a much higher amount
                gasPrice: web3.utils.toHex(gasPrice),
                to: toAddr,
                data: contract.methods.transferFrom(fromAddr,toAddr, noOfTokens).encodeABI()
            }


            const privateKey = Buffer.from(privKey, 'hex')
            const tx = new Tx(txObject)
            tx.sign(privateKey)

            const serializedTx = tx.serialize()
            const raw = '0x' + serializedTx.toString('hex')
            web3.eth.sendSignedTransaction(raw, (err, txHash) => {
                console.log('err:', err, 'txHash:', txHash)
                return txHash
        });
 
    });
}

const balanceOf = async (_addr) => { 

    const balanceFrom = await contract.methods.balanceOf(_addr).call(  //working
        (err, result) => {
        console.log("current balance ")
        console.log(result)
        return result
        }
    )

}

const totalSupply = async () => { 

    const balanceFrom = await contract.methods.totalSupply().call(  //working
        (err, result) => {
        console.log("total supply ")
        console.log(result)
        return result
        }
    )

}

const transferTo = async (toAddr,noOfTokens) => {

    web3.eth.getTransactionCount(address, (err, txnCount) => {

            // Create the transaction object
            const gasPrice =   await web3.eth.getGasPrice();
            const gasPriceLimit = await web3.eth.estimateGas({
                "from"      : process.env.address,    //this needs to be changes to be identified dynamically.  
                "nonce"     : web3.utils.numberToHex(txnCount), //nonce
                "to"        : toAddr,     //
                "data"      : contract.methods.transfer(fromAddr, noOfTokens).encodeABI()
            });

            const txObject = {
                nonce:    web3.utils.toHex(txCount),
                gasLimit: web3.utils.toHex(800000), // Raise the gas limit to a much higher amount
                gasPrice: web3.utils.toHex(gasPrice),
                to: contractAddress,
                data: contract.methods.transfer(fromAddr, noOfTokens).encodeABI()
            }


            const privateKey = Buffer.from(privKey, 'hex')
            const tx = new Tx(txObject)
            tx.sign(privateKey)

            const serializedTx = tx.serialize()
            const raw = '0x' + serializedTx.toString('hex')
            web3.eth.sendSignedTransaction(raw, (err, txHash) => {
                console.log('err:', err, 'txHash:', txHash)
                return txHash
        });

 
    });
}

const approve = async (delegate,noOfTokens) => {

    web3.eth.getTransactionCount(address, (err, txnCount) => {

            // Create the transaction object
            const gasPrice =   await web3.eth.getGasPrice();
            const gasPriceLimit = await web3.eth.estimateGas({
                "from"      : process.env.address,    //this needs to be changes to be identified dynamically.  
                "nonce"     : web3.utils.numberToHex(txnCount), //nonce
                "to"        : delegate,     //
                "data"      : contract.methods.approve(toAddr, noOfTokens).encodeABI()
            });

            const txObject = {
                nonce:    web3.utils.toHex(txCount),
                gasLimit: web3.utils.toHex(800000), // Raise the gas limit to a much higher amount
                gasPrice: web3.utils.toHex(gasPrice),
                to: contractAddress,
                data: contract.methods.approve(toAddr, noOfTokens).encodeABI()
            }

            const privateKey = Buffer.from(privKey, 'hex')
            const tx = new Tx(txObject)
            tx.sign(privateKey)

            const serializedTx = tx.serialize()
            const raw = '0x' + serializedTx.toString('hex')
            web3.eth.sendSignedTransaction(raw, (err, txHash) => {
                console.log('err:', err, 'txHash:', txHash)
                return txHash
        });

 
    });
}

// const promisify = (inner) =>
//     new Promise((resolve, reject) =>
//         inner((err, res) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(res);
//             }
//         })
//     );