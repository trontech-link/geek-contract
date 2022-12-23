// This contract should be created and deployed by the participant. Below is just an example.
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

import "./IAnswer.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract WrongAnswer is IAnswer {
    address payable public owner;

    constructor() {
        owner = payable(msg.sender);
    }

    function main(bytes[] memory input)
        public
        pure
        override
        returns (bytes memory)
    {
        uint256 x = bytesToUint(input[0]);
        uint256 y = bytesToUint(input[1]);
        uint256 sum = x + x + y + y;
        string memory s = Strings.toString(sum);
        return bytes(s);
    }

    function bytesToUint(bytes memory b) public pure returns (uint256) {
        uint256 number;
        for (uint256 i = 0; i < b.length; i++) {
            number =
                number +
                uint256(uint8(b[i])) *
                (2**(8 * (b.length - (i + 1))));
        }
        return number - 48;
    }
}
