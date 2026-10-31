const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: String,
  seq: { type: Number, default: 0 }
}, { versionKey: false });

const Counter = mongoose.model('Counter', counterSchema);

async function nextSequence(name) {
  const doc = await Counter.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return doc.seq;
}

module.exports = { Counter, nextSequence };
