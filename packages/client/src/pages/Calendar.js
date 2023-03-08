import CalendarTile from "../components/CalendarTile";
import { IoAddCircle } from "react-icons/io5";
import { useEffect, useMemo, useState } from "react";
import Api from "../utils/Api";
import { CALENDAR_ALL_CREATE } from "../utils/Endpoints";
import Modal from "../components/Modal";
import { NumberField, Submit } from "../components/form";
import FormProvider from "../context/FormContext";

const Calendar = () => {
  const [showModal, setShowModal] = useState(false);
  const [calendars, setCalendars] = useState([]);

  const buildInitialCreateFormData = (year) => {
    return {
      body: {
        year: {
          value: new Date().getFullYear(),
          error: "",
        },
      },
      errors: [],
    };
  };

  const [createFormData, setCreateFormData] = useState(
    buildInitialCreateFormData(new Date().getFullYear())
  );

  const getAllCalendars = async () => {
    const result = await Api.get(CALENDAR_ALL_CREATE);
    return result.data;
  };

  const createCalendar = async (body) => {
    try {
      const result = await Api.post(CALENDAR_ALL_CREATE, {
        ...body,
        holidays: [],
      });
      setShowModal(false);
      return null;
    } catch (err) {
      const errors = err.response.data.errors;
      return errors;
    }
  };

  useEffect(() => {
    (async () => {
      const data = await getAllCalendars();
      setCalendars(data);
      setCreateFormData(buildInitialCreateFormData(new Date().getFullYear()));
    })();
  }, [showModal]);

  return (
    <>
      <div className="p-6 flex-1 relative">
        <div className="mb-8 w-full flex flex-row justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-primary mb-2">
              <span className="text-secondary">Year</span> Calendar
            </h1>
            <h2 className="text-gray-500">Select a calendar</h2>
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
        <div className="px-10 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
          {calendars.map((calendar, index) => (
            <CalendarTile key={index} {...calendar} />
          ))}
        </div>
        {showModal && (
          <Modal
            onClose={() => {
              setShowModal(false);
            }}
          >
            <FormProvider
              initialData={buildInitialCreateFormData(new Date().getFullYear())}
              formData={createFormData}
              setFormData={setCreateFormData}
              onSubmit={createCalendar}
            >
              <NumberField label="Year" name="year" />
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
    </>
  );
};

export default Calendar;
