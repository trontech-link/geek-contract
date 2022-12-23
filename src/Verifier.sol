// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

contract Verifier {
    struct TestCase {
        bytes[] input;
        bytes output;
    }

    address payable public owner;
    address[] public registeredQuestionList;
    mapping(uint256 => uint256[2]) public prizePool;
    mapping(uint256 => address payable) public winner;

    event TestFailed(
        uint256 testCaseId,
        TestCase testCase,
        bytes expected,
        bytes actual
    );
    event TestPassed(
        uint256 testCaseId,
        TestCase testCase,
        bytes expected,
        bytes actual
    );
    event WinnerAssigned(uint256 questionId, address winner);
    event Rewarded(uint256 questionId, address winner, uint256 rewardToWinner);

    constructor() {
        owner = payable(msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function verify(uint256 _questionId, address answerAddr)
        public
        payable
        returns (bool)
    {
        require(
            prizePool[_questionId][0] > 0,
            "This question had already been rewarded."
        );

        require(msg.value >= 1, "Must pay at least 1 sun to verify.");

        // Deposit send value to prize pool
        deposit(_questionId, msg.value);

        TestCase[] memory testCases = _getTestCase(_questionId);

        uint256 arrLength = testCases.length;

        for (uint256 i = 0; i < arrLength; i++) {
            bytes memory payload = abi.encodeWithSignature(
                "main(bytes[])",
                testCases[i].input
            );

            (bool success, bytes memory data) = answerAddr.call(payload);

            require(success, "Answer call failed.");

            bytes memory expected = testCases[i].output;
            bytes memory actual = abi.decode(data, (bytes));

            if (bytes32(expected) != bytes32(actual)) {
                emit TestFailed(i, testCases[i], expected, actual);
                return false;
            } else {
                emit TestPassed(i, testCases[i], expected, actual);
            }
        }
        //Get answer's owner's address
        address payable answerOwner = _getAnswerOwner(answerAddr);

        //Assign winner
        winner[_questionId] = answerOwner;

        emit WinnerAssigned(_questionId, answerOwner);

        return true;
    }

    function registerQuestion(address questionAddr) public payable {
        require(msg.value >= 1, "Must pay at least 1 sun to register.");
        uint256 questionId = registeredQuestionList.length;
        deposit(questionId, msg.value);
        registeredQuestionList.push(questionAddr);
    }

    function withdrawByWinner(uint256 _questionId) public {
        // Get winner's address
        address payable winnerAddr = winner[_questionId];
        require(
            winnerAddr != address(0) && winnerAddr == msg.sender,
            "Only winner can take the prize."
        );

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

        require(
            winner[_questionId] != address(0) && questionOwner == msg.sender,
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

    function _getTestCase(uint256 _questionId)
        private
        returns (TestCase[] memory)
    {
        // Get contract address of the question that need to be verified
        address questionAddr = registeredQuestionList[_questionId];

        (bool success, bytes memory data) = questionAddr.call(
            abi.encodeWithSignature("getTestCases()")
        );
        require(success, "Get test cases failed.");

        TestCase[] memory testCases = abi.decode(data, (TestCase[]));

        return testCases;
    }

    function _getAnswerOwner(address answerAddr)
        private
        returns (address payable)
    {
        (bool success, bytes memory data) = answerAddr.call(
            abi.encodeWithSignature("owner()")
        );
        require(success, "Get answer owner failed.");

        return abi.decode(data, (address));
    }

    function _getQuestionOwner(uint256 _questionId)
        private
        returns (address payable)
    {
        address questionAddr = registeredQuestionList[_questionId];

        (bool success, bytes memory data) = questionAddr.call(
            abi.encodeWithSignature("owner()")
        );
        require(success, "Get question owner failed.");

        return abi.decode(data, (address));
    }

    function _getWinnerShare(uint256 _questionId) private returns (uint256) {
        address questionAddr = registeredQuestionList[_questionId];

        (bool success, bytes memory data) = questionAddr.call(
            abi.encodeWithSignature("winnerShare()")
        );

        require(success, "Get winner share failed.");

        return abi.decode(data, (uint256));
    }
}
