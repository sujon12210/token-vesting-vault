const { ethers } = require("hardhat");
const config = require("./vesting_config.json");

async function main() {
    const [_, beneficiary] = await ethers.getSigners();
    const vault = await ethers.getContractAt("VestingVault", config.vault, beneficiary);

    console.log(`Checking status for ${beneficiary.address}...`);

    // In a local testnet, time doesn't pass unless we mine blocks or mock it
    // await ethers.provider.send("evm_increaseTime", [600]); // Fast forward 10 mins
    // await ethers.provider.send("evm_mine");

    const releasable = await vault.releasableAmount(beneficiary.address);
    const vested = await vault.vestedAmount(beneficiary.address);

    console.log(`Total Vested: ${ethers.formatEther(vested)} FUTR`);
    console.log(`Claimable Now: ${ethers.formatEther(releasable)} FUTR`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
