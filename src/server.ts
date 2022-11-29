import express, { Express } from "express";
import {config} from "./config/config";
import bodyParser from "body-parser";
const dotenv = require("dotenv");
const cors = require("cors");
import { UserRouter } from "./api/v0/auth/user.router";
import { OrgRouter } from "./api/v0/organisation/organisation.router";
import { EmployeeRouter } from "./api/v0/employee/employee.route";


dotenv.config();

const app: Express = express();
const port = config.port;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(
  cors({
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "X-Access-Token",
      "Authorization",
    ],
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    origin: "*",
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", UserRouter);
app.use("/", OrgRouter);
app.use("/", EmployeeRouter)



app.listen(port, () => console.log(`listening on port ${port}!`));
