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

router.route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin','lead-guides'),
    tourController.getMonthlyPlan)

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(
    tourController.getToursWithin)
// /tours-within?distance=233,center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

router
  .route('/distance/:latlng/unit/:unit')
  .get(tourController.getDistances)
  
router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin','lead-guides'),
    tourController.createTour)

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin','lead-guides'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin','lead-guides'),
    tourController.deleteTour)

module.exports = router;
