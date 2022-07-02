import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";

import abi from "./artifacts/contracts/Loan.sol/Loan.json";
const contractABI = abi.abi;
const contractAddress = "0x57F6FD802A9b6ec2c6a924f17701caec8F00ff47";
// 0x2ea89164B7C88E08034358c1c1b49144EE1D1A9A

function App() {
  const { ethereum } = window;
  const [deposit, setDeposit] = useState(0);
  const [withdraw1, setWithdraw] = useState(0);
  const [collline, setCollLine] = useState('Your collateral amount will be shown here after deposit.')
  const [depositline1, setDepositLine] = useState('Your loan amount will be shown here after deposit.')
  const [collline1, setCollLine1] = useState('Your collateral amount will be shown here after withdrawal.')
  const [depositline2, setDepositLine1] = useState('Your loan amount will be shown here after withdrawal.')

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
      const transaction = await Deposit1.deposit(deposit*Math.pow(10,8),{value: ethers.utils.parseEther(deposit)});
      await transaction.wait();
      setDeposit(0);
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
      const transaction = await Withdraw1.withdraw(withdraw1)
      await transaction.wait();
      const acct1 = await storeAdrress();
      const { _hex} = ( await Withdraw1.Loans( acct1 ) ).collateralAmount
      const coll1 = parseInt(_hex)/Math.pow(10,18)
      console.log(coll1)
      const debt1= ( await Withdraw1.Loans( acct1 ) ).debtAmount
      const debt2 = parseInt(debt1._hex)/Math.pow(10,18)
      console.log(debt2);
      setCollLine1(`Collateral Amount: ${coll1}`)
      setDepositLine1(`Loan Amount: ${debt2}`)
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
    <div className="App">
    <div class="jumbotron-fluid">
       <div class="container">
         <h1 class="display-4 heading">BISWAS</h1>
         <p class="lead para">This awesome borrowing dapp lets an user submit Money ( in Eth ) to a smart contract as collateral and receive stablecoin ( ERC20 Token ) as a loan.</p>
         <p class='lead para'>Connect to Rinkeby Network.</p>
    </div>
    <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
  <ol class="carousel-indicators">
    <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
    <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
    <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
  </ol>
  <div class="carousel-inner pt-2 pb-5">
    <div class="carousel-item active" data-interval="1000">
      <img src="web3.jpg" class="imgg" alt="..." />
    </div>
    <div class="carousel-item">
      <img src="poly.jpeg" class="imgg" alt="..." data-interval="2000" />
    </div>
    <div class="carousel-item">
      <img src="loan.jpg" class="imgg" alt="..." data-interval="3000" />
    </div>
  </div>
  <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="sr-only">Previous</span>
  </a>
  <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="sr-only">Next</span>
  </a>
    </div>
    </div>
     <div>
        <input
          placeholder="Deposit collateral"
          type="number"
          value={deposit}
          onChange={(e) => setDeposit(e.target.value)}
          className="inputt"
        />
        <button onClick={()=> getEthereumContract()} type="button" class="bt button-25">Deposit</button>
     </div>
     <h4 className="para">{collline}</h4>
     <h4 className="para pb-5">{depositline1}</h4>
     <div>
        <input
          placeholder="Withdraw collateral"
          type="number"
          value={withdraw1}
          onChange={(e) => setWithdraw(e.target.value)}
          className="inputt"
        />
        <button onClick={()=> withdrawContract()} type="button" class="bt button-25">Withdraw</button>
     </div> 
     <h4 class='para'>{collline1}</h4>
     <h4 class='para pb-5'>{depositline2}</h4>
    </div>

)}


export default App;
