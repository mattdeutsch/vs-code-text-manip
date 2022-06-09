import * as vscode from 'vscode';

/**
 * @param document - the document to check
 * @param position - either a position or the index of the line (not the line
 * number, which is 1-indexed, but rather the 0-indexed line index)
 * @returns Returns the end of the line in the document at the given
 * position/line index
 */
export const endOfLine = (
	document: vscode.TextDocument,
	position: vscode.Position | number,
): vscode.Position => {
	if (typeof(position) === "object") {
		position = position.line;
	}
	return document.lineAt(position).range.end;
};

/**
 * Decrements a Position by one character, traversing line breaks. If at the
 * beginning of the file, it returns the beginning of the file.
 *
 * @param position - the position to be decremented
 * @param document - the document being edited (necessary to know what character
 * to go on after going back a line)
 * @returns the position one character before the current one (may be a newline)
 */
export const decrementOne = (
	document: vscode.TextDocument,
	position: vscode.Position,
): vscode.Position => {
	if (position.character !== 0) {
		return position.translate({characterDelta: -1});
	}
	if (position.line !== 0) {
		const newLineNo = position.line - 1;
		const newCharNo = endOfLine(document, newLineNo).character;
		return new vscode.Position(newLineNo, newCharNo);
	}
	// the position is (0, 0)
	return position;
};


export const incrementOne = (
	document: vscode.TextDocument,
	position: vscode.Position,
): vscode.Position => {
	const currentLineLength = endOfLine(document, position).character;
	if (position.character !== currentLineLength) {
		return position.translate({characterDelta: 1});
	}
	const numlines = document.lineCount;
	if (position.line !== numlines - 1) {
		return new vscode.Position(position.line + 1, 0);
	}
	// position is EOF
	return position;
};

/**
 * Returns whether char2 is the character that closes the scope created by the
 * character char1.
 * 
 * @param char1 - a character, must be a bracket, square bracket, or paren
 * @param char2 - the object to test whether its the accompanying bracket
 * @returns whether char1 and char2 close each other
 */
export const corresponds = (char1: string,	char2: any): boolean => {
	if (char1 === '(') {
		return char2 === ')';
	}
	if (char1 === ')') {
		return char2 === '(';
	}
	if (char1 === '[') {
		return char2 === ']';
	}
	if (char1 === ']') {
		return char2 === '[';
	}
	if (char1 === '{') {
		return char2 === '}';
	}
	if (char1 === '}') {
		return char2 === '{';
	}
	throw new Error(`${char1} was not a bracket`);
};

export const charBeforePosition = (
	document: vscode.TextDocument,
	position: vscode.Position,
): string => {
	if (position.character === 0) {
		return '';
	}
	return document.getText(
		new vscode.Range(
			position,
			position.translate({characterDelta: -1 })
		)
	);
};

export const charAfterPosition = (
	document: vscode.TextDocument,
	position: vscode.Position,
): string => {
	if (position === endOfLine(document, position)) {
		return '';
	}
	return document.getText(
		new vscode.Range(
			position,
			position.translate({characterDelta: 1})
		)
	);
};