const knex = require("../db/connection");

function list() {
    return knex("reservations")
    .select("*")
    .whereNot({ status:"cancelled" })
    .whereNot({ status:"finished" })
}

function listByDate(date) {
    return knex ("reservations")
    .select("*")
    .where({ reservation_date : date })
    .whereNot({ status:"cancelled" })
    .whereNot({ status:"finished" })
    .orderBy("reservation_time")
    
}

function search(mobile_number) {
    return knex('reservations')
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy(`reservation_date`)
}

function create(reservation) {
    return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createRecords) => createRecords[0]);
}

async function read(reservationId) {
    return knex("reservations")
    .select("*")
    .where({ reservation_id : reservationId })
    .first();
}

function update(updatedReservation) {
    return knex('reservations')
      .select('*')
      .where({ reservation_id: updatedReservation.reservation_id })
      .update(updatedReservation, '*')
      .then(updatedRecords => updatedRecords[0])
  }

module.exports = {
    list,
    listByDate,
    search,
    create,
    read,
    update
};