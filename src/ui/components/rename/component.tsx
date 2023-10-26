import { FC, useState } from "react";
import s from "./styles.module.scss";
import cn from "classnames";
import toast from "react-hot-toast";

interface Props {
  handler: (name: string) => void;
  title?: string;
  oldName?: string;
  otherNames?: string[];
}

const Rename: FC<Props> = ({ handler, oldName, otherNames, title }) => {
  const [name, setName] = useState(oldName ?? "");

  const onRename = () => {
    if (name.trim().length > 10) toast.error("Maximum length is 8");
    else if (name.trim().length <= 0) toast.error("Minimum length is 1");
    else if (otherNames !== undefined && otherNames.length > 0 && otherNames.includes(name.trim()))
      toast.error("This name is already taken");
    else handler(name.trim());
  };

  return (
    <form className={cn(s.form, "form")} onSubmit={(e) => e.preventDefault()}>
      <p className={cn(s.formTitle, "form-title")}>{title !== undefined ? title : "Enter new name"}</p>
      <div className="form-field">
        <span className="input-span">{title}</span>
        <input
          type="text"
          className="input"
          onChange={(e) => {
            setName(e.target.value);
          }}
          max="8"
          value={name}
        />
      </div>
      <button className="btn primary" onClick={onRename}>
        Enter
      </button>
    </form>
  );
};

export default Rename;
