import * as React from "react";
// Source: https://codesandbox.io/s/opmco?file=/src/useClickOutside.js:0-1192

// Improved version of https://usehooks.com/useOnClickOutside/
export const useClickOutside = (
  ref: React.RefObject<HTMLDivElement>,
  handler: (arg0: any) => void,
) => {
  React.useEffect(() => {
    let startedInside = false;
    let startedWhenMounted = false;

    const listener = (event: { target: any }) => {
      // Do nothing if `mousedown` or `touchstart` started inside ref element
      if (startedInside || !startedWhenMounted) return;
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) return;

      handler(event);
    };

    const validateEventStart = (event: { target: any }) => {
      startedWhenMounted = Boolean(ref.current);
      startedInside = Boolean(
        ref.current && ref.current.contains(event.target),
      );
    };

    document.addEventListener("mousedown", validateEventStart);
    document.addEventListener("touchstart", validateEventStart);
    document.addEventListener("click", listener);

    return () => {
      document.removeEventListener("mousedown", validateEventStart);
      document.removeEventListener("touchstart", validateEventStart);
      document.removeEventListener("click", listener);
    };
  }, [ref, handler]);
};

export default useClickOutside;
