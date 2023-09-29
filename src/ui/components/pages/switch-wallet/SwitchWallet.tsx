import { useWalletState } from "@/ui/states/walletState";
import s from "./styles.module.scss";
import cn from "classnames";
import { useState } from "react";
import wallet from "@/ui/pages/home/wallet";
import CheckIcon from "../../icons/Checkicon";
import SmallMenuIcon from "../../icons/SmallMenuIcon";
import XMarkIcon from "../../icons/XMarkIcon";
import KeyIcon from "../../icons/KeyIcon";
import TagIcon from "../../icons/TagIcon";

export const SwitchWallet = () => {

    const { wallets, currentWallet } = useWalletState((v) => ({
        wallets: v.wallets,
        currentWallet: v.currentWallet
    }));

    const [selected, setSelected] = useState<number>();

    return (
        <div className={s.switchWalletDiv}>
            <div className={s.wallets}>
                {Array.from(wallets.values()).map((wallet, i) => <div className={s.mainWallet} key={i}>
                    <div className={s.wallet}>
                        <div className={s.walletInfo}>
                            <div className={s.name}>
                                {wallet.id === currentWallet?.id ? <CheckIcon /> : undefined}
                                {wallet.name}
                            </div>
                        </div>
                        <div className={s.walletControl}>
                            <button className={s.manageAccButton} onClick={() => {
                                setSelected(i);
                            }}><SmallMenuIcon /></button>
                        </div>
                    </div>
                    <div className={cn(s.walletSettingsf, s.hidden, { [s.active]: selected === i })}>
                        <div className={cn(s.walletSetting, s.rename)}><TagIcon /></div>
                        <div className={s.divider}></div>
                        <div className={s.walletSetting}><KeyIcon /></div>
                        <div className={s.divider}></div>
                        <div className={s.walletSetting} onClick={() => {
                            setSelected(undefined);
                        }}><XMarkIcon /></div>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
};
