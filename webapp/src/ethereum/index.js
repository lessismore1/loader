import Web3 from 'web3'
import { env } from 'decentraland-commons'

import land from './LANDToken'
import sale from './LANDTestSale'
import reverseHash from './reverseHash'

class Ethereum {
  async init() {
    const provider = await this.getWeb3Provider()
    if (!provider) {
      return false
    }
    this._web3 = new Web3(provider)

    this.land = new this._web3.Contract(land.abi, land.address)
    this.land.address = land.address

    this.sale = new this._web3.Contract(sale.abi, sale.address)
    this.sale.address = sale.address
  }

  getProvider() {
    if (typeof window.web3 === 'undefined') {
      // Support Ledger Wallet
      let engine = new ProviderEngine()
      let ledgerWalletSubProvider = await LedgerWalletSubprovider(`44'/60'/0'/0`)

      engine.addProvider(ledgerWalletSubProvider)
      engine.addProvider(
        new RpcSubprovider({
          rpcUrl: 'https://mainnet.infura.io/'
        })
      )
      engine.start()

      return engine
    }

    return window.web3 && window.web3.currentProvider
  }

  get address() {
    return this._web3.eth.accounts[0]
  }

  buyParcel(x, y) {
    return this.sale.buy(x, y, '')
  }

  getBalance() {
    return this.land.balanceOf(this.address)
  }

  async getTokens() {
    const amount = await this.getBalance()
    const result = []
    for (let i = 0; i < amount; i++) {
      const hash = this.land.tokenByIndex(this.address, i)
      const { x, y } = reverseHash[hash]
      result.push({
        x,
        y,
        owner: this.getAddress(),
        metadata: await this.land.landMetadata(x, y)
      })
    }
    return result
  }

  async getParcelData(x, y) {
    return {
      x,
      y,
      owner: await this.land.ownerOfLand(x, y),
      metadata: await this.land.landMetadata(x, y)
    }
  }
}

export default new Ethereum()
