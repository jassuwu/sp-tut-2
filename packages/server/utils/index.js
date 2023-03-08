const addWeekdaysWithoutHolidays = (holidays, startDate, days) => {
  let currentDate = new Date(startDate);
  let count = 0;
  while (count < days) {
    currentDate.setDate(currentDate.getDate() + 1);

    if (
      holidays.includes(currentDate.toLocaleDateString()) ||
      currentDate.getDay() === 0
      // currentDate.getDay() === 6
    ) {
      continue;
    }

    count++;
  }

  return new Date(currentDate);
};

const differenceWeekdaysWithHolidays = (holidays, startDate, lastDate) => {
  let currentDate = new Date(startDate);
  let count = 0;
  while (currentDate.toLocaleDateString() !== lastDate.toLocaleDateString()) {
    currentDate.setDate(currentDate.getDate() + 1);

    if (
      holidays.includes(currentDate.toLocaleDateString()) ||
      currentDate.getDay() === 0
      // currentDate.getDay() === 6
    ) {
      continue;
    }

    count++;
  }

  return count;
};

module.exports = {
  addWeekdaysWithoutHolidays,
  differenceWeekdaysWithHolidays,
};
