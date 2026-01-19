// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// A simple ERC20 Token to test the vesting logic
contract ProjectToken is ERC20 {
    constructor() ERC20("Future Protocol", "FUTR") {
        // Mint 10 million tokens to deployer
        _mint(msg.sender, 10000000 * 10 ** decimals());
    }
}
