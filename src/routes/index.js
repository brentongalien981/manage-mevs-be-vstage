var express = require('express');
const My = require('../utils/My');
var router = express.Router();


router.get('/', (req, res) => {
  res.json({
    msg: "Request OK for GET route: /"
  });
});


router.get("/generateUuid", (req, res) => {
  res.status(200).json({
    msg: "Request OK for route: /generateUuid",
    uuid: My.generateUuid()
  });
});


module.exports = router;
