const router = require("express").Router();
const { Configuration, OpenAIApi } = require("openai");
const axios = require("axios");

require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

router.post("/api/imageGeneration", async (req, res) => {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const imageDetails = req.body.details || "";
  if (imageDetails.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      },
    });
    return;
  }

  try {
    // const response = await openai.createImage({
    //   prompt: imageDetails,
    //   n: 2,
    //   size: "1024x1024",
    // });

    const { data } = await axios.get(
      "https://sathya.in/media/80612/catalog/Sam%2053-1.png",
      {
        responseType: "blob",
      }
    );
    const blob = new Blob([data], { type: "image/jpeg" });
    const result = await openai.createImageEdit({
      image: new File([blob], "image.png", { type: blob.type }),
      prompt: "add iphone in the masked area",
    });

    console.log(result);
    const res = await res.status(200).json({ result: response.data });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
