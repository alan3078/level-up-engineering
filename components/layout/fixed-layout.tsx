import { ReactNode } from "react";

interface FixedLayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * FixedLayout - Centered layout with auto margins and max-width container
 * Use this for most content sections (everything except hero banner)
 */
export function FixedLayout({ children, className = "" }: FixedLayoutProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="container mx-auto px-4 md:px-6">{children}</div>
    </div>
  );
}
