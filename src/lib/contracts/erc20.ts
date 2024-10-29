/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers } from 'ethers'
import { TokenCurrency } from '@/types'
import { Web3Provider } from '@ethersproject/providers'
import { MaxUint256 } from '@ethersproject/constants'
import { erc20Contract } from '@/lib/contracts/contracts'

export const getTokenDecimals = async (provider: any, tokenAddress: string) => {
    const web3Provider = new Web3Provider(provider)
    const contract = erc20Contract(tokenAddress, web3Provider)
    const decimals = await contract.decimals()
    return decimals
}

export async function sendERC20Token(
    provider: any,
    toAddress: string,
    amount: string,
    tokenCurrency: Omit<TokenCurrency, 'symbol'>
) {
    const { address: tokenAddress, decimals } = tokenCurrency
    const web3Provider = new Web3Provider(provider)
    const tokenContract = erc20Contract(tokenAddress, web3Provider)
    const numberOfTokens = ethers.parseUnits(amount, decimals)

    const tx = await tokenContract.transfer(toAddress, numberOfTokens)
    const receipt = await web3Provider.waitForTransaction(tx.hash, 1)
    return receipt?.transactionHash
}

export const getAllowance = async (
    provider: any,
    ownerAddress: string,
    spenderAddress: string,
    tokenAddress: string
) => {
    const web3Provider = new Web3Provider(provider)
    const contract = erc20Contract(tokenAddress, web3Provider)
    const allowance = await contract.allowance(ownerAddress, spenderAddress)
    return allowance.toString()
}

export const approveToken = async (provider: any, spenderAddress: string, tokenAddress: string) => {
    const web3Provider = new Web3Provider(provider)
    const contract = erc20Contract(tokenAddress, web3Provider)
    const tx = await contract.approve(spenderAddress, MaxUint256.toString())
    const receipt = await web3Provider.waitForTransaction(tx.hash, 1)
    return receipt?.transactionHash
}
