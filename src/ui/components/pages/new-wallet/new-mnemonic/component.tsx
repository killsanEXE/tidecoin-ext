import { useEffect, useState } from "react";
import s from "./styles.module.scss";
import { useWalletState } from "@/ui/states/walletState";
import ReactLoading from "react-loading";

const NewMnemonic = () => {

  const [step, setStep] = useState(1);
  const [savedPhrase, setSavedPhrase] = useState(false);
  const { walletController } = useWalletState((v) => ({
    walletController: v.controller
  }))

  const [mnemonicPhrase, setMnemonicPhrase] = useState<string | undefined>(undefined);

  useEffect(() => {
    const setPhrase = async () => {
      setMnemonicPhrase(await walletController.generateMnemonicPhrase())
    }
    if (mnemonicPhrase) return;
    setPhrase();
  }, [mnemonicPhrase, setMnemonicPhrase, walletController])

  return (
    <div className={s.newMnemonic}>
      <div className={s.stepTitle}>
        <p className={step === 1 ? s.active : ""}>Step 1</p>
        <p className={step === 2 ? s.active : ""}>Step 2</p>
      </div>
      {mnemonicPhrase === undefined ? <ReactLoading type="spin" color="#fff" /> :
        <div className={s.stepOne}>
          <p className={s.warning}>Please save these words somewhere</p>
          <div className={s.phrase}>
            {mnemonicPhrase.split(" ").map((word, index) =>
              <div key={index} className={s.word}>{index + 1}. <p className={s.wordWord}>{word}</p></div>
            )}
          </div>
          <div className={s.saveToClipboard}></div>
          <div className={s.savePhrase}>
            <p>I saved this phrase</p>
            <input type="checkbox" onChange={() => { setSavedPhrase(!savedPhrase) }} />
          </div>
        </div>
      }
      <div className={s.stepTwo}>

      </div>
    </div>
  );
};

export default NewMnemonic;
