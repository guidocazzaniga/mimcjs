[![Version](https://img.shields.io/badge/version-1.0.5-blue)](https://github.com/guidocazzaniga/mimcjs)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

# mimcjs

A toolbox to compute MiMC hash in Javascript, which allows to export a .zok file to perform the same computation in ZoKrates.

## Table of contents

- [mimcjs](#mimcjs)
  - [Table of contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Usage](#usage)
    - [Computing MiMC Hash](#computing-mimc-hash)
  - [CLI](#cli)
  - [Contributing](#contributing)
  - [Credits](#credits)
  - [Authors](#authors)
  - [License](#license)

## Getting Started

To install the library, run:

```sh
$ npm install mimcjs
```

## Usage

### Computing MiMC Hash

```js
const mimcjs = require('mimcjs')
const point1 = [1,2]
const point2 = [123,"0x55DC2CF4057e4D6D78eE7Ea5170B58c04D2c08a7"]
var hash1 = mimcjs.mimc(point1)
var hash2 = mimcjs.mimc(point2)
```

## CLI
Some commands are available from CLI:
- `mimc help` show commands
- `mimc hash <point>` perform MiMC hash on a point
- `mimc generate-constants <seed>` generate round constants starting from a seed (number or string)
- `mimc set-rounds <rounds>` set DEFAULT_ROUNDS parameter
- `mimc set-exponent <exponent>` set DEFAULT_EXPONENT parameter
- `mimc export-circuit` export a .zok program to compute MiMC hash in ZoKrates using default parameters ROUND_CONSTANTS and DEFAULT_ROUNDS 

## Contributing

If you find a bug or you have ideas for new components, please feel free to submit a pull request 🚀

## Credits

The library is based on https://github.com/HarryR/ethsnarks/blob/master/ethsnarks/mimc/permutation.py

## Authors

* **Guido Cazzaniga** - *Initial work* - [guidocazzaniga](https://github.com/guidocazzaniga)

## License

[ISC License](ISC-LICENSE.md)
