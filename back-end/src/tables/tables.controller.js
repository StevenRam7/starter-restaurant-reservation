const service = require("./tables.service");
const reservationService = require('../reservations/reservations.service');
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

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

async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const table = await service.read(table_id);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({ 
    status: 404, 
    message: `Table id ${table_id} cannot be found.` });
}

async function reservationExists(req, res, next) {
    const { reservation_id } = req.body.data;
    if (!reservation_id) {
      next({
        status: 400,
        message: `A reservation_id is required`,
      });
    }
    const reservation = await reservationService.read(reservation_id);
    if (reservation) {
      res.locals.reservation = reservation;
      next();
    } else {
      next({
        status: 404,
        message: `The reservation ${reservation_id} does not exist.`,
      });
    }
}

function validTableName(req, res, next) {
  const { table_name } = req.body.data;
  if (!table_name || table_name === '' || table_name.length < 2) {
    next({
      status: 400,
      message: "table_name must be longer than one character",
    });
  }
  next();
}

function capacityIsNum(req, res, next) {
  const { capacity } = req.body.data;
  if (!capacity || capacity < 1 || typeof capacity !== "number") {
    next({
      status: 400,
      message: "The capacity must be a number 1 or higher.",
    });
  }
  next();
}

function hasEnoughCapacity(req, res, next) {
  const { reservation, table } = res.locals;
  if (Number(table.capacity) < Number(reservation.people)) {
    next({
      status: 400,
      message: `Table does not have enough capacity for reservation party.`,
    });
  }
  return next();
}

function tableIsNotTaken(req, res, next) {
  const { reservation_id } = res.locals.table;
  if (reservation_id) {
    return next({
      status: 400,
      message: "Table is occupied",
    });
  }
  next();
}

function tableIsTaken(req, res, next) {
  const { reservation_id } = res.locals.table;
  if (!reservation_id) {
    return next({
      status: 400,
      message: "Table is not occupied",
    });
  }
  next();
}

function statusNotSeated(req, res, next) {
  const { status } = res.locals.reservation;
  if (status === "seated") {
    return next({
      status: 400,
      message: `reservation status is ${status}`,
    });
  }
  next();
}

async function updateStatusToSeated(req, res, next) {
  const updatedReservation = {
    ...res.locals.reservation,
    status: "seated",
  };
  await service.updateReservationStatus(updatedReservation);
  next();
}

async function clearTable(req, res) {
  const reservation = await service.readReservation(
    res.locals.table.reservation_id
  );
  const updatedReservation = { ...reservation, status: "finished" };
  await service.updateReservationStatus(updatedReservation);
  await service.clearTable(req.params.table_id);
  res.status(200).json({});
}

async function create(req, res, next) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

async function list(req, res) {
  const data = await service.list();
  res.json({ data: data });
}

async function update(req, res) {
  const updatedTable = {
    ...req.body.data,
    table_id: res.locals.table.table_id,
  };
  const data = await service.update(updatedTable);
  res.status(200).json({ data: data });
}

async function read(req, res) {
  const data = res.locals.table;
  res.json({ data: data });
}

async function destroy(req, res) {
  const { table } = res.locals;
  await service.clearTable(table.table_id);
  res.sendStatus(204);
}

module.exports = {
  create: [dataExists, validTableName, capacityIsNum, asyncErrorBoundary(create)],
  list: [asyncErrorBoundary(list)],
  update: [
    dataExists,
    tableExists,
    asyncErrorBoundary(reservationExists),
    hasEnoughCapacity,
    tableIsNotTaken,
    updateStatusToSeated,
    statusNotSeated,
    asyncErrorBoundary(update),
  ],
  read: [asyncErrorBoundary(tableExists), asyncErrorBoundary(read)],
  clearTable: [
    tableExists,
    asyncErrorBoundary(tableIsTaken),
    asyncErrorBoundary(clearTable),
  ],
  delete: [asyncErrorBoundary(tableExists), asyncErrorBoundary(destroy)],
};
