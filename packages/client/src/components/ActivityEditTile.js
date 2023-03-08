import { useEffect } from "react";
import { useState } from "react";
import DatePicker from "react-date-picker";
import { RxDragHandleDots2 } from "react-icons/rx";
import { useActivity } from "../context/ActivityContext";

const ActivityEditTile = ({ name: n, type: t, value: v, index }) => {
  const { handleActivityAction } = useActivity();
  const [name, setName] = useState(n);
  const [type, setType] = useState(t);
  const [value, setValue] = useState(v);

  useEffect(() => {
    handleActivityAction({
      type: "UPDATE",
      data: { name, type, value },
      index,
    });
  }, [name, type, value]);

  return (
    <>
      <td className="py-4 text-lg">
        <RxDragHandleDots2></RxDragHandleDots2>
      </td>
      <td className="px-6 py-4">
        <input
          type="text"
          className="outline-2 outline px-2 py-2 rounded"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </td>
      <td className="px-6 py-4">
        <select
          type="text"
          className="outline-2 outline px-2 py-2 rounded bg-white"
          value={type}
          onChange={(e) => {
            setType(e.target.value);
          }}
        >
          <option value="RELATIVE">RELATIVE</option>
          <option value="ABSOLUTE">ABSOLUTE</option>
        </select>
      </td>
      <td className="px-6 py-4">
        {type === "RELATIVE" ? (
          <input
            className="outline-2 outline px-2 py-2 rounded bg-white"
            type="number"
            value={typeof value == "number" ? value : 0}
            onChange={(e) => {
              setValue(parseInt(e.target.value));
            }}
          />
        ) : (
          <DatePicker value={value} onChange={setValue} className="bg-white" />
        )}
      </td>
    </>
  );
};

export default ActivityEditTile;
