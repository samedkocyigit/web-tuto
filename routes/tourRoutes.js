const express = require('express')
const tourController = require('./../controllers/tourController')
const authController = require('./../controllers/authController')
const reviewRouter = require('../routes/reviewRoutes')

const router = express.Router()


router.use('/:tourId/reviews',reviewRouter)

router
  .route('/top-5-cheap')
  .get(
    tourController.aliasTopTours,
    tourController.getAllTours)

router.route('/tour-stats').get(tourController.getTourStats)

router.use(authController.protect)

router.route('/monthly-plan/:year')
  .get(
    authController.restrictTo('admin','lead-guides'),
    tourController.getMonthlyPlan)

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.restrictTo('admin','lead-guides'),
    tourController.createTour)

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.restrictTo('admin','lead-guides'),
    tourController.updateTour)
  .delete(
    authController.restrictTo('admin','lead-guides'),
    tourController.deleteTour)

module.exports = router;
