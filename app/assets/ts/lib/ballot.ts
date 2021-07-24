import { ethers } from "ethers";
import { Proposal } from "../models/proposal";

export default class Ballot {
  private static instance: Ballot;
  private constructor(
    private provider: ethers.providers.JsonRpcProvider,
    private contract: ethers.Contract,
  ) {}

  static async init() {
    if (!Ballot.instance) {
      const provider = Ballot.initProvider();
      const contract = await Ballot.initContract(provider);
      Ballot.instance = new Ballot(provider, contract);
    }
    return Ballot.instance;
  }

  private static initProvider(): ethers.providers.JsonRpcProvider {
    const localPort = window.prompt("Enter port number to use local blockchain");
    if (localPort && parseInt(localPort)) {
      console.log(`Connecting to localhost:${localPort} ...`);
      return new ethers.providers.JsonRpcProvider("http://localhost:" + localPort);
    } else {
      return new ethers.providers.Web3Provider((window as any).ethereum);
    }
  }

  private static async initContract(provider: ethers.providers.JsonRpcProvider): Promise<ethers.Contract> {
    return (
      Promise.all([
        fetch("contracts/Ballot.json").then(res => res.json()),
        provider.send("net_version", []),
      ]).then(([abi, networkId]) => {
        const signer = provider.getSigner();
        const contractAddress = abi.networks[networkId].address;
        return ethers.ContractFactory.fromSolidity(abi, signer).attach(contractAddress);
      })
    );
  }

  static async fetchProposals(): Promise<Proposal[]> {
    return fetch("data/proposals.json").then(res => res.json());
  }

  async isChairperson(): Promise<boolean> {
    return (
      Promise.all([
        this.provider.getSigner().getAddress(),
        this.contract.chairperson(),
      ]).then(([signer, chairperson]) => signer === chairperson )
    );
  }

  async listAddresses(): Promise<string[]> {
    return this.provider.listAccounts();
  }
}
