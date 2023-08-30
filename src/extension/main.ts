import * as vscode from 'vscode';
import { createDuplex } from '../common/Stream';
import { createWebviewMessenger } from '../common/Messenger';

export function activate(context: vscode.ExtensionContext) {
	console.log('hello');

	const disposable = vscode.commands.registerCommand(
		'readable-stream-perf-test.webview',
		() => {
			const panel = vscode.window.createWebviewPanel(
				'readable-stream-perf-test',
				'Readable Stream Performance Test',
				vscode.ViewColumn.One,
				{
					enableScripts: true,
					retainContextWhenHidden: true,
					localResourceRoots: [vscode.Uri.file(context.extensionPath)],
				},
			);

			const stream = createDuplex(createWebviewMessenger(panel.webview));

			stream.on('data', data => {
				// setTimeout(() => {
				stream.write(data);
				// }, 0);
			});

			panel.webview.html = getWebviewContent(context, panel.webview);
		},
	);

	context.subscriptions.push(disposable);
}

function getWebviewContent(
	context: vscode.ExtensionContext,
	webview: vscode.Webview,
) {
	const scriptUri = webview.asWebviewUri(
		vscode.Uri.joinPath(context.extensionUri, 'dist', 'webview.js'),
	);

	return `<script src="${scriptUri.toString()}"></script><h1>hello world from webview</h1>`;
}

export function deactivate() {}
