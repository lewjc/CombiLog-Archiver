import * as express from "express";
import file from "./file/index";
import { version } from "../../package.json";

const router: express.Router = express.Router();

router.use("/file", file);

router.get("/version", async (req: express.Request, res: express.Response) => {
  res.status(200).json({
    version,
  });
});
// Export the router
export default router;
