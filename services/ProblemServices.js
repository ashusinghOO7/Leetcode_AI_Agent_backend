const express = require('express');
const leetcodeAPIURL = require('../constants/LeetcodeAPI');
const axios = require('axios');

const app = express();

async function getLast20SolvedProblems(username) {
    try {
        const response = await axios.get(`${leetcodeAPIURL + username}/acSubmission`);
        return response.data; 
    } catch (error) {
        console.error(error);
        throw error;  // Throw error so it can be handled by the caller
    }
}

async function getTopicSlugs(username) {
    try {
        const topics = new Map(); // Use a Map to store topic slugs and their difficulty counts

        const data = await getLast20SolvedProblems(username);
        Promise.resolve(data); // Ensure data is a promise
        // console.log("lastQ" + data)
        // Create an array of promises
        const promises = data.submission.map(async (problem) => {
            try {
                const res = await axios.get(`${leetcodeAPIURL}select?titleSlug=${problem.titleSlug}`);
                const difficultyLevel = res.data.difficulty.toLowerCase(); // Ensure consistency in difficulty level naming

                // Update the difficulty count for each topic tag
                res.data.topicTags.forEach((topic) => {
                    const topicSlug = topic.slug;

                    // Initialize the topic in the map if it doesn't exist
                    if (!topics.has(topicSlug)) {
                        topics.set(topicSlug, { easy: 0, medium: 0, hard: 0 });
                    }

                    // Increment the corresponding difficulty count
                    const topicData = topics.get(topicSlug);
                    if (difficultyLevel === 'easy') {
                        topicData.easy += 1;
                    } else if (difficultyLevel === 'medium') {
                        topicData.medium += 1;
                    } else if (difficultyLevel === 'hard') {
                        topicData.hard += 1;
                    }
                });
            } catch (err) {
                console.error("Error fetching topic tags:", err);
            }
        });

        // Wait for all promises to resolve
        await Promise.all(promises);
        // Convert the Map to an array of objects for easier JSON serialization
        const result = Array.from(topics).map(([topicSlug, counts]) => ({
            topic: topicSlug,
            counts,
        }));

        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function getUserSkillStats(username) {
    //console.log(username);
    try {
        const skillData = await axios.get(`${leetcodeAPIURL}skillStats/${username}`);
        return skillData.data.data.matchedUser.tagProblemCounts;
    }
    catch (error) {
        console.error(error);
        throw error
    }
    
}

// Make another function to store the accuracy of each topic

module.exports = {
    getLast20SolvedProblems,
    getTopicSlugs,
    getUserSkillStats
};
