import { AddressType } from "test-test-test-hd-wallet/src/hd/types";
import SwitchAddressType from "../../switch-address-type";
import s from "./styles.module.scss";
import { useControllersState } from "@/ui/states/controllerState";
import { useWalletState } from "@/ui/states/walletState";
import { useUpdateCurrentWallet } from "@/ui/hooks/wallet";

const ChangeAddrType = () => {
  const { keyringController } = useControllersState((v) => ({
    keyringController: v.keyringController,
  }));
  const { currentWallet, selectedWallet } = useWalletState((v) => ({
    currentWallet: v.currentWallet,
    selectedWallet: v.selectedWallet,
  }));
  const udpateCurrentWallet = useUpdateCurrentWallet();

  return (
    <div className={s.changeAddrType}>
      <SwitchAddressType
        handler={async (type: AddressType) => {
          const addresses = await keyringController.changeAddressType(
            selectedWallet!,
            type
          );
          await udpateCurrentWallet({
            ...currentWallet,
            accounts: currentWallet()?.accounts.map((f) => ({
              ...f,
              address: addresses[f.id],
            })),
          });
        }}
      />
    </div>
  );
};

export default ChangeAddrType;
