// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyNft is ERC721 {
    uint256 public tokenId;

    constructor() ERC721("MyNft", "MNFT") {}

    function safeMint(address to) public {
        _safeMint(to, tokenId);
        tokenId++;
    }
}
