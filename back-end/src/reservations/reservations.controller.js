/**
 * List handler for reservation resources
 */
 const service = require("./reservations.service");
 const asyncErrorBoundary= require("../errors/asyncErrorBoundary")

 //middlewares
function firstNameExists(req, res, next){
  const { data: {first_name} = {} } = req.body;
  if (first_name){
    res.locals.Fname = first_name;
    return next();
  } else{
    next({
      status: 400,
      message: `Must include first name`
    });
  }
}

function lastNameExists(req, res, next){
  const { data: {last_name} = {} } = req.body;
  if (last_name){
    res.locals.Lname = last_name;
    return next();
  } else{
    next({
      status: 400,
      message: `Must include last name`
    });
  }
}

function numberExists(req, res, next){
  const { data: {mobile_number} = {} }= req.body;
  if (mobile_number){
    res.locals.number = mobile_number;
    return next();
  } else{
    next({
      status: 400,
      message: `Must include mobile number`
    });
  }
}

async function dateExists(req, res, next){
  const { data: {reservation_date} = {} }= req.body;
  if (reservation_date){
    res.locals.date = reservation_date;
    return next();
  } else{
    next({
      status: 400,
      message: `Must include date`
    });
  }
}

function timeExists(req, res, next){
  const { data: {reservation_time} = {} }= req.body;
  if (reservation_time){
    res.locals.time = reservation_time;
    return next();
  } else{
    next({
      status: 400,
      message: `Must include time`
    });
  }
}

async function list(req, res) {
  res.json({
    data: [],
  });
}

module.exports = {
  list,
};
