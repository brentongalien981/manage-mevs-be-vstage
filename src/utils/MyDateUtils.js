class MyDateUtils {
  /**
   * 
   * @param {int} numDaysPassed 
   * @returns string date in format "yyyy-MM-dd"
   */
  static getDateString(numDaysPassed = 0) {
    const date = new Date();
    date.setDate(date.getDate() - numDaysPassed);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }


  static getDateStringWithOffset(date = new Date(), numDaysOffset = 0) {
    date.setDate(date.getDate() + numDaysOffset);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }


  static getDate(numDaysPassed = 0) {
    const date = new Date();
    return date.setDate(date.getDate() - numDaysPassed);
  }


  static generateRandomDateInRange(rangeStartDateStr, rangeEndDateStr) {
    const startDate = new Date(rangeStartDateStr);
    const endDate = new Date(rangeEndDateStr);

    // Calculate time difference in milliseconds
    const timeDifference = endDate.getTime() - startDate.getTime();

    // Generate a random time within the range
    const randomTime = startDate.getTime() + Math.random() * timeDifference;

    // Convert the time back to a Date object
    return new Date(randomTime);
  }


  static getNumDayBetweenDates(startDateStr, endDateStr) {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // Calculate the difference in milliseconds
    const differenceInMilliseconds = endDate - startDate;

    // Convert milliseconds to days
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

    return differenceInDays;
  }
}


module.exports = MyDateUtils;