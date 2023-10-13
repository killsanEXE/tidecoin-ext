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

const RestoreMnemonic = () => {
  const [step, setStep] = useState(1);
  const { updateWalletState } = useWalletState((v) => ({
    updateWalletState: v.updateWalletState,
  }));
  const [addressType, setAddressType] = useState(AddressType.P2WPKH);
  const { walletController } = useControllersState((v) => ({
    walletController: v.walletController,
  }));
  const [mnemonicPhrase, setMnemonicPhrase] = useState<(string | undefined)[]>(
    new Array(12).fill("")
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
                    <p className="w-6">{index + 1}.</p>
                    <SelectWithHint
                      selected={value}
                      setSelected={(v) => {
                        if (!v) {
                          setMnemonicPhrase(mnemonicPhrase.with(index, v));
                          return;
                        }
                        const phrase = v.split(" ");
                        if (phrase.length === 12) setMnemonicPhrase(phrase);
                        else setMnemonicPhrase(mnemonicPhrase.with(index, v));
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
                  await createNewWallet(
                    mnemonicPhrase.join(" "),
                    "root",
                    addressType
                  );
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
