import Web3 from 'web3'
import { env } from 'decentraland-commons'
import land from './LANDToken.json'
import sale from './LANDTestSale.json'

class Ethereum {
  init() {
    this._web3 = new Web3(env.get('REACT_APP_ETHEREUM_PROVIDER'))

    this.land = new this._web3.Contract(land.abi, land.address)
    this.land.address = land.address

    this.sale = new this._web3.Contract(sale.abi, sale.address)
    this.sale.address = sale.address
  }
  get address() {
    return this._web3.eth.accounts[0]
  }
  buyParcel(x, y) {
    return this.sale.buy(x, y, '')
  }
  async getParcelData(x, y) {
    return {
      x,
      y,
      owner: await this.land.landOwner(x, y),
      metadata: await this.land.landMetadata(x, y)
  }
}

export default new Ethereum()
