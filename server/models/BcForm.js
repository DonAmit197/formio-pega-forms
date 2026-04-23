const mongoose = require("mongoose");

const bcFormSchema = new mongoose.Schema(
  {
    formId: String,
    data: mongoose.Schema.Types.Mixed,
    serviceJson: mongoose.Schema.Types.Mixed
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("BcForm", bcFormSchema, "bcforms");