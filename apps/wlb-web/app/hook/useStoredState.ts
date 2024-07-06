import { useEffect, useState } from "react";

export default function useStoredState<T>(
  localStorageKey: string,
  initialValue: T,
  serialize: (value: T) => string,
  deserialize: (serialized: string) => T
): [T, (value: T) => void] {
   const [internalState, setInternalState] = useState<T>(initialValue);

   useEffect(() => {
       const storedValue = localStorage.getItem(localStorageKey);
       if (storedValue !== null) {
         setInternalState(deserialize(storedValue));
       }
   }, [localStorageKey, deserialize]);

   const setState = (value: T) => {
       localStorage.setItem(localStorageKey, serialize(value));
       setInternalState(value);
   };

   return [internalState, setState];
}
