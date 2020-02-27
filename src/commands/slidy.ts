import { QuickPick, QuickPickItem, window } from 'vscode';
import { exec } from 'child_process';

export class Slidy {
    static async install(path: String) {
        console.log('wallace');
        const packageInstall = await window.showInputBox({
            placeHolder: `Qual nome do package que deseja instalar?`
        });

        if (packageInstall) {
            const slidy_command = `slidy install ${packageInstall}`;
            window.showInformationMessage(`${slidy_command}`);
            const projectFolder = path.split('lib')[0];
            exec(`cd ${projectFolder} && ${slidy_command}`, (err, stdout, stderr) => {
                let output = window.createOutputChannel('slidy');
                output.show();
                if (err) {
                    console.error(err);
                    output.append(err.message);
                    return;
                }
                output.append(stdout);
                output.append(stderr);
            });

        }
    }
    static async uninstall(path: String) {
        // console.log('wallace');
        const packageUninstall = await window.showInputBox({
            placeHolder: `Qual nome do package que deseja desinstalar?`
        });

        if (packageUninstall) {
            const slidy_command = `slidy uninstall ${packageUninstall}`;
            window.showInformationMessage(`${slidy_command}`);
            const projectFolder = path.split('lib')[0];
            exec(`cd ${projectFolder} && ${slidy_command}`, (err, stdout, stderr) => {
                let output = window.createOutputChannel('slidy');
                output.show();
                if (err) {
                    console.error(err);
                    output.append(err.message);
                    return;
                }
                output.append(stdout);
                output.append(stderr);
            });

        }
    }
    static async upgrade() {
        const slidy_command = `slidy upgrade`;
        window.showInformationMessage(`${slidy_command}`);
        exec(`${slidy_command}`, (err, stdout, stderr) => {
            let output = window.createOutputChannel('slidy');
            output.show();
            if (err) {
                console.error(err);
                output.append(err.message);
                return;
            }
            output.append(stdout);
            output.append(stderr);
        });
    }
}