interface ContractAddress {
  chainId: number;
  chainName: string;
  address: string;
  remote_chain_id?: number;
  iconPath: string;
}

export const contractAddresses: ContractAddress[] = [
  {
    chainId: 42161,
    chainName: "Arbitrum",
    address: "0x17dcdF9F0A378612041f83452e3DFdf7D97AAD0e",
    remote_chain_id: 110,
    iconPath: "/static/arbitrum.svg",
  },
  {
    chainId: 56,
    chainName: "BNB Chain",
    address: "0x17dcdF9F0A378612041f83452e3DFdf7D97AAD0e",
    remote_chain_id: 102,
    iconPath: "/static/bsc.svg",
  },
  {
    chainId: 8453,
    chainName: "Base",
    address: "0x17dcdF9F0A378612041f83452e3DFdf7D97AAD0e",
    remote_chain_id: 184,
    iconPath: "/static/base.svg",
  },
];
