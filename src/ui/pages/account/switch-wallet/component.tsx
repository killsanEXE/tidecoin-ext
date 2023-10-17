import { useGetCurrentWallet, useWalletState } from "@/ui/states/walletState";
import { useState } from "react";
import s from "./styles.module.scss";
import {
  CheckIcon,
  TagIcon,
  KeyIcon,
  XMarkIcon,
  Bars3Icon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import { useDeleteWallet, useSwitchWallet } from "@/ui/hooks/wallet";
import { useNavigate } from "react-router-dom";
import Menu from "@/ui/components/menu";
import Popup from "@/ui/components/popup";
import toast from "react-hot-toast";

const SwitchWallet = () => {
  const currentWallet = useGetCurrentWallet();
  const { wallets } = useWalletState((v) => ({
    wallets: v.wallets,
  }));
  const switchWallet = useSwitchWallet();
  const [selected, setSelected] = useState<number>();
  const navigate = useNavigate();
  const deleteWallet = useDeleteWallet();

  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [handler, setHandler] =
    useState<(result: boolean) => void | undefined>(undefined);

  return (
    <div className={s.switchWalletDiv}>
      <div className={s.wallets}>
        {wallets.map((wallet, i) => (
          <div className={s.mainWallet} key={i}>
            <div className={s.wallet}>
              <div
                className={s.walletInfo}
                onClick={() => {
                  switchWallet(i);
                  navigate("/home");
                }}
              >
                {wallet.id === currentWallet?.id ? (
                  <CheckIcon className="w-8 h-8 cursor-pointer" />
                ) : undefined}
                {wallet.name}
              </div>
              <div className={s.walletControl}>
                <button
                  className={s.manageWalletButton}
                  onClick={() => {
                    setSelected(i);
                  }}
                >
                  <Bars3Icon className="w-8 h-8 cursor-pointer" />
                </button>
              </div>
            </div>
            <Menu
              active={selected === i}
              items={[
                {
                  action: () => {
                    navigate(`/pages/rename-wallet/${wallet.id}`);
                  },
                  icon: <TagIcon className="w-8 h-8" />,
                },
                {
                  action: () => {
                    navigate(`/pages/show-mnemonic/${i}`);
                  },
                  icon: <KeyIcon className="w-8 h-8 cursor-pointer" />,
                },
                {
                  action: () => {
                    if (wallets.length <= 1)
                      toast.error("You cannot delete your last wallet");
                    else {
                      setQuestion(
                        `Are you sure you want to delete "${wallet.name}"?`
                      );
                      setHandler(() => (result) => {
                        if (result) {
                          deleteWallet(wallet.id);
                          setHandler(undefined);
                          setSelected(undefined);
                        }
                        setIsOpen(false);
                      });
                      setIsOpen(true);
                    }
                  },
                  icon: <TrashIcon className="w-8 h-8 cursor-pointer" />,
                },
                {
                  action: () => {
                    setSelected(undefined);
                  },
                  icon: <XMarkIcon className="w-8 h-8 cursor-pointer" />,
                },
              ]}
            />
          </div>
        ))}
      </div>
      <Popup isOpen={isOpen} question={question} handler={handler} />
    </div>
  );
};

export default SwitchWallet;
