import { type SVGProps } from "react";

const OlympicIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill="none" stroke="#000" stroke-width="37.7">
        <circle cx="232.3" cy="253.5" r="91.6" stroke="currentColor" />
        <circle cx="450" cy="253.5" r="91.6" stroke="currentColor" />
        <circle cx="667.7" cy="253.5" r="91.6" stroke="currentColor" />
        <circle cx="341.2" cy="346.5" r="91.6" stroke="currentColor" />
        <circle cx="558.8" cy="346.5" r="91.6" stroke="currentColor" />
        <path d="M305.6 198.5a91.6 91.6 0 0 1 0 109.9" stroke="currentColor" />
        <path
          d="M523.3 198.5a91.6 91.6 0 0 1 0 109.9M450 345a91.6 91.6 0 0 1-55-18.3"
          stroke="currentColor"
        />
        <path d="M667.7 345a91.6 91.6 0 0 1-55-18.3" stroke="currentColor" />
      </g>
    </svg>
  );
};

export default OlympicIcon;
