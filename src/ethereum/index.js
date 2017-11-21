import Web3 from "web3";

import land from "./LANDToken";
import sale from "./LANDTestSale";
import reverseHash from "./reverseHash";

class Ethereum {
  async init() {
    const provider = await this.getProvider();
    if (!provider) {
      return false;
    }

    this._web3 = new Web3(provider);
    const address = (await this._web3.eth.getAccounts())[0];
    if (!address) {
      return false;
    }
    this._address = address;

    this.land = new this._web3.eth.Contract(land.abi, land.address);
    this.land.address = land.address;

    this.sale = new this._web3.eth.Contract(sale.abi, sale.address);
    this.sale.address = sale.address;

    const call = (methods, name) => (...args) => methods[name](...args).call();
    const transaction = (methods, name) => (...args) =>
      methods[name](...args).send({
        from: address
      });
    this.methods = {
      buy: transaction(this.sale.methods, "buy"),
      balanceOf: call(this.land.methods, "balanceOf"),
      buildTokenId: async (x, y) =>
        (await call(this.land.methods, "buildTokenId")(x, y)).toString("hex"),
      tokenOfOwnerByIndex: call(this.land.methods, "tokenOfOwnerByIndex"),
      landMetadata: call(this.land.methods, "landMetadata"),
      ownerOfLand: call(this.land.methods, "ownerOfLand")
    };

    return true;
  }

  async getProvider() {
    return window.web3 && window.web3.currentProvider;
  }

  buyParcel(x, y) {
    return this.methods.buy(x, y, "[]");
  }

  getBalance() {
    return this.methods.balanceOf(this.address);
  }

  get address() {
    return this._address;
  }

  async getTokens() {
    const amount = await this.getBalance();
    const result = [];
    for (let i = 0; i < amount; i++) {
      const hash = await this.methods.tokenOfOwnerByIndex(this.address, i);
      const { x, y } = reverseHash[hash];
      result.push({
        x,
        y,
        owner: this.address,
        hash,
        metadata: await this.methods.landMetadata(x, y)
      });
    }
    return result;
  }

  async getParcelData(x, y) {
    return {
      x,
      y,
      hash: await this.methods.buildTokenId(x, y),
      owner: await this.methods.ownerOfLand(x, y),
      metadata: await this.methods.landMetadata(x, y)
    };
  }

  async getMany(parcels) {
    return Promise.all(
      parcels.map(parcel => this.getParcelData(parcel.x, parcel.y))
    );
  }

  async getOwnedParcels() {
    const amount = await this.getBalance();
    const result = [];
    for (let i = 0; i < amount; i++) {
      result.push(await this.getOwnedParcel(i));
    }
    console.log("result is", result);
    return result;
  }

  async getOwnedParcel(index) {
    const hash = await this.methods.tokenOfOwnerByIndex(this.address, index);
    console.log(hash, "hey", reverseHash[hash]);
    const { x, y } = reverseHash[hash];
    console.log(index, hash, x, y);
    return {
      x,
      y,
      hash,
      owner: this.address,
      metadata: await this.methods.landMetadata(x, y)
    };
  }
}

const ethService = new Ethereum();

export default ethService;
