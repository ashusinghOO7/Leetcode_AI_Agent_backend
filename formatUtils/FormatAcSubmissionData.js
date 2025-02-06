const formatAcSubmissionData = (data) => ({
    count: data.recentAcSubmissionList.length,
    submission: data.recentAcSubmissionList,
  });

module.exports = formatAcSubmissionData;