const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const JobseekerSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true
  }
);

const dataMigrate = [];

JobseekerSchema.statics.getMigrateData = function () {
  return dataMigrate;
};

module.exports = mongoose.model("Jobseeker", JobseekerSchema);
