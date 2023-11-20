import { t } from "i18next";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";

const PasswordInput = <T extends FieldValues>({
  label,
  name,
  register,
  showSeparateLabel = true
}: {
  register: UseFormRegister<T>;
  name: Path<T>;
  label: string;
  showSeparateLabel?: boolean
}) => {
  return (
    <div className="form-field">
      {showSeparateLabel &&
        <label className="input-span" htmlFor={name}>
          {label}
        </label>
      }
      <input
        id={name}
        {...register(name, {
          minLength: {
            value: 1,
            message: t("components.password_input.should_be_more_than_1_symbol"),
          },
          required: true,
        })}
        type="password"
        className="input"
        placeholder={showSeparateLabel ? "" : label}
      />
    </div>
  );
};

export default PasswordInput;
