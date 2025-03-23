const express = require('express');
const fs = require('fs');
const {getAllTours,addNewTour,getTour,deleteTour,updateTour}=require("./../controllers/tourController")

tours=JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))


const tourRouter = express.Router()

tourRouter.route("/").get(getAllTours).post(addNewTour)
tourRouter.route("/:id").get(getTour).delete(deleteTour).patch(updateTour)


module.exports = tourRouter