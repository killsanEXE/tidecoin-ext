import { browserTabsCreate } from "@/shared/utils/browser";
import { Link, useParams } from "react-router-dom";
import { CheckIcon } from "@heroicons/react/24/solid";

const FinalleSend = () => {
  const { txId } = useParams();

  return (
    <div className="text-sm flex-col h-full flex justify-center items-center">
      <div className="flex flex-col gap-4 justify-center mb-16">
        <div className="rounded-full bg-gradient-to-tr from-green-500 to-emerald-400">
          <CheckIcon className="w-28 h-28 text-bg p-3" />
        </div>
        <h3 className="text-center font-medium text-base">Success</h3>
      </div>

      <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3">
        <Link to={"/home"} className="btn primary w-full">
          Back
        </Link>
        <button
          className="bg-text text-bg rounded-xl w-full py-2 border-none font-medium text-sm text-center"
          onClick={() => {
            browserTabsCreate({
              active: true,
              url: `https://explorer.tidecoin.org/tx/${txId}`,
            });
          }}
        >
          Explorer
        </button>
      </div>
    </div>
  );
};

export default FinalleSend;
