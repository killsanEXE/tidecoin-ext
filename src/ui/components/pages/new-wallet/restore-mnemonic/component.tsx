import s from "./styles.module.scss";
import { useCreateNewWallet } from "@/ui/hooks/wallet";
import { useControllersState } from "@/ui/states/controllerState";
import { useWalletState } from "@/ui/states/walletState";
import { useState } from "react";
import cn from "classnames";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const RestoreMnemonic = () => {

  const [step, setStep] = useState(1);
  const { updateWalletState } = useWalletState((v) => ({
    updateWalletState: v.updateWalletState,
  }));
  const { walletController } = useControllersState((v) => ({
    walletController: v.walletController,
  }));
  const [mnemonicPhrase, setMnemonicPhrase] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const createNewWallet = useCreateNewWallet();

  const navigate = useNavigate();

  return (
    <div className={s.newMnemonic}>
      <div className={s.stepTitle}>
        <p className={step === 1 ? s.active : ""}>Step 1</p>
        <p className={step === 2 ? s.active : ""}>Step 2</p>
      </div>
      {step === 1 ? (
        <div className={cn(s.stepOneWrapper, s.step)}>

          <div className={cn(s.stepOne, s.step)}>
            <div>
              <div className={s.phrase}>
                {mnemonicPhrase.map((word, index) => (
                  <div key={index} className={s.word}>
                    {index + 1}.
                    <input
                      type="text"
                      className="input"
                      value={mnemonicPhrase[index]}
                      onChange={(e) => {
                        const updatedMnemonicPhrase = [...mnemonicPhrase];
                        updatedMnemonicPhrase[index] = e.target.value;
                        setMnemonicPhrase(updatedMnemonicPhrase);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className={s.continueWrapper}>
              <button
                className={cn(s.continue, "btn", "primary")}
                onClick={() => {
                  if (mnemonicPhrase.find(f => f.trim().length <= 0) !== undefined) toast("Please insert all the words");
                  else setStep(2);
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={cn(s.stepTwo, s.step)}>
          <div className={s.continueWrapper}>
            <button
              onClick={async () => {
                try {
                  await createNewWallet(mnemonicPhrase.join(" "));
                } catch (e) {
                  toast.error("Words you entered is invalid");
                  setStep(1);
                }
                // updateWalletState({ vaultIsEmpty: false });
                // navigate("/home/wallet");
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

export default RestoreMnemonic;
