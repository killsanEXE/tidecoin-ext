import { FC, useId } from "react";
import s from "./styles.module.scss";
import { useAppState } from "@/ui/states/appState";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

interface Props {
  handler: (password?: string) => void;
}

interface FormType {
  password: string;
}

const CheckPassword: FC<Props> = ({ handler }) => {
  const { appPassword } = useAppState((v) => ({ appPassword: v.password }));

  const pwdId = useId();

  const { register, handleSubmit } = useForm<FormType>();

  const checkPassword = ({ password }: FormType) => {
    if (password !== appPassword) return toast.error("Incorrect password");
    handler(password);
  };

  return (
    <form className={s.form} onSubmit={handleSubmit(checkPassword)}>
      <label htmlFor={pwdId} className={s.formTitle}>
        Password
      </label>
      <input id={pwdId} type="password" className="input" {...register("password")} />
      <button className="btn primary" type="submit">
        Enter
      </button>
    </form>
  );
};

export default CheckPassword;
