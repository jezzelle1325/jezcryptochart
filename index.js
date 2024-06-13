import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 1900;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const API_URL = "https://api.blockchain.com/v3/exchange/tickers";


// In index.js

app.get("/", async (req, res) => {
  try {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 20;
    const startItemNumber = (currentPage - 1) * itemsPerPage + 1;

    // Fetch the data from the API
    const result = await axios.get(API_URL);
    const coinData = result.data;

    // Calculate pagination variables
    const totalItems = coinData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Slice the data to display only the items for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;
    const itemsToDisplay = coinData.slice(startIndex, endIndex);

    res.render("index.ejs", {
      coinData: itemsToDisplay,
      currentPage,
      totalPages,
      startItemNumber,
    });
  } catch (error) {
    res.render("index.ejs", { secret: error.response.data });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


