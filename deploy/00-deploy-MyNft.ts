import { ethers, network } from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const deployMyNft = async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments } = hre
    const { deployer } = await getNamedAccounts()
    const { log, deploy } = deployments
    const MyNft = await deploy("MyNft", {
        from: deployer,
        log: true,
    })
    log("-----------------------------------")
}
export default deployMyNft

deployMyNft.tags = ["all", "mynft"]
