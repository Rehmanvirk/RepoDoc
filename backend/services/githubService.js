// backend/services/githubService.js

const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

// Headers for fetching JSON data from GitHub
const jsonHeaders = {
  'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
  'Accept': 'application/vnd.github.v3+json',
};

// Fetches the file tree for a repo
const fetchRepoTree = async (owner, repo) => {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`;
    const response = await axios.get(url, { headers: jsonHeaders });
    return response.data.tree;
  } catch (error) {
    console.error('Error fetching repo tree:', error.message);
    throw new Error('Could not fetch repo tree. Is the repo public and token valid?');
  }
};

// Fetches and decodes the content of a single file
const fetchFileContent = async (owner, repo, path) => {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    // Use the standard JSON headers
    const response = await axios.get(url, { headers: jsonHeaders });

    // response.data is now the JSON object { content: "...", encoding: "base64", ... }
    if (response.data.encoding !== 'base64') {
      console.warn(`Unknown encoding for ${path}: ${response.data.encoding}`);
      return null;
    }

    // Decode the Base64 content into a string
    // Buffer.from() is a built-in Node.js feature
    const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
    return content;

  } catch (error) {
    console.error(`Error fetching file content for ${path}:`, error.message);
    return null; // Return null if a single file fails
  }
};

module.exports = { fetchRepoTree, fetchFileContent };