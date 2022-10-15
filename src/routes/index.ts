import * as express from "express";
import { VERSION } from "../version";
import file from "./file/index";

const router: express.Router = express.Router();

router.use("/file", file);

router.get("/version", async (req: express.Request, res: express.Response) => {
  res.status(200).json({
    VERSION,
  });
});
// Export the router
export default router;
