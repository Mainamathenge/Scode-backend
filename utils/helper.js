const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function dateTime(time) {
  const date = new Date(time);
  return `${date.getHours()}:${`0${date.getUTCMinutes()}`.slice(-2)} ${
    date.getHours() > 12 ? "PM" : "AM"
  }`;
}

function dateString(date, state) {
  const formatDate = new Date(date);
  const Month = monthNames[formatDate.getMonth()];
  if (state) {
    return `${Month} ${formatDate.getDate()}, ${formatDate.getFullYear()}`;
  }
  return days[formatDate.getDay() - 1];
}

module.exports = {
  dateTime,
  dateString,
};
