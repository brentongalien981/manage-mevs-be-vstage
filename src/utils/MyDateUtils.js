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


  static getDate(numDaysPassed = 0) {
    const date = new Date();
    return date.setDate(date.getDate() - numDaysPassed);
  }
}


module.exports = MyDateUtils;