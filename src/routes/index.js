var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.json({
    msg: "Request OK for GET route: /"
  });
});

module.exports = router;
