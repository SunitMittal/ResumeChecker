const express = require('express')
const router = express.Router()

const {generateInterViewReportController, generateResumePdfController, getInterviewReportByIdController, getAllInterviewReportsController} = require("../controllers/interview.controller")
const {authUser} = require("../middlewares/auth.middleware")
const upload = require("../middlewares/file.middleware")

router.post("/", authUser, upload.single("resume"), generateInterViewReportController)

router.get("/report/:interviewId", authUser, getInterviewReportByIdController)

router.get("/", authUser, getAllInterviewReportsController)

router.post("/resume/pdf/:interviewReportId", authUser, generateResumePdfController)

module.exports = router