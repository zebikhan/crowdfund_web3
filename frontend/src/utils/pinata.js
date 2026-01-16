import axios from "axios"

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY
const PINATA_SECRET_API_KEY = import.meta.env.VITE_PINATA_SECRET_API_KEY

// Upload file (image) to IPFS
export async function uploadFileToIPFS(file) {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`
  const formData = new FormData()
  formData.append("file", file)

  const res = await axios.post(url, formData, {
    maxContentLength: "Infinity",
    headers: {
      "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_API_KEY,
    },
  })

  return `ipfs://${res.data.IpfsHash}`
}

// Upload metadata JSON to IPFS
export async function uploadJSONToIPFS(data) {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`
  const res = await axios.post(url, data, {
    headers: {
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_API_KEY,
    },
  })

  return `ipfs://${res.data.IpfsHash}`
}
