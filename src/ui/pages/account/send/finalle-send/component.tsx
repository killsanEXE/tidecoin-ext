import { browserTabsCreate } from "@/shared/utils/browser";
import { Link, useParams } from "react-router-dom";
import { CheckIcon } from "@heroicons/react/24/solid";

import s from "./styles.module.scss";

const FinalleSend = () => {
  const { txId } = useParams();

  const onClick = () => {
    browserTabsCreate({
      active: true,
      url: `https://explorer.tidecoin.org/tx/${txId}`,
    });
  };

  return (
    <div className={s.container}>
      <div className={s.resultContainer}>
        <div className={s.resultIconContainer}>
          <CheckIcon className={s.resultIcon} />
        </div>
        <h3 className={s.result}>Success</h3>
      </div>

      <div className={s.btnContainer}>
        <Link to={"/home"} className="btn primary w-full">
          Back
        </Link>
        <button className={s.btn} onClick={onClick}>
          Explorer
        </button>
      </div>
    </div>
  );
};

export default FinalleSend;
