// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

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


	const myScheme = 'question';
	const myProvider = new class implements vscode.TextDocumentContentProvider {

		// emitter and its event
		onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
		onDidChange = this.onDidChangeEmitter.event;

		provideTextDocumentContent(uri: vscode.Uri): string {
			// simply invoke cowsay, use uri-path as text
			return "import numpy as np";
		}
	};
	context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(myScheme, myProvider));

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('toid-vscode.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from toid!');

		// Open temporal python window
		vscode.workspace.openTextDocument({language:"python", content:""}).then(doc => {
			vscode.window.showTextDocument(doc);
		});

		let uri = vscode.Uri.parse('question:question');
		vscode.workspace.openTextDocument(uri).then(doc => {
			vscode.window.showTextDocument(doc, { preview: false, viewColumn: vscode.ViewColumn.Two });
		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
