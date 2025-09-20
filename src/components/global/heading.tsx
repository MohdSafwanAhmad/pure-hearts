import { cn } from "@/src/lib/utils";
import { HTMLAttributes, JSX, createElement } from "react";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
}

const headingStyles = {
  1: "text-3xl md:text-5xl",
  2: "text-2xl md:text-4xl",
  3: "text-xl md:text-3xl",
  4: "text-lg md:text-2xl",
  5: "text-base md:text-xl",
  6: "text-sm md:text-lg",
} as const;

export function Heading({
  level,
  className,
  children,
  ...props
}: HeadingProps) {
  const tag = `h${level}` as keyof JSX.IntrinsicElements;

  return createElement(
    tag,
    {
      className: cn(
        "font-semibold tracking-tight",
        headingStyles[level],
        className
      ),
      ...props,
    },
    children
  );
}
