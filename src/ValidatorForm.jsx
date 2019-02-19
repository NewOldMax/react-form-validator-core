/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
/* eslint-enable */
import Rules from './ValidationRules';

class ValidatorForm extends React.Component {

    static getValidator = (validator, value, includeRequired) => {
        let result = true;
        let name = validator;
        if (name !== 'required' || includeRequired) {
            let extra;
            const splitIdx = validator.indexOf(':');
            if (splitIdx !== -1) {
                name = validator.substring(0, splitIdx);
                extra = validator.substring(splitIdx + 1);
            }
            result = Rules[name](value, extra);
        }
        return result;
    }

    getChildContext = () => ({
        form: {
            attachToForm: this.attachToForm,
            detachFromForm: this.detachFromForm,
            instantValidate: this.instantValidate,
            debounceTime: this.debounceTime,
        },
    })

    instantValidate = this.props.instantValidate !== undefined ? this.props.instantValidate : true
    debounceTime = this.props.debounceTime
    childs = []
    errors = []

    attachToForm = (component) => {
        if (this.childs.indexOf(component) === -1) {
            this.childs.push(component);
        }
    }

    detachFromForm = (component) => {
        const componentPos = this.childs.indexOf(component);
        if (componentPos !== -1) {
            this.childs = this.childs.slice(0, componentPos)
                .concat(this.childs.slice(componentPos + 1));
        }
    }

    submit = (event) => {
        if (event) {
            event.preventDefault();
        }
        this.errors = [];
        const result = this.walk(this.childs);
        if (this.errors.length) {
            this.props.onError(this.errors);
        }
        if (result) {
            this.props.onSubmit(event);
        }
        return result;
    }

    walk = (children, dryRun) => {
        const self = this;
        let result = true;
        if (Array.isArray(children)) {
            children.forEach((input) => {
                if (!self.checkInput(input, dryRun)) {
                    result = false;
                }
                return input;
            });
        } else {
            result = self.walk([children], dryRun);
        }
        return result;
    }

    checkInput = (input, dryRun) => {
        let result = true;
        const validators = input.props.validators;
        if (validators && !this.validate(input, true, dryRun)) {
            result = false;
        }
        return result;
    }

    validate = (input, includeRequired, dryRun) => {
        const { value, validators } = input.props;
        const result = [];
        let valid = true;
        let validateResult = false;
        validators.map((validator) => {
            validateResult = this.constructor.getValidator(validator, value, includeRequired);
            result.push({ input, result: validateResult });
            input.validate(input.props.value, true, dryRun);
            return validator;
        });
        result.map((item) => {
            if (!item.result) {
                valid = false;
                this.errors.push(item.input);
            }
            return item;
        });
        return valid;
    }

    find = (collection, fn) => {
        for (let i = 0, l = collection.length; i < l; i++) {
            const item = collection[i];
            if (fn(item)) {
                return item;
            }
        }
        return null;
    }

    resetValidations = () => {
        this.childs.forEach((child) => {
            child.validateDebounced.cancel();
            child.setState({ isValid: true });
        });
    }

    isFormValid = (dryRun = true) => this.walk(this.childs, dryRun);

    render() {
        // eslint-disable-next-line
        const { onSubmit, instantValidate, onError, debounceTime, children, ...rest } = this.props;
        return (
            <form {...rest} onSubmit={this.submit}>
                {children}
            </form>
        );
    }
}

ValidatorForm.addValidationRule = (name, callback) => {
    Rules[name] = callback;
};

ValidatorForm.childContextTypes = {
    form: PropTypes.object,
};

ValidatorForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    instantValidate: PropTypes.bool,
    children: PropTypes.node,
    onError: PropTypes.func,
    debounceTime: PropTypes.number,
};

ValidatorForm.defaultProps = {
    onError: () => {},
    debounceTime: 0,
};

export default ValidatorForm;
