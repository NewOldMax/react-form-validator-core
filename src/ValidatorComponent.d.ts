// Type definitions for react-form-validator-core 0.6.4
// Definitions by: Siraj Alam https://github.com/sirajalam049

import validations from "./ValidationRules";
import React from 'react';

export interface ValidatorComponentProps {
    /**
     * Array of validators.
     * @default []
     */
    validators?: Array<keyof typeof validations>

    /**
     * Array of error messages. Order of messages should be the same as validators prop.
     * @default: `error`
     */
    errorMessages?: Array<string>

    // Name of input
    name: string

    /**
     * It triggers after each validation. It will return true or false
     */
    validatorListener?: (isValid: boolean) => void

    /**
     * Allow to use required validator in any validation trigger, not only form submit
     */
    withRequiredValidator?: boolean
}

declare class ValidatorComponent extends React.Component<ValidatorComponentProps> {

    // Get error validation message
    getErrorMessage(): boolean | ValidatorComponentProps['errorMessages']

    // Run validation for current component
    validate(value: any, includeRequired?:boolean, dryRun?: boolean): void

    // Return current validation state
    isValid(): boolean

    // Set invalid validation state
    makeInvalid(): void

    // Set valid validation state
    makeValid(): void

}

export default ValidatorComponent;