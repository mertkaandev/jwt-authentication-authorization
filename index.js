const express = require("express");
const dotenv = require("dotenv");
const routers = require("./routes/index.js");
const connectDatabase = require("./helpers/database/connectionDatabase.js");
const customErrorHandler = require("./middlewares/errors/customErrorHandler.js");
const path = require("path");

dotenv.config({
   path: "./env/config.env"
});

connectDatabase();

const PORT = 3000 || process.env.PORT;

const app = express();

app.get('/', (req,res)=> {
    res.send("Hello guys. This is the basic structure for the Node.js rest api. I will develop the files. Stay in follow.");
});

app.use(express.json());

app.use('/api', routers);

app.use(customErrorHandler);

app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, ()=>{
    console.log(`Server is running on localhost:${PORT}..`)
});
