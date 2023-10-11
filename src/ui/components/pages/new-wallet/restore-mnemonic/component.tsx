import s from "./styles.module.scss";
import { useCreateNewWallet } from "@/ui/hooks/wallet";
import { useControllersState } from "@/ui/states/controllerState";
import { useWalletState } from "@/ui/states/walletState";
import { useState } from "react";
import cn from "classnames";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import SwitchAddressType from "@/ui/components/switch-address-type";
import { AddressType } from "test-test-test-hd-wallet/src/hd/types";
import SelectWithHint from "@/ui/components/select-hint/component";
import { englishWords } from "test-test-test-hd-wallet";

const RestoreMnemonic = () => {
  const [step, setStep] = useState(1);
  const { updateWalletState } = useWalletState((v) => ({
    updateWalletState: v.updateWalletState,
  }));
  const [addressType, setAddressType] = useState(AddressType.P2WPKH);
  const { walletController } = useControllersState((v) => ({
    walletController: v.walletController,
  }));
  const [mnemonicPhrase, setMnemonicPhrase] = useState<(number | undefined)[]>(
    new Array(12).fill(undefined)
  );
  const createNewWallet = useCreateNewWallet();
  const navigate = useNavigate();

  return (
    <div className={s.restoreMnemonic}>
      <div className={s.stepTitle}>
        <p className={step === 1 ? s.active : ""}>Step 1</p>
        <p className={step === 2 ? s.active : ""}>Step 2</p>
      </div>
      {step === 1 ? (
        <div className={cn(s.stepOneWrapper, s.step)}>
          <div className={cn(s.stepOne, s.step)}>
            <div>
              <div className={s.phrase}>
                {mnemonicPhrase.map((value, index) => (
                  <div key={index} className={s.word}>
                    <p>{index + 1}.</p>
                    <SelectWithHint
                      selected={value}
                      setSelected={(v) => {
                        if (typeof v === "string") {
                          console.log(v)
                          setMnemonicPhrase(v.split(" ").map(f => englishWords.findIndex(j => j === f)))
                        } else {
                          setMnemonicPhrase(mnemonicPhrase.with(index, v));
                        }
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
                  if (mnemonicPhrase.findIndex((f) => f === undefined) !== -1)
                    toast.error("Please insert all the words");
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
            <SwitchAddressType
              handler={(selectedAddressType) => {
                setAddressType(selectedAddressType);
              }}
              selectedType={addressType}
            />
            <button
              onClick={async () => {
                try {
                  console.log("TRYING TO CREATE NEW WALLET ")
                  const stuff = mnemonicPhrase.map((i) => englishWords[i!]).join(" ")
                  console.log(stuff);
                  await createNewWallet(
                    mnemonicPhrase.map((i) => englishWords[i!]).join(" "),
                    "root",
                    addressType
                  );
                  console.log('SAVING WALLETS')
                  await walletController.saveWallets();
                  await updateWalletState({ vaultIsEmpty: false });
                  navigate("/home/wallet");
                } catch (e) {
                  toast.error("Words you entered is invalid");
                  setStep(1);
                }
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
