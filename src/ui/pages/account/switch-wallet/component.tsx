import { useGetCurrentWallet, useWalletState } from "@/ui/states/walletState";
import { useState } from "react";
import s from "./styles.module.scss";
import { CheckIcon, TagIcon, KeyIcon, XMarkIcon, Bars3Icon, TrashIcon } from "@heroicons/react/24/outline";

import { useDeleteWallet, useSwitchWallet } from "@/ui/hooks/wallet";
import { useNavigate } from "react-router-dom";
import Menu from "@/ui/components/menu";
import toast from "react-hot-toast";
import Modal from "@/ui/components/modal";

const SwitchWallet = () => {
  const currentWallet = useGetCurrentWallet();
  const { wallets } = useWalletState((v) => ({
    wallets: v.wallets,
  }));
  const switchWallet = useSwitchWallet();
  const [selected, setSelected] = useState<number>();
  const navigate = useNavigate();
  const deleteWallet = useDeleteWallet();

  const [deleteWalletId, setDeleteWalletId] = useState<number>();

  const onDelete = async () => {
    setSelected(undefined);
    setDeleteWalletId(undefined);

    await deleteWallet(wallets[deleteWalletId].id);
  };

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
                {wallet.id === currentWallet?.id ? <CheckIcon className="w-8 h-8 cursor-pointer" /> : undefined}
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
                  icon: <TagIcon title="Rename wallet" className="w-8 h-8 cursor-pointer text-bg" />,
                },
                {
                  action: () => {
                    navigate(`/pages/show-mnemonic/${i}`);
                  },
                  icon: <KeyIcon title="Show mnemonic \ private key" className="w-8 h-8 cursor-pointer text-bg" />,
                },
                {
                  action: () => {
                    if (wallets.length <= 1) toast.error("You cannot delete your last wallet");
                    else setDeleteWalletId(i);
                  },
                  icon: <TrashIcon title="Remove wallet" className="w-8 h-8 cursor-pointer text-bg" />,
                },
                {
                  action: () => {
                    setSelected(undefined);
                  },
                  icon: <XMarkIcon title="Close menu" className="w-8 h-8 cursor-pointer text-bg" />,
                },
              ]}
            />
          </div>
        ))}
      </div>
      <Modal onClose={() => setDeleteWalletId(undefined)} open={deleteWalletId !== undefined} title={"Confirmation"}>
        <div className="text-base text-text py-5 px-4 flex flex-col items-center">
          <div className="text-center text-sm">Are you sure you want to delete?</div>
          <span className="text-teal-200 block text-center mt-5">
            {deleteWalletId !== undefined ? wallets[deleteWalletId].name : ""}
          </span>
        </div>
        <div className="flex justify-center gap-4">
          <button className="btn hover:bg-red-500" onClick={onDelete}>
            Yes
          </button>
          <button className="btn hover:bg-text hover:text-bg" onClick={() => setDeleteWalletId(undefined)}>
            No
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SwitchWallet;
