import * as vscode from 'vscode';
import { 
  decrementOne, 
  charBeforePosition, 
  incrementOne, 
  charAfterPosition,
  corresponds
} from './text_document_utils';
const brackets = ['[', ']', '{', '}', '(', ')'];
const openBrackets = ['[', '{', '('];
const closeBrackets = [']', '}', ')'];
/**
 * Finds the scope of the current cursor placement, i.e. the innermost set of
 * brackets that contains the current cursor
 *
 * @param document - text document currently editing
 * @param cursor - location of the cursor
 * @returns the scope of the current cursor placement
 */
export const getCurrentScope = (
	document: vscode.TextDocument,
	cursor: vscode.Position
): vscode.Range => {
	// Find first unmatched open bracket left of cursor
	let initialBracketPosition = cursor;
	let initialBracketChar = '';
	let bracketStack = [];
	const beginningOfFile = new vscode.Position(0, 0);
	for (
		let currentPosition = cursor;
		!currentPosition.isEqual(beginningOfFile);
		currentPosition = decrementOne(document, currentPosition)
	) {
		const currentChar = charBeforePosition(document, currentPosition);
		
		if (closeBrackets.includes(currentChar)) {
			bracketStack.push(currentChar);
		} else if (openBrackets.includes(currentChar)) {
			if (bracketStack.length === 0) {
				initialBracketPosition = currentPosition;
				initialBracketChar = currentChar;
				break;
			}
			const correspondingClose = bracketStack.pop();
			if (!corresponds(currentChar, correspondingClose)) {
				throw new Error(`mismatched brackets ${currentChar}, ${correspondingClose}`);
			}
		}
	}
	if (initialBracketChar === '') {
		throw new Error(`got to beginning of file without finding an unmatched open bracket`);
	}

	bracketStack = [];
	let finalBracketPosition = beginningOfFile;
	const finalLineNo = document.lineCount - 1;
	const finalLineLength = document.lineAt(finalLineNo).range.end.character;
	const endOfFile = new vscode.Position(finalLineNo, finalLineLength);
	for (
		let currentPosition = cursor;
		!currentPosition.isEqual(endOfFile);
		currentPosition = incrementOne(document, currentPosition)
	) {
		const currentChar = charAfterPosition(document, currentPosition);
		if (openBrackets.includes(currentChar)) {
			bracketStack.push(currentChar);
		} else if (closeBrackets.includes(currentChar)) {
			if (bracketStack.length === 0) {
				finalBracketPosition = currentPosition;
				if (!corresponds(initialBracketChar, currentChar)) {
					throw new Error(`mismatched brackets ${initialBracketChar}, ${currentChar}`);
				}
				break;
			}
			const correspondingOpen = bracketStack.pop();
			if (!corresponds(currentChar, correspondingOpen)) {
				throw new Error(`mismatched brackets ${correspondingOpen}, ${currentChar}`);
			}
		}
	}
	if (finalBracketPosition.isEqual(beginningOfFile)) {
		throw new Error(`got to end of file without finding an unmatched close bracket`);
	}

	return new vscode.Range(initialBracketPosition, finalBracketPosition);
};
