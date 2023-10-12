import { useState } from "react";
import {
  CheckIcon,
  Bars3Icon,
  DocumentDuplicateIcon,
  TagIcon,
  KeyIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import s from "./styles.module.scss";
import { shortAddress } from "@/ui/utils";
import {
  useGetCurrentAccount,
  useGetCurrentWallet,
  useWalletState,
} from "@/ui/states/walletState";
import cn from "classnames";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SwitchAccount = () => {
  const [selected, setSelected] = useState<number>();

  const currentAccount = useGetCurrentAccount();
  const currentWallet = useGetCurrentWallet();

  const { updateWalletState } = useWalletState((v) => ({
    updateWalletState: v.updateWalletState,
  }));

  const navigate = useNavigate();

  const switchAccount = (id: number) => {
    updateWalletState({
      selectedAccount: id,
    });
    navigate("/home/wallet");
  };

  return (
    <div className={s.switchAccDiv}>
      <div className={s.accounts}>
        {currentWallet?.accounts.map((acc, i) => (
          <div className={s.mainAcc} key={i}>
            <div className={s.account}>
              <div
                className={s.accInfo}
                onClick={() => {
                  switchAccount(acc.id);
                }}
              >
                <div className={s.name}>
                  {currentAccount!.address === acc.address ? (
                    <CheckIcon />
                  ) : undefined}
                  {acc.name}
                </div>
                <div className={s.address}>{shortAddress(acc.address)}</div>
              </div>
              <div className={s.accControl}>
                <button
                  className={s.manageAccButton}
                  onClick={() => {
                    setSelected(i);
                  }}
                >
                  <Bars3Icon />
                </button>
              </div>
            </div>
            <div
              className={cn(s.accSettings, s.hidden, {
                [s.active]: selected === i,
              })}
            >
              <div
                className={cn(s.accSetting, s.copy)}
                onClick={() => {
                  navigator.clipboard.writeText(acc.address!);
                  toast.success("Copied!");
                }}
              >
                <DocumentDuplicateIcon />
              </div>
              <div className={s.divider}></div>
              <div
                className={cn(s.accSetting, s.rename)}
                onClick={() => {
                  navigate(`/pages/rename-account/${acc.id}`);
                }}
              >
                <TagIcon />
              </div>
              <div className={s.divider}></div>
              <div
                className={s.accSetting}
                onClick={() => {
                  navigate(`/pages/show-pk/${acc.id}`);
                }}
              >
                <KeyIcon />
              </div>
              <div className={s.divider}></div>
              <div
                className={s.accSetting}
                onClick={() => {
                  setSelected(undefined);
                }}
              >
                <XMarkIcon />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SwitchAccount;
