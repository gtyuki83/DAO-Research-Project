import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

// リンクへのアクセス
import { Link } from "react-router-dom";

// MUI
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
// ダークモード判定
import useMediaQuery from '@mui/material/useMediaQuery';
import CheckWallet from "../../data/blockchain_actions/checkWallet";
import { useEffect, useState } from 'react';

// スマコン関連のインポート
import { ethers } from "ethers"
import MyTokenContract from '../../contracts/MyToken.json';
import MyTokenFactoryContract from '../../contracts/MyTokenFactory.json';
import MyTokenCard from "./TokenCard.tsx";

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
});

const Token = () => {
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(
          contractAddress,
          ContractABI,
          signer
        );
        // コントラクトのmyTokens()関数を呼び出す。
        const tokens = await tokenContract.myTokens(10, 0);
        await setMyTokens(tokens);
        console.log(tokens)
      }
    }
    catch (error) {
      alert(`Failed to load web3, accounts, or contract. Check console for details.`,);
      console.log(error);
    }
  };

  // ステート変数を用意
  const [name, setName] = useState(null);
  const [symbol, setSymbol] = useState(null);
  const [myTokens, setMyTokens] = useState([]);
  const [to, setTo] = useState(null);
  const [amount, setAmount] = useState(0);

  // admin以外は管理画面へのアクセスを許可しない
  const [isAdmin, setIsAdmin] = useState(false);

  // ユーザーのウォレットアドレス取得
  const [currentAccount, setCurrentAccount] = useState(null);
  useEffect(() => {
    connect();
  }, []);

  const connect = async () => {
    CheckWallet().then(function (result) {
      const address = result;
      setCurrentAccount(address);
      if (address.toLowerCase() == "0x3a0be810754f7f7d04fca10e2c11e93ebb5bf19e" || address.toLowerCase() == "0x020f900c8ce927d7264de2285e1ae2bba5d543bc" || address.toLowerCase() == "0xd72b5feadfdf70df46268ec75ea8c579e4137a71" || address.toLowerCase() == "0x911608c090f983d02a9f30b81b9ff48091a5f71d") {
        setIsAdmin(true)
      }
    });
  };

  // ABIの参照
  const ContractABI = MyTokenFactoryContract.abi;

  // 新testnet(Goerli)
  // const contractAddress = "0xC6B3C091e8C5ae71754C55C3aD8eb2Bc88056563";
  const contractAddress = "0xCf06610B0Ef9C30acA1e2E808A18541E0a0cB9Bc";

  // トークンの発行
  const buttonDeploy = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const tokenFactoryContract = new ethers.Contract(
          contractAddress,
          ContractABI,
          signer
        );
        // トークン発行
        const tokenFactoryContractTxn = await tokenFactoryContract.createMyToken(
          name, symbol
        );
        console.log("Mining...", tokenFactoryContractTxn.hash);
        await tokenFactoryContractTxn.wait();
        console.log("Mined -- ", tokenFactoryContractTxn.hash);
        alert("MyTokenコントラクトデプロイ成功！");
      }
    } catch (e) {
      alert("MyTokenコントラクトデプロイ失敗");
      console.error(e);
    }
  };

  /**
   * 「発行」ボタンを押した時の関数
   */
  const buttonMint = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        // const options = { gasLimit: 850000 };
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(
          "0xdb9b83Ba9f9a9d6e0460b452D3755138591b7883",
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
        console.log(to, "：←to　→amount：", amount)
        await tokenContract.mint(to, amount);
        // alert("30UYZのミント成功！");
      }
    } catch (e) {
      alert("ミント失敗🥺");
      console.error(e);
    }
  };

  // トークン一覧
  /**
     * displayMyTokens関数
     * @returns MyTokenCardコンポーネント
     */
  const displayMyTokens = () => {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          spacing={{ xs: 2, md: 4 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {myTokens.map((token) => {
            return (
              <Grid item xs={1} sm={2} md={4} key={token}>
                <MyTokenCard token={token} key={token} />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  }


  return (
    <div className="main-container">
      {isAdmin ?
        <div>
          <h2>
            独自ERC20トークン作成画面
          </h2>
          <TextField
            id="name"
            placeholder="Token Name"
            margin="normal"
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            inputProps={{ 'aria-label': 'bare' }}
            required={true}
          />
          <TextField
            id="symbol"
            placeholder="Token Symbol"
            margin="normal"
            onChange={(e) => setSymbol(e.target.value)}
            variant="outlined"
            inputProps={{ 'aria-label': 'bare' }}
            required={true}
          />
          <br />
          <Button onClick={buttonDeploy} variant="contained" color="primary">
            MyTokenデプロイ
          </Button>
          <br />
          <TextField
            id="to"
            placeholder="To"
            margin="normal"
            onChange={(e) => setTo(e.target.value)}
            variant="outlined"
            inputProps={{ 'aria-label': 'bare' }} />
          <TextField
            id="amount"
            placeholder="Amount"
            margin="normal"
            onChange={(e) => setAmount(e.target.value)}
            variant="outlined"
            inputProps={{ 'aria-label': 'bare' }} />
          <br />
          <br />
          <Button onClick={buttonMint} variant="contained" color="primary">
            30UYZをミント
          </Button>
          <br />
          {displayMyTokens()}
        </div>
        :
        <span>You have no access rights.</span>}
    </div>
  );
};


export default Token;