import React from 'react';
import { IconProps } from 'types';

const DownloadIcon = ({ className }: IconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 55.2 50.52"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Layer_3">
        <path
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="5px"
          d="M2.5,23.16v16.42c0,4.67,3.78,8.45,8.45,8.45h33.3c4.67,0,8.45-3.78,8.45-8.45v-16.42"
        />
      </g>
      <g id="Layer_4">
        <line
          stroke="#fff"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="5px"
          x1="19.56"
          y1="24.57"
          x2="28.59"
          y2="36.02"
        />
        <line
          stroke="#fff"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="5px"
          x1="37.62"
          y1="24.57"
          x2="28.59"
          y2="36.02"
        />
        <line
          stroke="#fff"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="5px"
          x1="28.59"
          y1="2.5"
          x2="28.59"
          y2="36.02"
        />
      </g>
    </svg>
  );
};

export default DownloadIcon;
