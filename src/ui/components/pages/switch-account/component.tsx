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

const SwitchAccount = () => {
  const [selected, setSelected] = useState<number>()

  const { currentWallet } = useWalletState((v) => ({ currentWallet: v.currentWallet }))

  return (
    <div className={s.switchAccDiv}>
      <div className={s.accounts}>
        {currentWallet?.accounts.map((acc, i) =>
          <div className={s.mainAcc} key={i}>
            <div className={s.account}>
              <div className={s.accInfo}>
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
  )
}

export default SwitchAccount