export class TriggerableFunctions {
    functions: {
        [key: string]: (() => any)[];
    };
    constructor();
    register(functionName: string, _function: () => any): void;
    unregister(functionName: string): void;
    trigger(functionName: string): void;
}
declare type ValidatorInitializerProps = {
    validationGroup?: Document | HTMLElement;
    triggerName?: string;
};
export default class ValidatorInitializer {
    validationGroup: Document | HTMLElement;
    triggerName: string;
    TriggerableFunctions: TriggerableFunctions;
    elements: HTMLCollectionOf<Element>;
    constructor({ validationGroup, triggerName }: ValidatorInitializerProps);
    trigger(triggerName: string): void;
}
declare type ValidatorProps = {
    validationGroup: Document | HTMLElement;
    element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    triggerableFunctions: TriggerableFunctions;
    triggerName: string;
};
export declare class Validator {
    validationGroup: Document | HTMLElement;
    element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    name: string | null;
    triggerableFunctions: TriggerableFunctions;
    validations?: string[];
    formGroupElement: HTMLElement | null;
    errorTipElement: HTMLElement | null;
    errorMessages: {
        [key: string]: string;
    };
    validateFunctions: {
        [key: string]: () => void;
    };
    value: number | boolean | string | null;
    currentValidation: string | null;
    constructor({ element, triggerableFunctions, triggerName, validationGroup }: ValidatorProps);
    setValidations(): string[];
    setErrorMessages(): {
        empty: string;
        email: string;
        confirmation: string;
        halfWidthNumber: string;
        katakana: string;
        hiragana: string;
    };
    setValue(): void;
    setValidateFunctions(): {
        empty: () => void;
        multipleEmpty: () => void;
        selectEmpty: () => void;
        email: () => void;
        confirmation: () => void;
        minimumCharacters: () => void;
        maximumCharacters: () => void;
        halfWidthNumber: () => void;
        katakana: () => void;
        hiragana: () => void;
        charactersRange: () => void;
    };
    showErrorMessage(validationName: string): void;
    showCustomErrorMessage(errorMessage: string): void;
    validate(): void;
}
export {};
