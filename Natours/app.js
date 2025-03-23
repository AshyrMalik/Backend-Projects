const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const app = express()
const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require("./routes/userRoutes.js")


//MIddle Wares
app.use(morgan('dev'))

app.use(express.static(`${__dirname}/public`));

app.use(express.json());


app.use((req,res,next)=>{
    console.log("Hello from the middleware");
    next();
})

app.use((req,res,next)=>{
    req.reqTime= new Date().toISOString();
    next()
})



// Route Handlers 

// app.get("/api/v1/tours",getAllTours)

// app.get ("/api/v1/tours/:id",getTour)

// app.delete("/api/v1/tours/:id",deleteTour)

// app.post("/api/v1/tours",addNewTour)

//Routes 



app.use("/api/v1/tours",tourRouter)
app.use("/api/v1/users/",userRouter)


module.exports= app;