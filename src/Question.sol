// This contract should be created and deployed by the participant. Below is just an example.
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

abstract contract Question {
    address payable public owner;
    string public title;
    string public description;
    uint256 public winnerShare;
    uint256 public testCaseCount;
    string public inputType;
    string public outputType;

    constructor(
        string memory _title,
        string memory _description,
        uint256 _winnerShare,
        string memory _inputType,
        string memory _outputType
    ) {
        owner = payable(msg.sender);
        testCaseCount = 0;
        title = _title;
        description = _description;
        winnerShare = _winnerShare;
        inputType = _inputType;
        outputType = _outputType;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not Owner");
        _;
    }

    function setTitle(string memory _title) public onlyOwner {
        require(bytes(_title).length > 0, "title should not be empty");
        title = _title;
    }

    function setDescription(string memory _description) public onlyOwner {
        require(
            bytes(_description).length > 0,
            "description should not be empty"
        );
        description = _description;
    }

    function setWinnerShare(uint256 _winnerShare) public onlyOwner {
        require(_winnerShare < 1, "winnerShare must not be 0");
        winnerShare = _winnerShare;
    }

    function setInputType(string memory _inputType) public onlyOwner {
        require(bytes(_inputType).length > 0, "inputType should not be empty");
        inputType = _inputType;
    }

    function setOutputType(string memory _outputType) public onlyOwner {
        require(
            bytes(_outputType).length > 0,
            "outputType should not be empty"
        );
        outputType = _outputType;
    }

    function verify(address answerAddr, uint256 testCaseId)
        public
        virtual
        returns (bool);

    // return encoded TestCase
    function getTestCasesById(uint256 testCaseId)
        public
        view
        virtual
        returns (bytes memory);
}
