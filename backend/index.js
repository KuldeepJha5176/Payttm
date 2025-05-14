const path = require("path");

const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());

const mainRouter = require("./routes/index");



app.use("/api/v1", mainRouter);


app.use(express.static(path.join(__dirname, "/frontend/dist")))
app.get("/*", (req,res) => {
   res.sendFile(path.join(__dirname,"frontend","dist","index.html"))
 })


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});