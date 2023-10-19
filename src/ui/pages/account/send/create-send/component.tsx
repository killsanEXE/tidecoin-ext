import { useCreateTidecoinTxCallback } from "@/ui/hooks/transactions";
import { useGetCurrentAccount } from "@/ui/states/walletState";
import { Fragment, useCallback, useEffect, useState } from "react";
import s from "./styles.module.scss";
import cn from "classnames";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppState } from "@/ui/states/appState";
import { Combobox, Transition } from "@headlessui/react";
import FeeInput from "./fee-input";

interface FormType {
  address: string;
  amount: string;
  feeAmount: number;
  includeFeeInAmount: boolean;
}

const CreateSend = () => {
  const [formData, setFormData] = useState<FormType>({
    address: "",
    amount: "",
    includeFeeInAmount: false,
    feeAmount: 1,
  });
  const [includeFeeLocked, setIncludeFeeLocked] = useState<boolean>(false);
  const currentAccount = useGetCurrentAccount();
  const createTx = useCreateTidecoinTxCallback();
  const navigate = useNavigate();
  const location = useLocation();

  const { addressBook } = useAppState((v) => ({ addressBook: v.addressBook }));

  const send = async ({
    address,
    amount,
    feeAmount,
    includeFeeInAmount,
  }: FormType) => {
    // if (amount < 0.01) {
    //   toast.error("Minimum amount is 0.01 TDC");
    // } else if (address.trim().length <= 0) {
    //   toast.error("Insert the addresss of receiver")
    // } else if (amount > (currentAccount?.balance ?? 0) ||
    //   (amount === currentAccount?.balance && !includeFeeInAmount)) {
    //   toast.error("There's not enough money in your account");
    // } else if (feeAmount <= 1 / 10 ** 8) {
    //   toast.error("Increase the fee");
    // } else {
    //   try {
    //     const hex = await sendTdc(address, amount * 10 ** 8, feeAmount, includeFeeInAmount);
    //     navigate("/pages/confirm-send", {
    //       state: {
    //         toAddresss: address,
    //         amount,
    //         feeAmount,
    //         includeFeeInAmount,
    //         fromAddresss: currentAccount?.addresss ?? "",
    //         hex
    //       }
    //     })
    //   } catch (e) {
    //     toast.error("Error has occurred");
    //   }
    // }
    try {
      const hex = await createTx(
        address,
        Number(amount) * 10 ** 8,
        feeAmount,
        includeFeeInAmount
      );
      navigate("/pages/confirm-send", {
        state: {
          toAddress: address,
          amount: Number(amount),
          feeAmount,
          includeFeeInAmount,
          fromAddress: currentAccount?.address ?? "",
          hex,
        },
      });
    } catch (e) {
      console.error(e);
      toast.error("Error has occurred");
    }
  };

  useEffect(() => {
    if (
      location.state !== null &&
      (location.state.toAddress !== null ||
        location.state.toAddress !== undefined)
    ) {
      setFormData({
        address: location.state.toAddress,
        amount: location.state.amount,
        feeAmount: location.state.feeAmount,
        includeFeeInAmount: location.state.includeFeeInAmount,
      });
    }
  }, [location.state, setFormData]);

  const [query, setQuery] = useState("");
  const filteredAddresses =
    query === ""
      ? addressBook
      : addressBook.filter((address) => {
          return address.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <form
      className={cn("form", s.send)}
      onSubmit={(e) => {
        e.preventDefault();
        send(formData);
      }}
    >
      <div className={s.inputs}>
        <div className="form-field">
          <span className="input-span">Address</span>
          <Combobox
            value={formData.address}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, address: e }));
              setQuery(e);
            }}
          >
            <Combobox.Input
              displayValue={(address: string) => address}
              autoComplete="off"
              className="input"
              value={formData.address}
              onChange={(v) =>
                setFormData((prev) => ({ ...prev, address: v.target.value }))
              }
            />
            {filteredAddresses.length <= 0 ? (
              ""
            ) : (
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                afterLeave={() => {}}
              >
                <Combobox.Options className={s.addressbookoptions}>
                  {filteredAddresses.map((address) => (
                    <Combobox.Option
                      className={s.addressbookoption}
                      key={address}
                      value={address}
                    >
                      {address}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              </Transition>
            )}
          </Combobox>
        </div>
        <div className="form-field">
          <span className="input-span">Amount</span>
          <div className="flex gap-2 w-full">
            <input
              placeholder="Amount you want to send"
              className="input w-full"
              value={formData.amount}
              onChange={(v) =>
                setFormData((prev) => ({
                  ...prev,
                  amount: v.target.value.length ? v.target.value : "",
                }))
              }
            />
            <button
              className={s.maxAmount}
              onClick={(e) => {
                e.preventDefault();
                setFormData((prev) => ({
                  ...prev,
                  amount: currentAccount.balance.toString(),
                  includeFeeInAmount: true,
                }));
                setIncludeFeeLocked(true);
              }}
            >
              MAX
            </button>
          </div>
        </div>
      </div>

      <div className={s.feeDiv}>
        <div className={cn("form-field", s.amountInput)}>
          <span className="input-span">Fee:</span>
          <FeeInput
            onChange={useCallback(
              (v) => setFormData((prev) => ({ ...prev, feeAmount: v })),
              [setFormData]
            )}
            onIncludeChange={useCallback(
              (v) =>
                setFormData((prev) => ({ ...prev, includeFeeInAmount: v })),
              [setFormData]
            )}
            includeFeeValue={formData.includeFeeInAmount}
            includeFeeLocked={includeFeeLocked}
          />
        </div>
      </div>

      <button type="submit" className={cn(s.sendBtn, "btn primary")}>
        Continue
      </button>
    </form>
  );
};

export default CreateSend;
