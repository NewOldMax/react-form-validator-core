// Type definitions for react-form-validator-core 0.6.4
// Definitions by: Siraj Alam https://github.com/sirajalam049

import React from 'react';

export interface ValidatorFormProps {

    // Callback for form that fires when all validations are passed
    onSubmit: () => void

    /**
     * If true, form will be validated after each field change. 
     * If false, form will be validated only after clicking submit button.
     * @default true
     */
    instantValidate: boolean

    /**
     * Callback for form that fires when some of validations are not passed. 
     * It passees array of elements which not valid.
     */
    onError?: (errors: Array<string>) => void

    /**
     * Debounce time for validation i.e. your validation will run after debounceTime ms when you stop changing your input
     * @default 0
     */
    debounceTime?: number

}

declare class ValidatorForm extends React.Component<ValidatorFormProps> {

    // Reset validation messages for all validated inputs
    resetValidations(): void

    /**
     * Get form validation state in a Promise (true if whole form is valid). 
     * Run with dryRun = false to show validation errors on form
     */
    isFormValid(dryRun?: boolean): Promise<boolean>
}

export default ValidatorForm