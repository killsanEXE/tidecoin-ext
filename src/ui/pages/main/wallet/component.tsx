/* eslint-disable react-hooks/rules-of-hooks */
import { Link, Navigate, useNavigate } from "react-router-dom";

import { ListBulletIcon, Cog6ToothIcon, ChevronDownIcon, CheckIcon } from "@heroicons/react/24/outline";
import s from "./styles.module.scss";
import { shortAddress } from "@/shared/utils/transactions";
import { useGetCurrentAccount, useGetCurrentWallet } from "@/ui/states/walletState";
import cn from "classnames";
import { useCallback, useEffect, useState } from "react";
import { useUpdateCurrentAccountBalance } from "@/ui/hooks/wallet";
import ReactLoading from "react-loading";
import { ITransaction } from "@/shared/interfaces/api";
import { useGetPaginatedTransactions, useUpdateCurrentAccountTransactions } from "@/ui/hooks/transactions";
import CopyBtn from "@/ui/components/copy-btn";
import { useControllersState } from "@/ui/states/controllerState";
import { getTransactionValue, isIncomeTx } from "@/shared/utils/transactions";
import { Circle } from "rc-progress";
import { useDebounceCall } from "@/ui/hooks/debounce";
import { t } from "i18next";
import { useInView } from "react-intersection-observer";
import { COIN_SYMBOL } from "@/shared/constant";

const Wallet = () => {
  const navigate = useNavigate();
  const [lastBlock, setLastBlock] = useState<number>(0);
  const currentWallet = useGetCurrentWallet();

  const [, setPrevAcc] = useState<string>();

  if (currentWallet === undefined) return <Navigate to={"/pages/create-new-wallet"} />;

  const { apiController, stateController } = useControllersState((v) => ({
    apiController: v.apiController,
    stateController: v.stateController,
  }));

  const currentAccount = useGetCurrentAccount();
  const getPaginatedTransactions = useGetPaginatedTransactions();

  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number | undefined>();

  const updateAccountBalance = useUpdateCurrentAccountBalance();
  const updateAccountTransactions = useUpdateCurrentAccountTransactions();

  const udpateTransactions = useCallback(async () => {
    const receivedTransactions = await updateAccountTransactions();
    if (receivedTransactions !== undefined) {
      if (transactions.length > 0 && transactions[0].txid !== receivedTransactions[0].txid) {
        const oldTxidIndex = receivedTransactions.findIndex(f => f.txid === transactions[0].txid);
        setTransactions([...receivedTransactions.slice(0, oldTxidIndex), ...transactions])
      } else setTransactions(receivedTransactions);
    }
  }, [updateAccountTransactions, transactions]);

  const updateLastBlock = useCallback(async () => {
    setLastBlock(await apiController.getLastBlockTDC());
  }, [apiController]);

  useEffect(() => {
    (async () => {
      const data = await apiController.getTDCPrice();
      setCurrentPrice(Number(data.data.last));
      await updateLastBlock();
    })();
  }, [updateLastBlock, apiController]);

  const updateAll = useCallback(async () => {
    updateAccountBalance();
    udpateTransactions();
  }, [updateAccountBalance, udpateTransactions]);

  const trottledUpdate = useDebounceCall(updateAll, 300);

  useEffect(() => {
    const interval = setInterval(() => {
      updateAccountBalance();
      udpateTransactions();
      updateLastBlock();
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [updateAccountBalance, udpateTransactions, updateLastBlock]);

  useEffect(() => {
    setPrevAcc((prev) => {
      if (typeof prev === "undefined" || prev !== currentAccount.address) {
        trottledUpdate();
        return currentAccount.address;
      }
      return prev;
    });
  }, [trottledUpdate, currentAccount]);

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
  }, [stateController, navigate]);


  const { ref, inView } = useInView();
  const loadMore = useCallback(async () => {
    if (!transactions.length) return;
    const additionalTransactions = await getPaginatedTransactions(transactions[transactions.length - 1].txid ?? "");
    if (!additionalTransactions) return;
    if (additionalTransactions.length > 0) setTransactions(prev => [...prev, ...additionalTransactions]);
  }, [getPaginatedTransactions, transactions])

  useEffect(() => {
    if (inView) loadMore();
  }, [inView, loadMore])

  return (
    <div className={s.walletDiv}>
      <div className="flex justify-between mt-2 items-center">
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
            <span className="text-xl pb-0.5 text-slate-300">{COIN_SYMBOL}</span>
          </div>
          {currentAccount.balance !== undefined && currentPrice !== undefined && (
            <div className="text-gray-500 text-sm">~{(currentAccount?.balance * currentPrice).toFixed(3)}$</div>
          )}
        </div>
        <div className="flex gap-3 items-center">
          {currentWallet?.type === "root" && (
            <Link to={"/pages/switch-account"}>
              <ListBulletIcon title={"Switch account"} className={s.accountsIcon} />
            </Link>
          )}
          <div>
            <p>{currentAccount.name}</p>
            <CopyBtn
              title={currentAccount?.address}
              className={cn(s.accPubAddress)}
              label={shortAddress(currentAccount?.address, 9)}
              value={currentAccount?.address}
            />
          </div>
        </div>

        <div className={cn(s.receiveSendBtns)}>
          <Link to={"/pages/receive"} className={s.btn}>
            {t("wallet_page.receive")}
          </Link>
          <Link to={"/pages/create-send"} className={s.btn}>
            {t("wallet_page.send")}
          </Link>
        </div>
      </div>

      <p className={s.transactions}>{t("wallet_page.transactions")}</p>
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
                {getTransactionValue(t, currentAccount.address)} ${COIN_SYMBOL}
              </div>
            </Link>
          ))}
          <div ref={ref}></div>
        </div>
      ) : (
        <p className={s.noTransactions}>{t("wallet_page.no_transactions")}</p>
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
