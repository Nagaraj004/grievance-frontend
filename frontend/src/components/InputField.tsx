import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface BaseProps {
  label: string;
  error?: string;
  required?: boolean;
}

type InputProps = BaseProps &
  InputHTMLAttributes<HTMLInputElement> & { as?: "input" };
type TextareaProps = BaseProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & { as: "textarea" };

type Props = InputProps | TextareaProps;

const InputField = (props: Props) => {
  const { label, error, required, as = "input", ...rest } = props;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-primary-dark ml-1">*</span>}
      </label>
      {as === "textarea" ? (
        <textarea
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          className={`input-field resize-none ${error ? "border-primary-dark focus:border-primary-dark" : ""} ${rest.className ?? ""}`}
        />
      ) : (
        <input
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
          className={`input-field ${error ? "border-primary-dark focus:border-primary-dark" : ""} ${rest.className ?? ""}`}
        />
      )}
      {error && (
        <p className="text-primary-dark text-xs font-medium">{error}</p>
      )}
    </div>
  );
};

export default InputField;
