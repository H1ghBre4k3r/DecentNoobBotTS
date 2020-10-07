/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { defaultRegistry, Registry } from "dependory";
import { ClazzWrapper } from "../api/clazzWrapper";

export interface EventFunctionObject {
    event: string;
    eventer: any;
    function(...params: any[]): any;
}

/**
 * Register a function for a specific event on another class. The instance of the class will be pulled from the default registry.
 * Therefore be aware of not using this for transients.
 */
export function Event(event: string, eventer: ClazzWrapper): any {
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
