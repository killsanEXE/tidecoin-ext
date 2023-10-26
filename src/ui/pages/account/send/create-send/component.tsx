import { useCreateTidecoinTxCallback } from "@/ui/hooks/transactions";
import { useGetCurrentAccount } from "@/ui/states/walletState";
import { Fragment, useCallback, useEffect, useState, ChangeEventHandler, MouseEventHandler, useId } from "react";
import s from "./styles.module.scss";
import cn from "classnames";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppState } from "@/ui/states/appState";
import { Combobox, Transition } from "@headlessui/react";
import FeeInput from "./fee-input";
import { BookOpenIcon } from "@heroicons/react/24/solid";
import Switch from "@/ui/components/switch";
import { shortAddress } from "@/shared/utils/transactions";
import { useUpdateAddressBook } from "@/ui/hooks/app";
import AddressBookModal from "./address-book/component";

export interface FormType {
  address: string;
  amount: string;
  feeAmount: number;
  includeFeeInAmount: boolean;
  inputedFee?: number;
}

const CreateSend = () => {
  const formId = useId();

  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const [isSaveAddress, setIsSaveAddress] = useState<boolean>(false);
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
  const updateAddressBook = useUpdateAddressBook();

  const { addressBook } = useAppState((v) => ({
    addressBook: v.addressBook,
  }));

  const send = async ({ address, amount, feeAmount, includeFeeInAmount }: FormType) => {
    if (Number(amount) < 0.01) {
      return toast.error("Minimum amount is 0.01 TDC");
    }
    if (address.trim().length <= 0) {
      return toast.error("Insert the addresss of receiver");
    }
    if (Number(amount) > (currentAccount?.balance ?? 0)) {
      return toast.error("There's not enough money in your account");
    }
    if (feeAmount <= 1) {
      return toast.error("Increase the fee");
    }
    if (feeAmount % 1 !== 0) {
      return toast.error("Fee should be integer");
    }

    try {
      const { fee, rawtx } = await createTx(address, Number(amount) * 10 ** 8, feeAmount, includeFeeInAmount);

      if (isSaveAddress) {
        await updateAddressBook(address);
      }
      navigate("/pages/confirm-send", {
        state: {
          toAddress: address,
          amount: Number(amount),
          includeFeeInAmount,
          fromAddress: currentAccount?.address ?? "",
          feeAmount: fee,
          hex: rawtx,
        },
      });
    } catch (e) {
      console.error(e);
      toast.error("Error has occurred");
    }
  };

  useEffect(() => {
    if (location.state && location.state.toAddress) {
      setFormData({
        address: location.state.toAddress,
        amount: location.state.amount,
        feeAmount: location.state.inputedFee,
        includeFeeInAmount: location.state.includeFeeInAmount,
      });
      if (currentAccount.balance <= location.state.amount) setIncludeFeeLocked(true);
    }
  }, [location.state, setFormData, currentAccount.balance]);

  const [query, setQuery] = useState("");
  const filteredAddresses =
    query === ""
      ? addressBook
      : addressBook.filter((address) => {
          return address.toLowerCase().startsWith(query.toLowerCase());
        });

  const onOpenAddressBook: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    setOpenModal(true);
  };

  const onAmountChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormData((prev) => ({
      ...prev,
      amount: extractAmount(e.target.value),
    }));
    if (currentAccount.balance > Number(e.target.value)) {
      setIncludeFeeLocked(false);
    } else {
      setIncludeFeeLocked(true);
      setFormData((prev) => ({
        ...prev,
        includeFeeInAmount: true,
      }));
    }
  };

  const onMaxClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    setFormData((prev) => ({
      ...prev,
      amount: currentAccount.balance.toString(),
      includeFeeInAmount: true,
    }));
    setIncludeFeeLocked(true);
  };

  return (
    <div className="flex flex-col h-full justify-between w-full">
      <form
        id={formId}
        className={cn("form", s.send)}
        onSubmit={(e) => {
          e.preventDefault();
          send(formData);
        }}
      >
        <div className={s.inputs}>
          <div className="form-field">
            <span className="input-span">Address</span>
            <div className="flex gap-2">
              <Combobox
                value={formData.address}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, address: e }));
                }}
              >
                <div className="relative w-full">
                  <Combobox.Input
                    displayValue={(address: string) => address}
                    autoComplete="off"
                    className="input w-full"
                    value={formData.address}
                    onChange={(v) => {
                      setFormData((prev) => ({ ...prev, address: v.target.value }));
                      setQuery(v.target.value);
                    }}
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
                          <Combobox.Option className={s.addressbookoption} key={address} value={address}>
                            {shortAddress(address, 14)}
                          </Combobox.Option>
                        ))}
                      </Combobox.Options>
                    </Transition>
                  )}
                </div>
              </Combobox>
              <button className="bg-input-bg px-2 rounded-xl" title="Address book" onClick={onOpenAddressBook}>
                <BookOpenIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="form-field">
            <span className="input-span">Amount</span>
            <div className="flex gap-2 w-full">
              <input
                type="number"
                placeholder="Amount to send"
                className="input w-full"
                value={formData.amount}
                onChange={onAmountChange}
              />
              <button className={s.maxAmount} onClick={onMaxClick}>
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
                (v) => setFormData((prev) => ({ ...prev, feeAmount: v, inputedFee: v })),
                [setFormData]
              )}
              onIncludeChange={useCallback(
                (v) => setFormData((prev) => ({ ...prev, includeFeeInAmount: v })),
                [setFormData]
              )}
              includeFeeValue={formData.includeFeeInAmount}
              includeFeeLocked={includeFeeLocked}
            />
          </div>

          <Switch
            label="Save address for the next payments"
            value={isSaveAddress}
            onChange={setIsSaveAddress}
            locked={false}
          />
        </div>
      </form>

      <AddressBookModal isOpen={isOpenModal} onClose={() => setOpenModal(false)} setFormData={setFormData} />

      <button type="submit" className={"btn primary m-6 md:mb-3"} form={formId}>
        Continue
      </button>
    </div>
  );
};

const extractAmount = (value: string) => {
  if (!value.length) return "";
  if (value.includes(".")) {
    if (value.split(".")[1].length > 8) {
      return value.split(".")[0] + `.${value.split(".")[1].slice(0, 8)}`;
    }
  }
  return value;
};

export default CreateSend;
