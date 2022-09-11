import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

export const Login = async () => {
    try {
        const { ethereum } = window;
        if (!ethereum) {
            console.log("a")
            alert("Get MetaMask!");
            return;
        }
        // ウォレットアドレスに対してアクセスをリクエストしています。
        const accounts = await ethereum.request({
            method: "eth_requestAccounts",
        });
        // ウォレットアドレスを currentAccount に紐付けます。
        console.log("Connected", accounts[0]);
        return (accounts[0]);
    } catch (error) {
        console.log(error);
    }
};

export default Login;