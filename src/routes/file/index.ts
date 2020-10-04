import express, { Router, Request, Response } from "express";
import { getLogStructure, getFileContents } from "../../util/fileUtil";
import path from "path";

const router: Router = express.Router();

router.get("/hot/:logName", async (req: Request, res: Response) => {
	const logName: string = req.params.logName;

	if (process.env.COMBILOG_ARCHIVE_ROOT) {
		const filePath = path.join(process.env.COMBILOG_ARCHIVE_ROOT, "hot", logName);
		const fileContents = await getFileContents(filePath);
		if (fileContents) {
			res.status(200).json({
				content: fileContents,
			});
		} else {
			res.status(500).json({
				message: "An internal error occured. Please check the aggregator logs.",
			});
		}
	} else {
		res.status(500).json({
			message: "An internal error occured. Please check the aggregator logs.",
		});
	}
});

router.get("/archive/:logName", async (req: Request, res: Response) => {
	const logName: string = req.params.logName;

	if (process.env.COMBILOG_ARCHIVE_ROOT) {
		const filePath = path.join(process.env.COMBILOG_ARCHIVE_ROOT, "archive", logName);
		const fileContents = await getFileContents(filePath);
		if (fileContents) {
			res.status(200).json({
				content: fileContents,
			});
		} else {
			res.status(500).json({
				message: "An internal error occured. Please check the aggregator logs.",
			});
		}
	} else {
		res.status(500).json({
			message: "An internal error occured. Please check the aggregator logs.",
		});
	}
});

router.get("/:serviceName/:logName", async (req: Request, res: Response) => {
	const serviceName: string = req.params.serviceName;
	const logName: string = req.params.logName;

	if (process.env.COMBILOG_ARCHIVE_ROOT) {
		const filePath = path.join(process.env.COMBILOG_ARCHIVE_ROOT, "service", serviceName, logName);
		const fileContents = await getFileContents(filePath);
		if (fileContents) {
			res.status(200).json({
				content: fileContents,
			});
		} else {
			res.status(500).json({
				message: "An internal error occured. Please check the aggregator logs.",
			});
		}
	} else {
		res.status(500).json({
			message: "An internal error occured. Please check the aggregator logs.",
		});
	}
});

router.get("/structure", async (req: Request, res: Response) => {
	if (process.env.COMBILOG_ARCHIVE_ROOT) {
		const structure: null | object = await getLogStructure(process.env.COMBILOG_ARCHIVE_ROOT);
		if (structure) {
			res.status(200).json(structure);
			return;
		}
	}

	res.status(500).json({
		message: "An internal error occured. Please check the aggregator logs.",
	});
});

// GET Today's log

router.get("/heartbeat", async (req: Request, res: Response) => {
	res.send("beep");
});

export default router;
