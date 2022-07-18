import { NFTee } from "../typechain-types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { deployments, ethers, getNamedAccounts } from "hardhat"
import { assert } from "chai"
describe("NFTee test!!", () => {
    let NFTee: NFTee
    let deployer: SignerWithAddress
    let user: SignerWithAddress
    let accounts: SignerWithAddress[]
    beforeEach(async () => {
        ;[deployer, user, ...accounts] = await ethers.getSigners()
        await deployments.fixture(["all"])
        NFTee = await ethers.getContract("NFTee", deployer)
    })
    it("checks name & symbol", async () => {
        assert.equal(await NFTee.name(), "NFTee")
        assert.equal(await NFTee.symbol(), "NFT")
    })
})
