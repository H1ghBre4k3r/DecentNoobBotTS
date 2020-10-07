/**
 * Pseudo-Interface for wrapping classes.
 */
export interface ClazzWrapper<T = any> {
    prototype: any;
    name: string;
    new (...args: any[]): T;
    toString(): string;
}
