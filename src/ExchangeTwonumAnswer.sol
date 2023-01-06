// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

import "./Answer.sol";

contract ExchangeTwoNumAnswer is Answer {
    function main(uint256[] memory input)
        public
        pure
        returns (uint256[] memory)
    {
        uint256[] memory output = new uint256[](2);
        output[0] = input[1];
        output[1] = input[1];
        return output;
    }
}
