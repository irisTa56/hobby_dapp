import { ethers } from "ethers";

declare global {
  interface Window { ethereum: ethers.providers.ExternalProvider }
}

export const promisedProvider: Promise<ethers.providers.JsonRpcProvider> = (async () => {
  const localPort = window.prompt("Enter port number to use local blockchain");
  if (localPort && parseInt(localPort)) {
    console.log(`Connecting to localhost:${localPort} ...`);
    return new ethers.providers.JsonRpcProvider("http://localhost:" + localPort);
  } else {
    await window.ethereum.request?.({ method: "eth_requestAccounts" });
    return new ethers.providers.Web3Provider(window.ethereum);
  }
})();
