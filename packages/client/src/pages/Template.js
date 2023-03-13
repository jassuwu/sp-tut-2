import { useEffect, useState } from "react";
import { IoAddCircle } from "react-icons/io5";
import Modal from "../components/Modal";
import TemplateTile from "../components/TemplateTile";
import Api from "../utils/Api";
import { TEMPLATE_ALL_CREATE } from "../utils/Endpoints";

const Template = () => {
  const [showModal, setShowModal] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createErrors, setCreateErrors] = useState("");

  const [templates, setTemplates] = useState([]);

  const getAllCalendars = async () => {
    const result = await Api.get(TEMPLATE_ALL_CREATE);
    return result.data;
  };

  const createTemplate = async (name) => {
    if (name) {
      return await Api.post(TEMPLATE_ALL_CREATE, {
        name,
        activities: [],
      });
    } else {
      throw Error("Name is required");
    }
  };

  useEffect(() => {
    (async () => {
      const data = await getAllCalendars();
      setTemplates(data);
    })();
  }, [showModal]);

  return (
    <div className="p-6 flex-1 relative">
      <div className="mb-8 w-full flex flex-row justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-primary mb-2">
            <span className="text-secondary">Activity</span> Templates
          </h1>
          <h2 className="text-gray-500">Select a template</h2>
        </div>
        <div className="flex flex-col justify-center">
          <button
            onClick={(e) => {
              setShowModal(true);
            }}
            className="group text-4xl hover:scale-[101%] transition-all"
          >
            <IoAddCircle className="text-primary group-hover:text-secondary"></IoAddCircle>
          </button>
        </div>
      </div>
      <div className="px-10 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
        {templates.map((template) => (
          <TemplateTile key={template} {...template} />
        ))}
      </div>
      {showModal && (
        <Modal
          onClose={() => {
            setShowModal(false);
          }}
        >
          <h1 className="text-primary text-3xl mb-4">Name</h1>
          <input
            onChange={(e) => {
              setCreateName(e.target.value);
            }}
            type="text"
            value={createName}
            className="text-2xl underline text-secondary border border-primary rounded-md px-2 py-2 mb-2"
          />
          <p className="text-red-600 mb-4">{createErrors}</p>
          <div className="flex flex-row justify-center">
            <button
              onClick={async (e) => {
                try {
                  setCreateErrors("");
                  await createTemplate(createName);
                  setShowModal(false);
                  setCreateName("");
                } catch (e) {
                  setCreateErrors("please check name");
                  setTimeout(() => {
                    setCreateErrors("");
                  }, 1500);
                }
              }}
              className="bg-primary px-4 py-2 rounded-md text-white"
            >
              Create
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Template;
