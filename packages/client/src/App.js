import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Activities from "./pages/Activites";
import Calendar from "./pages/Calendar";
import Holidays from "./pages/Holildays";
import Home from "./pages/Home";
import Planner from "./pages/Planner";
import Template from "./pages/Template";
import TemplateActivities from "./pages/TemplateActivites";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Navigate to="/calendar" />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="calendar/:year/planner" element={<Planner />} />
          \<Route path="calendar/:year/holidays" element={<Holidays />} />
          <Route path="calendar/:year/planner/:id" element={<Activities />} />
          <Route path="template" element={<Template />} />
          <Route path="template/:id" element={<TemplateActivities />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
