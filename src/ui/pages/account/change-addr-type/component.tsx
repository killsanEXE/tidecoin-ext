import { AddressType } from "test-test-test-hd-wallet/src/hd/types";
import SwitchAddressType from "@/ui/components/switch-address-type";
import s from "./styles.module.scss";
import { useControllersState } from "@/ui/states/controllerState";
import {
  useGetCurrentAccount,
  useGetCurrentWallet,
  useWalletState,
} from "@/ui/states/walletState";
import {
  useUpdateCurrentAccountBalance,
  useUpdateCurrentWallet,
} from "@/ui/hooks/wallet";

const ChangeAddrType = () => {
  const { keyringController, walletController } = useControllersState((v) => ({
    keyringController: v.keyringController,
    walletController: v.walletController,
  }));
  const currentWallet = useGetCurrentWallet();
  const { selectedWallet } = useWalletState((v) => ({
    selectedWallet: v.selectedWallet,
  }));
  const udpateCurrentWallet = useUpdateCurrentWallet();
  const updateCurrentAccountBalance = useUpdateCurrentAccountBalance();
  const currentAccount = useGetCurrentAccount();

  const onSwitchAddress = async (type: AddressType) => {
    const addresses = await keyringController.changeAddressType(
      selectedWallet!,
      type
    );
    await udpateCurrentWallet({
      ...currentWallet,
      addressType: type,
      accounts: currentWallet?.accounts.map((f) => ({
        ...f,
        address: addresses[f.id],
      })),
    });
    await updateCurrentAccountBalance(
      addresses[currentAccount?.id as any as number]
    );
    await walletController.saveWallets();
  };

  return (
    <div className={s.changeAddrType}>
      <SwitchAddressType
        selectedType={currentWallet?.addressType ?? AddressType.P2PKH}
        handler={onSwitchAddress}
      />
    </div>
  );
};

export default ChangeAddrType;
