// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

contract Test {
    struct TC {
        uint256[] input;
        uint256[] output;
    }
    
    uint256[] input = [1, 2, 6];
    uint256[] output = [2, 1];
    string desc = "hello world";
    string[] tc = ["tc1", "tc2"];
    function returnMany()
        public
        view
        returns (
            uint,
            bool,
            uint,
            string memory
        )
    {
        return (1, true, 2, desc);
    }
    
    function getDesc() public pure returns(bytes memory){
        string memory aaa = "hello string";
        return abi.encode(aaa);
    }
    
    function getArray() public view returns(bytes memory) {
        return abi.encode(input);
    }
    
    function getArrayWithSig() public view returns(bytes memory) {
        return abi.encodeWithSignature("uint256[]", input);
    }
    
    function getTC() public view returns(bytes memory, uint256[] memory, uint256[] memory) {
        TC memory testCase = TC(input, output);
        bytes memory ret = abi.encode(testCase);
        
        TC memory newTC = abi.decode(ret, (TC));
        return (ret, newTC.input, newTC.output);
    }
    
    function justGetTC() public view returns(TC memory) {
        TC memory testCase = TC(input, output);
        return testCase;
    }
    
     function named()
        public
        pure
        returns (
            uint x,
            bool b,
            uint y
        )
    {
        return (1, true, 2);
    }
    
    function assigned()
        public
        pure
        returns (
            uint x,
            bool b,
            uint y
        )
    {
        x = 1;
        b = true;
        y = 2;
    }

    // Use destructuring assignment when calling another
    // function that returns multiple values.
    function destructuringAssignments()
        public
        pure
        returns (
            uint,
            bool,
            uint,
            uint,
            uint
        )
    {
        // (uint i, bool b, uint j, , , , , ) = returnMany();
        uint i = 0;
        bool b = true;
        uint j = 3;

        // Values can be left out.
        (uint x, , uint y) = (4, 5, 6);

        return (i, b, j, x, y);
    }

    // Cannot use map for either input or output

    // Can use array for input
    function arrayInput(uint[] memory _arr) public {}

    // Can use array for output
    uint[] public arr;

    function arrayOutput() public view returns (uint[] memory) {
        return arr;
    }
}