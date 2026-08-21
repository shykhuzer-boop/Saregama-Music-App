const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
    },
    tags: [{
      type: String,
      trim: true,
    }],
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

faqSchema.index({ category: 1 });
faqSchema.index({ tags: 1 });

const FAQ = mongoose.model('FAQ', faqSchema);

module.exports = FAQ;
