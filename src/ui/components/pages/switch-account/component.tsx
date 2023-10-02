import { useState } from "react";
import CheckIcon from "@/ui/components/icons/Checkicon";
import CopyIcon from "@/ui/components/icons/CopyIcon";
import KeyIcon from "@/ui/components/icons/KeyIcon";
import SmallMenuIcon from "@/ui/components/icons/SmallMenuIcon";
import TagIcon from "@/ui/components/icons/TagIcon";
import XMarkIcon from "@/ui/components/icons/XMarkIcon";
import s from "./styles.module.scss";
import { shortAddress } from "@/ui/utils";
import { useWalletState } from "@/ui/states/walletState";
import cn from 'classnames';
import { useNavigate } from "react-router-dom";
import { useUpdateCurrentWallet } from "@/ui/hooks/wallet";

const SwitchAccount = () => {
  const [selected, setSelected] = useState<number>()

  const { currentWallet } = useWalletState((v) => ({
    currentWallet: v.currentWallet,
  }))
  const updateCurrentWallet = useUpdateCurrentWallet();

  const navigate = useNavigate();

  const switchAccount = (id: number) => {
    if (!currentWallet) return;
    const acc = currentWallet.accounts.find(f => f.id === id)
    if (!acc) return;
    updateCurrentWallet({ ...currentWallet, currentAccount: acc });
    navigate("/home/wallet")
  }

  return (
    <div className={s.switchAccDiv}>
      <div className={s.accounts}>
        {currentWallet?.accounts.map((acc, i) =>
          <div className={s.mainAcc} key={i}>
            <div className={s.account}>
              <div className={s.accInfo} onClick={() => { switchAccount(acc.id) }}>
                <div className={s.name}>
                  {currentWallet.currentAccount.address === acc.address ? <CheckIcon /> : undefined}
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
              <div className={s.accSetting} onClick={() => { navigate(`/pages/show-pk/${acc.id}`) }}><KeyIcon /></div>
              <div className={s.divider}></div>
              <div className={s.accSetting} onClick={() => {
                setSelected(undefined)
              }}><XMarkIcon /></div>
            </div>
          </div>
        )}
      </div>
    </div >
  )
}

export default SwitchAccount