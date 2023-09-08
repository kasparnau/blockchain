import * as crypto from "crypto";

class Transaction {
  constructor(
    public amount: number,
    public payer: string,
    public payee: string
  ) {}

  toString() {
    return JSON.stringify(this);
  }
}

class Block {
  public nonce = Math.round(Math.random() * 999999999);

  constructor(
    public prevHash: string | null,
    public transaction: Transaction,
    public ts = Date.now()
  ) {}

  get hash() {
    const str = JSON.stringify(this);
    const hash = crypto.createHash("SHA256");
    hash.update(str).end();
    return hash.digest("hex");
  }
}

class Chain {
  public static instance = new Chain();

  chain: Block[];

  constructor() {
    this.chain = [new Block(null, new Transaction(0, "null", "null"))];
  }

  get lastBlock() {
    return this.chain[this.chain.length - 1];
  }

  mine(nonce: number) {
    let solution = 1;

    while (true) {
      const hash = crypto.createHash("MD5");
      hash.update((nonce + solution).toString()).end();

      const attempt = hash.digest("hex");

      if (attempt.slice(0, 4) === "0000") {
        console.log(`Solved: ${solution}`);
        return solution;
      }

      solution += 1;
    }
  }

  addBlock(
    transaction: Transaction,
    senderPublicKey: string,
    signature: Buffer
  ) {
    // GENESIS
    if (this.chain.length === 1) {
      const newBlock = new Block(
        this.lastBlock.hash,
        new Transaction(5000, "genesis", senderPublicKey)
      );
      this.mine(newBlock.nonce);
      this.chain.push(newBlock);
      return;
    }

    if (
      transaction.amount < 0 ||
      transaction.amount > this.getBalance(senderPublicKey)
    ) {
      return false;
    }

    const verifier = crypto.createVerify("SHA256");
    verifier.update(transaction.toString());

    const isValid = verifier.verify(senderPublicKey, signature);

    if (isValid) {
      const newBlock = new Block(this.lastBlock.hash, transaction);
      this.mine(newBlock.nonce);
      this.chain.push(newBlock);
    }
  }

  getBalance(publicKey: string): number {
    let balance = 0;

    for (const block of this.chain) {
      if (block.transaction.payer === publicKey) {
        balance -= block.transaction.amount;
      } else if (block.transaction.payee === publicKey) {
        balance += block.transaction.amount;
      }
    }

    return balance;
  }
}

class Wallet {
  public publicKey: string;
  public privateKey: string;

  constructor() {
    const keypair = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });

    this.privateKey = keypair.privateKey;
    this.publicKey = keypair.publicKey;
  }

  sendMoney(amount: number, payeePublicKey: string) {
    const transaction = new Transaction(amount, this.publicKey, payeePublicKey);

    const sign = crypto.createSign("SHA256");
    sign.update(transaction.toString()).end();

    const signature = sign.sign(this.privateKey);

    Chain.instance.addBlock(transaction, this.publicKey, signature);
  }
}

export { Chain, Wallet, Transaction, Block };
