const formatAcSubmissionData = require('../formatUtils/FormatAcSubmissionData');
const last20acSubmission = require('../queries/Last20acSubmission');
const fetchUserDetails = require('./FetchUserDetails');


const acSubmission = (req, res) => {
    fetchUserDetails(
      req.params.username,
      20,
      res,
      formatAcSubmissionData,
      last20acSubmission
    );
  };

  
  module.exports = { acSubmission };