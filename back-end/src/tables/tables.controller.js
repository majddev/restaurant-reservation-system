const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const {
  read: getReservation,
} = require("../reservations/reservations.service");

// #region ============= Primary =========================
/**
 * List handler for tables resources
 * @returns {Array of Objects} all Tables
 * from "tables" table
 */
async function list(req, res) {
  const methodName = "list";
  req.log.debug({ __filename, methodName });

  const tables = await service.list();

  res.status(200).json({ data: await tables });
}

/**
 * Inserts a new table into "tables" table
 * @returns {Object} New Table from "tables"
 */
async function create(req, res) {
  const methodName = "create";
  req.log.debug({ __filename, methodName });

  const { table } = res.locals;

  const newTable = await service.create(table);

  res.status(201).json({ data: await newTable[0] });
}

/**
 * Updates foreign reservation_id for
 * matching table by table_id
 * @returns {Object} Updated table
 */
async function update(req, res) {
  const methodName = "update";
  req.log.debug({ __filename, methodName });

  const { table_id } = req.params;
  const { reservation_id } = req.body.data;

  const seatReservation = await service.update(table_id, reservation_id);

  res.status(200).json({ data: await seatReservation });
}

/**
 * Removes foreign reservation_id for
 * matching table by table_id
 * @returns {Status} 200 for unseated table
 */
async function destroy(req, res) {
  const methodName = "destroy";
  req.log.debug({ __filename, methodName });

  const { table_id } = req.params;
  const { reservation_id } = res.locals.table;

  await service.destroy(table_id,reservation_id);

  res.sendStatus(200);
}
// #endregion

// #region ============= Validation ======================
/**
 * Checks form data from client side
 * Verifies that all fields are filled
 */
function validateTable(req, res, next) {
  const methodName = "validateTable";
  req.log.debug({ __filename, methodName });

  const { data: { table_name, capacity } = {} } = req.body;

  const errors = [];

  if (!table_name || table_name.length < 2) errors.push("table_name");
  if (!capacity) errors.push("capacity");

  if (errors.length) {
    next({
      status: 400,
      message: `The following required fields are missing: ${errors.join(
        ", "
      )}`,
    });

    req.log.trace({ __filename, methodName, valid: false, missing: errors });
  }

  res.locals.table = req.body.data;
  next();
  req.log.trace({ __filename, methodName, valid: true });
}

/**
 * Checks that table capacity
 * given is greater >= minimum
 */
function validateCapacity(req, res, next) {
  const methodName = "validateCapacity";
  req.log.debug({ __filename, methodName });

  const { capacity } = res.locals.table;

  if (capacity < 1) {
    next({
      status: 400,
      message: `Table capacity must be greater than 1. Capacity given: ${capacity}`,
    });

    req.log.trace({
      __filename,
      methodName,
      valid: false,
      reason: "Capacity less than 1",
    });
  }

  next();
  req.log.trace({ __filename, methodName, valid: true });
}

/**
 * Queries DB to retrieve
 * table by table_id
 * ---
 * If exists, proceed to next middleware
 * else, respond with error not found
 */
async function tableExists(req, res, next) {
  const methodName = "tableExists";
  req.log.debug({ __filename, methodName });

  const { table_id } = req.params;

  const table = await service.read(table_id);

  if (await table) {
    res.locals.table = table;
    next();
  } else {
    next({
      status: 404,
      message: `Table ${table_id} not found.`,
    });

    req.log.debug({
      __filename,
      methodName,
      valid: false,
      reason: `Table ${table_id} not found.`,
    });
  }
}

/**
 * Verifies table is not occupied
 */
function tableIsEmpty(req, res, next) {
  const methodName = "tableIsEmpty";
  req.log.debug({ __filename, methodName });

  const { table_id } = req.params;
  const { table } = res.locals;

  if (table.reservation_id) {
    next({
      status: 400,
      message: `Table ${table_id} is currently occupied!`,
    });

    req.log.debug({
      __filename,
      methodName,
      valid: false,
      reason: `Table ${table_id} is currently occupied!`,
    });
  }

  next();
}

/**
 * Opposite of tableIsEmpty
 * Checks for already occupied table
 * for DELETE request
 */
function tableIsOccupied(req, res, next) {
  const methodName = "tableIsOccupied";
  req.log.debug({ __filename, methodName });

  const { table_id } = req.params;
  const { table } = res.locals;

  if (table.reservation_id === null) {
    next({
      status: 400,
      message: `Table ${table_id} is not occupied.`,
    });

    req.log.debug({
      __filename,
      methodName,
      valid: false,
      reason: `Table ${table_id} is not occupied.`,
    });
  }

  next();
}

/**
 * Retrieve reservation by ID
 */
async function reservationExists(req, res, next) {
  const methodName = "reservationExists";
  req.log.debug({ __filename, methodName });

  const { reservation_id } = req.body.data;

  const reservation = await getReservation(reservation_id);

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
 * Confirm table is not already seated
 */
function isNotSeated(req, res, next) {
  const methodName = "isNotSeated";
  req.log.debug({ __filename, methodName });

  const { reservation_id, status } = res.locals.reservation;

  if (status !== "seated") {
    next();
  } else {
    next({
      status: 400,
      message: `Reservation ${reservation_id} is already seated!`,
    });

    req.log.debug({
      __filename,
      methodName,
      valid: false,
      reason: `Reservation ${reservation_id} is already seated!`,
    });
  }
}

/**
 * Checks if requested table
 * will fit requested
 * party size
 */
function tableFits(req, res, next) {
  const methodName = "tableFits";
  req.log.debug({ __filename, methodName });

  const { table, reservation } = res.locals;
  const { capacity } = table;
  const { people } = reservation;

  if (capacity < people) {
    next({
      status: 400,
      message: `Table capacity of ${capacity} is too small for a group of ${people}!`,
    });

    req.log.debug({
      __filename,
      methodName,
      valid: false,
      reason: `Table too small. Capacity: ${capacity} :: Party Size: ${people}`,
    });
  }

  next();
}

/**
 * Verifies that PUT request
 * has relevant data;
 */
function hasData(req, res, next) {
  const methodName = "hasData";
  req.log.debug({ __filename, methodName });

  const { data: { reservation_id } = {} } = req.body;

  if (!reservation_id) {
    next({
      status: 400,
      message: `Request body must have reservation_id`,
    });

    req.log.trace({
      __filename,
      methodName,
      valid: false,
      missing: "reservation_id",
    });
  }

  next();
}
// #endregion

// #region ============= Helper Functions ================

// #endregion

module.exports = {
  list: asyncErrorBoundary(list),
  create: [validateTable, validateCapacity, asyncErrorBoundary(create)],
  update: [
    hasData,
    asyncErrorBoundary(tableExists),
    tableIsEmpty,
    asyncErrorBoundary(reservationExists),
    isNotSeated,
    tableFits,
    asyncErrorBoundary(update),
  ],
  destroy: [asyncErrorBoundary(tableExists), tableIsOccupied, destroy],
};
