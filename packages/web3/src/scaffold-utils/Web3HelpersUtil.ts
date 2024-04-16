// @TODO think about consolidating with packages/scaffold-utils/src/EthersHelpersUtil.ts

import type { CaipNetwork } from '@web3modal/core'
import { ConstantsUtil } from '@web3modal/scaffold-utils'
import { PresetsUtil } from '@web3modal/scaffold-utils'
import type { Chain, Provider } from './Web3TypesUtil.js'

export const Web3HelpersUtil = {
  getCaipDefaultChain(chain?: Chain) {
    if (!chain) {
      return undefined
    }

    return {
      id: `${ConstantsUtil.EIP155}:${chain.chainId}`,
      name: chain.name,
      imageId: PresetsUtil.EIP155NetworkImageIds[chain.chainId]
    } as CaipNetwork
  },
  hexStringToNumber(value: string) {
    const string = value.startsWith('0x') ? value.slice(2) : value
    const number = parseInt(string, 16)

    return number
  },
  numberToHexString(value: number) {
    return `0x${value.toString(16)}`
  },
  async getUserInfo(provider: Provider) {
    const [address, chainId] = await Promise.all([
      Web3HelpersUtil.getAddress(provider),
      Web3HelpersUtil.getChainId(provider)
    ])

    return { chainId, address }
  },
  async getChainId(provider: Provider) {
    const chainId = await provider.request<string | number>({ method: 'eth_chainId' })

    return Number(chainId)
  },
  async getAddress(provider: Provider) {
    const [address] = await provider.request<string[]>({ method: 'eth_accounts' })

    return address
  },
  async addEthereumChain(provider: Provider, chain: Chain) {
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: Web3HelpersUtil.numberToHexString(chain.chainId),
          rpcUrls: [chain.rpcUrl],
          chainName: chain.name,
          nativeCurrency: {
            name: chain.currency,
            decimals: 18,
            symbol: chain.currency
          },
          blockExplorerUrls: [chain.explorerUrl],
          iconUrls: [PresetsUtil.EIP155NetworkImageIds[chain.chainId]]
        }
      ]
    })
  }
}
