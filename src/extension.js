const vscode = require('vscode');
const fs = require("fs");
const path = require("path");
const {URL} = require('url');

/** @type vscode.WebviewPanel */
let panel = null;
let extensionUri = null;
function activate(context) {
	// [ ] Create a server hosting the RegExr web app
	extensionUri = context.extensionUri;
	context.subscriptions.push(vscode.commands.registerCommand('regexr-webview.openRegexr', openRegexr));
	console.log('regexr-webview is activated');
}

function openRegexr() {
	if(panel === null) {
		panel = vscode.window.createWebviewPanel("regexr", "RegExr", vscode.ViewColumn.Beside, {
			enableScripts: true,
			retainContextWhenHidden: true,
		});
		panel.onDidDispose(() => panel = null);
		panel.iconPath = vscode.Uri.joinPath(extensionUri, "res", "regex.svg"); //new vscode.ThemeIcon("$(regex)").
		return getRegExrIFrame().then(data => panel.webview.html = data).then(() => {});
	} else {
		panel.reveal(vscode.ViewColumn.Beside);
		return Promise.resolve();
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
	if(params?.engine) url.searchParams.set("engine", params.engine);
	if(params?.tool) url.searchParams.set("tool", params.tool);
	if(params?.input) url.searchParams.set("input", params.input);
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