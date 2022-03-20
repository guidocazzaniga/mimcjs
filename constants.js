const keccak256 = require('keccak256')
const fs = require('fs')

// Read default parameters from config file
let rawdata = fs.readFileSync('config.json');
const config = JSON.parse(rawdata);
const DEFAULT_ROUNDS = config['DEFAULT_ROUNDS']
const P = BigInt(config['SNARK_SCALAR_FIELD'])

/**
 * Get BigInt from the digest resulting from keccak256
 * @param {*} s the digest
 * @returns a BigInt
 */
function H(s){
    return BigInt('0x'+s.toString('hex')) 
}

/**
 * Generate round costants
 * @param {*} seed seed used for the generation
 * @returns round constants
 */
function generateRoundConstants(seed){
    if(typeof(seed) == "string"){
        seed = Buffer.from(seed,'ascii')
    } else if (!Number.isInteger(seed)){
        throw "Invalid seed type"
    }
    constants = []
    for(var i=0; i<DEFAULT_ROUNDS; i++){
        seed = keccak256(seed)
        constants.push(H(seed) % P)
    }
    return writeToFile(constants)
}

/**
 * Write round constants to file
 * @param {*} constants round constants
 */
function writeToFile(constants){
    let rawdata = fs.readFileSync('config.json');
    const config = JSON.parse(rawdata);
    constants.forEach((element,i) => {
        constants[i]= element.toString()+"n"
    });
    config['ROUND_CONSTANTS'] = constants
    let data = JSON.stringify(config);
    fs.writeFileSync('config.json', data);
}

module.exports = {generateRoundConstants}






