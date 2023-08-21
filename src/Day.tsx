import React from 'react';

const Day: React.FC<{
  date: string;
  max: number;
  min: number;
  code: number;
  isToday: boolean;
}> = (props) => {
  function getWeatherIcon(wmoCode: number) {
    const icons = new Map([
      [[0], '☀️'],
      [[1], '🌤'],
      [[2], '⛅️'],
      [[3], '☁️'],
      [[45, 48], '🌫'],
      [[51, 56, 61, 66, 80], '🌦'],
      [[53, 55, 63, 65, 57, 67, 81, 82], '🌧'],
      [[71, 73, 75, 77, 85, 86], '🌨'],
      [[95], '🌩'],
      [[96, 99], '⛈'],
    ]);
    const arr = [...icons.keys()].find((key) => key.includes(wmoCode));
    if (!arr) return 'NOT FOUND';
    return icons.get(arr);
  }

  function formatDay(dateStr: string) {
    return new Intl.DateTimeFormat('en', {
      weekday: 'short',
    }).format(new Date(dateStr));
  }

  const { date, max, min, code, isToday } = props;
  return (
    <li className="day">
      <span>{getWeatherIcon(code)}</span>
      <p>{isToday ? 'Today' : formatDay(date)}</p>
      <p>
        {Math.floor(min)}&deg; - <strong>{Math.ceil(max)}&deg;</strong>
      </p>
    </li>
  );
};

export default Day;