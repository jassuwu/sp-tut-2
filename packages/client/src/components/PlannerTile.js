import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineCloudDownload } from "react-icons/ai";
import { useState } from "react";

const PlannerTile = ({ id, name, activities, start_date }) => {
  const navigate = useNavigate();
  let { year } = useParams();

  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/calendar/${year}/planner/${id}`);
      }}
      onMouseEnter={(e) => {
        setHovered(true);
      }}
      onMouseLeave={(e) => {
        setHovered(false);
      }}
      className={`group relative aspect-square border-4 rounded-lg border-primary hover:bg-primary hover:cursor-pointer p-5 flex flex-col justify-between hover:scale-[102%] transition-all`}
    >
      <div
        className={`absolute bg-primary text-white text-xl font-light w-[50%] aspect-square left-0 top-0 triangle p-5`}
      >
        {activities.length}
      </div>
      <div className="flex flex-row justify-end">
        {hovered && (
          <button
            className="text-4xl"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <AiOutlineCloudDownload className="text-white"></AiOutlineCloudDownload>
          </button>
        )}
      </div>
      <p
        className={`text-primary text-xl group-hover:text-white font-semibold text-right relative`}
      >
        {name}
      </p>
    </div>
  );
};

export default PlannerTile;
