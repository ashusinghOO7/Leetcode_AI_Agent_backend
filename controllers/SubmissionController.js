const formatSubmissionData = require('../formatUtils/FormatSubmissionData');
const last20Submission = require('../queries/Last20Submission');
const fetchUserDetails = require('./FetchUserDetails');


const submission = (req, res) => {
    fetchUserDetails(
      req.params.username,
      20,
      res,
      formatSubmissionData,
      last20Submission
    );
  };

  
  module.exports = { submission };