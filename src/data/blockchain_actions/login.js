import React, { useEffect, useState } from "react";

// Firebase関係
import { onSnapshot } from "firebase/firestore";
import {
    doc,
    setDoc,
    collection,
    getDoc,
    getDocs,
    query,
    where,
    updateDoc,
    arrayUnion,
} from "firebase/firestore";
import { firebaseFirestore } from "../../data/Firebase";

// スマコン関連のインポート
import { ethers } from "ethers"
import MyTokenContract from '../../contracts/MyToken.json';

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

        // ログインしたアドレスがFirebaseになければ追加します
        // アドレスが既に存在するか検索
        const docRef = doc(firebaseFirestore, "users", accounts[0].toLowerCase());
        const docSnap = await getDoc(docRef);
        console.log(docSnap.exists())
        if (docSnap.exists()) {
            // 特になし

        } else {
            const usersRef = collection(firebaseFirestore, "users");
            const documentRef = setDoc(doc(usersRef, accounts[0].toLowerCase()), {
                address: accounts[0].toLowerCase(),
                team: [],
                id: accounts[0].toLowerCase(),
                PXC: 10,
            });
            console.log("新たなユーザーとして登録されました")
            console.log("PXCトークンをミントします")
            try {
                const { ethereum } = window;
                if (ethereum) {
                    // const options = { gasLimit: 850000 };
                    const provider = new ethers.providers.Web3Provider(ethereum);
                    const signer = provider.getSigner();
                    const tokenContract = new ethers.Contract(
                        "0x48B01f58fc52c2C9050f15F02e19a6eB2336d9C5",
                        MyTokenContract.abi,
                        signer
                    );
                    // トークン発行
                    // const tokenFactoryContractTxn = await tokenFactoryContract.createMyToken(
                    //   name, symbol
                    // );
                    // console.log("Mining...", tokenFactoryContractTxn.hash);
                    // await tokenFactoryContractTxn.wait();
                    // console.log("Mined -- ", tokenFactoryContractTxn.hash);
                    // alert("MyTokenコントラクトデプロイ成功！");
                    // pause関数の呼び出し。
                    console.log(accounts[0], "：←to　→amount：", 10)
                    await tokenContract.mint(accounts[0], 10);
                    // alert("30UYZのミント成功！");
                }
            } catch (e) {
                alert("ミント失敗🥺");
                console.error(e);
            }
        }
        return (accounts[0]);
    } catch (error) {
        console.log(error);
    }
};

export default Login;