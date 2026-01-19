const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
    const [admin] = await ethers.getSigners();
    console.log("Deploying with:", admin.address);

    // 1. Deploy Token
    const Token = await ethers.getContractFactory("ProjectToken");
    const token = await Token.deploy();
    await token.waitForDeployment();
    const tokenAddr = await token.getAddress();
    console.log("Token:", tokenAddr);

    // 2. Deploy Vault
    const Vault = await ethers.getContractFactory("VestingVault");
    const vault = await Vault.deploy(tokenAddr);
    await vault.waitForDeployment();
    const vaultAddr = await vault.getAddress();
    console.log("Vault:", vaultAddr);

    // 3. Fund the Vault (Send 1 Million tokens)
    const fundAmount = ethers.parseEther("1000000");
    await token.transfer(vaultAddr, fundAmount);
    console.log("Vault funded with 1,000,000 FUTR");

    // Save config
    fs.writeFileSync("vesting_config.json", JSON.stringify({ vault: vaultAddr, token: tokenAddr }));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
