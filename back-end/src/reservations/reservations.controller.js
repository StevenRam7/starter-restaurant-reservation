/**
 * List handler for reservation resources
 */
 const service = require("./reservations.service");
 const asyncErrorBoundary= require("../errors/asyncErrorBoundary");
 
 //middlewares
function firstNameExists(req, res, next) {
  const { data: { first_name } = {} } = req.body;
  if (first_name) {
    res.locals.Fname = first_name;
    return next();
  } else {
    next({
      status: 400,
      message: `Must include property "first_name".`
    });
  }
}

function lastNameExists(req, res, next) {
  const { data: { last_name } = {} } = req.body;
  if (last_name) {
    res.locals.Lname = last_name;
    return next();
  } else {
    next({
      status: 400,
      message: `Must include property "last_name".`
    });
  }
}

function numberExists(req, res, next) {
  const { data: { mobile_number } = {} }= req.body;
  if (mobile_number) {
    res.locals.number = mobile_number;
    return next();
  } else {
    next({
      status: 400,
      message: `Must include property "mobile_number".`
    });
  }
}

function dateExists(req, res, next) {
  const { data: { reservation_date } = {} }= req.body;
  if (reservation_date) {
    res.locals.date = reservation_date;
    return next();
  } else {
    next({
      status: 400,
      message: `Must include property "reservation_date".`
    });
  }
}

function timeExists(req, res, next){
  const { data: { reservation_time } = {} }= req.body;
  if (reservation_time) {
    res.locals.time = reservation_time;
    return next();
  } else {
    next({
      status: 400,
      message: `Must include property "reservation_time".`
    });
  }
}

function peopleExist(req, res, next){
  const {data: { people } = {} }= req.body;
  //number validation not working
  if (people && !isNaN(people)) {
    res.locals.people = people;
    const reservation = res.locals;
    res.locals.reservation = reservation;
    return next();
  } else {
    next({
      status: 400,
      message: `Must include property "people".`
    });
  }
}

function checkDateTime(req, res, next){
  const errors = [];
  const { date, time } = res.locals;
  const currentDate = new Date();

  //create date object for the reservation
  const [year, month, day] = date.split("-");
  const [hours, minutes] = time.split(":");
  const reserveDate= new Date(Number(year), Number(month)-1, Number(day), Number(hours), Number(minutes), 0);

  const currentMS = currentDate.valueOf();
  const reserveMS = reserveDate.valueOf();
  const weekday = reserveDate.getDay();
  const reserveTime = Number(hours)*60 + Number(minutes);
  const openTime = 10*60 +30;
  const closeTime = 21*60 +30;

  //validations for various date-related conditions
  if (reserveMS < currentMS) {
    errors.push("Reservation date must be in future.");
  } 
  if (weekday == 2) {
    errors.push("The restaurant is closed on Tuesdays.");
  } 
  if (reserveTime > closeTime || reserveTime < openTime) {
    errors.push("Reservations cannot be made before 10:30am or after 9:30pm.");
  } 
  if (errors.length > 0) {
    res.locals.errors = errors;
    next({
      status: 400,
      message: `${errors}`});
  } else {
    return next();
  }
}

async function reservationExists(req, res, next) {
  const { reservationId } = req.params;
  const findWithID = await service.read(reservationId);
  if (findWithID) {
    res.locals.reservation = findWithID;
    return next()
  }
  next({
    status: 404,
    message: `Cannot find reservation ID ${reservationId}.`
  })
}

function statusBooked(req, res, next) {
  const { status } = req.body.data;
  if (status === 'booked' || !status) {
    return next()
  }
  next({
    status: 400,
    message: `Reservation status is ${status}`
  })
}

function statusNotFinished(req, res, next) {
  const { status } = res.locals.reservation;
  if (status != "finished") {
    return next()
  }
  next({
    status: 400,
    message: `Cannot update status once it is finished.`
  })
}

function statusValid(req, res, next) {
  const { status } = req.body.data;
  if (status === "booked" || status === "seated" || status === "finished" || status === "cancelled") {
    return next()
  }
  next({
    status: 400,
    message: `${status} is an invalid status.`
  })
}

//http methods
async function list(req, res) {
  const { date } = req.query;
  const { mobile_number } = req.query;
  if (date) {
    res.json({
      data: await service.listByDate(date),
    });
  } else if (mobile_number) {
    res.json({ data: await service.search(mobile_number) });
  } else
    res.json({ data: await service.list() });
}

async function read(req, res) {
  res.json({ data: await service.read(req.params.reservationId) });
}

async function create(req, res, next) {
  const newReservation = await service.create(req.body.data);
  res.status(201).json({ data: newReservation });
}

async function update(req, res) {
  const updatedR = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id
  }
  res.status(200).json({ data: await service.update(req.params.reservationId, updatedR) })
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [firstNameExists, lastNameExists, numberExists, dateExists, timeExists, peopleExist, checkDateTime, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(reservationExists), read],
  update: [firstNameExists, lastNameExists, numberExists, dateExists, timeExists, peopleExist, checkDateTime, statusBooked, asyncErrorBoundary(update)],
  updateStatus: [reservationExists, statusNotFinished, statusValid, asyncErrorBoundary(update)]
};
