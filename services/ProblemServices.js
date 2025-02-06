const express = require('express');
const leetcodeAPIURL = require('../constants/LeetcodeAPI');
const axios = require('axios');
const last20Submission = require('../queries/Last20Submission');
const formatSubmissionData = require('../formatUtils/FormatSubmissionData');
const { default: selectedProblemquery } = require('../queries/SelectedProblem');
const formatQuestionData = require('../formatUtils/FormatQuestionData');
const skillStatsQuery = require('../queries/SkillStatsQuery');
const API_URL = 'https://leetcode.com/graphql';

const app = express();

async function getLast20SolvedProblems(username) {
    try {
        const response = await fetch('https://leetcode.com/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Referer: 'https://leetcode.com',
          },
          body: JSON.stringify({
            query: last20Submission,
            variables: {
              username: username, // username required
              limit: 20, // only for submission
            },
          }),
        });
    
        const result = await response.json();
        // console.log(result)
    
        if (result.errors) {
          return result;
        }
        return formatSubmissionData(result.data);
      } catch (err) {
        console.error('Error: ', err);
        return err;
      }
}

async function getSingleProblemDetails(titleSlug){
    try {
        const response = await fetch('https://leetcode.com/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Referer: 'https://leetcode.com',
          },
          body: JSON.stringify({
            query: selectedProblemquery,
            variables: {
              titleSlug, //search question using titleSlug
            },
          }),
        });
    
        const result = await response.json();
    
        if (result.errors) {
          return result;
        }
    
        return formatQuestionData(result.data);
      } catch (err) {
        console.error('Error: ', err);
        return err;
      }
}

async function getTopicSlugs(username) {
    try {
        const topics = new Map(); // Use a Map to store topic slugs and their difficulty counts

        const data = await getLast20SolvedProblems(username);
        
        // Wait for all the promises to resolve
        await Promise.all(data.submission.map(async (problem) => {
            try {
                const res = await getSingleProblemDetails(problem.titleSlug);
                const difficultyLevel = res.difficulty.toLowerCase(); // Ensure consistency in difficulty level naming

                // Update the difficulty count for each topic tag
                res.topicTags.forEach((topic) => {
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
        }));

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
    try {
        const response = await fetch('https://leetcode.com/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Referer: 'https://leetcode.com',
          },
          body: JSON.stringify({
            query: skillStatsQuery,
            variables: {
              username: username, // username required
              //limit: 20, // only for submission
            },
          }),
        });
    
        const result = await response.json();
        // console.log(result)
    
        if (result.errors) {
          return result;
        }
        return result.data["matchedUser"]["tagProblemCounts"];
      } catch (err) {
        console.error('Error: ', err);
        return err;
      }
    }
    

// Make another function to store the accuracy of each topic

module.exports = {
    getLast20SolvedProblems,
    getTopicSlugs,
    getUserSkillStats
};
