/**
 * Pseudo-Interface for wrapping classes.
 */
export interface ClazzWrapper {
    prototype: any;
    name: string;
    new (...args: any[]): any;
    toString(): string;
}
