import CheckPassword from "@/ui/components/check-password";
import { useWalletState } from "@/ui/states/walletState";
import { useState } from "react";
import { useParams } from "react-router-dom";
import s from "./styles.module.scss";
import CopyIcon from "@/ui/components/icons/CopyIcon";
import { copyToClipboard } from "@/ui/utils";

const ShowMnemonic = () => {
    const [unlocked, setUnlocked] = useState(false);
    const { walletId } = useParams();
    const { wallets } = useWalletState((v) => ({ wallets: v.wallets }))

    return (
        <div className={s.showMnemonic}>
            {unlocked ?
                <div className={s.phraseDiv}>
                    <div className={s.phraseWrapper}>
                        {wallets.get(Number(walletId))?.phrase.split(" ").map((word, index) =>
                            <div key={index} className={s.word}>{index + 1}. <p className={s.wordWord}>{word}</p></div>
                        )}
                    </div>
                    <div className={s.copyDiv} onClick={() => {
                        copyToClipboard(wallets.get(Number(walletId))?.phrase);
                    }}><CopyIcon /> Copy</div>
                </div>
                : <CheckPassword handler={() => { setUnlocked(true) }} />}
        </div>
    );
};

export default ShowMnemonic;
