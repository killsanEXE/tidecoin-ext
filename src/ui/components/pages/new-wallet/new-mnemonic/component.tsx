import { useEffect, useState } from "react";
import s from "./styles.module.scss";
import { useWalletState } from "@/ui/states/walletState";
import ReactLoading from "react-loading";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAppState } from "@/ui/states/appState";
import { useControllersState } from "@/ui/states/controllerState";
import { useCreateNewWallet } from "@/ui/hooks/wallet";

const NewMnemonic = () => {

  const [step, setStep] = useState(1);
  const [savedPhrase, setSavedPhrase] = useState(false);
  const { updateWalletState } = useWalletState((v) => ({
    updateWalletState: v.updateWalletState
  }))
  const { walletController } = useControllersState((v) => ({ walletController: v.walletController }))
  const { password } = useAppState((v) => ({ password: v.password }))
  const [mnemonicPhrase, setMnemonicPhrase] = useState<string | undefined>(undefined);

  const createNewWallet = useCreateNewWallet();

  useEffect(() => {
    const setPhrase = async () => {
      setMnemonicPhrase(await walletController.generateMnemonicPhrase())
    }
    if (mnemonicPhrase) return;
    setPhrase();
  }, [mnemonicPhrase, setMnemonicPhrase, walletController])

  const navigate = useNavigate();

  return (
    <div className={s.newMnemonic}>
      <div className={s.stepTitle}>
        <p className={step === 1 ? s.active : ""}>Step 1</p>
        <p className={step === 2 ? s.active : ""}>Step 2</p>
      </div>
      {step === 1 ?
        <div className={s.stepOneWrapper}>
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
              <button onClick={() => {
                if (!savedPhrase) toast("Save the phrase first")
                else setStep(2);
              }}>Continue</button>
            </div>
          }
        </div> :
        <div className={s.stepTwo}>
          <button onClick={() => {
            createNewWallet(mnemonicPhrase!);
            updateWalletState({ vaultIsEmpty: false });
            navigate("/home/wallet");
          }}>Continue</button>
        </div>
      }
    </div>
  );
};

export default NewMnemonic;
