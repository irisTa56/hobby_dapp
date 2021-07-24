import { ethers } from "ethers";
import { Proposal } from "../models/proposal";

export default class Ballot {
  private constructor() {}

  private static provider: ethers.providers.JsonRpcProvider;
  private static contracts: { vote?: ethers.Contract } = {};

  private static initEthers(): void {
    const localPort = window.prompt("Enter port number to use local blockchain");
    if (localPort && parseInt(localPort)) {
      const localUrl = "http://localhost:" + localPort;
      console.log(`Connecting to ${localUrl} ...`);
      Ballot.provider = new ethers.providers.JsonRpcProvider(localUrl);
    } else {
      Ballot.provider = new ethers.providers.Web3Provider((window as any).ethereum);
    }
  }

  static async fetchProposals(): Promise<Proposal[]> {
    return fetch("data/proposals.json").then(res => res.json());
  }

  static async initContract(): Promise<void> {
    Ballot.initEthers();
    return (
      Promise.all([
        fetch("contracts/Ballot.json").then(res => res.json()),
        Ballot.provider.send("net_version", []),
      ]).then(([abi, networkId]) => {
        const signer = Ballot.provider.getSigner();
        const contractAddress = abi.networks[networkId].address;
        Ballot.contracts.vote = ethers.ContractFactory.fromSolidity(abi, signer).attach(contractAddress);
      })
    );
  }

  static async isChairperson(): Promise<boolean> {
    return (
      Promise.all([
        Ballot.provider.getSigner().getAddress(),
        Ballot.contracts.vote?.chairperson(),
      ]).then(([signer, chairperson]) => signer === chairperson )
    );
  }

  static async listAddresses(): Promise<string[]> {
    return Ballot.provider.listAccounts();
  }
}
