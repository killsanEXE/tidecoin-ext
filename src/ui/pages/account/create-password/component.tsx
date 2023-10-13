import { useAppState } from "@/ui/states/appState";
import PasswordInput from "@/ui/components/password-input";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface FormType {
  password: string;
  confirmPassword: string;
}

const formFields: { name: keyof FormType; label: string }[] = [
  {
    label: "Password",
    name: "password",
  },
  {
    label: "Confirm password",
    name: "confirmPassword",
  },
];

const CreatePassword = () => {
  const { register, handleSubmit } = useForm<FormType>({
    defaultValues: {
      confirmPassword: "",
      password: "",
    },
  });
  const { updateAppState } = useAppState((v) => ({
    updateAppState: v.updateAppState,
  }));

  const createPassword = async ({ confirmPassword, password }: FormType) => {
    if (password === confirmPassword) {
      await updateAppState({ password: password, isUnlocked: true });
    } else {
      toast.error("Passwords dismatches");
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit(createPassword)}>
      <p className="form-title">Create new password</p>
      {formFields.map((i) => (
        <PasswordInput key={i.name} register={register} {...i} />
      ))}

      <button className="btn primary" type="submit">
        Create password
      </button>
    </form>
  );
};

export default CreatePassword;
