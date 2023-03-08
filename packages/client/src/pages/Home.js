import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <>
      <div className="w-screen h-screen flex flex-col overflow-x-hidden">
        <Navbar></Navbar>
        <Outlet />
      </div>
    </>
  );
};

export default Home;
