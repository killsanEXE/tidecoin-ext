import { useCreateTidecoinTxCallback } from "@/ui/hooks/transactions";
import { useGetCurrentAccount } from "@/ui/states/walletState";
import { Fragment, useCallback, useEffect, useState, ChangeEventHandler, MouseEventHandler } from "react";
import s from "./styles.module.scss";
import cn from "classnames";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppState } from "@/ui/states/appState";
import { Combobox, Transition } from "@headlessui/react";
import FeeInput from "./fee-input";
import { BookOpenIcon, MinusCircleIcon } from "@heroicons/react/24/solid";
import Modal from "@/ui/components/modal";
import Switch from "@/ui/components/switch";
import { shortAddress } from "@/ui/utils";
import { useUpdateAddressBook } from "@/ui/hooks/app";

interface FormType {
  address: string;
  amount: string;
  feeAmount: number;
  includeFeeInAmount: boolean;
}

const CreateSend = () => {
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

  const { addressBook, updateAppState } = useAppState((v) => ({
    addressBook: v.addressBook,
    updateAppState: v.updateAppState,
  }));

  const send = async ({ address, amount, feeAmount, includeFeeInAmount }: FormType) => {
    if (Number(amount) < 0.01) {
      return toast.error("Minimum amount is 0.01 TDC");
    } else if (address.trim().length <= 0) {
      return toast.error("Insert the addresss of receiver");
    } else if (Number(amount) > (currentAccount?.balance ?? 0)) {
      return toast.error("There's not enough money in your account");
    } else if (feeAmount <= 1 / 10 ** 8) {
      return toast.error("Increase the fee");
    }
    try {
      const hex = await createTx(address, Number(amount) * 10 ** 8, feeAmount, includeFeeInAmount);

      if (isSaveAddress) {
        await updateAddressBook(address);
      }
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
    if (location.state !== null && (location.state.toAddress !== null || location.state.toAddress !== undefined)) {
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
            onChange={useCallback((v) => setFormData((prev) => ({ ...prev, feeAmount: v })), [setFormData])}
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

      <button type="submit" className={cn("btn primary", s.sendBtn)}>
        Continue
      </button>

      <Modal onClose={() => setOpenModal(false)} open={isOpenModal} title="Address book">
        {!addressBook.length && <div className="pt-8 text-base">No any addresses here</div>}
        <div className="flex flex-col gap-3 mt-6">
          {addressBook.map((i, idx) => (
            <div
              key={`ab-${idx}`}
              className="cursor-pointer flex gap-1"
              onClick={() => {
                setOpenModal(false);
                setFormData((prev) => ({ ...prev, address: i }));
              }}
            >
              <div className="px-4 py-2 rounded-xl bg-input-bg select-none hover:bg-gray-500 transition-colors">
                {shortAddress(i, 17)}
              </div>
              <div
                className="p-2 rounded-xl bg-input-bg hover:bg-red-500 transition-colors"
                onClick={async () => {
                  await updateAppState({
                    addressBook: addressBook.filter((d) => d !== i),
                  });
                }}
              >
                <MinusCircleIcon className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </form>
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
