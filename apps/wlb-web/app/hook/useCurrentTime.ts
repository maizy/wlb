import {useEffect, useState} from "react";
import {Time, makeTime} from "wlb-intelligence/data/time";

/**
 * This hacky hook only works because React will re-execute the hook
 * after its state has eventually changed after the timeout.
 */
export function useCurrentTime(maxUpdateIterval?: number): Time {
  const [now, setNow] = useState<Time>(makeTime());

  useEffect(() => {
    function tick() {
      setNow(makeTime());
    }

    // tune delay to fire at the start of a minute
    const date = new Date();
    const boundedMaxUpdateIterval = Math.min(60000, maxUpdateIterval || 60000);
    const delay = Math.min(boundedMaxUpdateIterval, 60000 - (date.getSeconds() * 1000 + date.getMilliseconds()));
    const itervalId = window.setTimeout(tick, delay);
    return () => {
      clearTimeout(itervalId);
    }
  }, [now, setNow, maxUpdateIterval]);
  return now;
}
