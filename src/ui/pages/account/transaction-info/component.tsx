import s from "./styles.module.scss";
import ReactLoading from "react-loading";
import { browserTabsCreate } from "@/shared/utils/browser";
import { useLocation } from "react-router-dom";
import { ITransaction } from "@/shared/interfaces/apiController";
import { getTransactionValue } from "@/ui/utils/transactions";
import { useGetCurrentAccount } from "@/ui/states/walletState";
import { LinkIcon } from "@heroicons/react/24/outline";
import { FC, useId, useState } from "react";
import Modal from "@/ui/components/modal";
import cn from "classnames";
import { shortAddress } from "@/ui/utils";
import toast from "react-hot-toast";

const TransactionInfo = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const currentAccount = useGetCurrentAccount();

  const {
    state: { transaction, lastBlock },
  } = useLocation();
  const tx = transaction as ITransaction;

  return (
    <div className={s.transactionInfoDiv}>
      {transaction ? (
        <div className={s.transaction}>
          <div className={s.group}>
            <p className={s.transactionP}>TxId:</p>

            <span>{tx.txid}</span>
          </div>
          <div className={s.group}>
            <p className={s.transactionP}>Confirmations:</p>
            <span>{tx.status.confirmed ? lastBlock - tx.status.block_height : 0}</span>
          </div>
          <div className={s.group}>
            <p className={s.transactionP}>Fee:</p>
            <span>{tx.fee / 10 ** 8} TDC</span>
          </div>
          <div className={s.group}>
            <p className={s.transactionP}>Value:</p>
            <span>{getTransactionValue(tx, currentAccount?.address, false)} TDC</span>
          </div>

          <div className={s.summary} onClick={() => setOpenModal(true)}>
            <LinkIcon className="w-4 h-4" /> Detailed info
          </div>

          <button
            className={s.explorerBtn}
            onClick={async () => {
              await browserTabsCreate({
                url: `https://explorer.tidecoin.org/tx/${transaction.txid}`,
                active: true,
              });
            }}
          >
            Open in explorer
          </button>
          <Modal onClose={() => setOpenModal(false)} open={openModal} title="Detailed info">
            <div className={s.tableContainer}>
              <TableItem
                label="Inputs"
                currentAddress={currentAccount.address}
                items={tx.vin.map((i) => ({
                  scriptpubkey_address: i.prevout.scriptpubkey_address,
                  value: i.prevout.value,
                }))}
              />
              <TableItem label="Outputs" currentAddress={currentAccount.address} items={tx.vout} />
            </div>
          </Modal>
        </div>
      ) : (
        <ReactLoading type="spin" color="#fff" />
      )}
    </div>
  );
};

interface ITableItem {
  items: {
    scriptpubkey_address: string;
    value: number;
  }[];
  currentAddress?: string;
  label: string;
}

const TableItem: FC<ITableItem> = ({ items, currentAddress, label }) => {
  const currentId = useId();

  const addressLength = (value: number) => {
    const newValue = (value / 10 ** 8).toFixed(2);
    if (newValue.length > 7) {
      return 9;
    }
    return 12;
  };

  return (
    <div className={s.table}>
      <h3>{label}:</h3>
      <div className={s.tableList}>
        {items.map((i, idx) => (
          <div key={`${currentId}${idx}`} className={s.tableGroup}>
            <div
              className={cn(
                {
                  [s.active]: i.scriptpubkey_address === currentAddress,
                },
                s.tableFirst
              )}
              onClick={() => {
                navigator.clipboard.writeText(i.scriptpubkey_address);
                toast.success("Copied");
              }}
              title={i.scriptpubkey_address}
            >
              {shortAddress(i.scriptpubkey_address, addressLength(i.value))}
            </div>
            <div className={s.tableSecond}>{(i.value / 10 ** 8).toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionInfo;
