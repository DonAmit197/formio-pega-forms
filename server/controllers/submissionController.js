const BcForm = require("../models/BcForm");

async function createSubmission(req, res) {
  try {
    const submission = await BcForm.create({
      formId: req.body.formId || "form-preview",
      data: req.body.data || req.body,
      serviceJson: req.body.serviceJson || req.body
    });

    res.json({
      message: "Submission saved",
      submission
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Error saving submission",
      error: err.message
    });
  }
}

module.exports = {
  createSubmission
};