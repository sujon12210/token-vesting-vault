const { ethers } = require("hardhat");
const config = require("./vesting_config.json");

async function main() {
    // Only used in emergencies or employee termination
    const [admin, beneficiary] = await ethers.getSigners();
    const vault = await ethers.getContractAt("VestingVault", config.vault, admin);

    console.log(`Revoking schedule for ${beneficiary.address}...`);

    // Note: My contract implementation didn't strictly add a 'revoke' function 
    // to keep the code simple and 'trustless' (employees prefer non-revocable).
    // To add it, you would simply add a function in the Solidity file:
    // function revoke(address user) external onlyOwner { ... }
    
    console.log("NOTE: Strict revocation is disabled in this safe contract version.");
    console.log("This prevents the admin from rug-pulling the employee.");
}

main();
