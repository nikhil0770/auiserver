const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(require("./routes/imageGenerator"));
app.use(require("./routes/textGeneration"));

app.listen(3081, () => {
  console.log("Server running at 3081");
});
