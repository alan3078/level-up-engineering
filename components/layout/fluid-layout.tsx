import { ReactNode } from "react";

interface FluidLayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * FluidLayout - Full width layout that spans across the entire page
 * Use this for hero banners and other full-width sections
 */
export function FluidLayout({ children, className = "" }: FluidLayoutProps) {
  return <div className={`w-full ${className}`}>{children}</div>;
}
