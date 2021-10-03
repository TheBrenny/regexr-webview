const vscode = require('vscode');

function activate(context) {
	console.log('Congratulations, your extension "regexr-webview" is now active!');
	let disposable = vscode.commands.registerCommand('regexr-webview.helloWorld', function () {
		vscode.window.showInformationMessage('Hello World from RegExr (WebView)!');
	});

	context.subscriptions.push(disposable);
}
function deactivate() {}

exports.activate = activate;

module.exports = {
	activate,
	deactivate
};