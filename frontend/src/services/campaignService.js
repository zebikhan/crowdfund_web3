// src/services/campaignService.js
import { getReadContract } from "../utils/contract"

/* ===================== HELPERS ===================== */

const IPFS_GATEWAY = "https://gateway.pinata.cloud/ipfs/"

function ipfsToHttp(uri) {
  if (!uri) return null 
  let cid = uri.replace("ipfs://", "");
  return `${IPFS_GATEWAY}${cid}`;
}

async function fetchMetadata(metadataCid) {
  try {
    const url = ipfsToHttp(metadataCid)
    if (!url) return {}
    const res = await fetch(url)
    return await res.json()
  } catch {
    return {}
  }
}

function normalizeCampaign(c, metadata = {}) {

  return {
    id: Number(c[0]),
    owner: c[1],
    metadataCid: c[2],
    goal: c[3].toString(),
    totalRaised: c[4].toString(),
    deadline: Number(c[5]),
    active: c[6],
    contributionType: Number(c[7]),
    acceptedToken: c[8],
    contributors: Number(c[9]),

    // IPFS Metadata
    title: metadata.title || "Untitled Campaign",
    description:
      metadata.shortDescription ||
      metadata.description ||
      "",
    image: metadata.image ? ipfsToHttp(metadata.image) : null,
    category: metadata.category || "Uncategorized",
    location: metadata.location || "Pakistan"
  }
}

/* ===================== CORE FETCH ===================== */

async function fetchCampaignByIndex(index) {
  const contract = getReadContract()
  const c = await contract.getCampaign(index)
  const metadata = await fetchMetadata(c[2])
  return normalizeCampaign(c, metadata)
}

/* ===================== CORE FETCH ===================== */

// All campaigns
export async function getAllCampaigns() {
  const contract = getReadContract()
  const count = Number((await contract.campaignCount()).toString()) 
  const list = []

  for (let i = 1; i <= count; i++) {
    list.push(await fetchCampaignByIndex(i))
  }

  return list.reverse()
}

// Single campaign (detail page)

export async function getCampaignById(id) {
  return await fetchCampaignByIndex(id)
}

// Campaigns created by wallet owner
export async function getCampaignsByOwner(owner) {
  if (!owner) return []

  const all = await getAllCampaigns()
  return all.filter(
    c => c.owner.toLowerCase() === owner.toLowerCase()
  )
}

// Campaigns by category

export async function getCampaignsByCategory(category) {
  const all = await getAllCampaigns()
  if (!category || category === "All") return all

  return all.filter(
    c => c.category.toLowerCase() === category.toLowerCase()
  )
}

// Featured campaigns (active + highest raised)

export async function getFeaturedCampaigns(limit = 3) {
  const all = await getAllCampaigns()

  return all
    .filter(c => c.active)
    .sort((a, b) => Number(b.totalRaised) - Number(a.totalRaised))
    .slice(0, limit)
}
