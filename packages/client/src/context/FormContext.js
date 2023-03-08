import { createContext, useContext } from "react";

const FormContext = createContext();

export const useForm = () => useContext(FormContext);

/*
{
  email: {
    value: "snjdfjjfjs",
    error: "",
    validation: (value) => {}
  }
}
*/

const FormProvider = ({
  initialData,
  formData,
  setFormData,
  onSubmit,
  children,
}) => {
  // const [formData, setFormData] = formState;

  const updateFormData = (name, updatedValue) => {
    // if (updatedValue) {
    const newFormData = { ...formData };
    newFormData["body"][name] = {
      ...formData["body"][name],
      value: updatedValue,
    };
    setFormData(newFormData);
    // }
  };

  const formatErrors = (errors) => {
    for (const [key, error] of Object.entries(errors)) {
      console.log(error);
      if (formData["body"][key]) {
        const newFormData = { ...formData };
        newFormData["body"][key] = {
          ...formData["body"][key],
          error,
        };
        console.log(newFormData);
        setFormData(newFormData);
      }
    }
  };

  const removeAllErrors = () => {
    for (const [key, value] of Object.entries(formData["body"])) {
      const newFormData = { ...formData };
      newFormData["body"][key] = {
        ...value,
        error: "",
      };
      setFormData(newFormData);
    }
    setFormData({ ...formData, errors: [] });
  };

  const validateAndSubmit = async () => {
    removeAllErrors();

    const data = {};
    for (const [key, fieldState] of Object.entries(formData["body"])) {
      const { value } = fieldState;
      data[key] = value;
    }

    const errors = await onSubmit(data);
    if (errors) {
      const formattedErrors = { body: {}, global: [] };
      const bodyErrors = errors.filter((v) => v.location === "body");
      const globalErrors = errors.filter((v) => v.location === "global");
      for (const error of bodyErrors) {
        formattedErrors["body"][error.param] = error.msg;
      }
      for (const error of globalErrors) {
        formattedErrors["global"] = [...formattedErrors["global"], error.msg];
      }
      formatErrors(formattedErrors.body);
      setFormData({ ...formData, errors: formattedErrors.global });
    } else {
      setFormData({ ...initialData });
    }
  };

  return (
    <FormContext.Provider
      value={{ formData, updateFormData, validateAndSubmit }}
    >
      {children}
    </FormContext.Provider>
  );
};

export default FormProvider;
