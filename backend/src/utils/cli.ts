import { exec } from "child_process";

export async function execPromise(cmd: string): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                reject(`Error executing command: ${error.message}`);
                return;
            }
            if (stderr) {
                reject(`Command stderr: ${stderr}`);
                return;
            }
            resolve(stdout);
        });
    });
}
