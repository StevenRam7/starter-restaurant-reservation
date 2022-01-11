/**
 * List handler for reservation resources
 */
 const service = require("./reservations.service");
 const asyncErrorBoundary= require("../errors/asyncErrorBoundary");
 
//middlewares
function dataExists(req, res, next) {
  if (req.body.data) {
    next();
  } else {
    next({
      status: 400,
      message: "No data was received.",
    });
  }
}

async function reservationExists(req, res, next) {
  const { reservationId } = req.params;
  const findWithID = await service.read(reservationId);
  if (findWithID) {
    res.locals.found = findWithID;
    return next()
  }
  next({
    status: 404,
    message: `Cannot find reservation ID ${reservationId}.`
  })
}

function firstNameExists(req, res, next) {
  const { first_name } = req.body.data;
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
  const { last_name } = req.body.data;
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
  const { mobile_number }= req.body.data;
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
  const { reservation_date } = req.body.data;
  if (reservation_date && reservation_date.match(/\d\d\d\d-\d\d-\d\d/)) {
    res.locals.date = reservation_date;
    return next();
  } else {
    next({
      status: 400,
      message: `Must include property "reservation_date".`
    });
  }
}

function timeExists(req, res, next) {
  const { reservation_time } = req.body.data;
  if (reservation_time && reservation_time.match(/\d\d:\d\d/)) {
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
  const { people } = req.body.data;
  if (people && typeof people == "number") {
    return next();
  } else {
    next({
      status: 400,
      message: `Must include property "people".`
    });
  }
}

function inFuture(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  let current = Date.now()
  const givenDate = new Date(reservation_date + ' ' + reservation_time);
  if (givenDate > current) {
    next()
  } else {
    return next({
      status: 400,
      message: 'reservation_time must be made in the future.'
    })
  }
}

function notTuesday(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const givenDate = new Date(reservation_date + ' ' + reservation_time);
  const dayNumber = givenDate.getDay();
  if (dayNumber == 2) {
    return next({
      status: 400,
      message: 'Restaurant is closed on Tuesdays, please select another day.'
    })
  } else {
    return next();
  }
}

function correctHours(req, res, next) {
  const { reservation_time } = req.body.data;
  if (reservation_time < '10:30' || reservation_time > '21:30') {
    return next({
      status: 400,
      message: 'reservation_time must be made between 10:30 am and 9:30 pm.'
    })
  } else {
    return next()
  }
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

function notFinished(req, res, next) {
  const { status } = res.locals.found;
  if (status != "finished") {
    return next()
  }
  next({
    status: 400,
    message: `Cannot update status once it is finished.`
  })
}

function notBooked(req, res, next) {
  const { status } = req.body.data;
  if (status) {
    if (status !== 'booked') {
      next({
        status: 400,
        message: `A new reservation cannot have a status of ${status}`,
      });
    }
  }
  next();
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
    reservation_id: res.locals.found.reservation_id
  }
  res.status(200).json({ data: await service.update(updatedR) })
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [dataExists, firstNameExists, lastNameExists, numberExists, dateExists, timeExists, peopleExist, notBooked, inFuture, notTuesday, correctHours, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(reservationExists), read],
  update: [asyncErrorBoundary(reservationExists), firstNameExists, lastNameExists, numberExists, dateExists, peopleExist, statusBooked, inFuture, notTuesday, correctHours, asyncErrorBoundary(update)],
  updateStatus: [asyncErrorBoundary(reservationExists), notFinished, statusValid, asyncErrorBoundary(update)]
};
