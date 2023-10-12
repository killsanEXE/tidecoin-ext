import s from "./styles.module.scss";
import { XMarkIcon } from "@heroicons/react/24/outline";
import cn from "classnames";

const Popup = (props: {
  handler: (answer: boolean) => void;
  question: string;
}) => {
  return (
    <div className={s.popup}>
      <div className={s.popupHeader}>
        <div
          className={s.crossIcon}
          onClick={() => {
            props.handler(false);
          }}
        >
          <XMarkIcon className="w-8 h-8" />
        </div>
      </div>
      <div className={s.popupContent}>
        <p className={s.question}>{props.question}</p>
        <div className={s.answers}>
          <button
            className={cn("btn", s.yesBtn)}
            onClick={() => {
              props.handler(true);
            }}
          >
            Yes
          </button>
          <button
            className={cn("btn", s.noBtn)}
            onClick={() => {
              props.handler(false);
            }}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
