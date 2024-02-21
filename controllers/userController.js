const catchAsync = require("../utils/catchAsync");
const User = require('../models/userModel');
const AppError = require("../utils/appError");

const filterObj= (obj , ...allowedFields)=>{
  const newObj={}

  Object.keys(obj).forEach(el=>{
    if(allowedFields.includes(el)) newObj[el]=obj[el]
  })
  return newObj
}

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

exports.updatedMe = catchAsync(async (req,res,next) =>{
  // 1) create error if user posts password data
  if(req.body.password || req.body.passwordConfirm){
    return next(new AppError(
      'this route is not for password updates. Please use /updateMyPassword.'
    ,400
    ))
  }

  // 2) Filtered only allow updated files
  const filteredBody = filterObj(req.body,'name','email')

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id,filteredBody,{
    new: true,
    runValidators: true
  })
  
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  })

})

exports.deleteMe = catchAsync(async (req,res,next) =>{
  await User.findByIdAndUpdate(req.user.id , { active: false})

  res.status(204).json({
    status:'success',
    data:null
  })
})

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
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined'
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
