#!/usr/bin/env node
const {generateRoundConstants} = require('./constants')
const {mimc} = require('./index.js')
const fs = require('fs')
const path = require('path')

// replaceAll function to perform substitutions on ZoKrates template
String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find, 'g'), replace);
};

let rawdata = fs.readFileSync(path.resolve(__dirname, "config.json"));
const config = JSON.parse(rawdata)

/**
 *  Compute the hash
 * @param {*} point the preimage
 */
function compute(point){
    point = eval(point)
    console.log(mimc(point))
}

/**
 * Generate round constants from a seed
 * @param {string|number} seed the seed
 */
function generateConstants(seed){
    generateRoundConstants(seed)
    console.log("Round constants generated successfully.")
}

/**
 * Set DEFAULT_ROUNDS parameter
 * @param {number} n rounds
 */
function changeRounds(n){
    try{
        config['DEFAULT_ROUNDS'] = parseInt(n)
        let data = JSON.stringify(config);
        fs.writeFileSync(path.resolve(__dirname, "config.json"), data);
        console.log("Default rounds count set successfully.")
    } catch(e) {
        console.log(e)
    }
}

/**
 * Set DEFAULT_EXPONENT parameter
 * @param {*} n exponent
 */
function changeDefaultExponent(n){
    try{
        config['DEFAULT_EXPONENT'] = parseInt(n)
        let data = JSON.stringify(config);
        fs.writeFileSync(path.resolve(__dirname, "config.json"), data);
        console.log("Default exponent set successfully.")
    } catch (e){
        console.log(e)
    }
}

/**
 * Export a .zok program to compute MiMC hash in ZoKrates
 * using ROUND_CONSTANTS and DEFAULT_ROUNDS parameters
 */
function exportZokratesCircuit(){
    let rawdata = fs.readFileSync(path.resolve(__dirname, 'template/mimc_hash.txt'),'utf8');
    let converted = config['ROUND_CONSTANTS']
    var finalString = "["
    for(var i=0; i<converted.length; i++){
        if(i == converted.length-1){
            finalString += converted[i].replace('n','') + ']'
        } else {
            finalString += converted[i].replace('n','') + ','           
        }
        
    }
    var circuit  = rawdata.replaceAll('<rounds>',config['DEFAULT_ROUNDS']).replaceAll('<round_constants>',finalString)
    fs.writeFileSync('mimc_hash.zok',circuit)
    console.log("ZoKrates circuit exported successfully.")
}

// Handle commands
switch(process.argv[2]){
    case "hash":
        compute(process.argv[3])
        break;
    case "generate-constants":
        generateConstants(process.argv[3])
        break;
    case "set-rounds":
        changeRounds(process.argv[3])
        break;
    case "set-exponent":
        changeDefaultExponent(process.argv[3])
        break;
    case "export-circuit":
        exportZokratesCircuit()
        break;
    case "help":
        console.log('   mimc hash <point>')
        console.log('       perform MiMC hash on a point')
        console.log('   mimc generate-constants <seed>')
        console.log('       generate round constants starting from a seed (number or string)')
        console.log('   mimc set-rounds <rounds>')
        console.log('       set DEFAULT_ROUNDS parameter')
        console.log('   mimc set-exponent <exponent>')
        console.log('       set DEFAULT_EXPONENT parameter')
        console.log('   mimc export-circuit')
        console.log('       export a .zok program to compute MiMC hash in ZoKrates using default parameters ROUND_CONSTANTS and DEFAULT_ROUNDS')
        break;
    default:
        console.log("Invalid command")
}