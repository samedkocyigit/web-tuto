const mongoose = require("mongoose")
const Tour = require("./tourModel")
const User = require("./userModel")

const reviewSchema = new mongoose.Schema(
  {
    review: String,
    rating: Number,
    createdAt: {
      type: Date,
      default: Date.now
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref:"Tour",
      required: [true,"Review must be belong a tour."]
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref:"User",
      required:[true, "Review must be belong a user"]
    }
  },
  {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
  }
)

// QUERY MIDDLEWARE

reviewSchema.pre(/^find/, function(next){
  // this.populate({
  //   path: 'tour',
  //   select: 'name'
  // }).populate({
  //   path: 'user',
  //   select: 'name'
  // });

  this.populate({
    path: 'user',
    select: 'name'
  })

  next()
})
const Review = mongoose.model("Review",reviewSchema)

module.exports = Review