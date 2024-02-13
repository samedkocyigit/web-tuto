const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userControllers');

router.route('/').get(userController.getUsers).post(userController.creatUser);
router.route('/:id').get(userController.getUser).patch(userController.uploadUser).delete(userController.deleteUser);

module.exports=router;