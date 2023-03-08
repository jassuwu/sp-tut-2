import { useNavigate } from "react-router-dom";

const CalendarTile = ({ year, planner }) => {
  const navigate = useNavigate();
  const isCurrent = year === new Date().getFullYear();

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/calendar/${year}/planner`);
      }}
      className={`group relative aspect-square border-4 rounded-lg ${
        isCurrent ? "border-secondary" : "border-primary"
      } p-5 flex flex-col justify-end ${
        isCurrent ? "hover:bg-secondary" : "hover:bg-primary"
      } ${
        isCurrent ? "focus:bg-secondary" : "focus:bg-primary"
      } hover:cursor-pointer hover:scale-[102%] transition-all`}
    >
      <div
        className={`absolute ${
          isCurrent ? "bg-secondary" : "bg-primary"
        } w-[50%] aspect-square left-0 top-0 triangle text-white text-xl font-light p-5`}
      >
        {planner && planner.length.toString()}
      </div>
      <p
        className={`text-4xl font-light ${
          isCurrent ? "text-secondary" : "text-primary"
        } text-right relative`}
      >
        {year.toString().substr(0, 2)}
        <span className="text-7xl group-hover:text-white font-semibold">
          {year.toString().substr(2)}
        </span>
      </p>
    </div>
  );
};

export default CalendarTile;
