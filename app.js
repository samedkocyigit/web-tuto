const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

const getTours = (req,res)=>{
    res.status(200).json({
        status:'success',
        results: tours.length,
        data:{tours}

    });
};
const getTour = (req,res)=>{
    const id=req.params.id*1;
    const tour= tours.find(el=>el.id===id);

    if(!tour)
    {
        return res.status(404).json({
            status: 'fail',
            message:'InvalidId'
        })
    }

    res.status(200).json({
        status:'success',
        data:{tour}

    });
};

const creatPost=(req,res)=>{
    // console.log(req.body);
    const newId= tours[tours.length-1].id+1;
    const newTour=Object.assign({id:newId},req.body)

    tours.push(newTour);

    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        err=>{
            res.status(200).json({
                status:'success',
                data:{
                    tours: newTour
                }
            });
        }
    );
};

const updateTour=(req,res)=>{
    if(req.params.id*1>tours.length){
        return res.status(400).json({
            status:'fail',
            message:'InvalidId'
        });
    }
    res.status(200).json({
        status:'success',
        data:{
            tour: '<Updated tour here..>'
        }
    });
};

const deleteTour=(req,res)=>{
    if(req.params.id*1>tours.length){
        return res.status(400).json({
            status:'fail',
            message:'InvalidId'
        });
    }
    res.status(203).json({
        status:'success',
        data:null
    })
};

app.get('/api/v1/tours',getTours);
app.get('/api/v1/tours/:id',getTour);
app.post('/api/v1/tours',creatPost);
app.patch('/api/v1/tours/:id',updateTour);
app.delete('/api/v1/tours/:id',deleteTour);

app.route('/api/v1/tours').get(getTours).post(creatPost);
app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);

app.listen(port, ()=>{
    console.log('app running on port ${port}...');
});
