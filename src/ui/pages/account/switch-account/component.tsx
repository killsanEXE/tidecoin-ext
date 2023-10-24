import { useState } from "react";
import { CheckIcon, Bars3Icon, TagIcon, KeyIcon, XMarkIcon } from "@heroicons/react/24/outline";
import s from "./styles.module.scss";
import { shortAddress } from "@/shared/utils/transactions";
import { useGetCurrentAccount, useGetCurrentWallet } from "@/ui/states/walletState";
import cn from "classnames";
import CopyBtn from "@/ui/components/copy-btn";
import Menu from "@/ui/components/menu";
import { useSwitchAccount } from "@/ui/hooks/wallet";
import { useNavigate } from "react-router-dom";

const SwitchAccount = () => {
  const [selected, setSelected] = useState<number>();

  const currentAccount = useGetCurrentAccount();
  const currentWallet = useGetCurrentWallet();

  const switchAccount = useSwitchAccount();
  const navigate = useNavigate();

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
                  {currentAccount!.id === acc.id ? <CheckIcon className="w-8 h-8" /> : undefined}
                  {acc.name}
                </div>
              </div>
              <div className={s.address}>{shortAddress(acc.address)}</div>
              <div className={s.accControl}>
                <button
                  className={s.manageAccButton}
                  onClick={() => {
                    setSelected(i);
                  }}
                >
                  <Bars3Icon className="w-8 h-8 text-text" />
                </button>
              </div>
            </div>
            <Menu
              active={selected === i}
              items={[
                {
                  custom: (
                    <CopyBtn
                      title="Copy address"
                      value={acc.address}
                      className={cn(s.copy)}
                      iconClassName="text-bg w-8 h-8"
                    />
                  ),
                },
                {
                  action: () => {
                    navigate(`/pages/rename-account/${acc.id}`);
                  },
                  icon: <TagIcon title="Rename account" className="w-8 h-8 cursor-pointer text-bg" />,
                },
                {
                  action: () => {
                    navigate(`/pages/show-pk/${acc.id}`);
                  },
                  icon: <KeyIcon title="Export private key" className="w-8 h-8 cursor-pointer text-bg" />,
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
    </div>
  );
};

export default SwitchAccount;
