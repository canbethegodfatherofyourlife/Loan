const { expect } = require("chai");

describe("Token contract", function () {

  it("should assign name to Godfather",async function () {

    const Token = await ethers.getContractFactory("Godfather");
    const hardhatToken = await Token.deploy();

    const name = await hardhatToken.name();;
    expect(name).to.equal("Godfather");
  })

  it("should assign symbol to GDA",async function () {

    const Token = await ethers.getContractFactory("Godfather");
    const hardhatToken = await Token.deploy();

    const symbol = await hardhatToken.symbol();
    expect(symbol).to.equal("GDA");
  })
});