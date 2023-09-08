import { Block, Chain, Transaction, Wallet } from "./main";

describe("Test Blockchain", () => {
  const wallets = {
    genesis: new Wallet(),
    kasposhi: new Wallet(),
    satoshi: new Wallet(),
  };

  it("should create genesis wallet", () => {
    // Create first block and receive 5000 coins to wallet.
    wallets.genesis.sendMoney(0, "");

    expect(Chain.instance.getBalance(wallets.genesis.publicKey)).toBe(5000);
  });

  it("should send 400 coins from genesis to kaposhi", () => {
    wallets.genesis.sendMoney(400, wallets.kasposhi.publicKey);

    expect(Chain.instance.getBalance(wallets.kasposhi.publicKey)).toBe(400);
    expect(Chain.instance.getBalance(wallets.genesis.publicKey)).toBe(4600);
  });

  it("shouldn't allow wallet to spend more coins than it has", () => {
    const coinsBefore = Chain.instance.getBalance(wallets.genesis.publicKey);
    wallets.genesis.sendMoney(9999, wallets.kasposhi.publicKey);
    const coinsAfter = Chain.instance.getBalance(wallets.genesis.publicKey);

    expect(coinsBefore).toBe(coinsAfter);
  });

  it("shouldn't allow wallet to send negative coins", () => {
    const coinsBefore = Chain.instance.getBalance(wallets.kasposhi.publicKey);
    wallets.kasposhi.sendMoney(-10, wallets.satoshi.publicKey);
    const coinsAfter = Chain.instance.getBalance(wallets.kasposhi.publicKey);
    expect(coinsBefore).toBe(coinsAfter);
  });
});
