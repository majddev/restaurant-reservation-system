const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// #region ============= Primary =========================
/**
 * List handler for reservation resources
 * @returns {Array of Objects} All reservations from table
 */
async function list(req, res) {
  const methodName = "list";
  req.log.debug({ __filename, methodName });

  const { date, mobile_number } = req.query;

  let reservations;

  if (date) reservations = await service.listWithDate(date);
  else if (mobile_number) reservations = await service.search(mobile_number);
  else reservations = await service.list();

  res.status(200).json({ data: await reservations });
}

/**
 * Inserts a new reservation into reservation table
 * @returns {Object} New Reservation from table
 */
async function create(req, res) {
  const methodName = "create";
  req.log.debug({ __filename, methodName });

  const { reservation } = res.locals;

  const newReservation = await service.create(reservation);

  res.status(201).json({ data: await newReservation[0] });
}

/**
 * Retrieves reservation by ID
 * from DB and sends to client
 * @returns {Object} Reservation from table
 */
function read(req, res) {
  const methodName = "read";
  req.log.debug({ __filename, methodName });

  const { reservation } = res.locals;

  res.status(200).json({ data: reservation });
}

/**
 * Updates reservation
 * by ID
 * @returns {Object} Updated reservation from table
 */
async function update(req, res) {
  const methodName = "update";
  req.log.debug({ __filename, methodName });

  const { reservation_id } = req.params;
  const { reservation } = res.locals;

  const updatedReservation = await service.update(reservation, reservation_id);

  res.status(200).json({ data: await updatedReservation[0] });
}

/**
 * Updates status column for
 * reservation by ID
 * @returns {Object} Updated reservation from table
 */
async function updateStatus(req, res) {
  const methodName = "updateStatus";
  req.log.debug({ __filename, methodName });

  const { reservation_id } = req.params;
  const { status } = res.locals;

  const updatedReservation = await service.updateStatus(reservation_id, status);
  const updatedStatus = await updatedReservation[0].status;

  res.status(200).json({ data: { status: await updatedStatus } });
}
// #endregion

// #region ============= Validation ======================
/**
 * Checks form data from client side
 * Verifies that all fields are filled
 */
function validateReservation(req, res, next) {
  const methodName = "validateReservation";
  req.log.debug({ __filename, methodName });

  const {
    data: {
      first_name,
      last_name,
      mobile_number,
      reservation_date,
      reservation_time,
      people,
    } = {},
  } = req.body;

  const errors = [];

  if (!first_name) errors.push("first_name");
  if (!last_name) errors.push("last_name");
  if (!mobile_number) errors.push("mobile_number");
  if (!reservation_date || !isDate(reservation_date))
    errors.push("reservation_date");
  if (!reservation_time || !isTime(reservation_time))
    errors.push("reservation_time");
  if (!people || typeof people !== "number") errors.push("people");

  if (errors.length) {
    next({
      status: 400,
      message: `The following required fields are missing or invalid: ${errors.join(
        ", "
      )}`,
    });

    req.log.debug({ __filename, methodName, valid: false, missing: errors });
  }

  res.locals.reservation = req.body.data;
  next();
  req.log.trace({ __filename, methodName, valid: true });
}

/**
 * Checks that date given is
 * not on a Tuesday
 */
function isNotTuesday(req, res, next) {
  const methodName = "isNotTuesday";
  req.log.debug({ __filename, methodName });

  const { reservation_date } = res.locals.reservation;

  const day = new Date(reservation_date).getUTCDay();

  if (day === 2) {
    next({
      status: 400,
      message: `The restaurant is closed on Tuesdays. Please choose a different day.`,
    });

    req.log.debug({
      __filename,
      methodName,
      valid: false,
      reason: "Tuesday is not a valid day.",
    });
  }

  next();
  req.log.trace({ __filename, methodName, valid: true });
}

/**
 * Checks that date given is on
 * a later/future date from "today"
 */
function isFutureDate(req, res, next) {
  const methodName = "isFutureDate";
  req.log.debug({ __filename, methodName });

  const { reservation_date } = res.locals.reservation;
  const today = new Date();

  const formattedDate = formatDate(today);
  req.log.trace({ __filename, methodName: "formatDate", formattedDate });

  const testDates = !!compare(reservation_date, formattedDate);

  //next({ status: 400, message: testDates });

  if (!testDates) {
    next({
      status: 400,
      message: `The reservation must be on a future date.`,
    });

    req.log.debug({
      __filename,
      methodName,
      valid: false,
      reason: `${reservation_date} is not in the future. Today: ${formattedDate}`,
    });
  }

  next();
}

/**
 * Checks that reservation time
 * is between 10:30 and 21:30
 */
function isValidTime(req, res, next) {
  const methodName = "isValidTime";
  req.log.debug({ __filename, methodName });

  const lower = toMinutes("10:30"); // 10:30 AM
  const upper = toMinutes("21:30"); // 9:30 PM
  const { reservation_time } = res.locals.reservation;

  const formattedTIme = toMinutes(reservation_time);
  req.log.trace({ __filename, methodName: "toMinutes", formattedTIme });

  if (formattedTIme < lower || formattedTIme > upper) {
    next({
      status: 400,
      message: `The reservation time must be between 10:30 - 21:30. Your time: ${reservation_time}`,
    });

    req.log.debug({
      __filename,
      methodName,
      valid: false,
      reason: `${reservation_time} is not a valid time. Valid timeframe is between 10:30 - 21:30.`,
    });
  }

  next();
}

/**
 * Queries DB to retrieve
 * reservation by reservation_id
 * ---
 * If exists, proceed to "read" and respond
 * else, respond with error not found
 */
async function reservationExists(req, res, next) {
  const methodName = "reservationExists";
  req.log.debug({ __filename, methodName });

  const { reservation_id } = req.params;

  const reservation = await service.read(reservation_id);

  if (await reservation) {
    res.locals.reservation = reservation;
    next();
  } else {
    next({
      status: 404,
      message: `Reservation ${reservation_id} not found.`,
    });

    req.log.debug({
      __filename,
      methodName,
      valid: false,
      reason: `Reservation ${reservation_id} not found.`,
    });
  }
}

/**
 * For POST request
 * Checks status in request body
 * for invalid statuses
 */
function isInvalidStatus(req, res, next) {
  const methodName = "isValidStatus";
  req.log.debug({ __filename, methodName });

  const { status } = res.locals.reservation;
  const invalidStatuses = ["seated", "finished"];

  if (invalidStatuses.includes(status)) {
    next({
      status: 400,
      message: `${status} is not a valid reservation status!`,
    });

    req.log.debug({
      __filename,
      methodName,
      valid: false,
      reason: `${status} is not a valid reservation status!`,
    });
  } else next();
}

/**
 * For PUT request
 * Checks status in request body
 * for valid statuses
 */
function isValidStatus(req, res, next) {
  const methodName = "isValidStatus";
  req.log.debug({ __filename, methodName });

  const { data: { status } = {} } = req.body;
  const validStatuses = ["booked", "seated", "finished", "cancelled"];

  if (validStatuses.includes(status)) {
    res.locals.status = status;
    next();
  } else {
    next({
      status: 400,
      message: `${status} is not a valid reservation status!`,
    });

    req.log.debug({
      __filename,
      methodName,
      valid: false,
      reason: `${status} is not a valid reservation status!`,
    });
  }
}

/**
 * For PUT request
 * Checks reservation is
 * not already finished
 */
function statusNotFinished(req, res, next) {
  const methodName = "statusNotFinished";
  req.log.debug({ __filename, methodName });

  const { reservation_id, status } = res.locals.reservation;

  if (status === "finished") {
    next({
      status: 400,
      message: `Reservation ${reservation_id} is already finished.`,
    });

    req.log.debug({
      __filename,
      methodName,
      valid: false,
      reason: `Reservation ${reservation_id} is already finished.`,
    });
  } else next();
}
// #endregion

// #region ============= Helper Functions ================
function isDate(date) {
  const regex = /[0-9\-]/g;
  date = date.match(regex);

  if (date) {
    date = date.join([]);

    if (date.length !== 10) return false;
    else return true;
  } else return false;
}

function isTime(time) {
  const regex = /[0-9\:]/g;

  time = time.match(regex);

  if (time) {
    time = time.join([]);

    if (time.length !== 5) return false;
    else return true;
  } else return false;
}

function formatDate(date) {
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();

  return `${year}-${month}-${day}`;
}

function compare(first, sec) {
  const firstDate = first.split("-");
  const secDate = sec.split("-");

  for (let i = 0; i < 3; i++) {
    if (parseInt(firstDate[i]) === parseInt(secDate[i])) {
      if (i == 2) return 0;
      else continue;
    } else if (parseInt(firstDate[i]) > parseInt(secDate[i])) return 1;
    else if (parseInt(firstDate[i]) > parseInt(secDate[i])) return -1;
    else return 0;
  }
}

function toMinutes(timeString) {
  const [hour, minutes] = timeString.split(":");

  return Number.parseInt(hour) * 60 + Number.parseInt(minutes);
}

/* function formatPhone(phone) {
  const numbers = phone.match(/\d/g).map(Number);

  numbers.splice(3, 0, "-");
  numbers.splice(7, 0, "-");

  return numbers.join("");
} */
// #endregion

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    validateReservation,
    isInvalidStatus,
    isFutureDate,
    isNotTuesday,
    isValidTime,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), read],
  update: [
    asyncErrorBoundary(reservationExists),
    validateReservation,
    isInvalidStatus,
    isFutureDate,
    isNotTuesday,
    isValidTime,
    asyncErrorBoundary(update),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    statusNotFinished,
    isValidStatus,
    updateStatus,
  ],
};
