const os = require("os");
const fse = require('fs-extra')
const path = require("path");
const util = require("util");
const protoc = util.promisify(require("protoc").protoc);

const OUT_DIR = path.resolve(__dirname, "../generated");
const PROTOC_GEN_JS_SERVICE = path.resolve(
	__dirname,
	`../node_modules/.bin/protoc-gen-js_service` +
		(os.platform() === 'win32' ? '.cmd': '')
);

const PROTOC_GEN_TS_SERVICE = path.resolve(
	__dirname,
	`../node_modules/.bin/protoc-gen-ts` +
		(os.platform() === 'win32' ? '.cmd': '')
);

async function build() {
	await fse.ensureDir(OUT_DIR);
	await fse.emptyDir(OUT_DIR);

	let result = await protoc([
		`--plugin=protoc-gen-js_service=${PROTOC_GEN_JS_SERVICE}`,
		`--js_out=import_style=commonjs,binary:${OUT_DIR}`,
		`--js_service_out=${OUT_DIR}`,
		// `-I ./proto`,
		`*.proto`
	], { cwd: path.resolve(__dirname, "../server/protos") });

	result = await protoc([
		`--plugin=protoc-gen-ts=${PROTOC_GEN_TS_SERVICE}`,
		`--js_out=import_style=commonjs,binary:${OUT_DIR}`,
		`--ts_out=service=true:${OUT_DIR}`,
		// `-I ./proto`,
		`*.proto`
	], { cwd: path.resolve(__dirname, "../server/protos") });
}

build().catch(err => {
	console.error(err);
});
