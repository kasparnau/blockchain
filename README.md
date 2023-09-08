# Blockchain
![Tests](https://github.com/kasparnau/blockchain/actions/workflows/main.yml/badge.svg)

Simple blockchain implementation in Node.js and TypeScript.

### Usage

Blockchain code in src/main.ts
Tests in src/main.spec.ts

### Classes

#### Transaction

- `amount`: The amount of cryptocurrency transferred in the transaction.
- `payer`: The public key of the sender (payer) of the transaction.
- `payee`: The public key of the recipient (payee) of the transaction.

#### Block

- `nonce`: A random number used in the mining process to find a valid hash.
- `prevHash`: The hash of the previous block in the chain.
- `transaction`: An instance of the `Transaction` class representing the transaction stored in this block.
- `ts`: The timestamp of when the block was created
- `hash`: A computed SHA-256 hash of the block's contents.

#### Chain

- `instance`: A static property that holds the single instance of the `Chain` class.
- `chain`: An array of `Block` instances representing the blockchain.

- `lastBlock`: Returns the last block in the blockchain.
- `mine(nonce: number)`: Mines a new block by finding a nonce that results in a hash with a leading "0."
- `addBlock(transaction: Transaction, senderPublicKey: string, signature: Buffer)`: Adds a new block to the blockchain if the transaction is valid and signed correctly. It includes a special case for the genesis block.
- `getBalance(publicKey: string)`: Calculates the balance of a wallet (public key) by iterating through the blockchain.

#### Wallet

- `publicKey`: The public key of the wallet.
- `privateKey`: The private key of the wallet.

- `sendMoney(amount: number, payeePublicKey: string)`: Creates a new transaction and signs it with the wallet's private key. Then, it adds the transaction to the blockchain using the `Chain` class.

### Credits

Fireship
