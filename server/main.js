const randomWords = require('random-words');
const grpc = require("grpc");

const {
	DemoResponse,
	DemoRequest,
	DemoService,
} = grpc.load(__dirname + "/protos/demo.proto");


async function start() {

	let server = new grpc.Server();
	let port = 3337;

	server.addService(DemoService.service, {
		demoUnary: async function(unaryCall, sendUnaryData) {
			let demoResponse = new DemoResponse(
				randomWords({min: 1, max: 3}).join(" ")
			);

			sendUnaryData(null, demoResponse);
		},

		demoStream: async function(writableStream) {
			let streamedItemsCount = 0;

			let interval = setInterval(() => {

				// They cancelled either due to error or client aborted.
				if(writableStream.cancelled) {
					clearInterval(interval);
					return;
				}

				let demoResponse = new DemoResponse();

				demoResponse.setDemoProperty(
					randomWords({min: 1, max: 3}).join(" ")
				);

				writableStream.write(demoResponse);

				streamedItemsCount += 1;

				if(streamedItemsCount >= 10) {
					clearInterval(interval);
					writableStream.end();
					return;
				}

			}, 500);
		}
	});

	server.bind(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure());
	server.start();

	console.log(`Listening on port ${port}`);
}

start().catch(err => {
	console.error(err);
	process.exit(1);
});
