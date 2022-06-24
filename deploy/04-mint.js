const { ethers, network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    //Basic NFT
    const basicNft = await ethers.getContract("BasicNft", deployer)
    const basicNftTx = await basicNft.mintNft()
    await basicNftTx.wait(1)
    console.log(`Basic NFT index 0 has tokenURI: ${await basicNft.tokenURI(0)}`)

    //Random IPFS NFT
    const randomIpfNft = await ethers.getContract("RandomIpfsNft", deployer)
    const mintFee = await randomIpfNft.getMintFee()

    await new Promise(async (resolve, reject) => {
        setTimeout(resolve, 300000) //5minutos
        randomIpfNft.once("NftMinted", async function () {
            resolve
        })
        const randomIpfNftMintTx = await randomIpfNft.requestNft({ value: mintFee.toString() })
        const randomIpfNftMintTxReceipt = await randomIpfNftMintTx.wait(1)
        if (developmentChains.includes(network.name)) {
            const requestId = randomIpfNftMintTxReceipt.events[1].args.requestId.toString()
            const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
            await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, randomIpfNft.address)
        }
    })
    console.log(`Random IPFS NFT index 0 tokenURI: ${await randomIpfNft.tokenURI(0)}`)

    //Dynamic SVG NFT
    const highValue = ethers.utils.parseEther("4000")
    const dynamicSvgNft = await ethers.getContract("DynamicSvgNft", deployer)
    const dynamicSvgNftMintTx = await dynamicSvgNft.mintNft(highValue.toString())
    await dynamicSvgNftMintTx.wait(1)
    console.log(`Dynamoc SVG NFT index 0 tokenUri: ${await dynamicSvgNft.tokenURI(0)}`)
}

module.exports.tags = ["all", "mint"]
