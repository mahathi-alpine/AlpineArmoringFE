import React from 'react';
import { IconProps } from 'types';

const InfoIcon = ({ className }: IconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 256 256"
      width="24px"
      height="24px"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        fill="#fff"
        fillRule="nonzero"
        stroke="none"
        strokeWidth="1"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeMiterlimit="10"
        strokeDasharray=""
        strokeDashoffset="0"
      >
        <g transform="scale(5.12,5.12)">
          <path d="M25,2c-12.703,0 -23,10.297 -23,23c0,12.703 10.297,23 23,23c12.703,0 23,-10.297 23,-23c0,-12.703 -10.297,-23 -23,-23zM25,11c1.657,0 3,1.343 3,3c0,1.657 -1.343,3 -3,3c-1.657,0 -3,-1.343 -3,-3c0,-1.657 1.343,-3 3,-3zM29,38h-2h-4h-2v-2h2v-13h-2v-2h2h4v2v13h2z"></path>
        </g>
      </g>
    </svg>
  );
};

export default InfoIcon;
