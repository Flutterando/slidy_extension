import { QuickPick, QuickPickItem, window, WindowState } from 'vscode';
import { exec, spawn } from 'child_process';

let commands = [
    "Bloc", "Controller", "Model", "Module", "Page", "Repository", "Service", "Widget"
];
export class SlidyGenerate {

    static async commmand(path: String | undefined) {
        const result = await window.showQuickPick(commands, {
            placeHolder: 'Qual comando deseja rodar?',
            // onDidSelectItem: item => window.showInformationMessage(`Select ${item}`)
        });
        const generate = this.prototype.getCommand(commands.findIndex(c => c === result));

        const name = await window.showInputBox({
            placeHolder: `Qual nome do seu ${generate}?`
        });

        if (name !== undefined || name !== '' && path !== undefined) {
            const slidy_command = `slidy generate ${generate} ${this.prototype.getFolder(path ?? '', name ?? '')}`;
            window.showInformationMessage(`${slidy_command}`);
            const projectFolder = path?.split('lib')[0];
            var child = spawn(slidy_command, [], {
                windowsVerbatimArguments: true,
                cwd: projectFolder,
                shell: true
            });
            let output = window.createOutputChannel('slidy');
            output.show();
            child.addListener('close', (err: any) => {
                console.log(`close: ${err}`);
                if (err === 0) {
                    window.showInformationMessage(`${slidy_command} finish`);
                } else {
                    throw new Error('build_runner error');
                }
            });
            child.addListener('error', (err: any) => {
                console.log(`error: ${err}`);
                output.append(err);
            });


            child.stdout.on('data', (data: any) => {
                console.log(`stdout: ${data}`);
                output.append(data as string);
            });
            // child.stderr.on('data', (data: any) => {
            //     console.log(`stderr: ${data}`);
            // });

            // exec(`cd ${projectFolder} && ${slidy_command}`, (err, stdout, stderr) => {
            //     let output = window.createOutputChannel('slidy');
            //     output.show();
            //     if (err) {
            //         console.error(err);
            //         output.append(err.message);
            //         return;
            //     }
            //     output.append(stdout);
            //     output.append(stderr);
            // });

        }

    }

    getCommand(id: number): String {
        return commands[id].split(' ')[0].toLocaleLowerCase();
    }

    getFolder(path: String, name: string): string {
        return `${path?.split('app')[1]}/${name}`.split('/').filter((value, index) => {
            return index !== 0;
        }).join('/');
    }
}