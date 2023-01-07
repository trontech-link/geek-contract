// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

import "./Question.sol";
import "./Answer.sol";

contract Verifier {
    address payable public owner;
    address[] public registeredQuestionList;
    mapping(uint256 => uint256[2]) public prizePool;
    mapping(uint256 => address payable) public winner;

    event TestFailed(uint256 questionId, uint256 testCaseId);
    event WinnerAssigned(uint256 questionId, address winner);
    event Rewarded(uint256 questionId, address winner, uint256 rewardToWinner);

    constructor() {
        owner = payable(msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function verify(uint256 _questionId, address answerAddr) public payable returns (bool){
        require(winner[_questionId] == address(0), "A winner had been assigned for this question.");

        require(msg.value >= 1, "Must pay at least 1 sun to verify.");

        // Deposit send value to prize pool
        deposit(_questionId, msg.value);

        address questionAddr = registeredQuestionList[_questionId];
        Question question = Question(questionAddr);
        (bool isPassed, uint testCaseId) = question.verify(answerAddr);

        if (isPassed) {
            //Get answer's owner's address
            address payable answerOwner = _getAnswerOwner(answerAddr);
            //Assign winner
            winner[_questionId] = answerOwner;
            emit WinnerAssigned(_questionId, answerOwner);
        } else {
            emit TestFailed(_questionId, testCaseId);
        }
        return isPassed;
    }

    function registerQuestion(address questionAddr) public payable {
        require(msg.value >= 1, "Must pay at least 1 sun to register.");
        uint256 questionId = registeredQuestionList.length;
        registeredQuestionList.push(questionAddr);
        deposit(questionId, msg.value);
    }

    function withdrawByWinner(uint256 _questionId) public {
        // Get winner's address
        address payable winnerAddr = winner[_questionId];
        require(winnerAddr != address(0) && winnerAddr == msg.sender, "Only winner can take the prize.");

        // Get the reward amount to winner
        uint256 rewardToWinner = prizePool[_questionId][0];

        // Deduct reward amount from prize pool
        prizePool[_questionId][0] = 0;

        // Send reward to the winner
        winnerAddr.transfer(rewardToWinner);
        emit Rewarded(_questionId, winnerAddr, rewardToWinner);
    }

    function withdrawByQuestionOwner(uint256 _questionId) public {
        // Get question's owner's address
        address payable questionOwner = _getQuestionOwner(_questionId);
        // Get winner's address
        address payable winnerAddr = winner[_questionId];

        require(
            winnerAddr != address(0) && questionOwner == msg.sender,
            "Only question owner can take the prize."
        );

        // Get the reward amount to question owner
        uint256 rewardToQuestionOwner = prizePool[_questionId][1];

        // Deduct reward amount from prize pool
        prizePool[_questionId][1] = 0;

        // Send reward to the question owner
        questionOwner.transfer(rewardToQuestionOwner);
    }

    function deposit(uint256 _questionId, uint256 _amount) public {
        require(_amount >= 1, "Deposit at least 1 sun");
        uint256 winnerShare = _getWinnerShare(_questionId);

        uint256 prizeForWinner = (_amount * winnerShare) / 100;
        uint256 prizeForQuestionOwner = _amount - prizeForWinner;

        // Add prize for winner
        prizePool[_questionId][0] += prizeForWinner;

        // Add prize for question owner
        prizePool[_questionId][1] += prizeForQuestionOwner;
    }

    function _getAnswerOwner(address answerAddr) private view returns (address payable){
        return Answer(answerAddr).owner();
    }

    function _getQuestionOwner(uint256 _questionId) private view returns (address payable){
        address questionAddr = registeredQuestionList[_questionId];
        return Question(questionAddr).owner();
    }

    function _getWinnerShare(uint256 _questionId) private view returns (uint256){
        address questionAddr = registeredQuestionList[_questionId];
        return Question(questionAddr).winnerShare();
    }

    function getQuestionCount() public view returns (uint count) {
        return registeredQuestionList.length;
    }
}
