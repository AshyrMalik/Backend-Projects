const express = require('express');
const fs = require('fs');

const app = express()

app.use(express.json());
app.use((req,res,next)=>{
    console.log("Hello from the middleware");
    next();
})
app.use((req,res,next)=>{
    req.reqTime= new Date().toISOString();
    next()
})

tours=JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

const getAllTours = (req,res)=>{
    res.status(200).json({
        requestTime:req.reqTime,
        status:"success",
        results:tours.length,
        data:{
            tours
        }

    })
}
const getTour= (req,res)=>{
    console.log(req.params)
    const id = req.params.id *1;
    const tour = tours.find(el=>el.id === id)
    //if (id>tours.length){
    
    if (!tour){
        return res.status(404).json({
            status:"failed",
            message:"invalid id"
        })
    }
    res.status(200).json({
        status:"success",
        tour
    })
}

const deleteTour = (req,res)=>{
    
    if (req.params.id * 1 > tours.length){
        return res.status(404).json({
            status:"failed",
            message:"invalid id"
        })
    }

    res.status(204).json({
        status:"Success",
        data: null 

    })

}

const  addNewTour=(req,res)=>{
    //console.log(req.body)
    new_id = tours[tours.length-1].id +1
    const new_Tour= Object.assign({id:new_id},req.body)
    tours.push(new_Tour)
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours),err=>{
        res.status(201).json({
            status:"Success",
            data:{
                tours : new_Tour
            }
        })
    })
    
 }
// app.get("/api/v1/tours",getAllTours)

// app.get ("/api/v1/tours/:id",getTour)

// app.delete("/api/v1/tours/:id",deleteTour)

// app.post("/api/v1/tours",addNewTour)


app.route("/api/v1/tours").get(getAllTours).post(addNewTour)
app.route("/api/v1/tours/:id").get(getTour).delete(deleteTour).post(addNewTour)

const port = 3000;


app.listen(port, ()=>{
    console.log(`App running on ${port} `)
});
