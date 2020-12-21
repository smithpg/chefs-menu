import React, { useEffect, useRef, useCallback } from "react";

export default function useOnClickOutside(cb) {
  const ref = useRef(null);

  const register = useCallback((element) => {
    ref.current = element;
  }, []);

  useEffect(() => {
    // Bind the event listener
    document.addEventListener("mousedown", onClick);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  return register;

  /* Helper functions */
  function clickWasOutside(event) {
    // Return true if none of the registered elements
    // contain the target of passed event
    console.log(ref.current);
    return !ref.current.contains(event.target);
  }
  function onClick(event) {
    console.log(ref.current);
    if (ref.current !== null && clickWasOutside(event)) {
      cb(event);
    }
  }
}
