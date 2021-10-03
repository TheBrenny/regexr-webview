const vscode = require('vscode');
const fs = require("fs");
const path = require("path");
const {URL} = require('url');

/** @type vscode.WebviewPanel */
let panel = null;
function activate(context) {
	// [ ] Create a server hosting the RegExr web app
	context.subscriptions.push(vscode.commands.registerCommand('regexr-webview.openRegexr', openRegexr));
	console.log('regexr-webview is activated');
}

function openRegexr() {
	// vscode.window.showInformationMessage('Hello World from RegExr (WebView)!');

	if(panel === null) {
		panel = vscode.window.createWebviewPanel("regexr", "RegExr", vscode.ViewColumn.Beside, {
			enableScripts: true,
		});
		return getRegExrIFrame().then(data => panel.webview.html = data);
	} else {
		panel.reveal(vscode.ViewColumn.Beside);
	}
}

function getRegExrIFrame(id, params) {
	if(typeof id === "object") {
		params = id;
		id = undefined;
	}

	let url = new URL("https://regexr.com/");
	if(id) url.pathname = id;
	if(params?.expression) url.searchParams.set("expression", params.expression);
	if(params?.text) url.searchParams.set("text", params.text);
	url = url.toString();

	return fs.promises.readFile(path.join(__dirname, "regexr.html"), "utf8").then(data => data.replace("${url}", url));
}

function deactivate() {
	// [ ] Shutdown the internal server
}

module.exports = {
	activate,
	deactivate
};