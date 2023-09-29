import { useEffect, useState } from "react";
import { useWalletState } from "@/ui/states/walletState";
import s from "./styles.module.scss";
import cn from "classnames";
import CheckIcon from "../../icons/Checkicon";
import TagIcon from "../../icons/TagIcon";
import KeyIcon from "../../icons/KeyIcon";
import XMarkIcon from "../../icons/XMarkIcon";
import SmallMenuIcon from "../../icons/SmallMenuIcon";

const SwitchWallet = () => {

    const { wallets, currentWallet, switchWallet } = useWalletState((v) => ({
        wallets: v.wallets,
        currentWallet: v.currentWallet,
        switchWallet: v.switchWallet
    }))

    const [selected, setSelected] = useState<number>()

    return (
        <div className={s.switchWalletDiv}>
            <div className={s.wallets}>
                {Array.from(wallets.values()).map((wallet, i) =>
                    <div className={s.mainWallet} key={i}>
                        <div className={s.wallet}>
                            <div className={s.walletInfo} onClick={() => { switchWallet(i, wallet.id) }}>
                                {wallet.id === currentWallet?.id ? <CheckIcon /> : undefined}
                                {wallet.name}
                            </div>
                            <div className={s.walletControl}>
                                <button className={s.manageAccButton} onClick={() => {
                                    setSelected(i)
                                }}><SmallMenuIcon /></button>
                            </div>
                        </div>
                        <div className={cn(s.walletSettings, s.hidden, { [s.active]: selected === i })}>
                            <div className={cn(s.walletSetting, s.rename)}><TagIcon /></div>
                            <div className={s.divider}></div>
                            <div><KeyIcon /></div>
                            <div className={s.divider}></div>
                            <div onClick={() => {
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
