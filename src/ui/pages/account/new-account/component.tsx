import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCreateNewAccount } from "@/ui/hooks/wallet";
import { useGetCurrentWallet } from "@/ui/states/walletState";
import { useForm } from "react-hook-form";

interface FormType {
  name: string;
}

const NewAccount = () => {
  const { register, handleSubmit } = useForm<FormType>({
    defaultValues: {
      name: "",
    },
  });
  const navigate = useNavigate();

  const createNewAccount = useCreateNewAccount();
  const currentWallet = useGetCurrentWallet();

  const nameAlreadyExists = (name: string) => {
    return currentWallet?.accounts.find((f) => f.name?.trim() === name.trim()) !== undefined;
  };

  const createNewAcc = async ({ name }: FormType) => {
    if (name.length > 16) return toast.error("Maximum name length is 16");
    if (nameAlreadyExists(name)) return toast.error("Name for this account is already taken");

    await createNewAccount(name);
    toast.success("Created new account");
    navigate("/home");
  };

  return (
    <form className="form" onSubmit={handleSubmit(createNewAcc)}>
      <p className="form-title">Enter the name:</p>
      <input
        type="text"
        className="input"
        {...register("name", {
          maxLength: 14,
        })}
      />
      <button className="btn primary" type="submit">
        Create an account
      </button>
    </form>
  );
};

export default NewAccount;
