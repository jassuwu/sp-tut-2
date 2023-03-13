import { createContext, useContext, useState } from "react";
import { IoAddCircle } from "react-icons/io5";
import {
  DateTimeField,
  Submit,
  TextField,
} from "../components/form";
import Modal from "../components/Modal";
import FormProvider from "./FormContext";

const HolidaysContext = createContext();

export const useHolidays = () => useContext(HolidaysContext);

export const holidaysReducer = (state, action) => {
  if (action.type === "CREATE") {
    return [...state, action.data];
  } else if (action.type === "UPDATE") {
    return state.map((value, index) => {
      if (index === action.index) {
        return { ...value, ...action.data };
      } else {
        return value;
      }
    });
  } else if (action.type === "DELETE") {
    return state.filter((value, index) => index !== action.index);
  }
};

const HolidaysProvider = ({ value, setValue, children }) => {
  const initialCreateFormData = {
    body: {
      name: {
        value: "",
        error: "",
      },
      date: {
        value: new Date().toISOString(),
        error: "",
      },
    },
    errors: [],
  };

  const [createFormData, setCreateFormData] = useState({
    ...initialCreateFormData,
  });

  const [showModal, setShowModal] = useState(false);

  const handleHolidaysAction = (action) => {
    setValue(holidaysReducer(value, action));
  };

  const addHoliday = (data) => {
    handleHolidaysAction({ type: "CREATE", data: data });
    setShowModal(false);
  };

  return (
    <>
      <HolidaysContext.Provider value={{ handleHolidaysAction }}>
        <table className="table-fixed w-full">
          <thead className="bg-secondary text-white border-secondary border-t-2 border-x-2">
            <tr>
              <th className="py-3">NAME</th>
              <th className="py-3">DATE</th>
              <th className="py-3">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="text-center">{children}</tbody>
        </table>
        <div className="w-full flex flex-row justify-center py-2 bg-primary/30">
          <button
            onClick={(e) => {
              setShowModal(true);
            }}
            className="text-primary hover:text-secondary text-2xl"
          >
            <IoAddCircle></IoAddCircle>
          </button>
        </div>
        {showModal && (
          <Modal
            onClose={() => {
              setShowModal(false);
            }}
          >
            <FormProvider
              initialData={initialCreateFormData}
              formData={createFormData}
              setFormData={setCreateFormData}
              onSubmit={addHoliday}
            >
              <TextField label="Name" name="name" />
              <DateTimeField label="Date" name="date" />
              <Submit label="Create" />
            </FormProvider>
          </Modal>
        )}
      </HolidaysContext.Provider>
    </>
  );
};

export default HolidaysProvider;