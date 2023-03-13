const router = require("express").Router();
const { Configuration, OpenAIApi } = require("openai");

require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

router.post("/api/textGeneration", async (req, res) => {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const { query, programmingLanguage, info } = req.body;
  if (!query || query.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid input",
      },
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(query, programmingLanguage, info),
      temperature: 0.6,
      max_tokens: 1000,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
});

function generatePrompt(query, programmingLanguage, info) {
  const question = `Write a ${programmingLanguage} solution for this problem \n`;
  let actualQuery = question + query;
  if (info) {
    actualQuery += `\n ${info}`;
  }
  return actualQuery;
}

module.exports = router;
