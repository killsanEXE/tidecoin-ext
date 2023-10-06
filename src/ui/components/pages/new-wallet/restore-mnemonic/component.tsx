import s from "./styles.module.scss";
import { useCreateNewWallet } from "@/ui/hooks/wallet";
import { useControllersState } from "@/ui/states/controllerState";
import { useWalletState } from "@/ui/states/walletState";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import cn from "classnames";
import { useNavigate } from "react-router-dom";
import CopyIcon from "@/ui/components/icons/CopyIcon";
import { copyToClipboard } from "@/ui/utils";
import toast from "react-hot-toast";

// export interface IMnemonicInput {
//   word1: string;
//   word2: string;
//   word3: string;
//   word4: string;
//   word5: string;
//   word6: string;
//   word7: string;
//   word8: string;
//   word9: string;
//   word10: string;
//   word11: string;
//   word12: string;
// }

const RestoreMnemonic = () => {

  // const mnemonicInput: IMnemonicInput = {
  //   word1: '',
  //   word2: '',
  //   word3: '',
  //   word4: '',
  //   word5: '',
  //   word6: '',
  //   word7: '',
  //   word8: '',
  //   word9: '',
  //   word10: '',
  //   word11: '',
  //   word12: ''
  // };

  const [step, setStep] = useState(1);
  const [savedPhrase, setSavedPhrase] = useState(false);
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
                    {index + 1}. <p className={s.wordWord}>
                      <input type="text" value={mnemonicPhrase[index]} onChange={(e) => {
                        const mnemPhrase = mnemonicPhrase;
                        mnemPhrase[index] = e.target.value
                        setMnemonicPhrase(mnemPhrase);
                      }} />
                    </p>
                  </div>
                ))}
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
        </div>
      ) : (
        <div className={cn(s.stepTwo, s.step)}>
          <div className={s.continueWrapper}>
            <button
              onClick={async () => {
                // await createNewWallet(mnemonicPhrase.join(" "));
                // updateWalletState({ vaultIsEmpty: false });
                // navigate("/home/wallet");
                console.log(mnemonicPhrase.join(" "))
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
