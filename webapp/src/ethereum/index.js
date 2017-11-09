import Web3 from 'web3'
import { env } from 'decentraland-commons'

import land from './LANDToken'
import sale from './LANDTestSale'
import reverseHash from './reverseHash'

class Ethereum {
  async init() {
    const provider = await this.getProvider()
    if (!provider) {
      return false
    }

    this._web3 = new Web3(provider)
    const address = (await this._web3.eth.getAccounts())[0]
    if (!address) {
      return false
    }

    this.land = new this._web3.eth.Contract(land.abi, land.address)
    this.land.address = land.address

    this.sale = new this._web3.eth.Contract(sale.abi, sale.address)
    this.sale.address = sale.address

    return true
  }

  async getProvider() {
    if (typeof window.web3 === 'undefined') {
      return env.get('REACT_APP_ETHEREUM_PROVIDER')
    }

    return window.web3 && window.web3.currentProvider
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
