import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HolidaysTile from "../components/HolidaysTile";
import HolidaysProvider from "../context/HolidaysContext";
import Api from "../utils/Api";
import { CALENDAR_ONE_UPDATE_DELETE } from "../utils/Endpoints";

const Holidays = () => {
  const { year } = useParams();

  const [holidays, setHolidays] = useState([]);

  const fetchHolidays = async () => {
    try {
      const result = await Api.get(
        CALENDAR_ONE_UPDATE_DELETE.replace(":year", year)
      );
      setHolidays(result.data.holidays);
    } catch (err) {
      console.log(err);
    }
  };

  const updateHolidays = async () => {
    try {
      const result = await Api.put(
        CALENDAR_ONE_UPDATE_DELETE.replace(":year", year),
        {
          holidays,
        }
      );
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (holidays.length > 0) {
      updateHolidays();
    }
  }, [holidays]);

  useEffect(() => {
    fetchHolidays();
  }, []);

  return (
    <div className="p-6 flex-1 relative">
      <div className="mb-8 w-full flex flex-row justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-primary mb-2">
            <span className="text-secondary">{year}</span> Holidays
          </h1>
          <h2 className="text-gray-500">Add/Delete Holidays</h2>
        </div>
      </div>
      <div className="flex flex-row">
        <div className="flex-1">
          <HolidaysProvider value={holidays} setValue={setHolidays}>
            {holidays.map((holiday, index) => (
              <tr
                key={index}
                className="border-2 border-primary whitespace-pre-wrap"
              >
                <HolidaysTile index={index} {...holiday} />
              </tr>
            ))}
          </HolidaysProvider>
        </div>
      </div>
    </div>
  );
};

export default Holidays;
