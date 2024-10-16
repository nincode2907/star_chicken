import React, { useState } from "react";

const DropDownList = ({ relative, children }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative min-w-24 transition-all duration-500">
      <div onClick={() => setShow((prev) => !prev)}>{relative}</div>
      <div
        className={`absolute top-12 left-0 ${
          show ? "opacity-100" : "opacity-0 "
        }  flex flex-col gap-2 transition-all duration-500 `}
      >
        {children}
      </div>
    </div>
  );
};

export default DropDownList;
