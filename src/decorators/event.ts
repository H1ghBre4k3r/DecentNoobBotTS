import { defaultRegistry, Registry } from "dependory";

export interface EventFunctionObject {
    event: string;
    eventer: any;
    function(...params: any[]): any;
}

/**
 * Register a function for a specific event on another object. The instance of the class will be pulled from the default registry.
 * Therefore be aware of not using this for transients.
 */
export function Event(event: string, eventer: any): any {
    // tslint:disable-next-line: only-arrow-functions
    return (clazz: any, _functionName: any, propDesc: PropertyDescriptor): PropertyDescriptor => {
        clazz.__dnbEventFunctions = clazz.__dnbEventFunctions ?? [];

        const eventRegisterObject: EventFunctionObject = {
            event,
            eventer: defaultRegistry.get(Registry.getHash(eventer)),
            function: propDesc.value
        };

        clazz.__dnbEventFunctions.push(eventRegisterObject);

        return propDesc;
    };
}
