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
        uint256 mintAmount = (depositAmount.mul(10**10)).mul(getEthUSDPrice());
        mint(msg.sender, mintAmount); // token minted takes mintAmount by 10**18
        Loans[msg.sender].collateralAmount = Loans[msg.sender].collateralAmount.add(msg.value);
        Loans[msg.sender].debtAmount = Loans[msg.sender].debtAmount.add(msg.value.mul(getEthUSDPrice()));
        emit Deposit(msg.value, msg.value.mul(getEthUSDPrice()));
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
        burn(msg.sender, repayAmount*1000000000000000000);
        Loans[msg.sender].collateralAmount = Loans[msg.sender].collateralAmount-((repayAmount*(10**18))/getEthUSDPrice());
        Loans[msg.sender].debtAmount = Loans[msg.sender].debtAmount-(repayAmount*1000000000000000000);
        payable(msg.sender).transfer((repayAmount*(10**18))/getEthUSDPrice());
        emit Withdraw(repayAmount/getEthUSDPrice(), repayAmount);
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