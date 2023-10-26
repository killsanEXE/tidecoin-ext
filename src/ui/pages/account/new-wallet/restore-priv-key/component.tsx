import PasswordInput from "@/ui/components/password-input";
import { useCreateNewWallet } from "@/ui/hooks/wallet";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface FormType {
  privKey: string;
}

const RestorePrivKey = () => {
  const { register, handleSubmit } = useForm<FormType>({
    defaultValues: {
      privKey: "",
    },
  });

  const createNewWallet = useCreateNewWallet();
  const navigate = useNavigate();

  const recoverWallet = async ({ privKey }: FormType) => {
    await createNewWallet(privKey, "simple");
    navigate("/home");
  };

  return (
    <form className="form" onSubmit={handleSubmit(recoverWallet)}>
      <PasswordInput label="Private key" register={register} name="privKey" />
      <button className="btn primary" type="submit">
        Recover
      </button>
    </form>
  );
};

export default RestorePrivKey;
