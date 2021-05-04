const ERC20 = artifacts.require("DCERC20");

const { deployProxy } = require('@openzeppelin/truffle-upgrades');

module.exports = async function (deployer) {
  await deployProxy(ERC20, [42], { deployer, initializer: 'setTotalSupply' });
};
