import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { AiFillCheckCircle, AiOutlineEdit } from "react-icons/ai";
import DatePicker from "react-date-picker";
import Api from "../utils/Api";
import {
  ACTIVITY_UPDATE_ORDER,
  PLANNER_ONE_UPDATE_DELETE,
} from "../utils/Endpoints";
import Modal from "../components/Modal";
import ActivityTile from "../components/ActivityTile";
import ActivityReOrder from "../components/ActivityReOrder";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import FormProvider from "../context/FormContext";
import {
  DateTimeField,
  NumberField,
  Submit,
  TextField,
} from "../components/form";
import ActivitiesProvider from "../context/ActivityContext";

const Activities = () => {
  let { year, id } = useParams();

  const [name, setName] = useState("");
  const [activities, setActivities] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [lastDate, setLastDate] = useState(new Date());
  const [totalWorkingDays, setTotalWorkingDays] = useState(0);
  const [remainingDays, setRemainingDays] = useState(0);

  const [showModal, setShowModal] = useState(false);

  const buildInitialUpdateFormData = (year) => {
    return {
      body: {
        name: {
          value: name,
          error: "",
        },
        startDate: {
          value: startDate.toISOString(),
          error: "",
        },
        totalWorkingDays: {
          value: totalWorkingDays,
          error: "",
        },
      },
      errors: [],
    };
  };

  const [updateFormData, setUpdateFormData] = useState(
    buildInitialUpdateFormData(new Date().getFullYear())
  );

  const fetchPlanner = async () => {
    const result = await Api.get(
      PLANNER_ONE_UPDATE_DELETE.replace(":year", year).replace(":id", id)
    );
    const data = result.data;
    console.log(data);
    setName(data.name);
    setActivities(data.activities);
    setTotalWorkingDays(data.totalWorkingDays);
    setStartDate(new Date(data.startDate));
    setLastDate(new Date(data.lastDate));
    setRemainingDays(data.remainingDays);
  };

  const updatePlanner = async (data) => {
    try {
      const result = await Api.put(
        PLANNER_ONE_UPDATE_DELETE.replace(":year", year).replace(":id", id),
        { ...data }
      );
      setShowModal(false);
      return null;
    } catch (err) {
      return err.response.data.errors;
    }
  };

  useEffect(() => {
    setUpdateFormData(buildInitialUpdateFormData());
    fetchPlanner();
  }, [showModal]);

  return (
    <div className="p-6">
      <div className="mb-8 w-full flex flex-row justify-between px-4">
        <div>
          <div className="mb-3 flex flex-row space-x-4">
            <h1 className="text-3xl font-semibold text-primary">
              <span className="text-secondary">{year}</span> Calendar
            </h1>
            <button
              onClick={(e) => {
                setShowModal(true);
              }}
              className="text-2xl text-secondary"
            >
              <AiOutlineEdit />
            </button>
          </div>
          <h1 className="text-3xl font-semibold text-primary">{name}</h1>
        </div>
        <div className="flex flex-row space-x-10">
          <div className="text-center">
            <h1 className="font-pragati text-4xl text-gray-500 mb-2">
              Total Working days
            </h1>
            <h2 className="text-2xl text-primary">{totalWorkingDays}</h2>
          </div>
          <div className="text-center">
            <h1 className="font-pragati text-4xl text-gray-500 mb-2">
              Start date
            </h1>
            <h2 className="text-2xl text-primary">
              {startDate.toDateString()}
            </h2>
          </div>
        </div>
      </div>
      <div className="flex flex-row">
        <div className="flex-1">
          <ActivitiesProvider value={activities} setValue={setActivities}>
            {activities.map((activity, index) => (
              <Draggable key={index} draggableId={`${index}`} index={index}>
                {(provided) => (
                  <tr
                    className="border-2 border-primary whitespace-pre-wrap"
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                  >
                    <ActivityTile key={index} {...activity} />
                  </tr>
                )}
              </Draggable>
            ))}
          </ActivitiesProvider>
        </div>
        {/* <div className="flex-1">
          <table className="table-fixed w-full">
            <thead className="bg-black text-white border-black border-t-2 border-x-2">
              <tr>
                <th className="py-3">Days Left</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {activities.map((activity, index) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const diffInTime = new Date(activity.date).getTime() - today;
                const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));

                if (diffInTime < 0) {
                  return (
                    <tr className="border-2 border-black border-l-0">
                      <th className="px-6 py-4">COMPLETED</th>
                    </tr>
                  );
                }

                return (
                  <tr className="border-2 border-black border-l-0">
                    <th className="px-6 py-4">{diffInDays} days</th>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div> */}
      </div>
      <div className="mt-8 w-full flex flex-row justify-between px-4">
        <div className="flex-1"></div>
        <div className="flex flex-row space-x-10">
          <div className="text-center">
            <h1 className="font-pragati text-4xl text-gray-500 mb-2">
              Remaining Working days
            </h1>
            <h2 className="text-2xl text-primary">{remainingDays}</h2>
          </div>
          <div className="text-center">
            <h1 className="font-pragati text-4xl text-gray-500 mb-2">
              Last date
            </h1>
            <h2 className="text-2xl text-primary">{lastDate.toDateString()}</h2>
          </div>
        </div>
      </div>
      {showModal && (
        <Modal
          onClose={() => {
            setShowModal(false);
          }}
        >
          <FormProvider
            initialData={buildInitialUpdateFormData()}
            formData={updateFormData}
            setFormData={setUpdateFormData}
            onSubmit={updatePlanner}
          >
            <TextField label="Name" name="name" />
            <DateTimeField label="Start Date" name="startDate" />
            <NumberField label="Total Working days" name="totalWorkingDays" />
            {updateFormData.errors && updateFormData.errors.length > 0 && (
              <div className="text-sm text-red-500 my-4">
                {updateFormData.errors.map((msg, index) => {
                  return <p key={index}>*{msg}</p>;
                })}
              </div>
            )}
            <Submit label="Update" />
          </FormProvider>
        </Modal>
      )}
    </div>
  );
};

export default Activities;
