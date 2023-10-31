import { FC, useId } from "react";
import s from "./styles.module.scss";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import Modal from "../modal";

interface Props {
  handler: (name: string) => void;
  active: boolean;
  onClose: () => void;
}

const Rename: FC<Props> = ({ handler, active, onClose }) => {
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

  const onSubmit = () => {
    if (errors.name) {
      toast.error(errors.name.message);
    }
  };

  return (
    <Modal open={active} onClose={onClose} title="Renaming">
      <form className={s.form} onSubmit={handleSubmit(onRename)}>
        <div>
          <label htmlFor={renameId} className={s.label}>
            Enter new name
          </label>
          <input
            id={renameId}
            className="input w-full"
            {...register("name", {
              minLength: {
                value: 1,
                message: "Minimum length is 1",
              },
              maxLength: {
                value: 16,
                message: "Maximum length is 16",
              },
              required: "Name is required",
            })}
          />
        </div>
        <button className="btn primary mx-auto w-2/3" onClick={onSubmit}>
          Save
        </button>
      </form>
    </Modal>
  );
};

export default Rename;
