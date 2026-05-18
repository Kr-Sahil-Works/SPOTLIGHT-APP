import { useRef } from "react";

type Layout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export default function useMessageLayout() {
  const layouts = useRef<
    Record<string, Layout>
  >({});

  const setLayout = (
    id: string,
    layout: Layout
  ) => {
    layouts.current[id] = layout;
  };

  const getLayout = (
    id: string
  ) => {
    return layouts.current[id];
  };

  return {
    setLayout,
    getLayout,
  };
}