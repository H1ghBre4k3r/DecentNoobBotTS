/**
 * Register a class as a command.
 */
export function Command(cmd: string): (Fn: any) => any {
    return (Fn: any): any => {
        new (class CommandImpl extends Fn {
            constructor() {
                super();

                this.cmd = cmd;
                this.messageManager.registerCommand(this);
            }
        })();

        return Fn;
    };
}
