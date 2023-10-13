import { FieldValues, Path, UseFormRegister } from "react-hook-form";

const PasswordInput = <T extends FieldValues>({
  label,
  name,
  register,
}: {
  register: UseFormRegister<T>;
  name: Path<T>;
  label: string;
}) => {
  return (
    <div className="form-field">
      <label className="input-span" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        {...register(name, {
          minLength: 6,
          required: true,
        })}
        type="password"
        className="input"
      />
    </div>
  );
};

export default PasswordInput;
