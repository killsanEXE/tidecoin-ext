import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { FC, HTMLAttributes } from "react";
import s from "./styles.module.scss";
import toast from "react-hot-toast";

interface Props extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  value?: string;
  className?: string;
  title?: string;
}

const CopyBtn: FC<Props> = ({ label, value, className, ...props }) => {
  return (
    <button
      className={className ? className : s.btn}
      onClick={async () => {
        if (!value) return;
        await navigator.clipboard.writeText(value);
        toast.success("Copied");
      }}
    >
      {label && <div {...props}>{label}</div>}

      <DocumentDuplicateIcon className="w-4 h-4" />
    </button>
  );
};

export default CopyBtn;
