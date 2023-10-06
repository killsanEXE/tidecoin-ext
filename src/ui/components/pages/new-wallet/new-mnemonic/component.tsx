import { useEffect, useState } from "react";
import s from "./styles.module.scss";
import { useWalletState } from "@/ui/states/walletState";
import ReactLoading from "react-loading";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useControllersState } from "@/ui/states/controllerState";
import { useCreateNewWallet } from "@/ui/hooks/wallet";
import CopyIcon from "@/ui/components/icons/CopyIcon.svg";
import cn from "classnames";
import { copyToClipboard } from "@/ui/utils";

const NewMnemonic = () => {
  const [step, setStep] = useState(1);
  const [savedPhrase, setSavedPhrase] = useState(false);
  const { updateWalletState } = useWalletState((v) => ({
    updateWalletState: v.updateWalletState,
  }));
  const { walletController } = useControllersState((v) => ({
    walletController: v.walletController,
  }));
  const [mnemonicPhrase, setMnemonicPhrase] = useState<string | undefined>(
    undefined
  );

  const createNewWallet = useCreateNewWallet();

  useEffect(() => {
    const setPhrase = async () => {
      setMnemonicPhrase(await walletController.generateMnemonicPhrase());
    };
    if (mnemonicPhrase) return;
    setPhrase();
  }, [mnemonicPhrase, setMnemonicPhrase, walletController]);

  const navigate = useNavigate();

  return (
    <div className={s.newMnemonic}>
      <div className={s.stepTitle}>
        <p className={step === 1 ? s.active : ""}>Step 1</p>
        <p className={step === 2 ? s.active : ""}>Step 2</p>
      </div>
      {step === 1 ? (
        <div className={cn(s.stepOneWrapper, s.step)}>
          {mnemonicPhrase === undefined ? (
            <ReactLoading type="spin" color="#fff" />
          ) : (
            <div className={cn(s.stepOne, s.step)}>
              <div>
                <p className={s.warning}>Please save these words somewhere</p>
                <div className={s.phrase}>
                  {mnemonicPhrase.split(" ").map((word, index) => (
                    <div key={index} className={s.word}>
                      {index + 1}. <p className={s.wordWord}>{word}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className={s.savePhraseWrapper}>
                <div
                  className={s.saveToClipboard}
                  onClick={() => {
                    copyToClipboard(mnemonicPhrase);
                    toast.success("Copied");
                  }}
                >
                  <CopyIcon /> Copy to ClickBoard
                </div>
                <div className={s.savePhrase}>
                  <p>I saved this phrase</p>
                  <input
                    type="checkbox"
                    onChange={() => {
                      setSavedPhrase(!savedPhrase);
                    }}
                  />
                </div>
              </div>
              <div className={s.continueWrapper}>
                <button
                  className={cn(s.continue, "btn", "primary")}
                  onClick={() => {
                    if (!savedPhrase) toast("Save the phrase first");
                    else setStep(2);
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={cn(s.stepTwo, s.step)}>
          <div className={s.continueWrapper}>
            <button
              onClick={async () => {
                await createNewWallet(mnemonicPhrase!);
                await updateWalletState({ vaultIsEmpty: false });
                navigate("/home/wallet");
              }}
              className={cn(s.continue, "btn", "primary")}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewMnemonic;
