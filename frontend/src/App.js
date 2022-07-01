import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";

import abi from "./artifacts/contracts/Loan.sol/Loan.json";
const contractABI = abi.abi;
const contractAddress = "0x2ea89164B7C88E08034358c1c1b49144EE1D1A9A";
// 0x2ea89164B7C88E08034358c1c1b49144EE1D1A9A

function App() {
  const { ethereum } = window;
  const [deposit, setDeposit] = useState(0);
  const [withdraw1, setWithdraw] = useState(0);
  const [collline, setCollLine] = useState('')
  const [depositline1, setDepositLine] = useState('')
  const [collline1, setCollLine1] = useState('')
  const [depositline2, setDepositLine1] = useState('')

  const storeAdrress = async() => {
    await ethereum.request( { method: 'eth_requestAccounts' } );
    const [ account ] = await ethereum.request( { method: 'eth_accounts' } );
    return account;
  }

  //Carrying out the deposit function
  const getEthereumContract = async(event) => {

    if (typeof ethereum !== "undefined"){
      await connect();
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer =  provider.getSigner();
      const Deposit1 = new ethers.Contract(contractAddress, contractABI, signer);
      await Deposit1.deposit(deposit)
      const acct = await storeAdrress();
      const { _hex} = ( await Deposit1.Loans( acct ) ).collateralAmount
      const coll = parseInt(_hex)/Math.pow(10,18)
      console.log( coll);
      const debt= ( await Deposit1.Loans( acct ) ).debtAmount
      const debt1 = parseInt(debt._hex)/Math.pow(10,18)
      console.log( debt1);
      setCollLine(`Collateral Amount: ${coll}`)
      setDepositLine(`Loan Amount: ${debt1}`)
    }else{
      console.log("Metamask not found")
    }

  };

  //Carrying out the withdraw function
  const withdrawContract = async(event) => {

    if (typeof ethereum !== "undefined"){
      await connect();
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer =  provider.getSigner();
      const Withdraw1 = new ethers.Contract(contractAddress, contractABI, signer);
      await Withdraw1.withdraw(withdraw1)
      const acct1 = await storeAdrress();
      const { _hex} = ( await Withdraw1.Loans( acct1 ) ).collateralAmount
      const coll = parseInt(_hex)/Math.pow(10,18)
      console.log(coll)
      const debt= ( await Withdraw1.Loans( acct1 ) ).debtAmount
      const debt1 = parseInt(debt._hex)/Math.pow(10,18)
      console.log( debt1);
      setCollLine1(`Collateral Amount: ${coll}`)
      setDepositLine1(`Loan Amount: ${debt1}`)
    }else{
      console.log("Metamask not found")
    }

  };

  const connect = async () => {
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
    } catch (e) {
      console.log("error in request", e);
    }
  };

  return (
    <>
     <div>
        <input
          placeholder="Deposit collateral"
          type="text"
          value={deposit}
          onChange={(e) => setDeposit(e.target.value)}
        />
        <button onClick={getEthereumContract}> SUBMIT </button>
     </div>
     <h1>{collline}</h1>
     <h1>{depositline1}</h1>
     <div>
        <input
          placeholder="Withdraw collateral"
          type="text"
          value={withdraw1}
          onChange={(e) => setWithdraw(e.target.value)}
        />
        <button onClick={withdrawContract}> SUBMIT1 </button>
     </div> 
     <h1>{collline1}</h1>
     <h1>{depositline2}</h1>
    </>

)}


export default App;
