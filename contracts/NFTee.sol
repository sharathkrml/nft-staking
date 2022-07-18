// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTee is ERC721 {
    uint256 public immutable MAX_NFTS;
    uint256 public tokenId;

    constructor(uint256 max_nfts) ERC721("NFTee", "NFT") {
        MAX_NFTS = max_nfts;
    }

    function freeMint() public {
        require(tokenId < MAX_NFTS, "MAX_SUPPLY_REACHED");
        _safeMint(msg.sender, tokenId);
        tokenId++;
    }
}
