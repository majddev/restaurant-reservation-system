import axios from "axios";
import { formatAsDate, formatAsTime } from "./date-time";
const { REACT_APP_API_BASE_URL, NODE_ENV } = process.env;

/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
const API_BASE_URL =
  NODE_ENV === "production" ? REACT_APP_API_BASE_URL : "http://localhost:5000";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

// #region Reservations
/**
 * Takes in a axios cancel token
 * @param source
 * @returns {Promise<[reservation]>}
 */
export async function listReservations(query = null, source) {
  const baseUrl = `${API_BASE_URL}/reservations`;

  const url = query !== null ? await checkQuery(baseUrl, query) : baseUrl;

  const config = {
    headers,
    cancelToken: source.token,
  };

  return axios
    .get(url, { config })
    .then(({ data }) => data)
    .then(({ data }) => {
      /**
       * Converts date and time into
       * proper format for use by client
       * if there is any data to parse
       */
      if (data.length) {
        data.forEach(({ reservation_date, reservation_time }, index) => {
          data[index].reservation_date = formatAsDate(reservation_date);
          data[index].reservation_time = formatAsTime(reservation_time);
        });
      }

      return data;
    })
    .catch(({ response }) => {
      const { status } = response;
      const { error } = response.data;

      return Promise.reject({ status, message: error });
    });
}

/**
 * Takes in a base URL and a query
 * Compares for valid queries and returns
 * appropriate server route
 * @param {String} url base URL
 * @param {String} query possible query
 * @returns {String} complete server route with query
 */
function checkQuery(url, query) {
  if (query.match(/\d\d\d\d-\d\d-\d\d/)) return `${url}?date=${query}`;
  else if (query.match(/\d\d\d-\d\d\d-\d\d\d\d/))
    return `${url}?mobile_number=${query}`;
  else return `${url}`;
}

/**
 * Gets single reservation by
 * reservation_id
 * @param {Integer} reservation_id
 * @param {Token} source
 * @returns {Promise<[reservation]>}
 */
export function readReservation(reservation_id, source) {
  const url = `${API_BASE_URL}/reservations/${reservation_id}`;

  const config = {
    headers,
    cancelToken: source.token,
  };

  return axios
    .get(url, { config })
    .then((res) => res.data.data)
    .catch(({ response }) => {
      const { status } = response;
      const { error } = response.data;

      return Promise.reject({ status, message: error });
    });
}

/**
 * Takes in form data as
 * new reservation object
 * @param {Object} reservation
 * @returns {Promise}
 */
export function createReservation(reservation) {
  const url = `${API_BASE_URL}/reservations`;

  const config = { headers };

  return axios
    .post(url, { data: reservation }, { config })
    .then((res) => res.data.data)
    .catch(({ response }) => {
      const { status } = response;
      const { error } = response.data;

      return Promise.reject({ status, message: error });
    });
}

/**
 * Takes in form data as
 * reservation object
 * to update in DB
 * @param {Object} reservation
 * @returns {Promise}
 */
export function updateReservation(updatedReservation, reservation_id) {
  const url = `${API_BASE_URL}/reservations/${reservation_id}`;

  const config = { headers };

  return axios
    .put(url, { data: updatedReservation }, { config })
    .then((res) => res.data.data)
    .catch(({ response }) => {
      const { status } = response;
      const { error } = response.data;

      return Promise.reject({ status, message: error });
    });
}

/**
 * Takes in reservation_id
 * Updates status for matching
 * reservation to "cancelled"
 * @param {Object} reservation
 * @returns {Promise}
 */
export function cancelReservation(reservation_id) {
  const url = `${API_BASE_URL}/reservations/${reservation_id}/status`;

  const config = { headers };

  return axios
    .put(url, { data: { status: "cancelled" } }, { config })
    .then((res) => res.data.data)
    .catch(({ response }) => {
      const { status } = response;
      const { error } = response.data;

      return Promise.reject({ status, message: error });
    });
}
// #endregion Reservations

// #region Tables
/**
 * Takes in a axios cancel token
 * @param source
 * @returns {Promise<[tables]>}
 */
export function listTables(source) {
  const url = `${API_BASE_URL}/tables`;

  const config = {
    headers,
    cancelToken: source.token,
  };

  return axios
    .get(url, { config })
    .then((res) => res.data.data)
    .catch(({ response }) => {
      const { status } = response;
      const { error } = response.data;

      return Promise.reject({ status, message: error });
    });
}

/**
 * Takes in form data as
 * new table object
 * @param {Object} table
 * @returns {Promise}
 */
export function createTable(table) {
  const url = `${API_BASE_URL}/tables`;

  const config = { headers };

  return axios
    .post(url, { data: table }, { config })
    .then((res) => res.data.data)
    .catch(({ response }) => {
      const { status } = response;
      const { error } = response.data;

      return Promise.reject({ status, message: error });
    });
}

/**
 * Takes in table and reservation
 * ID to update related Table's
 * reservation_id, "seating"
 * related reservation at that
 * table.
 * @param {Integer} table_id
 * @param {Integer} reservation_id
 * @returns {Promise}
 */
export function seatTable(table_id, reservation_id) {
  const url = `${API_BASE_URL}/tables/${table_id}/seat`;

  const config = { headers };

  return axios
    .put(url, { data: { reservation_id } }, { config })
    .then((res) => res.data.data)
    .catch(({ response }) => {
      const { status } = response;
      const { error } = response.data;

      return Promise.reject({ status, message: error });
    });
}

/**
 * Takes in table ID and
 * "unseats" reservation from
 * table (delete reservation_id)
 * @param {Integer} table_id
 * @returns {Promise}
 */
export function finishTable(table_id) {
  const url = `${API_BASE_URL}/tables/${table_id}/seat`;

  const config = { headers };

  return axios
    .delete(url, { config })
    .then()
    .catch(({ response }) => {
      const { status } = response;
      const { error } = response.data;

      return Promise.reject({ status, message: error });
    });
}
// #endregion Tables
