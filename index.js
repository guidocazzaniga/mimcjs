const fs = require('fs')
const path = require('path')

// Read default parameters

let rawdata = fs.readFileSync(path.resolve(__dirname, "config.json"));
const config = JSON.parse(rawdata);

const DEFAULT_ROUNDS = config['DEFAULT_ROUNDS']
const DEFAULT_EXPONENT = config['DEFAULT_EXPONENT']
const ROUND_CONSTANTS = config['ROUND_CONSTANTS']
ROUND_CONSTANTS.forEach((c, index) => ROUND_CONSTANTS[index] = parseBigInt(c));
const P = BigInt(config['SNARK_SCALAR_FIELD'])

/**
 * Parse BigInt from a string
 * @param {*} value the string
 * @returns a BigInt
 */
function parseBigInt(value){
    if (typeof value === 'string') {
        const m = value.match(/(-?\d+)n/);
        if (m && m[0] === value) {
            value = BigInt(m[1]);
        }
    }
    return value;
}

/**
 * MiMC Cipher
 * @param {*} input input data
 * @param {*} roundConstants round constants
 * @param {*} k key
 * @returns the ciphertext
 */
function mimcCipher(input,roundConstants,k){
    var a = 0
    for(var i=0; i<DEFAULT_ROUNDS; i++){
        a = (input + BigInt(roundConstants[i]) + k) % P
        input = BigInt(a**BigInt(DEFAULT_EXPONENT))
    }
    return (input + k) % P
}

/**
 * MiMC Hash
 * based on https://github.com/HarryR/ethsnarks/blob/master/ethsnarks/mimc/permutation.py
 * @param {*} input a point
 * @param {*} roundConstants round constants
 * @returns the hash
 */
function mimcHash(input,roundConstants){
    var k = BigInt(0)
    for(var i=0; i<2; i++){
        k = mimcCipher(input[i], roundConstants, k)
    }
    return k 
}

/**
 * Convert inputs and perform mimc hash
 * @param {*} preimage a point
 * @returns the hash
 */
function mimc(preimage){
    if (!Array.isArray(preimage) || !(preimage.length == 2) ) {
        throw 'Expected preimage is a point';
    }
    let inputs = []
    for(var i=0; i<preimage.length; i++){
        inputs.push(BigInt(preimage[i])) 
    }
    return mimcHash(inputs,ROUND_CONSTANTS)
}

module.exports = {mimc}









