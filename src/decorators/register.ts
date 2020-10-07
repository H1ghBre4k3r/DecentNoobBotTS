/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ClazzWrapper } from "../api/clazzWrapper";

/**
 * Register all events for the decorated class, which were previously declared using `@Event`.
 */
export function Register(): (Fn: ClazzWrapper) => any {
    return (Fn: ClazzWrapper): any => {
        // Create new class, which inherits from Fn, so we can return it
        const clazz = class ClassToRegister extends Fn {
            public constructor(...args: any[]) {
                super(...args);

                // Register all functions for their desired event
                this.__dnbEventFunctions = this.__dnbEventFunctions ?? [];
                for (const fn of this.__dnbEventFunctions) {
                    fn.eventer.on(fn.event, fn.function.bind(this));
                }
            }

            /**
             * Override the toString function, so the registry is not confused anymore.
             */
            public static toString(): string {
                return Fn.toString();
            }
        };

        return clazz;
    };
}
