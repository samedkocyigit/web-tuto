const fs=require('fs');
const mongoose = require('mongoose');

const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');


dotenv.config({ path: './config.env' });

mongoose
  //.connect('mongodb://127.0.0.1/natours', {
  .connect(process.env.DATABASE_LOCAL,{  
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(()=> {
    console.log('DB connection successfully');
  });

  const tours =JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,'utf-8'));
  // IMPORT DATA TO INTO DB

const importData = async ()=>{
  try{
    console.log(process.argv);

    await Tour.create(tours);
    console.log('Data successfully loaded!');
  }
  catch(err){
    console.log(err);
  }
  process.exit();
};

  // DELETE ALL DATA FROM DB
const deleteData = async ()=>{
  try{
    console.log(process.argv);

    await Tour.deleteMany();
    console.log('Data successfully deleted!');
  }
  catch(err){
    console.log(err);
  }
  process.exit();
};

if(process.argv[2]==='--import'){
  importData();
}
else if(process.argv[2]==='--delete'){
  deleteData();
}