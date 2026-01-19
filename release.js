const { ethers } = require("hardhat");
const config = require("./vesting_config.json");

async function main() {
    const [_, beneficiary] = await ethers.getSigners();
    const vault = await ethers.getContractAt("VestingVault", config.vault, beneficiary);
    const token = await ethers.getContractAt("ProjectToken", config.token, beneficiary);

    console.log("Attempting to claim tokens...");

    try {
        const tx = await vault.release();
        await tx.wait();
        
        const balance = await token.balanceOf(beneficiary.address);
        console.log("Claim Successful!");
        console.log(`New Wallet Balance: ${ethers.formatEther(balance)} FUTR`);
    } catch (e) {
        console.error("Claim Failed (Maybe cliff hasn't passed?):", e.message);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
