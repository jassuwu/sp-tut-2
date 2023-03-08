import { useRef } from "react";
import { useEffect } from "react";

const Modal = ({ onClose, children }) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
      className="absolute left-0 top-0 w-full h-full z-10 bg-secondary/30 grid place-items-center"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className=" bg-white rounded-lg shadow-lg p-10 max-h-[80%] overflow-y-auto"
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
