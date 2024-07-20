import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useStoredState<T>(
  storageKey: string,
  initialValue: T,
  serialize: (value: T) => string,
  deserialize: (serialized: string) => T
): [T, (value: T) => void] {
   const [internalState, setInternalState] = useState<T>(initialValue);

   useEffect(() => {
     try {
       AsyncStorage.getItem(storageKey).then(storedValue => {
         if (storedValue !== null) {
           setInternalState(deserialize(storedValue));
         }
       });
     } catch (e) {
       console.error(`unable to get '${storageKey}' from native storage`, e);
     }
   }, [storageKey, deserialize]);

   const setState = (value: T) => {
     try {
       AsyncStorage.setItem(storageKey, serialize(value));
     } catch (e) {
       console.error(`unable to set '${storageKey}' to native storage`, e);
     }
     setInternalState(value);
   };
   return [internalState, setState];
}
