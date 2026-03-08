import React from "react";

// Step 1: Create a Loader component using the global .loader class defined in index.css
const Loader = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        margin: "40px 0",
        width: "100%",
      }}
    >
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
