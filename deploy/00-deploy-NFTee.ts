import { ethers, network } from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const deployNFTee = async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments } = hre
    const { deployer, user } = await getNamedAccounts()
    console.log(network.name)
    const { log, deploy } = deployments
    let args = [10]
    const NFTee = await deploy("NFTee", {
        from: deployer,
        log: true,
        args: args,
    })
}
export default deployNFTee

deployNFTee.tags = ["all"]
