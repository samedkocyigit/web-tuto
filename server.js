const dotenv=require('dotenv');
const port = 3000;
const app = require('./app');

dotenv.config({path: './config.env}'});

console.log(process.env);

app.listen(port, ()=>{
    console.log('app running on port ${port}...');
});