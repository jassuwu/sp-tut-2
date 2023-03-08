import { useEffect, useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import ActivityTile from "./ActivityTile";

const ActivityReOrder = ({ activities: acts }) => {
  const [activities, setActivities] = useState(acts);

  useEffect(() => {
    console.log(activities);
    console.log(acts);
  }, []);

  return <div></div>;
};

export default ActivityReOrder;
