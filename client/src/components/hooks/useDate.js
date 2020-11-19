import React from "react";
export const useDate = () => {
  const locale = "en";
  const [today, setDate] = React.useState(new Date()); // Save the current date to be able to trigger an update

  React.useEffect(() => {
    const timer = setInterval(() => {
      // Creates an interval which will update the current data every minute
      // This will trigger a rerender every component that uses the useDate hook.
      setDate(new Date());
    }, 1 * 1000);
    return () => {
      clearInterval(timer); // Return a funtion to clear the timer so that it will stop being called on unmount
    };
  }, []);

  const month = today.toLocaleDateString(locale, {
    month: "long",
  });
  const dateNum = today.getDate();
  const year = today.getFullYear();
  const day = today.toLocaleDateString(locale, { weekday: "long" });

  const date = `${month} ${dateNum}, ${year} `;

  const hour = today.getHours();
  const wish = `Good ${
    (hour < 12 && "Morning") || (hour < 17 && "Afternoon") || "Evening"
  }!`;

  const time = today.toLocaleTimeString(locale, {
    hour: "numeric",
    hour12: true,
    minute: "numeric",
  });

  return {
    day,
    date,
    time,
    wish,
    month,
    dateNum,
    year,
  };
};
