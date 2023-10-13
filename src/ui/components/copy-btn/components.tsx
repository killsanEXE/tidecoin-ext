import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { FC } from "react";
import toast from "react-hot-toast";

interface Props {
  label?: string;
  value?: string;
  className?: string;
}

const CopyBtn: FC<Props> = ({ label, value, className }) => {
  return (
    <button
      className={className ? className : "btn primary"}
      onClick={async () => {
        if (!value) return;
        await navigator.clipboard.writeText(value);
        toast.success("Copied");
      }}
    >
      <DocumentDuplicateIcon className="w-5 h-5" />
      {label && <div>{label}</div>}
    </button>
  );
};

export default CopyBtn;
