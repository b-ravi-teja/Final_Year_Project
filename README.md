# 🪪 Blockchain-Based Identification System

A decentralized identity verification system built on **Polygon Amoy Testnet** using **IPFS**, **Solidity**, **Hardhat**, **Node.js**, and **MongoDB**.  
This project ensures **secure, tamper-proof, and transparent identity management** by storing user identity data hashes on blockchain while keeping actual data on IPFS.

---

## 🚀 Overview

This system provides a secure identity verification workflow with two types of users:

- **User** → Submits personal details like Name, Email, Aadhaar ID, and Wallet Address.  
  Data is uploaded to **IPFS**, and the generated **hash** is stored on the **Polygon blockchain** using a smart contract.
  
- **Admin** → Verifies user identities by comparing the blockchain hash and database hash.  
  On successful verification, the `auth` field is updated to `true`.

---

## ⚙️ Tech Stack

### 🧠 **Blockchain**
- **Polygon Amoy Testnet**
- **Solidity (Smart Contract)**
- **Hardhat (Deployment & Testing)**
- **Ethers.js (Blockchain Interaction)**

### ☁️ **Storage**
- **IPFS** (via Pinata Cloud)

### 💻 **Backend**
- **Node.js + Express.js**
- **MongoDB** (Mongoose for schema)
- **Dotenv** for environment configuration

### 🌐 **Frontend**
- **Next.js (Vercel v0)**
- **Tailwind CSS**
- **MetaMask Integration**

---

## 🔐 Core Features

| Feature | Description |
|----------|--------------|
| 🧾 **User Registration** | User enters details → stored on IPFS → hash sent to blockchain |
| ⛓️ **Smart Contract** | Stores IPFS hash on Polygon Amoy with wallet mapping |
| 🗃️ **Database Storage** | MongoDB stores wallet address, hash, and auth status |
| 🔑 **Admin Verification** | Admin validates user’s blockchain hash and updates auth status |
| 🧩 **MetaMask Integration** | Wallet connection for on-chain transactions |
| 🪙 **Polygon Amoy Network** | Used for low-cost test transactions |

---
# Final_Year_Project
