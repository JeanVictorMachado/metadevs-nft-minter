require("dotenv").config();
const key = process.env.REACT_APP_PINATA_KEY;
const secret = process.env.REACT_APP_PINATA_SECRET;

const axios = require("axios");

// Função para converter JSON em IPFS
export const pinJSONToIPFS = async (JSONBody) => {
  const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

  return axios
    .post(url, JSONBody, {
      headers: {
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      },
    })
    .then((res) => {
      return {
        success: true,
        pinataUrl: `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`,
      };
    })
    .catch((err) => {
      return {
        success: false,
        message: err.message,
      };
    });
};

// Função para transformar a imagem da Arte do Projeto em IPFS
export const pinIMAGEtoIPFS = async (imageBody) => {
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

  return axios
    .post(url, imageBody, {
      headers: {
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      },
    })
    .then((res) => {
      return {
        success: true,
        pinataUrl: `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`,
      };
    })
    .catch((err) => {
      return {
        success: false,
        message: err.message,
      };
    });
};
