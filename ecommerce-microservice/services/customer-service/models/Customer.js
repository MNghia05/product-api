const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  uid: { type: Number, required: true, unique: true },
  fullname: { type: String, required: true, trim: true },
  age: { type: Number, min: 0 },
  address: { type: String, trim: true }
}, {
  versionKey: false,
  toJSON: { transform: (doc, ret) => { delete ret._id; return ret; } }
});

module.exports = mongoose.model('Customer', customerSchema);
