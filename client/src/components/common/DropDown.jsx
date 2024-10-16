import React from "react";

const DropDown = ({ onHandle, icon, title }) => {
  return (
    <div
      onClick={onHandle ? onHandle : undefined}
      className="px-4 py-2 shadow-lg min-w-24 cursor-pointer text-nowrap flex items-center gap-2 rounded-md bg-blue-400 text-white"
    >
      {icon}
      <span>{title}</span>
    </div>
  );
};

export default DropDown;
