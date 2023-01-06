// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

abstract contract Question {
    address payable public owner;
    string public title;
    string public description;
    uint256 public winnerShare; // in percent
    uint256 public testCaseCount;

    constructor(
        string memory _title,
        string memory _description,
        uint256 _winnerShare
    ) {
        owner = payable(msg.sender);
        title = _title;
        description = _description;
        winnerShare = _winnerShare;
        testCaseCount = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not Owner");
        _;
    }

    function setTitle(string memory _title) public onlyOwner {
        title = _title;
    }

    function setDescription(string memory _description) public onlyOwner {
        description = _description;
    }

    function setWinnerShare(uint256 _winnerShare) public onlyOwner {
        winnerShare = _winnerShare;
    }

    function verify(address answerAddr, uint256 testCaseId)
        public
        virtual
        returns (bool);
}
