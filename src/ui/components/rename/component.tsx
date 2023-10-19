import { useState } from "react";
import s from "./styles.module.scss";
import cn from "classnames";
import toast from "react-hot-toast";

const Rename = (props: {
  handler: (name: string) => void;
  title?: string;
  oldName?: string;
  otherNames?: string[];
}) => {
  const [name, setName] = useState(props.oldName ?? "");

  const rename = () => {
    if (name.trim().length > 10) toast.error("Maximum length is 8");
    else if (name.trim().length <= 0) toast.error("Minimum length is 1");
    else if (props.otherNames !== undefined && props.otherNames.length > 0 && props.otherNames.includes(name.trim()))
      toast.error("This name is already taken");
    else props.handler(name.trim());
  };

  return (
    <form className={cn(s.form, "form")} onSubmit={(e) => e.preventDefault()}>
      <p className={cn(s.formTitle, "form-title")}>{props.title !== undefined ? props.title : "Enter new name"}</p>
      <div className="form-field">
        <span className="input-span">{props.title}</span>
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
      <button className="btn primary" onClick={rename}>
        Enter
      </button>
    </form>
  );
};

export default Rename;
