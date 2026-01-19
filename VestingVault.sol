// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract VestingVault is Ownable, ReentrancyGuard {
    
    struct Schedule {
        uint256 totalAllocated; // Total tokens to be vested
        uint256 released;       // Amount already claimed
        uint256 start;          // Timestamp when vesting starts
        uint256 cliff;          // Duration of cliff (seconds)
        uint256 duration;       // Total vesting duration (seconds)
        bool revoked;
    }

    IERC20 public token;
    mapping(address => Schedule) public schedules;
    uint256 public totalVesting; // Total tokens currently locked

    event ScheduleCreated(address indexed beneficiary, uint256 amount);
    event TokensReleased(address indexed beneficiary, uint256 amount);
    event ScheduleRevoked(address indexed beneficiary);

    constructor(address _token) Ownable(msg.sender) {
        token = IERC20(_token);
    }

    function createSchedule(
        address _beneficiary,
        uint256 _amount,
        uint256 _start,
        uint256 _cliff,
        uint256 _duration
    ) external onlyOwner {
        require(schedules[_beneficiary].totalAllocated == 0, "Schedule exists");
        require(_amount > 0, "Amount > 0");
        
        // Ensure contract has enough tokens
        require(token.balanceOf(address(this)) >= totalVesting + _amount, "Insufficient Vault Balance");

        schedules[_beneficiary] = Schedule({
            totalAllocated: _amount,
            released: 0,
            start: _start,
            cliff: _start + _cliff,
            duration: _duration,
            revoked: false
        });

        totalVesting += _amount;
        emit ScheduleCreated(_beneficiary, _amount);
    }

    function vestedAmount(address _beneficiary) public view returns (uint256) {
        Schedule memory s = schedules[_beneficiary];
        if (block.timestamp < s.cliff) {
            return 0;
        } else if (block.timestamp >= s.start + s.duration || s.revoked) {
            return s.totalAllocated;
        } else {
            return (s.totalAllocated * (block.timestamp - s.start)) / s.duration;
        }
    }

    function releasableAmount(address _beneficiary) public view returns (uint256) {
        return vestedAmount(_beneficiary) - schedules[_beneficiary].released;
    }

    function release() external nonReentrant {
        uint256 unreleased = releasableAmount(msg.sender);
        require(unreleased > 0, "Nothing to claim");

        schedules[msg.sender].released += unreleased;
        totalVesting -= unreleased;
        
        token.transfer(msg.sender, unreleased);
        emit TokensReleased(msg.sender, unreleased);
    }
}
