/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import Promise from 'promise-polyfill';
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
            event.persist();
        }
        this.errors = [];
        this.walk(this.childs).then((result) => {
            if (this.errors.length) {
                this.props.onError(this.errors);
            }
            if (result) {
                this.props.onSubmit(event);
            }
            return result;
        });
    }

    walk = (children, dryRun) => {
        const self = this;
        return new Promise((resolve) => {
            let result = true;
            if (Array.isArray(children)) {
                Promise.all(children.map(input => self.checkInput(input, dryRun))).then((data) => {
                    data.forEach((item) => {
                        if (!item) {
                            result = false;
                        }
                    });
                    resolve(result);
                });
            } else {
                self.walk([children], dryRun).then(result => resolve(result));
            }
        });
    }

    checkInput = (input, dryRun) => (
        new Promise((resolve) => {
            let result = true;
            const validators = input.props.validators;
            if (validators) {
                this.validate(input, true, dryRun).then((data) => {
                    if (!data) {
                        result = false;
                    }
                    resolve(result);
                });
            } else {
                resolve(result);
            }
        })
    )

    validate = (input, includeRequired, dryRun) => (
        new Promise((resolve) => {
            const { value, validators } = input.props;
            const result = [];
            let valid = true;
            const validations = Promise.all(
                validators.map(validator => (
                    Promise.all([
                        this.constructor.getValidator(validator, value, includeRequired),
                    ]).then((data) => {
                        result.push({ input, result: data && data[0] });
                        input.validate(input.props.value, true, dryRun);
                    })
                )),
            );
            validations.then(() => {
                result.forEach((item) => {
                    if (!item.result) {
                        valid = false;
                        this.errors.push(item.input);
                    }
                });
                resolve(valid);
            });
        })
    )

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

ValidatorForm.removeValidationRule = (name) => {
    delete Rules[name];
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
