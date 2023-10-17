import { useCreateTidecoinTxCallback } from "@/ui/hooks/transactions";
import { useGetCurrentAccount } from "@/ui/states/walletState";
import { Fragment, useEffect, useState } from "react";
import s from "./styles.module.scss";
import cn from "classnames";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAppState } from "@/ui/states/appState";
import { Combobox, Transition } from "@headlessui/react";

interface FormType {
  address: string;
  amount: number;
  feeAmount: number;
  includeFeeInAmount: boolean
}

const CreateSend = () => {

  const currentAccount = useGetCurrentAccount();
  const sendTdc = useCreateTidecoinTxCallback();
  const navigate = useNavigate();
  const location = useLocation();

  const { register, handleSubmit, setValue, getValues } = useForm<FormType>({
    defaultValues: {
      address: "",
      amount: 0,
      feeAmount: 0,
      includeFeeInAmount: false
    }
  });

  const { addressBook } = useAppState((v) => ({ addressBook: v.addressBook }))


  const send = async ({ address, amount, feeAmount, includeFeeInAmount }: FormType) => {
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
      const hex = await sendTdc(address, amount * 10 ** 8, feeAmount, includeFeeInAmount);
      navigate("/pages/confirm-send", {
        state: {
          toAddress: address,
          amount,
          feeAmount,
          includeFeeInAmount,
          fromAddress: currentAccount?.address ?? "",
          hex
        }
      })
    } catch (e) {
      toast.error("Error has occurred");
    }
  };

  useEffect(() => {
    if (location.state !== null && (location.state.toAddress !== null || location.state.toAddress !== undefined)) {
      setValue("address", location.state.toAddress);
      setValue("amount", location.state.amount);
      setValue("feeAmount", location.state.feeAmount);
      setValue("includeFeeInAmount", location.state.includeFeeInAmount);
    }
  }, [location.state, setValue])

  const [query, setQuery] = useState("");
  const filteredAddresses =
    query === ''
      ? addressBook
      : addressBook.filter((address) => {
        return address.toLowerCase().includes(query.toLowerCase())
      })

  return (
    <form className={cn("form", s.send)} onSubmit={handleSubmit(send)}>
      <div className={s.inputs}>
        <div className="form-field">
          <span className="input-span">Address</span>
          <Combobox value={getValues().address} onChange={(e) => {
            setValue("address", e)
            setQuery(e)
          }}>
            <Combobox.Input displayValue={(address: string) => address} autoComplete="off" className="input" value={getValues("address")} onChange={((e) => {
              setValue("address", e.target.value)
              setQuery(e.target.value)
            })} />
            {filteredAddresses.length <= 0 ? "" :
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                afterLeave={() => { }}
              >
                <Combobox.Options className={s.addressbookoptions}>
                  {
                    filteredAddresses.map((address) => (
                      <Combobox.Option className={s.addressbookoption} key={address} value={address}>
                        {address}
                      </Combobox.Option>
                    ))
                  }
                </Combobox.Options>
              </Transition>
            }
          </Combobox>
        </div>
        <div className="form-field">
          <span className="input-span">Amount</span>
          <input
            placeholder="Amount you want to send"
            className="input"
            {...register("amount", { valueAsNumber: true })}
          />
          <span className="input-info">
            MAX AMOUNT: {currentAccount!.balance}
          </span>
        </div>
      </div>

      <div className={s.feeDiv}>
        <div className={cn("form-field", s.amountInput)}>
          <span className="input-span">Fee:</span>
          <input
            className="input"
            placeholder="sat/Vb"
            {...register("feeAmount", { valueAsNumber: true })} />
        </div>
        <div className={s.includeFeeInAmountDiv}>
          <input type="checkbox" {...register("includeFeeInAmount")} />
          <span className={s.includeFeeSpan}>Include fee in the amount</span>
        </div>
      </div>

      <button type="submit" className={cn(s.sendBtn, "btn primary")}>
        Continue
      </button>
    </form>
  );
};

export default CreateSend;
