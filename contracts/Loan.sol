//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.7;

import "./Token.sol";
import "./PriceConsumerV3.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

import './SafeMath.sol';

contract Loan is Ownable, Godfather, PriceConsumerV3 {

    using SafeMath for uint256;
    // store the details of the loan as a struct
    struct Details {
        // the collateral amount of each address
        uint256 collateralAmount;
        // the debt amount of each address
        uint256 debtAmount;
    }

    // mapping addresses to the Details
    mapping(address => Details) public Loans;

    event Deposit(uint256 deposit_amount, uint256 minted_amount);
    event Withdraw(uint256 withdraw_amount, uint256 repay_amount);

    function deposit(uint256 depositAmount) public payable {
        uint256 mintAmount = depositAmount.mul(getEthUSDPrice());
        mint(msg.sender, mintAmount);
        Loans[msg.sender].collateralAmount = Loans[msg.sender].collateralAmount.add(depositAmount);
        Loans[msg.sender].debtAmount = Loans[msg.sender].debtAmount.add(mintAmount);
        emit Deposit(depositAmount, mintAmount);
    }

    function withdraw(uint256 repayAmount) public {
        require(
            repayAmount <= Loans[msg.sender].debtAmount,
            "withdraw limit exceeded"
        );
        require(
            balanceOf(msg.sender) >= repayAmount,
            "not enough tokens in balance"
        );
        uint256 withdrawAmount = repayAmount.div(getEthUSDPrice());
        console.log(withdrawAmount);
        burn(msg.sender, repayAmount);
        Loans[msg.sender].collateralAmount = Loans[msg.sender].collateralAmount.sub(withdrawAmount);
        Loans[msg.sender].debtAmount = Loans[msg.sender].debtAmount.sub(repayAmount);
        console.log(Loans[msg.sender].collateralAmount);
        console.log(Loans[msg.sender].debtAmount);
        payable(msg.sender).transfer(withdrawAmount);
        emit Withdraw(withdrawAmount, repayAmount);
    }

    function getDetails(address user)
        external
        view
        returns (Details memory detail)
    {
        return Loans[user];
    }

    function getEthUSDPrice() public view returns (uint256) {
        uint price = uint(getLatestPrice());
        return price.div(10**8);
    }
}
