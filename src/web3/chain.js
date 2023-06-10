export const zkSyncTestChain = {
  id: 280,
  name: "ZkSync testNet",
  network: "ZkSync",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["https://testnet.era.zksync.dev"] },
  },
  blockExplorers: {
    default: { name: "SnowTrace", url: "https://testnet.era.zksync.dev"},
  },
};

export const zkSyncMainetChain = {
  id: 324,
  name: "ZkSync mainet",
  network: "ZkSync",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["https://mainnet.era.zksync.io"] },
  },
  blockExplorers: {
    default: { name: "SnowTrace", url: "https://explorer.zksync.io"},
  },
};

export const tenetTestChain = {
  id: 155,
  name: "Tenet mainet",
  network: "Tenet",
  nativeCurrency: {
    decimals: 18,
    name: "TENET",
    symbol: "TENET",
  },
  rpcUrls: {
    default: { http: ["https://rpc.testnet.tenet.org"] },
  },
  blockExplorers: {
    default: { name: "Tenet scan", url: "https://testnet.tenetscan.io/"},
  },
};

export const tenetChain = {
  id: 1559,
  name: "Tenet",
  network: "Tenet",
  nativeCurrency: {
    decimals: 18,
    name: "TENET",
    symbol: "TENET",
  },
  rpcUrls: {
    default: { http: ["https://rpc.tenet.org"] },
  },
  blockExplorers: {
    default: { name: "Tenet scan", url: "https://tenetscan.io"},
  },
};


export const sepoliaChain = {
  id: 11155111,
  name: "Sepolia",
  network: "Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["https://rpc2.sepolia.org"] },
  },
  blockExplorers: {
    default: { name: "etherscan", url: "https://sepolia.etherscan.io/"},
  },
};




export const mainnetChains = [11155111];