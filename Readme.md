## Validation component for react forms

[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/react-form-validator-core.svg)](https://badge.fury.io/js/react-form-validator-core)
[![Build Status](https://travis-ci.org/NewOldMax/react-form-validator-core.svg?branch=master)](https://travis-ci.org/NewOldMax/react-form-validator-core)

Simple form validation component for react forms inspired by [formsy-react](https://github.com/christianalfoni/formsy-react)

Default validation rules:
+ matchRegexp
+ isEmail
+ isEmpty
+ required
+ trim
+ isNumber
+ isFloat
+ isPositive
+ minNumber
+ maxNumber
+ minStringLength
+ maxStringLength
+ isString
+ isEqual

Some rules can accept extra parameter, example:
````javascript
<YourValidationInput
   {...someProps}
   validators={['minNumber:0', 'maxNumber:255', 'matchRegexp:^[0-9]$']}
/>
````

### Usage

````javascript
import React from 'react';
import { ValidatorComponent } from 'react-form-validator-core';

class TextValidator extends ValidatorComponent {

    render() {
        const { errorMessages, validators, requiredError, validatorListener, ...rest } = this.props;

        return (
            <div>
                <input
                    {...rest}
                    ref={(r) => { this.input = r; }}
                />
                {this.errorText()}
            </div>
        );
    }

    errorText() {
        const { isValid } = this.state;

        if (isValid) {
            return null;
        }

        return (
            <div style={{ color: 'red' }}>
                {this.getErrorMessage()}
            </div>
        );
    }
}

export default TextValidator;
````

````javascript
...
import { ValidatorForm } from 'react-form-validator-core';
...
render() {
    return (
        <ValidatorForm
            ref="form"
            onSubmit={this.handleSubmit}
        >
            <TextValidator
                onChange={this.handleChange}
                name="email"
                value={email}
                validators={['required', 'isEmail']}
                errorMessages={['this field is required', 'email is not valid']}
            />
            <button type="submit">submit</button>
        </ValidatorForm>
    );
}
...
````

#### You can add your own rules
````javascript
ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
    if (value !== this.state.user.password) {
        return false;
    }
    return true;
});
````

### API

#### ValidatorForm

| Prop            | Required | Type     | Default value | Description                                                                                                                  |
|-----------------|----------|----------|---------------|------------------------------------------------------------------------------------------------------------------------------|
| onSubmit        | true     | function |               | Callback for form that fires when all validations are passed                                                                 |
| instantValidate | false    | bool     | true          | If true, form will be validated after each field change. If false, form will be validated only after clicking submit button. |
| onError         | false    | function |               | Callback for form that fires when some of validations are not passed. It will return array of elements which not valid. |

#### All validated fields (ValidatorComponent)

| Prop            | Required | Type     | Default value | Description                                                                            |
|-----------------|----------|----------|---------------|----------------------------------------------------------------------------------------|
| validators      | false    | array    |               | Array of validators. See list of default validators above.                             |
| errorMessages   | false    | array    |               | Array of error messages. Order of messages should be the same as `validators` prop.    |
| name            | true     | string   |               | Name of input                                                                          |
| validatorListener | false  | function |               | It triggers after each validation. It will return `true` or `false`                    |


### Implemetations

 + [material-ui](https://www.npmjs.com/package/react-material-ui-form-validator)

### Contributing

This component covers all my needs, but feel free to contribute.