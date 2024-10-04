import React, { useState } from "react";

const TruncateText = ({ children, maxLength }) => {
  const [isTruncated, setIsTruncated] = useState(true);

  const toggleTruncate = () => {
    setIsTruncated(!isTruncated);
  };

  const text = children;

  return (
    <div>
      <p>
        {isTruncated ? `${text.slice(0, maxLength)}...` : text}
      </p>
      {/* {text.length > maxLength && (
        <button onClick={toggleTruncate}>
          {isTruncated ? "Show more" : "Show less"}
        </button>
      )} */}
    </div>
  );
};

export default TruncateText;