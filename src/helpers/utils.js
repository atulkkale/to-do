const { Schema } = require('mongoose');

/**
 * Pass Object Or Array Or String Or Number and find if it is empty or not, Null Or Undefined also gives false
 * @param  {Any} data data to be checked against
 * @return {Any} data which is given if it exists or False
 */
exports.checkIfDataExists = (data) => {
  let flagDataExists;
  if (data === 0 ? '0' : data) {
    switch (data.constructor) {
      case Object:
        flagDataExists = Object.keys(data).length ? true : false;
        break;
      case Array:
        flagDataExists = data.length ? true : false;
        break;
      default:
        flagDataExists = true;
        break;
    }
    if (flagDataExists) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

/**
 * @param {Boolean} errMsg
 * @param {Boolean} successStatus
 * @param {Array or Object} data
 * @param {Boolean} paginated
 * @returns {Object}
 */
exports.responseMsg = (errMsg, successStatus, data, paginated) => {
  const responseObj = {
    success: successStatus || false,
    error: errMsg || null,
    data: data || null,
  };

  if (errMsg) {
    return responseObj;
  }

  if (paginated) {
    responseObj.data = data.docs;
    responseObj.page = data.page;
    responseObj.totalDocs = data.totalDocs;
    responseObj.limit = data.limit;
    responseObj.totalPages = data.totalPages;
    responseObj.hasPrevPage = data.hasPrevPage;
    responseObj.hasNextPage = data.hasNextPage;
    responseObj.prevPage = data.prevPage;
    responseObj.nextPage = data.nextPage;
  } else {
    responseObj.data = data.docs || data;
  }

  return responseObj;
};

/**
 * Returns the validation errors if any are found when validating the data.
 * @param  {Schema} schema validation schema
 * @param  {Object} data data to be checked against
 * @return {Object} error which is given if it exists or False
 */
exports.validateData = (schema, data, options) => {
  const validationRes = schema.validate(data, options);
  if (validationRes.error) {
    const {
      error: { details: errors },
    } = validationRes;
    const validationErrObj = {};
    for (let err of errors) {
      validationErrObj[`${err.context.label} error`] = err.message;
    }
    return validationErrObj;
  }
  return false;
};
