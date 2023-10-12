import { useGetCurrentWallet, useWalletState } from "@/ui/states/walletState";
import { useState } from "react";
import s from "./styles.module.scss";
import cn from "classnames";
import {
  CheckIcon,
  TagIcon,
  KeyIcon,
  XMarkIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

import { useSwitchWallet } from "@/ui/hooks/wallet";
import { useNavigate } from "react-router-dom";

const SwitchWallet = () => {
  const currentWallet = useGetCurrentWallet();
  const { wallets } = useWalletState((v) => ({
    wallets: v.wallets,
  }));
  const switchWallet = useSwitchWallet();
  const [selected, setSelected] = useState<number>();
  const navigate = useNavigate();

  return (
    <div className={s.switchWalletDiv}>
      <div className={s.wallets}>
        {wallets.map((wallet, i) => (
          <div className={s.mainWallet} key={i}>
            <div className={s.wallet}>
              <div
                className={s.walletInfo}
                onClick={() => {
                  switchWallet(i);
                  navigate("/home/wallet");
                }}
              >
                {wallet.id === currentWallet?.id ? <CheckIcon /> : undefined}
                {wallet.name}
              </div>
              <div className={s.walletControl}>
                <button
                  className={s.manageWalletButton}
                  onClick={() => {
                    setSelected(i);
                  }}
                >
                  <Bars3Icon />
                </button>
              </div>
            </div>
            <div
              className={cn(s.walletSettings, s.hidden, {
                [s.active]: selected === i,
              })}
            >
              <div
                className={cn(s.walletSetting, s.rename)}
                onClick={() => {
                  navigate(`/pages/rename-wallet/${wallet.id}`);
                }}
              >
                <TagIcon />
              </div>
              <div className={s.divider}></div>
              <div
                onClick={() => {
                  navigate(`/pages/show-mnemonic/${i}`);
                }}
              >
                <KeyIcon />
              </div>
              <div className={s.divider}></div>
              <div
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

export default SwitchWallet;
