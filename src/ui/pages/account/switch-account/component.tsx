import { useState } from "react";
import {
  CheckIcon,
  Bars3Icon,
  TagIcon,
  KeyIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import s from "./styles.module.scss";
import { shortAddress } from "@/ui/utils";
import {
  useGetCurrentAccount,
  useGetCurrentWallet,
  useWalletState,
} from "@/ui/states/walletState";
import cn from "classnames";
import { useNavigate } from "react-router-dom";
import CopyBtn from "@/ui/components/copy-btn";
import Menu from "@/ui/components/menu";

const SwitchAccount = () => {
  const [selected, setSelected] = useState<number>();

  const currentAccount = useGetCurrentAccount();
  const currentWallet = useGetCurrentWallet();

  const { updateWalletState } = useWalletState((v) => ({
    updateWalletState: v.updateWalletState,
  }));

  const navigate = useNavigate();

  const switchAccount = (id: number) => {
    updateWalletState({
      selectedAccount: id,
    });
    navigate("/home/wallet");
  };

  return (
    <div className={s.switchAccDiv}>
      <div className={s.accounts}>
        {currentWallet?.accounts.map((acc, i) => (
          <div className={s.mainAcc} key={i}>
            <div className={s.account}>
              <div
                className={s.accInfo}
                onClick={() => {
                  switchAccount(acc.id);
                }}
              >
                <div className={s.name}>
                  {currentAccount!.id === acc.id ? (
                    <CheckIcon className="w-8 h-8 cursor-pointer" />
                  ) : undefined}
                  {acc.name}
                </div>
                <div className={s.address}>{shortAddress(acc.address)}</div>
              </div>
              <div className={s.accControl}>
                <button
                  className={s.manageAccButton}
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
                  custom: (
                    <CopyBtn
                      value={acc.address}
                      className={cn(s.accSetting, s.copy)}
                    />
                  ),
                },
                {
                  action: () => {
                    navigate(`/pages/rename-account/${acc.id}`);
                  },
                  icon: <TagIcon className="w-8 h-8" />,
                },
                {
                  action: () => {
                    navigate(`/pages/show-pk/${acc.id}`);
                  },
                  icon: <KeyIcon className="w-8 h-8 cursor-pointer" />,
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
    </div>
  );
};

export default SwitchAccount;
