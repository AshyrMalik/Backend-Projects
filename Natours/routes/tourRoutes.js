// tourRoutes.js
const express = require('express');
const { getAllTours, addNewTour, getTour, deleteTour, updateTour, checkId, checkBody } = require("./../controllers/tourController");

const tourRouter = express.Router();

tourRouter.param('id', checkId);
tourRouter.route("/")
  .get(getAllTours)
  .post(checkBody, addNewTour);

tourRouter.route("/:id")
  .get(getTour)
  .delete(deleteTour)
  .patch(updateTour);

module.exports = tourRouter;
