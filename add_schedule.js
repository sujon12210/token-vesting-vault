const { ethers } = require("hardhat");
const fs = require("fs");
const config = require("./vesting_config.json");

async function main() {
    const [admin, beneficiary] = await ethers.getSigners();
    const vault = await ethers.getContractAt("VestingVault", config.vault, admin);

    console.log(`Creating schedule for ${beneficiary.address}...`);

    const amount = ethers.parseEther("10000"); // 10,000 Tokens
    
    // Get current block timestamp
    const blockNum = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNum);
    const now = block.timestamp;

    const start = now + 60; // Starts in 1 minute
    const cliff = 300;      // 5 minute cliff
    const duration = 3600;  // 1 hour vesting duration

    const tx = await vault.createSchedule(beneficiary.address, amount, start, cliff, duration);
    await tx.wait();

    console.log("Schedule Created Successfully!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
