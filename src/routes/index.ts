import * as express from "express";

// import sub-routers
import file from "./file/index";

const router: express.Router = express.Router();

router.use("/file", file);

// Export the router
export default router;
