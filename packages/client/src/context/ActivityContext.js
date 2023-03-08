import { createContext, useContext, useEffect, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import DatePicker from "react-date-picker";
import { IoAddCircle } from "react-icons/io5";
import { useParams } from "react-router-dom";
import {
  DateTimeField,
  NumberField,
  Submit,
  TextField,
  ToggleField,
} from "../components/form";
import Modal from "../components/Modal";
import Api from "../utils/Api";
import {
  ACTIVITY_ALL_CREATE,
  ACTIVITY_ONE_UPDATE_DELETE,
  ACTIVITY_UPDATE_ORDER,
} from "../utils/Endpoints";
import FormProvider from "./FormContext";

const ActivityContext = createContext();

export const useActivity = () => useContext(ActivityContext);

const ActivitiesProvider = ({ value, setValue, children }) => {
  let { year, id } = useParams();

  const initialCreateFormData = {
    body: {
      name: {
        value: "",
        error: "",
      },
      type: {
        value: "RELATIVE",
        error: "",
      },
      relativeDays: {
        value: 0,
        error: "",
      },
      relativeDate: {
        value: new Date(),
        error: "",
      },
    },
    errors: [],
  };

  const [activityCreateForm, setActivityCreateForm] = useState({
    ...initialCreateFormData,
  });

  const [showModal, setShowModal] = useState(false);

  const [typeState, setTypeState] = useState("ABSOLUTE");

  const updateOrder = async (data) => {
    try {
      const result = await Api.post(
        ACTIVITY_UPDATE_ORDER.replace(":year", year).replace(":id", id),
        { ...data }
      );
      console.log(result);
      setValue(result.data);
    } catch (err) {
      console.log(err);
    }
  };

  // const accumulateDaysLeft = (days) => {};

  const createActivity = async (data) => {
    try {
      const result = await Api.post(
        ACTIVITY_ALL_CREATE.replace(":year", year).replace(":id", id),
        { ...data }
      );
      setValue([...value, result.data]);
      setShowModal(false);
      return null;
    } catch (err) {
      const errors = err.response.data.errors;
      return errors;
    }
  };

  const updateActivity = async (activity_id, data) => {
    try {
      const result = await Api.put(
        ACTIVITY_ONE_UPDATE_DELETE.replace(":year", year)
          .replace(":id", id)
          .replace(":activity_id", activity_id),
        { ...data }
      );
      setValue(result.data);
    } catch (err) {
      const errors = err.response.data.errors;
      return null;
    }
  };

  const deleteActivity = async (activity_id) => {
    try {
      const result = await Api.delete(
        ACTIVITY_ONE_UPDATE_DELETE.replace(":year", year)
          .replace(":id", id)
          .replace(":activity_id", activity_id)
      );
      setValue(result.data);
    } catch (err) {
      const errors = err.response.data.errors;
      return null;
    }
  };

  const handleReorder = (result) => {
    if (!result.destination) return;
    const items = value.map((v) => v);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    updateOrder({ orders: items.map((v) => v.id) });
  };

  return (
    <>
      <ActivityContext.Provider value={{ updateActivity, deleteActivity }}>
        <table className="table-fixed w-full">
          <thead className="bg-secondary text-white border-secondary border-t-2 border-x-2">
            <tr>
              <th className="py-3">ACTIVITY NAME</th>
              <th className="py-3">TYPE</th>
              <th className="py-3">DAYS/DATE</th>
              <th className="py-3">CALCULATED DATE</th>
              <th className="py-3">ACTIONS</th>
              <th className="py-3">DAYS LEFT</th>
            </tr>
          </thead>
          <DragDropContext onDragEnd={handleReorder}>
            <Droppable droppableId="activities">
              {(provided) => (
                <tbody
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="text-center"
                >
                  {children}
                  {provided.placeholder}
                </tbody>
              )}
            </Droppable>
          </DragDropContext>
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
              formData={activityCreateForm}
              setFormData={setActivityCreateForm}
              onSubmit={createActivity}
            >
              <TextField label="Name" name="name" />
              <ToggleField
                label="Type"
                name="type"
                onChange={setTypeState}
                choice1="RELATIVE"
                choice2="ABSOLUTE"
              />
              {typeState === "RELATIVE" ? (
                <NumberField label="Relative Days" name="relativeDays" />
              ) : (
                <DateTimeField label="Relative Date" name="relativeDate" />
              )}
              {activityCreateForm.errors &&
                activityCreateForm.errors.length > 0 && (
                  <div className="text-sm text-red-500 my-4">
                    {activityCreateForm.errors.map((msg, index) => {
                      return <p key={index}>*{msg}</p>;
                    })}
                  </div>
                )}
              <Submit label="Create" />
            </FormProvider>
          </Modal>
        )}
      </ActivityContext.Provider>
    </>
  );
};

export default ActivitiesProvider;
