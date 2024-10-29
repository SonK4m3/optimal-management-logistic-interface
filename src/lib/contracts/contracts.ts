/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers } from 'ethers'
import ERC20 from '@/abi/Erc20.json'

const abiERC20 = ERC20.abi

export const erc20Contract = (address: string, provider: any) => {
    return new ethers.Contract(address, abiERC20, provider.getSigner())
}

export const erc20ContractToReadOnly = (address: string, provider: any) => {
    return new ethers.Contract(address, abiERC20, provider)
}
