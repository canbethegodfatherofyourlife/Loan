
async function main() {

  const [deployer] = await ethers.getSigners();

  const Loan = await ethers.getContractFactory("Loan");
  const token = await Loan.deploy();
  console.log("Token address: " + token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
