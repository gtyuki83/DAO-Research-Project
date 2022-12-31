import { ethers } from 'ethers';
import { contractABI, contractAddress } from "../../contracts/connectMyToken"; 

/*
* スマートコントラクトを取得する関数.
* @return {Object} スマートコントラクトオブジェクト
*/
export const getSmartContract = () => {
    // Create Provider 
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    // Create Signer
    const signer = provider.getSigner()

    // Create Contract Instance
    const myContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
    )

    return myContract;
}