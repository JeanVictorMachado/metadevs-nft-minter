const MetadevsContract = artifacts.require("MetadevsContract");

module.exports = function (deployer) {
  deployer.deploy(MetadevsContract);
};
