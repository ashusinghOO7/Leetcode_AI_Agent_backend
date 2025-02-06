require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const chat = require('./prompts/NextSuggestion').default;
const { getTopicSlugs, getLast20SolvedProblems, getUserSkillStats } = require('./services/ProblemServices');
const skillStatsQuery = require('./queries/SkillStatsQuery');
const { acSubmission } = require('./controllers/ACSubmissionController');
const { submission } = require('./controllers/SubmissionController');
const selectProblem = require('./controllers/SelectedProblem');

const API_URL = 'https://leetcode.com/graphql';
const port = process.env.PORT || 8001;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(express.json());

// Middleware for logging requests
app.use((req, _res, next) => {
    console.log('Requested URL:', req.originalUrl);
    next();
});

// Start server
app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});

// Chat endpoint
// app.get('/:username/acSubmission', acSubmission);
// app.get('/:username/submission' , async (req,res) => {
//     const username = req.params.username;
//     const result = await getUserSkillStats(username);
//     //console.log(result);
//     res.send(result);
// });

// app.get('/select', selectProblem);

app.get('/chat', async (req, res) => {
    const userPrompt = req.query.userprompt; 

    if (!userPrompt) {
        return res.status(400).json({ error: "userprompt query parameter is required" });
    }

    try {
        const result = await chat(userPrompt); 
        console.log("Chat request completed");
        res.json(result); 
    } catch (error) {
        console.error("Error fetching chat response:", error);
        res.status(500).json({ error: "Failed to process request" });
    }
});

// app.get('/skillStats/:username', async (req, res) => {
//     const { username } = req.params;
//     await handleRequest(res, skillStatsQuery, { username });
//   });
  
  const handleRequest = async (res, query, params) => {
    try {
      const data = await queryLeetCodeAPI(query, params);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  async function queryLeetCodeAPI(query, variables) {
    try {
      const response = await axios.post(API_URL,  query, variables);
      console.log(API_URL);
      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(`Error from LeetCode API: ${error.response.data}`);
      } else if (error.request) {
        throw new Error('No response received from LeetCode API');
      } else {
        throw new Error(`Error in setting up the request: ${error.message}`);
      }
    }
  }
  
