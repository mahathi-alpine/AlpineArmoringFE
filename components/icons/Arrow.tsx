import React from 'react';
import { IconProps } from 'types';

const ArrowIcon = ({ className }: IconProps) => {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 6.66667H13ZM13 6.66667L7.33333 1ZM13 6.66667L7.33333 12.3333Z"
        fill="#2D2D27"
      />
      <path
        d="M1 6.66667H13M13 6.66667L7.33333 1M13 6.66667L7.33333 12.3333"
        stroke="#2D2D27"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ArrowIcon;
