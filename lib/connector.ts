import * as farcaster from "@farcaster/frame-sdk";
import { SwitchChainError, fromHex, getAddress, numberToHex } from "viem";
import { ChainNotConfiguredError, createConnector } from "wagmi";

// Handle potential default export or named export differences
const sdk = farcaster.default || farcaster;

frameConnector.type = "frameConnector" as const;

export function frameConnector() {
  let connected = false;

  return createConnector<any>((config) => ({
    id: "farcaster",
    name: "Farcaster Wallet",
    type: frameConnector.type,

    async setup() {
      this.connect({ chainId: config.chains[0].id });
    },
    async connect({ chainId }: { chainId?: number } = {}) {
      const provider = sdk.wallet?.ethProvider;
      if (!provider) {
        // Fail silently or throw specific error, but don't crash on undefined access
        throw new Error("Frame SDK not ready or wallet not available");
      }

      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });

      let currentChainId = await this.getChainId();
      if (chainId && currentChainId !== chainId) {
        const chain = await this.switchChain!({ chainId });
        currentChainId = chain.id;
      }

      connected = true;

      return {
        accounts: accounts.map((x: string) => getAddress(x)),
        chainId: currentChainId,
      };
    },
    async disconnect() {
      connected = false;
    },
    async getAccounts() {
      if (!connected) throw new Error("Not connected");
      const provider = sdk.wallet?.ethProvider;
      const accounts = await provider?.request({
        method: "eth_requestAccounts",
      });
      return accounts.map((x: string) => getAddress(x));
    },
    async getChainId() {
      const provider = sdk.wallet?.ethProvider;
      const hexChainId = await provider?.request({ method: "eth_chainId" });
      return fromHex(hexChainId, "number");
    },
    async isAuthorized() {
      return !!sdk.wallet?.ethProvider;
    },
    async switchChain({ chainId }: { chainId: number }) {
      const provider = sdk.wallet?.ethProvider;
      const chain = config.chains.find((x: any) => x.id === chainId);
      if (!chain) throw new SwitchChainError(new ChainNotConfiguredError());

      await provider?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: numberToHex(chainId) }],
      });
      return chain;
    },
    onAccountsChanged(accounts: string[]) {
      config.emitter.emit("change", {
        accounts: accounts.map((x) => getAddress(x)),
      });
    },
    onChainChanged(chain: string) {
      const chainId = Number(chain);
      config.emitter.emit("change", { chainId });
    },
    onDisconnect() {
      config.emitter.emit("disconnect");
    },
  }));
}