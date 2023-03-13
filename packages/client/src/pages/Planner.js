import { useEffect, useState } from "react";
import { IoAddCircle } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import {
  DateTimeField,
  NumberField,
  Submit,
  TextField,
} from "../components/form";
import Modal from "../components/Modal";
import PlannerTile from "../components/PlannerTile";
import FormProvider from "../context/FormContext";
import Api from "../utils/Api";
import {
  PLANNER_ALL_CREATE,
} from "../utils/Endpoints";

const Planner = () => {
  const navigate = useNavigate();
  let { year } = useParams();
  const [showModal, setShowModal] = useState(false);

  const initialCreateFormData = {
    body: {
      name: {
        value: "",
        error: "",
      },
      startDate: {
        value: new Date().toISOString(),
        error: "",
      },
      totalWorkingDays: {
        value: 0,
        error: "",
      },
    },
    errors: [],
  };

  const [createFormData, setCreateFormData] = useState({
    ...initialCreateFormData,
  });


  const createPlanner = async (body) => {
    try {
      // console.log(body);
      await Api.post(PLANNER_ALL_CREATE.replace(":year", year), {
        ...body,
      });
      setShowModal(false);
      return null;
    } catch (err) {
      const errors = err.response.data.errors;
      return errors;
    }
  };

  const [planners, setPlanners] = useState([]);

  useEffect(() => {
    const getAllPlanners = async () => {
      const result = await Api.get(PLANNER_ALL_CREATE.replace(":year", year));
      return result.data;
    };
    (async () => {
      const data = await getAllPlanners();
      setPlanners(data);
    })();
  }, [showModal, year]);

  return (
    <div className="p-6">
      <div className="mb-8 w-full flex flex-row justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-primary mb-2">
            <span className="text-secondary">{year}</span> Planners
          </h1>
          <h2 className="text-gray-500">Select a planner</h2>
        </div>
        <div className="flex flex-row space-x-4">
          <div className="flex flex-col justify-center">
            <button
              onClick={(e) => {
                navigate(`/calendar/${year}/holidays`);
              }}
              className="group text-2xl transition-all"
            >
              <p className="text-primary group-hover:text-secondary">
                Holidays
              </p>
            </button>
          </div>
          <div className="flex flex-col justify-center">
            <button
              onClick={(e) => {
                setShowModal(true);
              }}
              className="group text-4xl hover:scale-[101%] transition-all"
            >
              <IoAddCircle className="text-primary group-hover:text-secondary"></IoAddCircle>
            </button>
          </div>
        </div>
      </div>
      <div className="px-10 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
        {planners.map((planner) => (
          <PlannerTile {...planner} />
        ))}
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
            onSubmit={createPlanner}
          >
            <TextField label="Name" name="name" />
            <DateTimeField label="Start Date" name="startDate" />
            <NumberField label="Total Working days" name="totalWorkingDays" />
            {createFormData.errors && createFormData.errors.length > 0 && (
              <div className="text-sm text-red-500 my-4">
                {createFormData.errors.map((msg, index) => {
                  return <p key={index}>*{msg}</p>;
                })}
              </div>
            )}
            <Submit label="Create" />
          </FormProvider>
        </Modal>
      )}
    </div>
  );
};

export default Planner;
