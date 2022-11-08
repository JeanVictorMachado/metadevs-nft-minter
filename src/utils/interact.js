import MetadevsContract from "../abis/MetadevsContract.json";
import { pinJSONToIPFS } from "./pinata";

require("dotenv").config();

const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

// Função para iniciar o contrato de acordo com a ABI
export const loadContract = async () => {
  const networkData = MetadevsContract.networks["5777"];
  const contractAddress = networkData.address;
  const contractABI = MetadevsContract.abi;

  if (contractABI && contractAddress) {
    window.contract = new web3.eth.Contract(contractABI, contractAddress);

    return {
      success: true,
      contractAddress,
    };
  } else {
    return {
      success: false,
    };
  }
};

// Função para abrir a opção de conectar carteira na Metamask
export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const address = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      return {
        connectedStatus: true,
        status: "",
        address,
      };
    } catch (err) {
      return {
        connectedStatus: false,
        status: "Conecte sua carteira na Metamask",
      };
    }
  } else {
    return {
      connectedStatus: false,
      status: "Por favor, instale a Metamask",
    };
  }
};

// Função para realizar o Mint de um NFTT a partir dos parâmetros
export const mintNFT = async (artist, image, name) => {
  const metadata = {
    image,
    name,
    artist,
  };

  const pinataResponse = await pinJSONToIPFS(metadata);

  if (!pinataResponse.success) {
    return {
      success: false,
      status: "Algo deu errado ao converter JSON para IPFS",
    };
  }

  const tokenURI = pinataResponse.pinataUrl;
  const { contractAddress } = await loadContract();

  const transactionsParameters = {
    to: contractAddress,
    from: window.ethereum.selectedAddress,
    data: window.contract.methods
      .mintNFT(window.ethereum.selectedAddress, tokenURI)
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionsParameters],
    });

    return {
      success: true,
      status: `NFT Mintado com sucesso! txHash: ${txHash}`,
    };
  } catch (err) {
    return {
      success: false,
      status: "Algo deu errado ao mintar o NFT",
    };
  }
};
