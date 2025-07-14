import { cn } from "@/lib/utils";
import { type SVGProps } from "react";

const CheckMark = ({ className, ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      className={cn("w-full block", className)}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 130.2 130.2"
      {...props}
    >
      <polyline
        className="
    fill-none
    stroke-current
    stroke-[6]               /* stroke-width: 6 */
    stroke-linecap-round
    stroke-miterlimit-[10]
  "
        style={{
          strokeDasharray: 1000,
          strokeDashoffset: -100,
          animation: "dash-check 1.9s .35s ease-in-out forwards",
        }}
        points="100.2,40.2 51.5,88.8 29.8,67.5"
      />
    </svg>
  );
};

export default CheckMark;
