import { useState } from "react";
import { useWalletState } from "@/ui/states/walletState";
import s from "./styles.module.scss";
import cn from "classnames";
import CheckIcon from "@/ui/components/icons/Checkicon.svg";
import TagIcon from "@/ui/components/icons/TagIcon.svg";
import KeyIcon from "@/ui/components/icons/KeyIcon.svg";
import XMarkIcon from "@/ui/components/icons/XMarkIcon.svg";
import SmallMenuIcon from "@/ui/components/icons/SmallMenuIcon.svg";
import { useSwitchWallet } from "@/ui/hooks/wallet";
import { useNavigate } from "react-router-dom";

const SwitchWallet = () => {
  const { wallets, currentWallet } = useWalletState((v) => ({
    wallets: v.wallets,
    currentWallet: v.currentWallet,
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
                  switchWallet(i, wallet.id);
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
                  <SmallMenuIcon />
                </button>
              </div>
            </div>
            <div
              className={cn(s.walletSettings, s.hidden, {
                [s.active]: selected === i,
              })}
            >
              <div className={cn(s.walletSetting, s.rename)}>
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
