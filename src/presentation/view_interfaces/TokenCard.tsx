import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
// ダイアログ関連モジュール
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
// Cardコンポーネント
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

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
import { ClassNames } from '@emotion/react';

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

const TokenCard = (props) => {
  // ABIの参照
  const ContractABI = MyTokenFactoryContract.abi;
  // 新testnet(Goerli)
  const contractAddress = "0xC6B3C091e8C5ae71754C55C3aD8eb2Bc88056563";
  // 引数からMyTokenアドレスを取得する。
  const { token } = props;
  // ステート変数を用意する。
  const [ethWeb3, setEthWeb3] = useState(null);
  const [tokenName, setTokenName] = useState(null);
  const [tokenSymbol, setTokenSymbol] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [balance, setBalance] = useState(0);
  const [owner, setOwner] = useState(null);
  const [totalSupply, setTotalSupply] = useState(0);
  const [nonce, setNonce] = useState(0);
  const [to, setTo] = useState(null);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [isOwner, setIsOwner] = useState(false);
  const [pauseFlg, setPauseFlg] = useState(false);
  const [tokenAddress, setTokenAddress] = useState(null);

  const classes = [{ tokenCard: "", button: "", textField: "" }];

  /**
   * useEffect関数
   */
  useEffect(() => {
    /**
     * init関数
     * @param token MyTokenコントラクトアドレス
     */
    const init = async (token) => {
      try {
        const { ethereum } = window;
        if (ethereum) {
          // MyTokenコントラクトの情報を取得する。
          const MyToken = token;
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          // ウォレットアドレスに対してアクセスをリクエストしています。
          const web3Accounts = await ethereum.request({
            method: "eth_requestAccounts",
          });
          const instance = new ethers.Contract(
            MyToken,
            MyTokenContract.abi,
            signer
          );
          // const instance = new web3.eth.Contract(MyTokenContract.abi, MyToken);
          // コントラクトより名前、シンボル、所有者、総発行数、残高、pause状態を取得する。
          // const name = await instance.methods.name().call();
          const name = await instance.name();
          const symbol = await instance.symbol();
          const owner = await instance.owner();
          // const total = await instance.totalSupply();
          instance.totalSupply().then(function (value) {
            const total = parseInt(value._hex.toString(), 16); // Promise Chainで値を取得できる。
            setTotalSupply(total);
          })
          // const balanceOf = await instance.methods.balanceOf(web3Accounts[0]).call();
          // const balanceOf = await instance.balanceOf(web3Accounts[0]);
          // const nonces = await instance.nonces(web3Accounts[0]);
          // const paused = await instance.paused();
          // Ownerかどうかチェックする。
          if (owner === web3Accounts[0]) {
            setIsOwner(true);
          }
          // ステート変数に値を詰める。
          setEthWeb3(ethWeb3);
          // setAccounts(web3Accounts);
          setContract(instance);
          setTokenName(name);
          setTokenSymbol(symbol);
          setOwner(owner);
          // setTotalSupply(total);
          // setBalance(balanceOf);
          // setNonce(nonces);
          // setPauseFlg(paused);
          setTokenAddress(MyToken);
        }
      } catch (error) {
        alert(`Failed to load web3, accounts, or contract. Check console for details.`,);
        console.error(error);
      }
    }
    // tokenが存在する時のみ実行
    if (token) {
      init(token);
    }
  }, [token]);


  /**
   * ダイアログを開くための関数
   */
  const handleOpen = () => {
    // trueにして開く。
    setOpen(true);
  };

  /**
   * ダイアログを閉じるための関数
   */
  const handleClose = () => {
    // falseにして閉じる。
    setOpen(false);
  };

  /**
   * 「発行」ボタンを押した時の関数
   */
  const buttonMint = async () => {
    try {
      // pause関数の呼び出し。
      await contract.mint(to, amount);
      alert("発行成功！");
    } catch (error) {
      alert(`発行に失敗しました。`);
      console.error(error);
    }
  };

  /**
   * 「移転」ボタンを押した時の関数
   */
  const buttonTransfer = async () => {
    try {
      // pause関数の呼び出し。
      await contract.methods.transfer(to, amount).send({
        from: accounts[0],
        gas: 6500000
      });
      alert("送金成功！");
    } catch (error) {
      alert(`送金に失敗しました。`);
      console.error(error);
    }
  };

  return (
    <div className="main-container">
      <div className="mytoken-card-content">
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">
            NAME : {tokenName}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <p>
                Symbol : {tokenSymbol}
              </p>
              <p>
                Address : {tokenAddress}
              </p>
              <p>
                残高 : {balance}
              </p>
              <p>
                総供給量 : {totalSupply}
              </p>
              <p>
                ナンス : {nonce}
              </p>
              <TextField
                id="to"
                className={classes.textField}
                placeholder="To"
                margin="normal"
                onChange={(e) => setTo(e.target.value)}
                variant="outlined"
                inputProps={{ 'aria-label': 'bare' }} />
              <TextField
                id="amount"
                className={classes.textField}
                placeholder="Amount"
                margin="normal"
                onChange={(e) => setAmount(e.target.value)}
                variant="outlined"
                inputProps={{ 'aria-label': 'bare' }} />
              <br />
              <Button onClick={buttonMint} variant="contained" color="primary" className={classes.button}>
                発行
              </Button>
              <br />
              {/* <Button onClick={buttonBurn} variant="contained" color="primary" className={classes.button}>
                償却
              </Button> */}
              <br />
              <Button onClick={buttonTransfer} variant="contained" color="primary" className={classes.button}>
                送金
              </Button>
              <br />
              {/* {isOwner ?
                <Button onClick={buttonPause} variant="contained" color="secondary" className={classes.button}>
                  Pause
                </Button>
                : <></>} */}
              <br />
              {/* {isOwner ?
                <Button onClick={buttonUnPause} variant="contained" color="secondary" className={classes.button}>
                  UnPause
                </Button>
                : <></>} */}
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Card className={classes.tokenCard} onClick={handleOpen}>
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {tokenName}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="div">
                <p>
                  {tokenSymbol}
                </p>
              </Typography>
              <Typography variant="body2" color="textSecondary" component="div">
                <p>
                  {balance}
                </p>
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button onClick={handleOpen} variant="contained" className={classes.button}>
              View More
            </Button>
          </CardActions>
        </Card>
      </div>
    </div>
  );
};


export default TokenCard;