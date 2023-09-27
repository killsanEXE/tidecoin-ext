import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWalletState } from "@/ui/states/walletState";
import QRCode from "react-qr-code";
import s from "./styles.module.scss";
import CopyIcon from "../../icons/CopyIcon";
import cn from "classnames";

const SwitchWallet = () => {

  const { wallets, currentWallet } = useWalletState((v) => ({
    wallets: v.wallets,
    currentWallet: v.currentWallet
  }))

  return (
    <div className={s.switchWalletDiv}>
      <div className={s.wallets}>
        {wallets?.forEach((wallet, i) =>
          <div className={s.mainWallet} key={i}>
            <div className={s.wallet}>
              <div className={s.walletInfo}>
                <div className={s.name}>
                  {wallet ? <CheckIcon /> : undefined}
                  {acc.name}
                </div>
                <div className={s.address}>
                  {shortAddress(acc.address)}
                </div>
              </div>
              <div className={s.accControl}>
                <button className={s.manageAccButton} onClick={() => {
                  setSelected(i)
                }}><SmallMenuIcon /></button>
              </div>
            </div>
            <div className={cn(s.accSettings, s.hidden, { [s.active]: selected === i })}>
              <div className={cn(s.accSetting, s.copy)}><CopyIcon /></div>
              <div className={s.divider}></div>
              <div className={cn(s.accSetting, s.rename)}><TagIcon /></div>
              <div className={s.divider}></div>
              <div className={s.accSetting}><KeyIcon /></div>
              <div className={s.divider}></div>
              <div className={s.accSetting} onClick={() => {
                setSelected(undefined)
              }}><XMarkIcon /></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwitchWallet;
