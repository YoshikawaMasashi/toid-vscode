// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';


// TODO 一回しか開けないようにする
// TODO 他のウィンドウを開いたりしたら即練習終了
var counter = 0;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "toid-vscode" is now active!');

	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor(editor => {
			if (editor) {
				console.log('DEBUG');
			}
		})
	);

	context.subscriptions.push(
		vscode.workspace.onDidChangeTextDocument(e => {
			console.log('DEBUG2');
		})
	);


	context.subscriptions.push(
		vscode.window.onDidChangeTextEditorSelection(e => { // ここでカーソルの位置の変化もわかる
			console.log('DEBUG3', e.selections[0].active);
		})
	);


	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('toid-vscode.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from toid!');

		// Open temporal python window
		vscode.workspace.openTextDocument({language:"python", content:""}).then(doc => {
			vscode.window.showTextDocument(doc, {viewColumn: vscode.ViewColumn.One});
		});

		var lines = [
			"import numpy as np",
			"import toid",
			"",
			"p['a']"
		];
		QuestionPanel.createOrShow(context.extensionUri, lines);
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

class QuestionPanel {
	public static currentPanel: QuestionPanel | undefined;

	public static readonly viewType = 'question';

	private readonly _panel: vscode.WebviewPanel;
	private readonly _extensionUri: vscode.Uri;
	private _disposables: vscode.Disposable[] = [];

	private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, lines: string[]) {
		this._panel = panel;
		this._extensionUri = extensionUri;

		// Set the webview's initial html content
		this._update();
		for(let line of lines) {
			this.addLine(line);
		}

		// Listen for when the panel is disposed
		// This happens when the user closes the panel or when the panel is closed programatically
		this._panel.onDidDispose(
			() => this.dispose(),
			null,
			this._disposables
		);

		// Update the content based on view changes
		this._panel.onDidChangeViewState(
			e => {
				// if (this._panel.visible) {
				// 	this._update();
				// }
			},
			null,
			this._disposables
		);

	}

	public static createOrShow(extensionUri: vscode.Uri, lines: string[]) {
		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

		// If we already have a panel, show it.
		if (QuestionPanel.currentPanel) {
			QuestionPanel.currentPanel._panel.reveal(column);
			return;
		}

		// Otherwise, create a new panel.
		const panel = vscode.window.createWebviewPanel(
			QuestionPanel.viewType,
			'Cat Coding',
			vscode.ViewColumn.Two,
			{
				// Enable javascript in the webview
				enableScripts: true,

				// And restrict the webview to only loading content from our extension's `media` directory.
				localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
			}
		);

		QuestionPanel.currentPanel = new QuestionPanel(panel, extensionUri, lines);

		
	}

	public dispose() {
		QuestionPanel.currentPanel = undefined;

		// Clean up our resources
		this._panel.dispose();

		while (this._disposables.length) {
			const x = this._disposables.pop();
			if (x) {
				x.dispose();
			}
		}
	}

	private _update() {
		const webview = this._panel.webview;

		this._panel.title = "question";
		this._panel.webview.html = this._getHtmlForWebview(webview);
	}

	public addLine(line: string) {
		this._panel.webview.postMessage({ command: 'addline', line: line });
	}


	private _getHtmlForWebview(webview: vscode.Webview) {
		// Local path to main script run in the webview
		const scriptPathOnDisk = vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js');

		// And the uri we use to load this script in the webview
		const scriptUri = webview.asWebviewUri(scriptPathOnDisk);

		// Use a nonce to only allow specific scripts to be run
		const nonce = getNonce();

		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Cat Coding</title>
			</head>
			<body>
				<div id="main"></div>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
	}
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
