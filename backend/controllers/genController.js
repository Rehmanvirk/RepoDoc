// backend/controllers/genController.js

const Generation = require('../models/generationModel');
const User = require('../models/userModel');
const { fetchRepoTree, fetchFileContent } = require('../services/githubService');
const { generateReadme } = require('../services/aiService');

// --- Helper function to parse GitHub URL ---
const parseRepoUrl = (url) => {
  try {
    const { pathname } = new URL(url);
    const parts = pathname.match(/^\/([^\/]+)\/([^\/]+)/);
    if (!parts || parts.length < 3) {
      throw new Error('Invalid URL format');
    }
    return { owner: parts[1], repo: parts[2] };
  } catch (error) {
    throw new Error('Invalid GitHub URL');
  }
};

// --- Helper function to filter for key files ---
const filterKeyFiles = (tree) => {
  const keyFileNames = [
    'package.json',
    'requirements.txt', // Python
    'pom.xml',        // Java (Maven)
    'build.gradle',   // Java (Gradle)
    'go.mod',         // Go
    'dockerfile',
    'vercel.json',
    'index.js',
    'server.js',
    'main.py',
    'app.js',
  ];

  const maxFiles = 10;
  const filteredPaths = [];

  for (const item of tree) {
    if (item.type !== 'blob') {
      continue; // Skip folders
    }

    const lowerPath = item.path.toLowerCase();

    // Check if the path *exactly matches* a key file (e.g., "package.json")
    // OR if the path *ends with* a key file (e.g., "src/package.json")
    const isKeyFile = keyFileNames.some(key => 
      lowerPath === key || lowerPath.endsWith(`/${key}`)
    );

    if (isKeyFile) {
      filteredPaths.push(item.path);
    }

    if (filteredPaths.length >= maxFiles) {
      break;
    }
  }
  return filteredPaths;
};

// @desc    Create a new generation job
// @route   POST /api/generate
// @access  Private
const createGenerationJob = async (req, res) => {
  try {
    const { repoUrl } = req.body;
    const user = req.user; 

    if (user.generationsRemaining <= 0) {
      return res.status(402).json({ message: 'No generations remaining. Please upgrade.' });
    }

    const { owner, repo } = parseRepoUrl(repoUrl);

    const generation = await Generation.create({
      user: user._id,
      repoUrl,
      status: 'pending',
    });

    res.status(202).json({
      message: 'Generation job accepted.',
      jobId: generation._id,
    });

    // --- DO THE HEAVY WORK *AFTER* RESPONDING ---
    try {
      generation.status = 'processing';
      await generation.save();

      const tree = await fetchRepoTree(owner, repo);
      const keyFilePaths = filterKeyFiles(tree);

      // --- DEBUG 1: Check if we found any files ---
      console.log('Found key files:', keyFilePaths);

      if (keyFilePaths.length === 0) {
        throw new Error('Could not find any key files (like package.json) in this repo.');
      }

      const fileContents = await Promise.all(
        keyFilePaths.map(path => fetchFileContent(owner, repo, path))
      );

   // --- DEBUG 2: Check if we got file contents ---
console.log('Fetched file contents (types):', 
  fileContents.map(c => typeof c)
);

console.log('Fetched file contents (preview):', 
  fileContents.map(c => (typeof c === 'string') ? c.substring(0, 20) + '...' : c)
);

      let context = 'Project File Structure and Contents:\n\n';
      keyFilePaths.forEach((path, index) => {
        if (fileContents[index]) { 
          context += `--- File: ${path} ---\n${fileContents[index]}\n\n`;
        }
      });

      // --- DEBUG 3: Check the final context string ---
      console.log('Context being sent to AI:', context.substring(0, 300) + '...');

      const readmeContent = await generateReadme(context);

      generation.status = 'completed';
      generation.generatedReadme = readmeContent;
      await generation.save();

      user.generationsRemaining -= 1;
      await user.save();

    } catch (jobError) {
      // --- DEBUG 4: Log the specific job error ---
      console.error('Job processing failed:', jobError.message);
      
      generation.status = 'failed';
      generation.error = jobError.message || 'An unknown error occurred.';
      await generation.save();
    }
    
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Check the status of a generation job
// @route   GET /api/generate/status/:id
// @access  Private
const checkGenerationStatus = async (req, res) => {
  try {
    const generation = await Generation.findById(req.params.id);

    if (!generation) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (generation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this job' });
    }

    res.json(generation);

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { createGenerationJob, checkGenerationStatus };