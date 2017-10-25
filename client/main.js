const {grpc, Code, Metadata} = require("grpc-web-client");

const {
	DemoResponse,
	DemoRequest,
} = require("web-grpc-demo-server/demo_pb.js");

const {
	DemoService,
} = require("web-grpc-demo-server/demo_pb_service.js");

// The dream
// const {
// 	DemoResponse,
// 	DemoRequest,
// 	DemoService
// } = require("web-grpc-demo-server");

const streamResultsElement = document.getElementById("stream-results");
const unaryResultsElement = document.getElementById("unary-results");

let openedStreams = [];

function onEndHandler(element, code, msg, metadata) {
	console.log("onEndHandler:", arguments);

	let endText = "";

	endText += `|  code      = ${code} (${Code[code]})\n`;
	endText += `|  msg       = ${msg}\n`;

	endText += `|  metadata  = {\n`;

	metadata.forEach((key, value) => {
		endText += `|    ${key}: ${value}\n`;
	});

	endText += `|  }\n`;

	let largestLen = endText.split("\n").reduce((largestLen, line) => {
		if(line.length > largestLen) {
			return line.length;
		}

		return largestLen;
	}, 0);

	endText = " " + Array(largestLen+2).join("-") + "\n" + endText;

	endText += " " + Array(largestLen+2).join("-") + "\n"

	element.textContent = endText + element.textContent
}

global.demoUnary = () => {
	let demoRequest = new DemoRequest();

	grpc.invoke(DemoService.demoUnary, {
		debug: true,
		request: demoRequest,
		host: "https://" + location.hostname + ":8443",
		onMessage: (demoResponse) => {
			console.log(demoResponse);
			unaryResultsElement.textContent = "";

			unaryResultsElement.textContent += JSON.stringify(
				demoResponse.toObject(),
				null, '  '
			) + "\n";
		},
		onEnd: onEndHandler.bind(null, unaryResultsElement)
	});
};

global.grpc = grpc;

global.demoStream = () => {

	streamResultsElement.textContent = "";

	let demoRequest = new DemoRequest();

	currentDemoStream = grpc.invoke(DemoService.demoStream, {
		debug: true,
		request: demoRequest,
		host: "https://" + location.hostname + ":8443",
		onMessage: (demoResponse) => {
			console.log(demoResponse);

			streamResultsElement.textContent = JSON.stringify(
				demoResponse.toObject(),
				null, '  '
			) + "\n" + streamResultsElement.textContent;
		},
		onEnd: onEndHandler.bind(null, streamResultsElement)
	});
};

global.demoStreamAbort = () => {
	if(currentDemoStream) {
		currentDemoStream.abort();
	}
};
