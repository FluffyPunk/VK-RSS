const mongoose = require("mongoose");

const subListSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true,
  },
  subList: {
    type: mongoose.SchemaTypes.Array,
  },
  modList: {
    type: mongoose.SchemaTypes.Array,
  },
  announcerId: {
    type: mongoose.SchemaTypes.String,
  },
  busyStatus: {
    type: mongoose.SchemaTypes.Boolean,
  },
});

module.exports = mongoose.model("subList", subListSchema);
