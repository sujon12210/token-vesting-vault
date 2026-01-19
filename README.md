# Token Vesting Vault

![Solidity](https://img.shields.io/badge/solidity-^0.8.20-blue)
![Security](https://img.shields.io/badge/security-high-green)
![License](https://img.shields.io/badge/license-MIT-green)

## Overview

**Token Vesting Vault** ensures that project tokens are locked and released according to a strict schedule. This builds trust with the community by mathematically preventing the team from selling all their tokens at once.

## Features

-   **Cliff Mechanism**: Tokens remain 100% locked until a specific date.
-   **Linear Vesting**: After the cliff, tokens unlock second-by-second over the duration.
-   **Multi-Beneficiary**: One contract can manage schedules for the whole team.
-   **Revocable**: Option to revoke unvested tokens (useful if an employee is fired).

## Usage

1.  **Deploy**: Launch the Vesting Contract.
2.  **Fund**: Transfer the total supply of tokens to the Vault.
3.  **Register**: Owner adds beneficiaries with specific schedules.
4.  **Claim**: Beneficiaries call `release()` to withdraw unlocked tokens.

## Quick Start

```bash
# 1. Install
npm install

# 2. Deploy
npx hardhat run deploy.js --network localhost

# 3. Add a Schedule (e.g., 6-month cliff, 2-year vesting)
node add_schedule.js

# 4. Check Claimable Amount
node check_status.js

# 5. Claim Tokens
node release.js
