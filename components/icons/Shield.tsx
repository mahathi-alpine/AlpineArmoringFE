import React from 'react';
import { IconProps } from 'types';

const ShieldIcon = ({ color, className }: IconProps) => {
  return (
    <svg
      className={className}
      fill={`${color ? color : '#fff'}`}
      height="64px"
      width="64px"
      viewBox="0 0 151.96 146.5"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill={`${color ? color : '#e0e0e0'}`}
        d="M152,27.07V7.82h-5.25V0H5V8H0V27.29H5V59.54H0V78.79H5V92.13l27.58,21.15-3.19,4.11,15.27,11.75L47.82,125l27.69,21.23.2.14.21.15.47-.37a2.69,2.69,0,0,1,.27-.2l.08-.07.12-.09h0l0,0c.07-.05.12-.11.19-.15l27-20.89,3.26,4.22L122.6,117.2,119.39,113l27.32-20.86V78.58H152V59.35h-5.25V27.07Z"
      />
      <polygon
        fill={`${color ? color : '#e0e0e0'}`}
        points="120.32 103.59 121.28 103.59 121.11 102.95 120.32 103.59"
      />
    </svg>
  );
};

export default ShieldIcon;
