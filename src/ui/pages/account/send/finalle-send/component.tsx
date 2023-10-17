import { browserTabsCreate } from "@/shared/utils/browser";
import { useParams } from "react-router-dom";

const FinalleSend = () => {

  const { txId } = useParams();

  return (
    <div className="w-[95%] text-sm flex gap-[.3rem] flex-col items-center justify-center h-full">
      <span>TxId</span>
      <p className="bg-input-bg break-all rounded-[.3rem] w-full flex justify-center">
        <p onClick={() => {
          browserTabsCreate({ url: `https://explorer.tidecoin.org/tx/${txId}` })
        }}>{txId}</p>
      </p>
    </div>
  );
};

export default FinalleSend;
