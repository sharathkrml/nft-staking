import { MyNft, NFTeeStaker } from "../typechain-types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { deployments, ethers, getNamedAccounts, network } from "hardhat"
import { assert, expect } from "chai"
describe("NFTeeStaker test!!", () => {
    let MyNft: MyNft
    let NFTeeStaker: NFTeeStaker
    let deployer: SignerWithAddress
    let user: SignerWithAddress
    let accounts: SignerWithAddress[]
    beforeEach(async () => {
        ;[deployer, user, ...accounts] = await ethers.getSigners()
        await deployments.fixture(["all"])
        MyNft = await ethers.getContract("MyNft", deployer)
        NFTeeStaker = await ethers.getContract("NFTeeStaker", deployer)
    })
    it("Constructor", async () => {
        assert.equal(await NFTeeStaker.nft(), MyNft.address)
    })
    it("check EMISSION_RATE = wei per second", async () => {
        assert.equal((await NFTeeStaker.EMISSION_RATE()).toString(), "1")
    })
    describe("check Staking", () => {
        let tx
        beforeEach(async () => {
            // mint nft to deployer
            tx = await MyNft.safeMint(deployer.address)
            await tx.wait()
        })
        it("stake NFT", async () => {
            tx = await MyNft.approve(NFTeeStaker.address, 0)
            await tx.wait(1)
            tx = await NFTeeStaker.stake(0)
            assert.equal(await MyNft.ownerOf(0), NFTeeStaker.address)
        })
        describe("calculates and unstake", () => {
            beforeEach(async () => {
                tx = await MyNft.approve(NFTeeStaker.address, 0)
                await tx.wait(1)
                tx = await NFTeeStaker.stake(0)
            })
            it("calculate after 30 seconds", async () => {
                await network.provider.send("evm_increaseTime", [30])
                await network.provider.send("evm_mine", [])
                assert.equal((await NFTeeStaker.calculate(0)).toString(), "30")
            })
            describe("unstake after 1 minute", () => {
                beforeEach(async () => {
                    await network.provider.send("evm_increaseTime", [60])
                    await network.provider.send("evm_mine", [])
                })
                it("check ownership transfer from Staking contract to user", async () => {
                    assert.equal(await MyNft.ownerOf(0), NFTeeStaker.address)
                    tx = await NFTeeStaker.unstake(0)
                    tx.wait(1)
                    assert.equal(await MyNft.ownerOf(0), deployer.address)
                })
                it("check NFTeeStaker Tokens balance", async () => {
                    tx = await NFTeeStaker.unstake(0)
                    tx.wait(1)
                    assert((await NFTeeStaker.balanceOf(deployer.address)).toNumber() >= 60)
                })
                it("check deletion of tokenOwnerOf & tokenStakedAt", async () => {
                    assert.equal(await NFTeeStaker.tokenOwnerOf(0), deployer.address)
                    tx = await NFTeeStaker.unstake(0)
                    tx.wait(1)
                    assert.equal((await NFTeeStaker.tokenStakedAt(0)).toString(), "0")
                    assert.equal(await NFTeeStaker.tokenOwnerOf(0), ethers.constants.AddressZero)
                })
                it("check failure if someone else try to unstake", async () => {
                    await expect(NFTeeStaker.connect(user).unstake(0)).to.be.revertedWith(
                        "You can't unstake,you aren't owner"
                    )
                })
            })
        })
    })
})
