const formatQuestionData = require("../formatUtils/FormatQuestionData");
const { default: selectedProblemquery } = require("../queries/SelectedProblem");
const fetchSingleProblem = require("./FetchSingleProblem");

const selectProblem = (req, res) => {
    const title = req.query.titleSlug;
    if (title !== undefined) {
      fetchSingleProblem(
        res,
        formatQuestionData,
        selectedProblemquery,
        title
      );
    } else {
      res.status(400).json({
        error: 'Missing or invalid query parameter: titleSlug',
        solution: 'put query after select',
        example: 'localhost:3000/select?titleSlug=two-sum',
      });
    }
  };

  module.exports = selectProblem;
  