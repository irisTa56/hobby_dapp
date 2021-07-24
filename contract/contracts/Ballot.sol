// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0; // solhint-disable-line

contract Ballot {
    struct Voter {
        uint weight;
        bool voted;
    }

    address public chairperson;

    mapping (address => Voter) private voters;
    mapping (uint => uint) private proposals;

    enum Phase { Init, Regs, Vote, Done }
    Phase public phase = Phase.Init;

    modifier validPhase(Phase reqPhase) {
        require(phase == reqPhase, "phaseError");
        _;
    }

    modifier onlyChair() {
        require(msg.sender == chairperson, "onlyChair");
        _;
    }

    modifier validVoter() {
        require(voters[msg.sender].weight > 0, "notRegistered");
        _;
    }

    constructor() { // solhint-disable-line
        chairperson = msg.sender;
        voters[chairperson].weight = 2;
    }

    function changePhase(Phase newPhase) public onlyChair {
        require(newPhase < phase, "invalidPhaseTransition");
        phase = newPhase;
    }

    function register(address voter) public validPhase(Phase.Regs) onlyChair {
        require(!voters[voter].voted, "alreadyVotedAccount");
        voters[voter].weight = 1;
        voters[voter].voted = false;
    }

    function vote(uint proposalId) public validPhase(Phase.Vote) validVoter {
        Voter storage voter = voters[msg.sender];
        require (!voter.voted, "alreadyVoted");
        voter.voted = true;
        proposals[proposalId] += voter.weight;
    }

    function reqWinner(uint[] memory proposalIds) public validPhase(Phase.Done) view
      returns (uint winningProposalId, uint winningVoteCount) {
        require (proposalIds.length > 0, "noProposalId");
        winningProposalId = proposalIds[0];
        winningVoteCount = 0;
        for (uint i = 0; i < proposalIds.length; i++) {
            if (proposals[proposalIds[i]] > winningVoteCount) {
                winningProposalId = proposalIds[i];
                winningVoteCount = proposals[winningProposalId];
            }
        }
    }
}
