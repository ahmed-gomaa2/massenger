import React from "react";

export default ({ onClick }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        onClick={onClick}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="feather feather-plus"
        viewBox="0 0 24 24"
    >
        <path d="M12 5L12 19" />
        <path d="M5 12L19 12" />
    </svg>
);
