const express = require('express');
const checkAuth = require('../middleware/checkAuth');
const checkAdmin = require('../middleware/checkAdmin');

const router = express.Router();

const controllerFeedback = require('../controllers/feedback');

router.get("/", checkAuth, controllerFeedback.getFeedback);
router.post("/", checkAuth, controllerFeedback.postFeedback);

module.exports = router;