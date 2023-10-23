import { Link, Navigate, useNavigate } from "react-router-dom";

import { ListBulletIcon, Cog6ToothIcon, ChevronDownIcon, CheckIcon } from "@heroicons/react/24/outline";
import s from "./styles.module.scss";
import { shortAddress } from "@/ui/utils";
import { useGetCurrentAccount, useGetCurrentWallet } from "@/ui/states/walletState";
import cn from "classnames";
import { useCallback, useEffect, useState } from "react";
import { useUpdateCurrentAccountBalance } from "@/ui/hooks/wallet";
import ReactLoading from "react-loading";
import { ITransaction } from "@/shared/interfaces/apiController";
import { useUpdateCurrentAccountTransactions } from "@/ui/hooks/transactions";
import { useDebounceCall } from "@/ui/hooks/debounce";
import CopyBtn from "@/ui/components/copy-btn";
import { useControllersState } from "@/ui/states/controllerState";
import { getTransactionValue, isIncomeTx } from "@/ui/utils/transactions";
import { Circle } from "rc-progress";
import { openNotification } from "@/background/webapi";

const Wallet = () => {
  const navigate = useNavigate();
  const [lastBlock, setLastBlock] = useState<number>(0);
  const currentWallet = useGetCurrentWallet();

  if (currentWallet === undefined) return <Navigate to={"/pages/create-new-wallet"} />;

  const currentAccount = useGetCurrentAccount();

  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number | undefined>();

  const updateAccountBalance = useUpdateCurrentAccountBalance();
  const updateAccountTransactions = useUpdateCurrentAccountTransactions();

  const udpateTransactions = useCallback(async () => {
    const receivedTransactions = await updateAccountTransactions();
    if (receivedTransactions !== undefined) setTransactions(receivedTransactions);
  }, [updateAccountTransactions, setTransactions, lastBlock]);

  const updateLastBlock = useCallback(async () => {
    setLastBlock(await apiController.getLastBlockTDC());
  }, []);

  const callUpdateTransactions = useDebounceCall(udpateTransactions, 200);
  const callUpdateLastBlock = useDebounceCall(updateLastBlock, 200);

  const { apiController, stateController } = useControllersState((v) => ({
    apiController: v.apiController,
    stateController: v.stateController,
  }));

  useEffect(() => {
    const load = async () => {
      const data = await apiController.getTDCPrice();
      setCurrentPrice(Number(data.data.last));
    };
    load();
  }, [apiController, setCurrentPrice]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateAccountBalance();
      callUpdateTransactions();
      callUpdateLastBlock();
    }, 10000);

    if (currentAccount && currentAccount.balance === undefined) updateAccountBalance();

    callUpdateTransactions();
    callUpdateLastBlock();

    return () => {
      clearInterval(interval);
    };
  }, [updateAccountBalance, currentAccount, currentWallet, callUpdateTransactions]);

  useEffect(() => {
    (async () => {
      const pending = await stateController.getPendingWallet();
      if (pending) {
        navigate("/pages/new-mnemonic", {
          state: {
            pending,
          },
        });
      }
    })();
  }, [stateController]);

  return (
    <div className={s.walletDiv}>
      <button
        className="fixed top-0 left-0 z-10"
        onClick={() =>
          openNotification({
            route: "/provider/sign",
          })
        }
      >
        OPEN SHIT
      </button>
      <div className="flex justify-between mx-6 mt-2 items-center">
        <Link className="flex gap-3 items-center select-none cursor-pointer" to={"/pages/switch-wallet"}>
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-950 rounded-full w-6 h-6 flex items-center justify-center">
            {currentWallet.name ? currentWallet.name.split(/.*?/u)[0].toUpperCase() : "W"}
          </div>
          <div className="flex gap-2 items-center">
            <div className={s.change}>{currentWallet?.name ?? "wallet"} </div>
            <ChevronDownIcon className="w-3 h-3" />
          </div>
        </Link>

        <Link to={"/pages/settings"} className="cursor-pointer">
          <Cog6ToothIcon className="w-6 h-6 hover:rotate-90 transition-transform" />
        </Link>
      </div>

      <div className={s.accPanel}>
        <div className="flex gap-2 pb-2">
          <div className={s.balance}>
            {currentAccount?.balance === undefined ? (
              <ReactLoading
                type="spin"
                color="#ffbc42"
                width={"2.5rem"}
                height={"2rem"}
                className="react-loading pr-2"
              />
            ) : (
              currentAccount?.balance
            )}
            <span className="text-xl pb-0.5 text-slate-300">TDC</span>
          </div>
          {currentAccount.balance !== undefined && currentPrice !== undefined && (
            <div className="text-gray-500 text-sm">~{(currentAccount?.balance * currentPrice).toFixed(3)}$</div>
          )}
        </div>
        <div className="flex gap-3 items-center px-6">
          {currentWallet?.type === "root" && (
            <Link to={"/pages/switch-account"}>
              <ListBulletIcon title="Switch account" className={s.accountsIcon} />
            </Link>
          )}
          <CopyBtn
            title={currentAccount?.address}
            className={cn(s.accPubAddress)}
            label={shortAddress(currentAccount?.address, 9)}
            value={currentAccount?.address}
          />
        </div>

        <div className={cn(s.receiveSendBtns, s.center)}>
          <Link to={"/pages/receive"} className={cn(s.btn, s.center, "w-36")}>
            Receive
          </Link>
          <Link to={"/pages/create-send"} className={cn(s.btn, s.center, "w-36")}>
            Send
          </Link>
        </div>
      </div>

      <p className={s.transactions}>Transactions</p>
      {transactions.length > 0 ? (
        <div className={s.transactionsDiv}>
          {transactions.map((t, index) => (
            <Link
              className={s.transaction}
              key={index}
              to={`/pages/transaction-info/${t.txid}`}
              state={{
                transaction: t,
                lastBlock,
              }}
            >
              <div className="flex gap-3 items-center">
                <div
                  className={cn("rounded-full w-6 h-6 text-bg flex items-center justify-center relative", {
                    "bg-gradient-to-r from-green-400 to-emerald-600":
                      getPercent(lastBlock, t.status.block_height) === 100,
                    "bg-gradient-to-r from-gray-200 to-gray-500": getPercent(lastBlock, t.status.block_height) < 100,
                  })}
                >
                  <Circle
                    className={cn("absolute -inset-1", {
                      hidden: getPercent(lastBlock, t.status.block_height) === 100,
                    })}
                    percent={getPercent(lastBlock, t.status.block_height)}
                    strokeWidth={3}
                  />
                  <div className="absolute inset-0">{getConfirmationsCount(lastBlock, t.status.block_height)}</div>
                </div>
                <div className={s.transactionInfo}>
                  <div className={s.address}>{shortAddress(t.txid)}</div>
                </div>
              </div>
              <div
                className={cn(s.value, {
                  "text-green-500": isIncomeTx(t, currentAccount.address),
                  "text-red-500": !isIncomeTx(t, currentAccount.address),
                })}
              >
                {isIncomeTx(t, currentAccount.address) ? "+ " : "- "}
                {getTransactionValue(t, currentAccount.address)} TDC
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className={s.noTransactions}>No transactions</p>
      )}
    </div>
  );
};

const getPercent = (lastBlock: number, currentBlock?: number) => {
  if (!currentBlock) return 0;
  if (lastBlock - currentBlock > 6) {
    return 100;
  }
  return Math.floor(((lastBlock - currentBlock) / 6) * 100);
};

const getConfirmationsCount = (lastBlock: number, currentBlock?: number) => {
  if (!currentBlock) return <div className="p-0.5 flex items-center justify-center leading-[159%]">0</div>;
  if (lastBlock - currentBlock < 6) {
    return <div className="p-0.5 flex items-center justify-center leading-[159%]">{lastBlock - currentBlock}</div>;
  }
  return <CheckIcon className="w-6 h-6 p-0.5" />;
};

export default Wallet;
