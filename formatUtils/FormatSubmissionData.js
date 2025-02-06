const formatSubmissionData = (data) => ({
    count: data.recentSubmissionList.length,
    submission: data.recentSubmissionList,
  });

module.exports = formatSubmissionData;