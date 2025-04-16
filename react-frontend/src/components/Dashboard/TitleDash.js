import React, { useState } from "react";
import { Button } from "primereact/button";
import classNames from "classnames";

// CHANGE
export const TitleDash = ({ user }) => {
  const [active4, setActive4] = useState(0); // Adjusted to use for tab navigation

  return (
    <div className="mb-4 flex justify-content-between align-items-center">
      <span className="text-900 font-medium text-3xl m-0.5">
        Welcome, {user.name}
      </span>
    </div>
  );
};
