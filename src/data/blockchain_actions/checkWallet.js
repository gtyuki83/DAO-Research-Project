import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

export const CheckWallet = async () => {
    // ユーザーがMetaMaskを持っているか確認します。
    try {
        const { ethereum } = window;
        if (!ethereum) {
            console.log("Make sure you have MetaMask!");
            // 次の行で return を使用するため、ここで isLoading を設定します。
            // setIsLoading(false);
            return ("");
        } else {
            // console.log("We have the ethereum object", ethereum);
            // accountsにWEBサイトを訪れたユーザーのウォレットアカウントを格納します。
            // （複数持っている場合も加味、よって account's' と変数を定義している）
            const accounts = await ethereum.request({ method: "eth_accounts" });
            // もしアカウントが一つでも存在したら、以下を実行。
            if (accounts.length !== 0) {
                // accountという変数にユーザーの1つ目（=Javascriptでいう0番目）のアドレスを格納
                const account = accounts[0];
                // console.log("Found an authorized account:", account);
                return (account);
            } else {
                // console.log("No authorized account found");
                return ("");
            }
        }
    } catch (error) {
        console.log(error);
        return ("");
    }
};

export default CheckWallet;