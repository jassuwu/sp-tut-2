import { useForm } from "../../context/FormContext";
import DatePicker from "react-date-picker";
import { useState } from "react";
import { useEffect } from "react";

export const TextField = ({ label, name, onChange }) => {
  const { formData, updateFormData } = useForm();
  const { value, error } = formData["body"][name];

  return (
    <div className="mb-4">
      <h1 className="text-primary text-3xl mb-2">{label}</h1>
      <input
        type="text"
        className="text-2xl underline text-secondary border border-primary rounded-md px-2 py-2 mb-2"
        value={value}
        onChange={(e) => {
          if (onChange) onChange(e.target.value);
          updateFormData(name, e.target.value);
        }}
      />
      {error && <p className="text-red-400 text-sm mt-1">*{error}</p>}
    </div>
  );
};

export const NumberField = ({ label, name, onChange }) => {
  const { formData, updateFormData } = useForm();
  const { value, error } = formData["body"][name];

  return (
    <div className="mb-4">
      <h1 className="text-primary text-3xl mb-2">{label}</h1>
      <input
        type="number"
        className={`text-2xl underline text-secondary border ${error ? "border-red-400" : "border-primary"
          } rounded-md px-2 py-2 mb-2`}
        value={value}
        onChange={(e) => {
          if (onChange) onChange(parseInt(e.target.value));
          updateFormData(name, parseInt(e.target.value));
        }}
      />
      {error && <p className="text-red-400 text-sm mt-1">*{error}</p>}
    </div>
  );
};

export const ToggleField = ({ label, name, choice1, choice2, onChange }) => {
  const { formData, updateFormData } = useForm();
  const { value, error } = formData["body"][name];

  const [checked, setChecked] = useState(value !== choice1);

  useEffect(() => {
    if (onChange) onChange(checked ? choice2 : choice1);
    updateFormData(name, checked ? choice2 : choice1);
  }, [checked, choice1, choice2, onChange, updateFormData, name]);

  return (
    <div className="mb-4 cursor-pointer">
      <h1 className="text-primary text-3xl mb-4">{label}</h1>
      <div className="flex flex-row space-x-3 items-center">
        <p>{choice1}</p>
        <div
          onClick={(e) => {
            setChecked(!checked);
          }}
          class="relative"
        >
          <div
            class={`box ${checked ? "bg-secondary" : "bg-primary"
              } block h-8 w-14 rounded-full`}
          ></div>
          <div
            class={`${checked && "translate-x-[100%]"
              } dot absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition`}
          ></div>
        </div>
        <p>{choice2}</p>
      </div>
      {error && <p className="text-red-400 text-sm mt-1">*{error}</p>}
    </div>
  );
};

export const DateTimeField = ({ label, name, onChange }) => {
  const { formData, updateFormData } = useForm();
  const { value, error } = formData["body"][name];

  return (
    <div className="mb-4">
      <h1 className="text-primary text-3xl mb-2">{label}</h1>
      <DatePicker
        value={
          value ? (!isNaN(new Date(value)) ? new Date(value) : null) : value
        }
        onChange={(v) => {
          if (!v) {
            if (onChange) onChange(v);
            updateFormData(name, v);
          } else {
            if (onChange) onChange(v.toISOString());
            updateFormData(name, v.toISOString());
          }
        }}
      />
      {error && <p className="text-red-400 text-sm mt-1">*{error}</p>}
    </div>
  );
};

export const Submit = ({ label }) => {
  const { validateAndSubmit } = useForm();

  return (
    <button
      onClick={(e) => {
        validateAndSubmit();
      }}
      className="bg-primary px-4 py-2 rounded-md text-white"
    >
      {label}
    </button>
  );
};
