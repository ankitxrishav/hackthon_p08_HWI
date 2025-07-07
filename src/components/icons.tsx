import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22c-2 0-3.8-.8-5.2-2.2-1.4-1.4-2.2-3.2-2.2-5.2 0-4.2 3-7.6 7-8.5V2" />
      <path d="M12 16c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z" />
      <path d="m14.2 11.8 4.6-4.6" />
      <path d="M12 22c4.2 0 7.6-3 8.5-7h-4.3" />
      <path d="M2 12h4.3c-.9 4-4.3 7-8.5 7Z" />
      <path d="M7.2 6.2 2.6 1.6" />
      <path d="m15.4 15.4 3 3" />
      <path d="m16.8 6.2-3-3" />
      <path d="m8.6 15.4-3 3" />
    </svg>
  ),
};
