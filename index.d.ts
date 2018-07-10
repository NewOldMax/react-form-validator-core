declare module 'react-form-validator-core' {
    import * as React from 'react'

    interface ValidatorComponentProps
        extends React.AllHTMLAttributes<HTMLElement> {
        errorMessages?: string[] | string
        validators?: string[]
        validatorListener?: () => void
        withRequiredValidator?: boolean
        onChange: (event: any) => void
    }

    interface ValidatorComponentState {
        isValid
    }

    export class ValidatorComponent<
        P = ValidatorComponentProps,
        S = ValidatorComponentState
        > extends React.Component<P, S> {
        input: any
        isValid: boolean

        getErrorMessage: () => string[] | string
        makeInvalid: () => void
        makeValid: () => void
    }

    interface ValidatorFormProps
        extends React.FormHTMLAttributes<HTMLFormElement> {
        onSubmit: React.FormEventHandler<HTMLFormElement>
        instantValidate?: boolean
        debounceTime?: number
        onError?: () => void
    }

    export class ValidatorForm extends React.Component<ValidatorFormProps> {
        resetValidations: () => void
        isFormValid: (dryRun: boolean) => boolean
    }
}
