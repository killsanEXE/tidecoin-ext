import CheckPassword from "@/ui/components/check-password";
import { useState } from "react";
import { useParams } from "react-router-dom";
import s from "./styles.module.scss";
import CopyIcon from "@/ui/components/icons/CopyIcon";
import { copyToClipboard } from "@/ui/utils";
import { useControllersState } from "@/ui/states/controllerState";
import { useWalletState } from "@/ui/states/walletState";

const ShowMnemonic = () => {
  const [unlocked, setUnlocked] = useState(false);
  const { walletId } = useParams();
  const { stateController } = useControllersState((v) => ({
    stateController: v.stateController
  }))
  const [phrase, setPhrase] = useState("");
  const { wallets } = useWalletState((v) => ({ wallets: v.wallets }))
  const [walletType, setWalletType] = useState<"simple" | "root">("root")

  return (
    <div className={s.showMnemonic}>
      {unlocked ? (
        <div className={s.phraseDiv}>
          {walletType === "root" ?
            <div className={s.phraseWrapper}>
              {phrase
                .split(" ")
                .map((word, index) => (
                  <div key={index} className={s.word}>
                    {index + 1}. <p className={s.wordWord}>{word}</p>
                  </div>
                ))}
            </div> :
            <div className={s.privKeyWrapper}>
              <div className={s.secret}>
                {phrase}
              </div>
            </div>
          }
          <div
            className={s.copyDiv}
            onClick={() => {
              copyToClipboard(phrase);
            }}
          >
            <CopyIcon /> Copy
          </div>
        </div>
      ) : (
        <CheckPassword
          handler={async (password) => {
            setPhrase(await stateController.getWalletPhrase(Number(walletId), password!) ?? "");
            setWalletType(wallets[Number(walletId)].type);
            setUnlocked(true);
          }}
        />
      )}
    </div>
  );
};

export default ShowMnemonic;
