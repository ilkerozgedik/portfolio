import type React from "react";
import { useEffect, useState } from "react";

type ClockProps = {
  className?: string;
};

const Clock: React.FC<ClockProps> = ({ className }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <span className={className}>
      {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
    </span>
  );
};

export default Clock;
