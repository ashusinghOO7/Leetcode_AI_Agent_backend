const { default: axios } = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { default: chat } = require('./prompts/NextSuggestion');
const { getTopicSlugs } = require('./services/ProblemServices');
// const getLast20SolvedProblems = require('./services/ProblemServices');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(cors());

app.use(express.json());

const port = process.env.PORT || 8001;


app.listen(port , () => {
    console.log('Server is running at port ' + port);
})

app.get('/chat', async (req, res) => {
    const userPrompt = req.query.userprompt; // Access the query parameter in lowercase
    Promise.resolve(userPrompt)
    //console.log(userPrompt); // Log the userPrompt to verify it's being received

    if (!userPrompt) {
        return res.status(400).json({ error: "userprompt query parameter is required" });
    }
    try {
        const result = await chat(userPrompt); // Await the async function
        // const result = await getTopicSlugs('scripted_ashu')
        Promise.resolve(result);
        console.log("completed")
        res.json(result); // Send response as JSON
    } catch (error) {
        console.error("Error fetching problems:", error);
        res.status(500).json({ error: "Failed to fetch problems" });
    }
});

