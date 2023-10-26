import { FC, useEffect, useId } from "react";
import s from "./styles.module.scss";
import cn from "classnames";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

interface Props {
  handler: (name: string) => void;
  title?: string;
  oldName?: string;
}

const Rename: FC<Props> = ({ handler, title }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string }>({
    defaultValues: {
      name: "",
    },
  });
  const renameId = useId();

  const onRename = ({ name }: { name: string }) => {
    handler(name.trim());
  };

  useEffect(() => {
    toast.error(errors.name.message);
  }, [errors]);

  return (
    <form className={cn(s.form, "form")} onSubmit={handleSubmit(onRename)}>
      <p className={cn(s.formTitle, "form-title")}>{title !== undefined ? title : "Enter new name"}</p>
      <div className="form-field">
        <label htmlFor={renameId} className="input-span">
          {title}
        </label>
        <input
          id={renameId}
          className="input"
          {...register("name", {
            minLength: 2,
            maxLength: 16,
            required: true,
          })}
        />
      </div>
      <button className="btn primary">Enter</button>
    </form>
  );
};

export default Rename;
