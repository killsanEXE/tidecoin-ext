import { Psbt } from "tidecoinjs-lib";
import { keyringService, sessionService, storageService } from "../../services";
import "reflect-metadata";
import { AccountBalanceResponse } from "@/shared/interfaces/apiController";
import { fetchTDCMainnet } from "@/shared/utils";
import permission from "@/background/services/permission";

function formatPsbtHex(psbtHex: string) {
  let formatData = "";
  try {
    if (!/^[0-9a-fA-F]+$/.test(psbtHex)) {
      formatData = Psbt.fromBase64(psbtHex).toHex();
    } else {
      Psbt.fromHex(psbtHex);
      formatData = psbtHex;
    }
  } catch (e) {
    throw new Error("invalid psbt");
  }
  return formatData;
}

class ProviderController {
  connect = async () => {
    // if (!permissionService.hasPermission(origin)) {
    //   throw ethErrors.provider.unauthorized();
    // }
    if (storageService.currentWallet === undefined) return undefined;
    const _account = await storageService.currentWallet.accounts[0];
    const account = _account ? _account.address : "";
    sessionService.broadcastEvent("accountsChanged", account);
    // const connectSite = permissionService.getConnectedSite(origin);
    // if (connectSite) {
    //   const network = wallet.getNetworkName()
    //   sessionService.broadcastEvent(
    //     'networkChanged',
    //     {
    //       network
    //     },
    //     origin
    //   );
    // }
    return account;
  };

  @Reflect.metadata("SAFE", true)
  getAccounts = async () => {
    // if (!permissionService.hasPermission(origin)) {
    //   return [];
    // }
    if (storageService.currentWallet === undefined) return undefined;
    const _account = storageService.currentWallet.accounts[0];
    const account = _account ? _account.address : "";
    return account;
  };

  @Reflect.metadata("SAFE", true)
  getNetwork = async () => {
    return "TIDECOIN";
  };

  // @Reflect.metadata('APPROVAL', ['SwitchNetwork', (req) => {
  //   const network = req.data.params.network;
  //   if (NETWORK_TYPES[NetworkType.MAINNET].validNames.includes(network)) {
  //     req.data.params.networkType = NetworkType.MAINNET
  //   } else if (NETWORK_TYPES[NetworkType.TESTNET].validNames.includes(network)) {
  //     req.data.params.networkType = NetworkType.TESTNET
  //   } else {
  //     throw new Error(`the network is invalid, supported networks: ${NETWORK_TYPES.map(v => v.name).join(',')}`)
  //   }

  //   if (req.data.params.networkType === wallet.getNetworkType()) {
  //     // skip approval
  //     return true;
  //   }
  // }])
  // switchNetwork = async (req) => {
  //   const { data: { params: { networkType } } } = req;
  //   wallet.setNetworkType(networkType)
  //   return NETWORK_TYPES[networkType].name
  // }

  // @Reflect.metadata('SAFE', true)
  // getPublicKey = async () => {
  //   const account = keyringService.keyrings[storageService.currentWallet.id];
  //   return "SHIT";
  // };

  //   @Reflect.metadata('SAFE', true)
  //   getInscriptions = async (req) => {
  //     const { data: { params: { cursor, size } } } = req;
  //     const account = await wallet.getCurrentAccount();
  //     if (!account) return ''
  //     const { list, total } = await wallet.openapi.getAddressInscriptions(account.address, cursor, size);
  //     return { list, total };
  //   };

  @Reflect.metadata('SAFE', true)
  getBalance = async ({ session: { origin } }) => {
    if (!permission.siteIsConnected(origin)) return undefined;
    const account = storageService.currentAccount;
    if (!account) return null;
    const data = await fetchTDCMainnet<AccountBalanceResponse>({
      path: `/address/${account.address}`,
    });

    if (!data) return undefined;

    return (
      (data.chain_stats.funded_txo_sum -
        data.chain_stats.spent_txo_sum +
        data.mempool_stats.funded_txo_sum -
        data.mempool_stats.spent_txo_sum) / 10 ** 8
    );
  };

  @Reflect.metadata("SAFE", true)
  getAccountName = async ({ session: { origin } }) => {
    if (!permission.siteIsConnected(origin)) return undefined;
    const account = storageService.currentAccount;
    if (!account) return null;
    return account.name;
  }

  @Reflect.metadata("SAFE", true)
  isConnected = async ({ session: { origin } }) => {
    return permission.siteIsConnected(origin);
  }

  @Reflect.metadata("SAFE", true)
  getAccount = async ({ session: { origin } }) => {
    if (!permission.siteIsConnected(origin)) return undefined;
    if (storageService.currentWallet === undefined) return undefined;
    const _account = storageService.currentWallet.accounts[0];
    const account = _account ? _account.address : "";
    return account;
  }

  @Reflect.metadata("APPROVAL", ["SignText", (req) => {
    // console.log(req);
  }])
  signMessage = async ({ data: { params: { text } } }) => {
    const account = storageService.currentAccount;
    if (!account || !account.address) return;
    const message = keyringService.signMessage({ from: account.address, data: text })
    return message;
  }

  //   @Reflect.metadata('APPROVAL', ['SignPsbt', (req) => {
  //     const { data: { params: { toAddress, satoshis } } } = req;

  //   }])
  //   sendBitcoin = async ({ approvalRes: { psbtHex } }) => {
  //     const psbt = Psbt.fromHex(psbtHex);
  //     const tx = psbt.extractTransaction();
  //     const rawtx = tx.toHex()
  //     return await wallet.pushTx(rawtx)
  //   }

  //   @Reflect.metadata('APPROVAL', ['SignPsbt', (req) => {
  //     const { data: { params: { toAddress, satoshis } } } = req;
  //   }])
  //   sendInscription = async ({ approvalRes: { psbtHex } }) => {
  //     const psbt = Psbt.fromHex(psbtHex);
  //     const tx = psbt.extractTransaction();
  //     const rawtx = tx.toHex()
  //     return await wallet.pushTx(rawtx)
  //   }

  //   @Reflect.metadata('APPROVAL', ['SignText', () => {
  //     // todo check text
  //   }])
  //   signMessage = async ({ data: { params: { text, type } } }) => {
  //     if (type === 'bip322-simple') {
  //       return wallet.signBIP322Simple(text)
  //     } else {
  //       return wallet.signMessage(text)
  //     }
  //   }

  //   // @Reflect.metadata('APPROVAL', ['SignTx', () => {
  //   //   // todo check
  //   // }])
  //   //   signTx = async () => {
  //   //     // todo
  //   //   }

  //   @Reflect.metadata('SAFE', true)
  //   pushTx = async ({ data: { params: { rawtx } } }) => {
  //     return await wallet.pushTx(rawtx)
  //   }

  //   @Reflect.metadata('APPROVAL', ['SignPsbt', (req) => {
  //     const { data: { params: { psbtHex } } } = req;
  //     req.data.params.psbtHex = formatPsbtHex(psbtHex);
  //   }])
  //   signPsbt = async ({ data: { params: { psbtHex, options } } }) => {
  //     const networkType = wallet.getNetworkType()
  //     const psbtNetwork = toPsbtNetwork(networkType)
  //     const psbt = Psbt.fromHex(psbtHex, { network: psbtNetwork })
  //     const autoFinalized = (options && options.autoFinalized == false) ? false : true;
  //     const toSignInputs = await wallet.formatOptionsToSignInputs(psbtHex, options);
  //     await wallet.signPsbt(psbt, toSignInputs, autoFinalized);
  //     return psbt.toHex();
  //   }

  //   @Reflect.metadata('APPROVAL', ['MultiSignPsbt', (req) => {
  //     const { data: { params: { psbtHexs, options } } } = req;
  //     req.data.params.psbtHexs = psbtHexs.map(psbtHex => formatPsbtHex(psbtHex));
  //   }])
  //   multiSignPsbt = async ({ data: { params: { psbtHexs, options } } }) => {
  //     const account = await wallet.getCurrentAccount();
  //     if (!account) throw null;
  //     const networkType = wallet.getNetworkType()
  //     const psbtNetwork = toPsbtNetwork(networkType)
  //     const result: string[] = [];
  //     for (let i = 0; i < psbtHexs.length; i++) {
  //       const psbt = Psbt.fromHex(psbtHexs[i], { network: psbtNetwork });
  //       const autoFinalized = (options && options[i] && options[i].autoFinalized == false) ? false : true;
  //       const toSignInputs = await wallet.formatOptionsToSignInputs(psbtHexs[i], options[i]);
  //       await wallet.signPsbt(psbt, toSignInputs, autoFinalized);
  //       result.push(psbt.toHex())
  //     }
  //     return result;
  //   }

  //   @Reflect.metadata('SAFE', true)
  //   pushPsbt = async ({ data: { params: { psbtHex } } }) => {
  //     const hexData = formatPsbtHex(psbtHex);
  //     const psbt = Psbt.fromHex(hexData);
  //     const tx = psbt.extractTransaction();
  //     const rawtx = tx.toHex()
  //     return await wallet.pushTx(rawtx)
  //   }

  //   @Reflect.metadata('APPROVAL', ['InscribeTransfer', (req) => {
  //     const { data: { params: { ticker } } } = req;
  //     // todo
  //   }])
  //   inscribeTransfer = async ({ approvalRes }) => {
  //     return approvalRes
  //   }
}

export default new ProviderController();
