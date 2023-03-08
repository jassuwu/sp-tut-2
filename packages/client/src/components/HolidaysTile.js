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
import { useHolidays } from "../context/HolidaysContext";
import { DateTimeField, Submit, TextField, ToggleField } from "./form";
import Modal from "./Modal";

const HolidaysTile = ({ index, name, date }) => {
  const { handleHolidaysAction } = useHolidays();
  return (
    <>
      <td className="px-6 py-4">{name}</td>
      <td className="px-6 py-4">{new Date(date).toDateString()}</td>
      <td className="px-6 py-4 flex flex-row items-center justify-center space-x-4 text-2xl">
        <button
          onClick={(e) => {
            handleHolidaysAction({ type: "DELETE", index });
          }}
          className="text-primary hover:text-red-500"
        >
          <AiFillDelete />
        </button>
      </td>
    </>
  );
};

export default HolidaysTile;
