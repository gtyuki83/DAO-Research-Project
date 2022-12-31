import { ethers } from "ethers";
import { getSmartContract } from "./getSmartContract";

/*
* アカウントの残高を取得する関数
* @param {String} accountAddress アカウントアドレス
* @return {uint256} 残高
*/
export const getBalanceOf = async (accountAddress) => {

    /*
    * smartContractオブジェクト．
    * @type {Object} 
    */
    const smartContract = await getSmartContract();

    // アカウントの残高を取得
    const balance = await smartContract.balanceOf(accountAddress);

    // BigNum型から変換
    formatedBalance = ethers.utils.formatUnits(balance,18);

    return formatedBalance
}