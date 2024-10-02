import { ReactNode } from "react";
import { HeadComponent } from "./head-component";
import React from "react";

interface LayoutProps {
  flexDirection?: "row" | "col";
  justify?: "start" | "end" | "center" | "between" | "around" | "evenly";
  align?: "start" | "end" | "center" | "baseline" | "stretch";
  gap?: number;
}

interface PageLayoutProps extends LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title = "RainbowKit App",
  description = "Generated by @rainbow-me/rainbowkit",
  flexDirection = "col",
  justify = "start",
  align = "center",
  gap = 8,
}) => {
  return (
    <>
      <HeadComponent title={title} description={description} />
      <MainContainer
        flexDirection={flexDirection}
        justify={justify}
        align={align}
        gap={gap}
      >
        {children}
      </MainContainer>
    </>
  );
};

const MainContainer: React.FC<LayoutProps & { children: React.ReactNode }> = ({
  children,
  flexDirection = "col",
  justify = "start",
  align = "center",
  gap = 8,
}) => {
  const justifyClass = {
    start: "justify-start",
    end: "justify-end",
    center: "justify-center",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  }[justify];

  const alignClass = {
    start: "items-start",
    end: "items-end",
    center: "items-center",
    baseline: "items-baseline",
    stretch: "items-stretch",
  }[align];

  return (
    <main
      className={`min-h-[100vh] p-8 flex flex-${flexDirection} ${justifyClass} ${alignClass} gap-${gap} py-8`}
    >
      {children}
    </main>
  );
};
