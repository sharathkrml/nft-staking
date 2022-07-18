// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "hardhat/console.sol";

contract NFTeeStaker is ERC20, ERC721Holder {
    IERC721 public nft;
    mapping(uint256 => address) public tokenOwnerOf;
    mapping(uint256 => uint256) public tokenStakedAt;
    uint256 public EMISSION_RATE = ((50 * 10) ^ decimals()) / 1 days; //per second => 50 token per day

    constructor(address _nft) ERC20("NFTeeStaker", "NST") {
        nft = IERC721(_nft);
    }

    function stake(uint256 tokenId) external {
        nft.safeTransferFrom(msg.sender, address(this), tokenId);
        tokenOwnerOf[tokenId] = msg.sender;
        tokenStakedAt[tokenId] = block.timestamp;
    }

    function calculate(uint256 tokenId) public view returns (uint256) {
        uint256 elasped = block.timestamp - tokenStakedAt[tokenId];
        return elasped * EMISSION_RATE;
    }

    function unstake(uint256 tokenId) external {
        require(tokenOwnerOf[tokenId] == msg.sender, "You can't unstake,you aren't owner");
        _mint(msg.sender, calculate(tokenId)); // mint tokens
        nft.safeTransferFrom(address(this), msg.sender, tokenId);
        delete tokenOwnerOf[tokenId];
        delete tokenStakedAt[tokenId];
    }
}
