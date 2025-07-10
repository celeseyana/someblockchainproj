const hre = require("hardhat");

async function main() {
	const FoodSupplyChain = await hre.ethers.getContractFactory("FoodSupplyChain");
	const contract = await FoodSupplyChain.deploy();
	await contract.waitForDeployment();

	console.log(`Deployed to: ${contract.target}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
