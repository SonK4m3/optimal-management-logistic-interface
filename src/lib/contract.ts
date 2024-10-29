import { ContractRunner, ethers } from 'ethers'
import ERC20 from '@/abi/Erc20.json'

const abiERC20 = ERC20.abi

export const erc20Contract = (address: string, providerOrSigner: unknown) => {
    return new ethers.Contract(address, abiERC20, providerOrSigner as ContractRunner)
}
