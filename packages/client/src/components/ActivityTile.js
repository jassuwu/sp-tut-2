import { useEffect } from "react";
import { useState } from "react";
import DatePicker from "react-date-picker";
import {
  AiFillDelete,
  AiFillEdit,
  AiOutlineDelete,
  AiOutlineEdit,
} from "react-icons/ai";
import { useActivity } from "../context/ActivityContext";
import FormProvider from "../context/FormContext";
import { DateTimeField, Submit, TextField, ToggleField } from "./form";
import Modal from "./Modal";

const ActivityTile = ({
  id,
  name: n,
  type: t,
  relativeDays: r,
  relativeDate: rd,
  date: d,
}) => {
  const { updateActivity, deleteActivity } = useActivity();

  const [name, setName] = useState(n);
  const [type, setType] = useState(t);
  const [relativeDays, setRelativeDays] = useState(r);
  const [relativeDate, setRelativeDate] = useState(
    rd ? new Date(rd) : new Date()
  );
  const [date, setDate] = useState(d);

  const calculateDiffInDays = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffInTime = new Date(date).getTime() - today.getTime();
    return Math.floor(diffInTime / (1000 * 3600 * 24));
  };

  const [diffInDays, setDiffInDays] = useState(calculateDiffInDays());

  const [editMode, setEditMode] = useState(false);

  const update = async () => {
    await updateActivity(id, {
      name,
      relativeDays,
      type,
      relativeDate,
    });
  };

  useEffect(() => {
    setDate((prevD) => {
      setDiffInDays(calculateDiffInDays(d));
      return d;
    });
    setName(n);
    setType(t);
    setRelativeDays(r);
    setRelativeDate(rd ? new Date(rd) : new Date());
  }, [d, n, t, r, rd]);

  return (
    <>
      {/* <tr className="border-b-2 border-x-2 border-primary whitespace-pre-wrap w-full"> */}
      <td className="px-6 py-4">
        {editMode ? (
          <input
            className="w-full"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        ) : (
          <>{name}</>
        )}
      </td>
      <td className="px-6 py-4">
        {editMode ? (
          <select
            className="w-full"
            // type="text"
            value={type}
            onChange={(e) => {
              setType(e.target.value);
            }}
          >
            <option>RELATIVE</option>
            <option>ABSOLUTE</option>
          </select>
        ) : (
          <>{type}</>
        )}
      </td>
      {type === "RELATIVE" ? (
        <td className="px-6 py-4">
          {editMode ? (
            <input
              className="w-full"
              type="number"
              value={relativeDays}
              onChange={(e) => {
                setRelativeDays(parseInt(e.target.value));
              }}
            />
          ) : (
            <>{relativeDays}</>
          )}
        </td>
      ) : (
        <td>
          {editMode ? (
            <DatePicker
              className="w-full"
              type="number"
              value={relativeDate}
              onChange={setRelativeDate}
            />
          ) : (
            <>{relativeDate.toDateString()}</>
          )}
        </td>
      )}
      <td className="px-6 py-4">{new Date(date).toDateString()}</td>
      <td className="px-6 py-4 flex flex-row items-center justify-center space-x-4 text-2xl">
        <button
          onClick={(e) => {
            // updateActivity();
            setEditMode(!editMode);
            if (editMode) update();
          }}
          className={`${
            editMode
              ? "text-secondary hover:text-primary"
              : "text-primary hover:text-secondary"
          }`}
        >
          <AiFillEdit />
        </button>
        <button
          onClick={(e) => {
            deleteActivity(id);
          }}
          className="text-primary hover:text-red-500"
        >
          <AiFillDelete />
        </button>
      </td>
      <th className="px-6 py-4">
        {diffInDays < 0 ? "COMPLETED" : `${diffInDays} days`}
      </th>
      {/* </tr> */}
    </>
  );
};

export default ActivityTile;
