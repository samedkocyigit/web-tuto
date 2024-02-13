const express = require('express');
const router= express.Router();
const tourController = require('./../controllers/tourControllers');

router.param('id',tourController.checkId);

router.route('/').get(tourController.getTours).post(tourController.creatPost);
router.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour);

module.exports=router;