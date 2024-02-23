const express = require("express")
const reviewController = require("../controllers/reviewController")
const authController = require("../controllers/authController")

const router = express.Router({mergeParams:true})

//POST /tour/23fdsw232/reviews
//POST /reviews

router
.route("/")
.get(reviewController.getAllReviews)
.post(
  authController.restrictTo("admin"),
  reviewController.setTourUserIds,
  reviewController.createReview)

  router.route("/:id")
  .get(reviewController.getReview)
  .patch(
    authController.protect,
    authController.restrictTo('admin','user'),
    reviewController.updateReview)
  .delete(
    authController.protect,
    authController.restrictTo('admin','user'),
    reviewController.deleteReview)

module.exports = router 
