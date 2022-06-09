// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { getCurrentScope } from './get_current_scope';






// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const listReformatter = vscode.commands.registerCommand(
		'list-formatter.formatList',
		() => {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				return;
			}
			const cursor = editor.selection.active;
			const currentScope = getCurrentScope(editor.document, cursor);

			console.log("calling helper function");
			vscode.window.showInformationMessage(
				`${JSON.stringify(currentScope)}`
			);

			// Step 1: Determine range of scope this is currently in
			// vscode.window.showInformationMessage(
			// 	`${
			// 		editor.selection.active.character
			// 	}, ${
			// 		editor.selection.active.line
			// 		// how to read the current character at the position?
			// 	}, ${
			// 		decrementOne(editor.document, editor.selection.active).character
			// 	}, ${
			// 		editor.document.getText(new vscode.Range(cursor, cursor.translate({characterDelta: 1})))
			// 	}`
			// );
			return;
		}
	);

	context.subscriptions.push(listReformatter);
}

// this method is called when your extension is deactivated
export function deactivate() {}
