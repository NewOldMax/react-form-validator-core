/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
/* eslint-enable */
import { polyfill } from 'react-lifecycles-compat';
import ValidatorForm from './ValidatorForm';
import { debounce } from './utils';

class ValidatorComponent extends React.Component {

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.validators && nextProps.errorMessages &&
            (
                prevState.validators !== nextProps.validators ||
                prevState.errorMessages !== nextProps.errorMessages
            )
        ) {
            return {
                value: nextProps.value,
                validators: nextProps.validators,
                errorMessages: nextProps.errorMessages,
            };
        }

        return {
            value: nextProps.value,
        };
    }

    state = {
        isValid: true,
        value: this.props.value,
        errorMessages: this.props.errorMessages,
        validators: this.props.validators,
    }

    componentDidMount() {
        this.configure();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state !== nextState || this.props !== nextProps;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.instantValidate && this.props.value !== prevState.value) {
            this.validateDebounced(this.props.value, this.props.withRequiredValidator);
        }
    }

    componentWillUnmount() {
        this.context.form.detachFromForm(this);
        this.validateDebounced.cancel();
    }

    getErrorMessage = () => {
        const { errorMessages } = this.state;
        const type = typeof errorMessages;

        if (type === 'string') {
            return errorMessages;
        } else if (type === 'object') {
            if (this.invalid.length > 0) {
                return errorMessages[this.invalid[0]];
            }
        }
        // eslint-disable-next-line
        console.log('unknown errorMessages type', errorMessages);
        return true;
    }

    instantValidate = true
    invalid = []

    configure = () => {
        if (!this.props.name) {
            throw new Error('Form field requires a name property when used');
        }
        this.context.form.attachToForm(this);
        this.instantValidate = this.context.form.instantValidate;
        this.debounceTime = this.context.form.debounceTime;
        this.validateDebounced = debounce(this.validate, this.debounceTime);
    }

    validate = (value, includeRequired = false, dryRun = false) => {
        this.invalid = [];
        const result = [];
        let valid = true;
        this.state.validators.map((validator, i) => {
            const obj = {};
            obj[i] = ValidatorForm.getValidator(validator, value, includeRequired);
            return result.push(obj);
        });
        result.map(item =>
            Object.keys(item).map((key) => {
                if (!item[key]) {
                    valid = false;
                    this.invalid.push(key);
                }
                return key;
            }),
        );

        if (!dryRun) {
            this.setState({ isValid: valid }, () => {
                this.props.validatorListener(this.state.isValid);
            });
        }
    }

    isValid = () => this.state.isValid;

    makeInvalid = () => {
        this.setState({ isValid: false });
    }

    makeValid = () => {
        this.setState({ isValid: true });
    }
}

ValidatorComponent.contextTypes = {
    form: PropTypes.object,
};

ValidatorComponent.propTypes = {
    errorMessages: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.string,
    ]),
    validators: PropTypes.array,
    name: PropTypes.string,
    value: PropTypes.any,
    validatorListener: PropTypes.func,
    withRequiredValidator: PropTypes.bool,
};

ValidatorComponent.defaultProps = {
    errorMessages: 'error',
    validators: [],
    validatorListener: () => {},
};

polyfill(ValidatorComponent);

export default ValidatorComponent;
