const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

exports.entry = path.resolve(__dirname, "main.js");

exports.resolve = {
	alias: {
		"web-grpc-demo-server": path.resolve(__dirname, "../generated")
	}
};

exports.devtool = "eval-cheap-module-source-map";

exports.devServer = {
	// hot: true,
	port: 3000,
	disableHostCheck: true,
	host: "0.0.0.0",
	overlay: true,
	// useLocalIp: true,
	// inline: true,
	historyApiFallback: true,
	watchOptions: {
		aggregateTimeout: 300,
		poll: 1000
	},
	https: {
		key: fs.readFileSync(path.resolve(__dirname, "../server.key")),
		cert: fs.readFileSync(path.resolve(__dirname, "../server.crt")),
	},
};

exports.plugins = [
	new webpack.HotModuleReplacementPlugin(),
	new HtmlWebpackPlugin({
		inject: "body",
		template: "./index.html"
	}),
];
