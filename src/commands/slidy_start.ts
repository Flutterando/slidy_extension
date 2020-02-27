import { QuickPick, QuickPickItem, window, workspace, commands, Uri } from 'vscode';
import { exec, spawn } from 'child_process';
import * as path from "path";

const packageNameRegex = new RegExp("^[a-z][a-z0-9_]*$");

export class SlidyStart {

    static async create() {
        const name = await window.showInputBox({ prompt: "Enter a name for your new project", placeHolder: "hello_world", validateInput: this.validateFlutterProjectName });
        if (!name) {
            return;
        }
        // If already in a workspace, set the default folder to something nearby.
        const folders = await window.showOpenDialog({ canSelectFolders: true, openLabel: "Select a folder to create the project in" });
        if (!folders || folders.length !== 1) {
            return;
        }
        const folderUri = folders[0];
        // const projectFolderUri = Uri.file(path.join(fsPath(folderUri), name));
        const projectFolderUri = Uri.file(path.join(folderUri.fsPath, name));

        const hasFoldersOpen = !!(workspace.workspaceFolders && workspace.workspaceFolders.length);
        const openInNewWindow = hasFoldersOpen;

        const description = await window.showInputBox({ prompt: "Enter a Description for your new project", placeHolder: "defaults to 'A new Flutter project.'" });
        const org = await window.showInputBox({ prompt: "Enter a Orgazination for your new project", placeHolder: "defaults to 'com.example'" });


        const flutter_command_create = `slidy create${description ? ' --description="' + description + '"' : ''}${org ? ' --org="' + org + '"' : ''} -k -s -x ${name}`;
        const slidy_command_start = await this.start();
        const command_final = `${flutter_command_create} ${slidy_command_start}`;
        await this.runCommand({
            directory: folderUri.fsPath, exec: command_final, order: 0,
            afterUri: projectFolderUri,
            isOpenInNewWindow: openInNewWindow
        });
    }

    static async start() {

        const providers = ["flutter_modular", "bloc_pattern"];
        var provider = await window.showQuickPick(providers, {
            placeHolder: `What Provider System do you want to use?`
        });
        if (!provider) {
            provider = providers[0];
        }
        const stms = ["mobx", "flutter_bloc", "rxdart"];
        var state_manager = await window.showQuickPick(stms, {
            placeHolder: `Choose a state manager`
        });
        if (!state_manager) {
            state_manager = stms[0];
        }

        // var complete = await window.showQuickPick(['YES', 'NO'], {
        //     placeHolder: `Create a complete flutter project with Themes separated of main.dart, named Routes and locales Strings configured`
        // });

        // console.log(provider);
        // console.log(state_manager);
        // slidy start${complete === 'YES' ? '--complete' : ''} 
        const slidy_command_start = `--provider-system ${provider} --state-management ${state_manager}`;
        return slidy_command_start;
    }
    static validateFlutterProjectName(input: string) {
        if (!packageNameRegex.test(input)) {
            return "Flutter project names should be all lowercase, with underscores to separate words";
        }
        const bannedNames = ["flutter", "flutter_test", "test"];
        if (bannedNames.indexOf(input) !== -1) {
            return `You may not use ${input} as the name for a flutter project`;
        }
    }
    static async runCommand(command: {
        directory: string, exec: string, order: number, afterUri: Uri
            , isOpenInNewWindow: boolean
    }) {
        var child = spawn(command.exec, [], {
            windowsVerbatimArguments: true,
            cwd: command.directory,
            shell: true
        });
        let output = window.createOutputChannel('Slidy');
        output.show();
        child.addListener('close', async (err: any) => {
            console.log(`close: ${err}`);
            if (err === 0) {
                // window.showInformationMessage(`${command.exec} finish`);
                // child.kill();
                await commands.executeCommand("vscode.openFolder", command.afterUri, command.isOpenInNewWindow);
            } else {
                throw new Error(`${command.exec} error`);
            }
        });
        child.addListener('error', (err: any) => {
            console.error(`${err}`);
            output.append(err);
        });


        child.stdout.on('data', (data: any) => {
            console.log(`${data}`);
            output.append(data as string);
        });
    }
}