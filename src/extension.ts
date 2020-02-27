// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { SlidyGenerate } from './commands/slidy_generate';
import { SlidyStart } from './commands/slidy_start';
import { Slidy } from './commands/slidy';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "slidy-extension" is now active!');
	// let slidy = vscode.commands.registerCommand('extension.slidy', (...args) => {
	// 	console.log(args[0].fsPath);
	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Run Script!');
	// });

	let slidyGen = vscode.commands.registerCommand('extension.slidyGen', (...args) => {

		console.log();
		if (args.length < 1) {
			SlidyGenerate.commmand((vscode.workspace.workspaceFolders ?? [])[0].uri.fsPath ?? '');
		} else {
			SlidyGenerate.commmand(args[0].fsPath);
		}
		vscode.window.showInformationMessage('slidy generate start');
	});
	let slidyInstall = vscode.commands.registerCommand('extension.slidyInstall', (...args) => {
		if (vscode.workspace.workspaceFolders?.length === 1) {
			Slidy.install(vscode.workspace.workspaceFolders[0].uri.fsPath);
			vscode.window.showInformationMessage('slidy install start');
		}
	});
	let slidyUninstall = vscode.commands.registerCommand('extension.slidyUninstall', (...args) => {
		if (vscode.workspace.workspaceFolders?.length === 1) {
			Slidy.uninstall(vscode.workspace.workspaceFolders[0].uri.fsPath);
			vscode.window.showInformationMessage('slidy uninstall start');
		}
	});
	let slidyUpgrade = vscode.commands.registerCommand('extension.slidyUpgrade', (...args) => {
		Slidy.upgrade();
		vscode.window.showInformationMessage('slidy upgrade start');
	});

	let slidyStart = vscode.commands.registerCommand('extension.slidyStart', (...args) => {
		SlidyStart.start();
		vscode.window.showInformationMessage('slidy start');
	});
	let slidyCreate = vscode.commands.registerCommand('extension.slidyCreate', (...args) => {
		SlidyStart.create();
		vscode.window.showInformationMessage('slidy create');
	});



	// context.subscriptions.push(slidy);
	context.subscriptions.push(slidyGen);
	context.subscriptions.push(slidyInstall);
	context.subscriptions.push(slidyUninstall);
	context.subscriptions.push(slidyUpgrade);
	context.subscriptions.push(slidyStart);
	context.subscriptions.push(slidyCreate);
}

// this method is called when your extension is deactivated
export function deactivate() { }
