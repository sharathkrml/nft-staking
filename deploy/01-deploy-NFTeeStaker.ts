import { ethers, network } from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { MyNft } from "../typechain-types"

const deployNFTeeStaker = async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const MyNFT: MyNft = await ethers.getContract("MyNft")
    let args = [MyNFT.address]
    const NFTeeStaker = await deploy("NFTeeStaker", {
        from: deployer,
        args: args,
        log: true,
    })
    log("--------------------------------------")
}
export default deployNFTeeStaker

deployNFTeeStaker.tags = ["all"]
