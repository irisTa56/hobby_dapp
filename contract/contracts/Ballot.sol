// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Ballot {
    struct Voter {
        uint weight;
        bool voted;
    }

    address public chairperson;
    mapping (address => Voter) voters;
    mapping (uint => uint) proposals;

    modifier onlyChair() {
        require(msg.sender == chairperson, "onlyChair");
        _;
    }

    modifier validVoter() {
        require(voters[msg.sender].weight > 0, "notRegisteredVoter");
        _;
    }

    constructor () {
        chairperson = msg.sender;
        voters[chairperson].weight = 2;
    }

    function register(address voter) public onlyChair {}

    function vote(uint toProposal) public validVoter {}

    function reqWinner() public view returns (uint) {}
}
