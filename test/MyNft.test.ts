import { MyNft, NFTeeStaker } from "../typechain-types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { deployments, ethers, getNamedAccounts } from "hardhat"
import { assert, expect } from "chai"
describe("MyNft test!!", () => {
    let MyNft: MyNft
    // let NFTeeStaker: NFTeeStaker
    let deployer: SignerWithAddress
    let user: SignerWithAddress
    let accounts: SignerWithAddress[]
    beforeEach(async () => {
        ;[deployer, user, ...accounts] = await ethers.getSigners()
        await deployments.fixture(["mynft"])
        MyNft = await ethers.getContract("MyNft", deployer)
        // NFTeeStaker = await ethers.getContract("NFTeeStaker", deployer)
    })
    it("checks name & symbol", async () => {
        assert.equal(await MyNft.name(), "MyNft")
        assert.equal(await MyNft.symbol(), "MNFT")
        // console.log(NFTeeStaker)
    })
    it("checks safeMint function", async () => {
        assert.equal((await MyNft.tokenId()).toString(), "0")
        await expect(MyNft.ownerOf(0)).to.be.revertedWith("ERC721: invalid token ID")

        let tx = await MyNft.connect(user).safeMint(user.address)
        await tx.wait()
        assert.equal(await MyNft.ownerOf(0), user.address)
        assert.equal((await MyNft.tokenId()).toString(), "1")
    })
})
