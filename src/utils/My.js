const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const { default: mongoose } = require("mongoose");


class My {
  static displayJsonContents(jsonObj) {
    const jsonString = JSON.stringify(jsonObj, null, 2); // The third argument (2) adds indentation for readability
    console.log(jsonString);
  }



  static getDefaultAltImgSrc() {
    return "/img/product/beetle-1.jpg";
  }



  static log(msg) {
    console.log(msg);
  }


  static sleep(ms = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  static generateUuid() {
    return uuidv4();
  }

  /**
   * 
   * @param {integer} min: inclusive
   * @param {integer} max: inclusive 
   * @returns integer
   */
  static getRandomNumber(min, max) {
    // Math.random() generates a number between 0 (inclusive) and 1 (exclusive)
    // Multiply by (max - min + 1) to include the maximum value in the range
    // Math.floor() rounds down to the nearest integer
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  static uuidToObjectId(uuid) {
    const hash = crypto.createHash('md5').update(uuid).digest('hex');
    return new mongoose.Types.ObjectId(hash.substring(0, 24));    
  }
  
  
}


module.exports = My;