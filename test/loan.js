const { expect } = require("chai");

describe("Loan contract", function () {
  let Loan1, HardhatLoan, owner;
  let collateralAmount1;

  beforeEach(async function () {
    Loan1 = await ethers.getContractFactory("Loan");
    HardhatLoan = await Loan1.deploy();
    const signers = await ethers.getSigners();
    owner = signers[0];
  });

  describe("Deposit", function () {

    it("collateral amount checking ...", async function () {
        collateralAmount1 = HardhatLoan.Loans(owner).collateralAmount;
        await HardhatLoan.deposit(41);
        expect(parseInt(ethers.utils.formatEther(HardhatLoan.Loans(owner).collateralAmount).toString())).to.equal(
           parseInt(ethers.utils.formatEther(collateralAmount1).toString()+41)
        );
      });

    it("collateral amount checking ...", async function () {
      collateralAmount1 = HardhatLoan.Loans(owner).collateralAmount;
      await HardhatLoan.withdraw(40);
      expect(parseInt(ethers.utils.formatEther(HardhatLoan.Loans(owner).collateralAmount).toString())).to.equal(
         parseInt(ethers.utils.formatEther(collateralAmount1).toString()-40)
      );
    });
  });
});
