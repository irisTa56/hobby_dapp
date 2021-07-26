import { ethers } from "ethers";
import { Proposal } from "../models/proposal";
import { promisedProvider } from "../lib/helper/ethers";

const promisedContract: Promise<ethers.Contract> = promisedProvider.then((provider) => {
  return (
    Promise.all([
      fetch("contracts/Ballot.json").then((res) => res.json()),
      provider.send("net_version", []),
    ]).then(([abi, networkId]) => {
      const signer = provider.getSigner();
      const contractAddress = abi.networks[networkId].address;
      return ethers.ContractFactory.fromSolidity(abi, signer).attach(contractAddress);
    })
  );
});

export async function fetchProposals(): Promise<Proposal[]> {
  return (await fetch("data/proposals.json")).json();
}

export async function isChairperson(): Promise<boolean> {
  return (
    Promise.all([
      (await promisedProvider).getSigner().getAddress(),
      (await promisedContract).chairperson(),
    ]).then(([signer, chairperson]) => signer === chairperson )
  );
}

export async function listAddresses(): Promise<string[]> {
  return (await promisedProvider).listAccounts();
}

export async function currentPhase(): Promise<number> {
  return (await promisedContract).currentPhase();
}

export async function advancePhase(): Promise<void> {
  await (await promisedContract).advancePhase();
}

export async function onPhaseChanged(callback: () => void | Promise<void>): Promise<void> {
  (await promisedContract).on("PhaseChanged", async (toPhase) => {
    console.log(`Phase has changed to ${toPhase}`);
    await callback();
  });
}

export async function register(address: string): Promise<void> {
  try {
    await (await promisedContract).register(address);
    console.log(`Registered: ${address}`);
  } catch (err) {
    console.error(err);
  }
}

export async function isRegistered(): Promise<boolean> {
  const address = await (await promisedProvider).getSigner().getAddress();
  const { weight } = await (await promisedContract).voters(address);
  return weight > 0;
}
