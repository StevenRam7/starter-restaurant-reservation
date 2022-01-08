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
    .orderBy("reservation_date")
    
}

function search(mobileNumber) {
    return knex ("reservations")
    .select("*")
    .where({ mobile_number : mobileNumber })
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
}

async function update(reservationId, data) {
    return knex("reservations")
    .where({ reservation_id : reservationId })
    .update(data)

  }

module.exports = {
    list,
    listByDate,
    search,
    create,
    read,
    update
};