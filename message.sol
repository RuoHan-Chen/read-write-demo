// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract StringStore {
    // state variable to hold the string
    string private message;

    // constructor sets an initial value
    constructor() {
        message = "Change this";
    }

    // read the string (view function)
    function getMessage() public view returns (string memory) {
        return message;
    }

    // update the string (mutating function)
    function setMessage(string memory _newMessage) public {
        message = _newMessage;
    }
}