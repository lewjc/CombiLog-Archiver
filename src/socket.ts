import WebSocket, { Data } from "ws";
import { SocketMessage } from "./message/types";
import { writeToLogFile } from "./util/fileUtil";
import path from "path";
import request, { Response } from "request";
import { endpoints } from "./util/requestUtil";

export function connect(aggregatorSocketUrl: string): void {
	let socket: null | WebSocket = null;
	const url = `${aggregatorSocketUrl}?connectionType=consumer`;
	function start() {
		try {
			console.log(process.memoryUsage());
			socket = new WebSocket(url);

			socket.onopen = () => {
				console.info(`Connected to aggregator @ ${aggregatorSocketUrl}`);
			};

			socket.on("message", (data: Data) => {
				try {
					const message = JSON.parse(data.toString());
					if (message) {
						console.log("Recieved message");
						archiveMessage(message as SocketMessage);
					}
				} catch (e) {
					if (e instanceof SyntaxError) {
						console.error("Failed to parse message. Incorrect format... " + e);
					}
				}
			});

			socket.on("close", function (code: number, reason: "string") {
				// TODO: Handle closure codes and display appropritae messages to the logs.
				console.error(
					`Connection to aggregator closed. CODE ${code}. REASON ${
						reason ?? "NULL"
					} Reconnection attempt will occur in 5 seconds...`
				);
			});

			socket.on("error", function (error: Error) {
				// TODO: Handle closure codes and display appropritae messages to the logs.
				console.error(`Connection to aggregator failed. ERROR: ${error}`);
			});
		} catch (e) {
			setTimeout(() => {
				connect(url);
			}, 5000);
		}
	}

	function check() {
		if (!socket || socket.readyState === WebSocket.CLOSED) {
			start();
		}
	}
	start();
	setInterval(check, 5000);
}

function archiveMessage(message: SocketMessage) {
	let today = new Date().toISOString().slice(0, 10);
	if (process.env.COMBILOG_ARCHIVE_ROOT) {
		const hotDir = path.join(process.env.COMBILOG_ARCHIVE_ROOT, "hot");
		writeToLogFile(hotDir, `${today}.log`, message.content);
		// Once we have written to the 'hot' file, then we write to the specific folder for something else.
		const serviceDir = path.join(
			process.env.COMBILOG_ARCHIVE_ROOT,
			"service",
			message.service.friendlyName
		);
		writeToLogFile(serviceDir, `${today}.log`, message.content);

		setTimeout(() => {
			request.delete(
				`${process.env.COMBILOG_AGGREGATOR_API_URL}${endpoints.aggreagtor.message.delete.replace(
					"{messageId}",
					message.id ?? ""
				)}`,
				{},
				(error: Error, response: Response, body: any) => {
					if (error) {
						console.error(`Failed to remove message ${message.id}. Error: ${error}`);
					} else {
						if (response.statusCode !== 200) {
							console.error(body);
						} else {
							console.log(JSON.parse(body).message);
						}
					}
				}
			);
		}, 5000);
	} else {
		throw new Error("COMBILOG_ARCHIVE_ROOT not set.");
	}
}
