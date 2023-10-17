import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { FC, HTMLAttributes } from "react";
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
      className={className ? className : "btn primary"}
      onClick={async () => {
        if (!value) return;
        await navigator.clipboard.writeText(value);
        toast.success("Copied");
      }}
    >
      <DocumentDuplicateIcon className="w-5 h-5" />
      {label && <div {...props}>{label}</div>}
    </button>
  );
};

export default CopyBtn;
