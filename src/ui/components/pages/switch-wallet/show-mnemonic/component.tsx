import CheckPassword from "@/ui/components/check-password";
import { useWalletState } from "@/ui/states/walletState";
import { useState } from "react";
import { useParams } from "react-router-dom";
import s from "./styles.module.scss";

const ShowMnemonic = () => {
    const [unlocked, setUnlocked] = useState(false);
    const { walletId } = useParams();
    const { wallets } = useWalletState((v) => ({ wallets: v.wallets }))

    return (
        <div className={s.ShowMnemonic}>
            {unlocked ?
                <div>{wallets.get(Number(walletId))?.phrase}</div>
                : <CheckPassword handler={() => { setUnlocked(true) }} />}
        </div>
    );
};

export default ShowMnemonic;
