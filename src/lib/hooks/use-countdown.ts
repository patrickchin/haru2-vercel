import { useState, useEffect } from "react";

export const useCountdown = (initialValue: number) => {
  const [countdown, setCountdown] = useState(initialValue);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  return { countdown, setCountdown };
};
