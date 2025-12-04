# Soda Trading Bot

A web-based automated cryptocurrency trading bot supporting both EVM-compatible chains (including BNB Smart Chain, Ethereum, and Base) and Solana.

## Technology Stack

- Blockchain: EVM (Ethereum, BNB Smart Chain, Base) + Solana  
- Smart Contracts: EVM (Solidity-based), Solana
- Frontend: Vue + TypeScript
- Development: EVM using Hardhat and OpenZeppelin libraries; Solana using Anchor framework  

## Supported Networks

- Ethereum Mainnet (Chain ID: 1)  
- BNB Smart Chain Mainnet (Chain ID: 56)  
- Base Mainnet  (Chain ID: 8453)
- Solana Mainnet

## Contract Addresses

| Network       | Contract        |
|--------------|----------------------|
| Ethereum     | 0x80f3864dd6316ca206ea34e6979ec6cc4238265d  |
| BNB Mainnet  | 0xc35f0d1225ce500b154c1ec94d0f02421c5c66bc  |
| Base         | 0x711225d325a0a22fbc82263b3c3eed8f185f9a18  |
| Solana       | e1Jf2BALBQdk6YQqrHRmt4TyGHns4wjfvwdAcWcbvDK  |

## Features

- Multi-chain automated trading across Ethereum, BNB Smart Chain, Base, and Solana.  
- Real-time monitoring of on-chain events such as pool creation, price fluctuations, and activity from significant smart money addresses.  
- Automated trade execution when market conditions match user-defined strategies and parameters.  
- Fully customizable trading strategies, including risk controls and asset selection, tailored to individual user preferences.  
- Security-focused design with independent EVM and Solana audits (PeckShield SodaBot EVM and Solana audit reports).  
