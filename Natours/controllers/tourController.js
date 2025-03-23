// tourController.js
const fs = require('fs');
tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: "failed",
      message: "Missing name or price"
    });
  }
  next();
};

exports.checkId = (req, res, next, val) => {
  const id = Number(val);
  console.log(id);
  const tour = tours.find(el => el.id === id);
  if (!tour) {
    return res.status(404).json({
      status: "failed",
      message: "Invalid id"
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    requestTime: req.reqTime,
    status: "success",
    results: tours.length,
    data: {
      tours
    }
  });
};

exports.getTour = (req, res) => {
  console.log(req.params);
  const id = Number(req.params.id);
  const tour = tours.find(el => el.id === id);
  res.status(200).json({
    status: "success",
    tour
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: "Success",
    data: null 
  });
};

exports.addNewTour = (req, res) => {
  // Increment the id from the last tour in the array
  const new_id = tours[tours.length - 1].id + 1;
  const new_Tour = Object.assign({ id: new_id }, req.body);
  tours.push(new_Tour);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(201).json({
      status: "Success",
      data: {
        tours: new_Tour
      }
    });
  });
};

exports.updateTour = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet implemented"
  });
};
