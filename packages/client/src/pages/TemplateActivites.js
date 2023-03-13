import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Api from "../utils/Api";
import { TEMPLATE_ONE_UPDATE_DELETE } from "../utils/Endpoints";

const TemplateActivities = () => {
  let { id } = useParams();
  const [name, setName] = useState("");
  const [activities, setActivities] = useState([]);


  useEffect(() => {
    const fetchTemplate = async () => {
      const result = await Api.get(TEMPLATE_ONE_UPDATE_DELETE.replace(":id", id));
      const data = result.data;
      setName(data.name);
      setActivities(data.activities);
    };
    fetchTemplate();
  }, [activities, id]);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-primary mb-3">
          <span className="text-secondary">Activity</span> Template
        </h1>
        <h1 className="text-3xl font-semibold text-primary">{name}</h1>
      </div>
      <div className="px-10 lg:px-20 space-y-4"></div>
    </div>
  );
};

export default TemplateActivities;
