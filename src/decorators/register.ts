/**
 * Register all events for the decorated class, which were previously declared using `@Event`.
 */
export function Register(): (Fn: any) => any {
    // tslint:disable-next-line: only-arrow-functions
    return function (Fn: any): any {
        // Create new class, which inherits from Fn, so we can return it
        const clazz = class ClassToRegister extends Fn {
            constructor(...args: any[]) {
                super(...args);

                this.__dnbEventFunctions = this.__dnbEventFunctions ?? [];
                // Register all functions for their desired event
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
