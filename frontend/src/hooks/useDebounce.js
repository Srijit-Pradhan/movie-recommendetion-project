// Step 1: React theke hook gulo nilam
import { useState, useEffect } from "react";

// Step 2: Custom hook banacchi jar nam useDebounce
// Eta use korle amra search box e type korar time e prottek ta onnor jonno api call hobe na.
// Ekbar type bondho korle, delay time (jemon 500ms) par hole tobei api call korbe.
export const useDebounce = (value, delay) => {
  // Eita final return korbe
  const [debouncedValue, setDebouncedValue] = useState(value);

  // Step 3: useEffect - value ba delay change holei eta cholbe
  useEffect(() => {
    // Ekta timer set korchi (setTimeout diye)
    // Delay time tuku par hole tobei debouncedValue ta update hobe
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Kintu jodi delay time er majhei user abar notun kichu type kore (value change hoy)
    // Tokhon purono timer ta ei return function (cleanup) diye cancel hoye jabe (clearTimeout).
    // Eta kora hoy jate unnecessarily beshi API call na hoy server e stress kom pore.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
