const catchAsync = require("../utils/catchAsync");
const User = require('../models/userModel');
const AppError = require("../utils/appError");

exports.getAllUsers =catchAsync(async (req, res) => {
  const user =await User.find()
  
  res.status(200).json({
    status: 'success',
    result: user.lenght,
    data:{
      user
    }
  });
});

exports.getUser = catchAsync(async (req, res,next) => {
  const user = User.findById(req.params.id)
  
  if(!user){
    return next( new AppError('Invalid ID',404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.updateUser = catchAsync(async (req, res) => {
  const user = User.findByIdAndUpdate(req.body)

  if(!user){
    return new AppError('Invalid ID',404)
  }

  res.status(200).json({
    status: 'success',
    message: 'This user is updated succesfuly'
  });
});
exports.deleteUser =catchAsync(async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id)

  if(!user){
    return new AppError('Invalid ID',404)
  }

  res.status(200).json({
    status: 'success',
    data:null
  });
});
