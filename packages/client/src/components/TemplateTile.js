import { useNavigate } from "react-router-dom";
const TemplateTile = ({ id, name, activities }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/template/${id}`);
      }}
      className={`group relative aspect-square border-4 rounded-lg border-primary hover:bg-primary hover:cursor-pointer p-5 flex flex-col justify-between hover:scale-[102%] transition-all`}
    >
      <div
        className={`absolute bg-primary text-white text-xl font-light w-[50%] aspect-square left-0 top-0 triangle p-5`}
      >
        {activities.length}
      </div>
      <div className="flex flex-col h-full justify-end">
        <p
          className={`text-primary text-2xl group-hover:text-white font-semibold text-right relative`}
        >
          {name}
        </p>
      </div>
    </div>
  );
};

export default TemplateTile;
