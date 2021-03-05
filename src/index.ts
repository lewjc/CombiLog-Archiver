import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { createDirectory, checkHotRecords } from "./util/fileUtil";
import router from "./routes/index";
import { connect } from "./socket";

const app: Application = express();
dotenv.config();

app.use(bodyParser.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const port = process.env.COMBILOG_ARCHIVE_PORT ?? 13338;

if (
  process.env.COMBILOG_ARCHIVE_ROOT &&
  process.env.COMBILOG_AGGREGATOR_SOCKET_URL
) {
  // Initalise directories that may or may not exist on startup.`
  try {
    createDirectory(process.env.COMBILOG_ARCHIVE_ROOT, "hot");
    createDirectory(process.env.COMBILOG_ARCHIVE_ROOT, "service");
    createDirectory(process.env.COMBILOG_ARCHIVE_ROOT, "archive");
  } catch (e) {
    console.error("Please check value of COMBILOG_ARCHIVE_ROOT.");
    process.exit(1);
  }
  checkHotRecords();
  const aggregatorUrl = process.env.COMBILOG_AGGREGATOR_SOCKET_URL;
  // Set our hot record archive check to run once per hour.
  setInterval(checkHotRecords, 1000 * 60 * 60);
  app.use("/api", router);
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    connect(aggregatorUrl);
  });
} else {
  throw new Error(
    "Missing one of [COMBILOG_ARCHIVE_ROOT, COMBILOG_AGGREGATOR_SOCKET_URL] env variables."
  );
}
