/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ClazzWrapper } from "../../../api/clazzWrapper";

/**
 * Register a class as a command.
 */
export function Command(cmd: string): (Fn: ClazzWrapper) => any {
    return (Fn: ClazzWrapper): any => {
        new (class CommandImpl extends Fn {
            public constructor() {
                super();

                this.cmd = cmd;
                this.messageManager.registerCommand(this);
            }
        })();

        return Fn;
    };
}
