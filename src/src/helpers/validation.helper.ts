/* eslint-disable no-unused-vars */
import Joi, { Types } from 'joi';
import { Exception, ExceptionCode } from '../exceptions';
import { ICradle } from '../container';
import moment from 'moment-timezone';
import _ from 'lodash';
import { otherHelper } from './other.helper';

export const validation = (iCradle: ICradle) => {
    const formatErrorMessage = ({
        type,
        error_type,
        is_array,
        is_object,
    }: {
        type: Types;
        error_type: string;
        is_array?: boolean;
        is_object?: boolean;
    }) => {
        let prefix = 'JOI_VALIDATE';

        switch (true) {
            case is_array:
                prefix = 'JOI_VALIDATE_ARRAY';
                break;
            case is_object:
                prefix = 'JOI_VALIDATE_OBJECT';
                break;
            default:
        }

        const errorData: string[] = [
            prefix,
            type.toUpperCase(),
            error_type.toUpperCase(),
        ];

        return errorData.join('_');
    };

    const formatLabel = (label: string) => {
        let formattedLabel = label;
        let is_array = false;
        let is_object = false;

        const regexArray = /\[|\]/g;
        if (regexArray.test(formattedLabel)) {
            formattedLabel = formattedLabel.replace(/\[|\]|\d/g, '');
            is_array = true;
        }

        const regexObject = /./g;
        if (regexObject.test(formattedLabel)) {
            is_object = true;
        }

        formattedLabel = capitalizeLabel(formattedLabel);

        return {
            label: formattedLabel,
            is_array,
            is_object,
        };
    };

    const capitalizeLabel = (label: string) => {
        return label.charAt(0).toUpperCase() + label.slice(1);
    };

    const joiDateTimeNumber = () => {
        try {
            return Joi.extend(joi => {
                return {
                    type: 'dateTimeNumber',
                    base: joi.number(),
                    messages: {
                        'dateTimeNumber.format':
                            'JOI_VALIDATE_OBJECT_DATETIMENUMBER_FORMAT',
                    },
                    validate(value, helpers) {
                        if (value === 0) {
                            return;
                        }
                        // Base validation regardless of the rules applied
                        const strValue = _.toString(value);
                        const date = moment(value, 'YYYYMMDD');
                        const dateTime = moment(value, 'YYYYMMDDHHmm');
                        const isLengthDate =
                            strValue.length === 8 || strValue.length === 12;

                        if (!isLengthDate) {
                            return {
                                value,
                                errors: helpers.error('dateNumber.format'),
                            };
                        }

                        if (strValue.length === 8 && !date.isValid()) {
                            return {
                                value,
                                errors: helpers.error('dateNumber.format'),
                            };
                        }

                        if (strValue.length === 12 && !dateTime.isValid()) {
                            return {
                                value,
                                errors: helpers.error('dateNumber.format'),
                            };
                        }

                        return;
                    },
                };
            });
        } catch (error) {
            console.log(error, 'parseDateTimeNumberError');
            return;
        }
    };

    const joiDateNumber = () => {
        try {
            return Joi.extend(joi => {
                return {
                    type: 'dateNumber',
                    base: joi.number(),
                    messages: {
                        'dateNumber.format':
                            'JOI_VALIDATE_OBJECT_DATENUMBER_FORMAT',
                    },
                    validate(value, helpers) {
                        if (value === 0) {
                            return;
                        }
                        // Base validation regardless of the rules applied
                        const strValue = _.toString(value);
                        const date = moment(value, 'YYYYMMDD');
                        if (strValue.length !== 8 || !date.isValid()) {
                            return {
                                value,
                                errors: helpers.error('dateNumber.format'),
                            };
                        }

                        return;
                    },
                };
            });
        } catch (error) {
            console.log(error, 'parseDateNumberError');
            return;
        }
    };

    const joiMonthNumber = () => {
        try {
            return Joi.extend(joi => {
                return {
                    type: 'monthNumber',
                    base: joi.number(),
                    messages: {
                        'monthNumber.format':
                            'JOI_VALIDATE_OBJECT_DATENUMBER_FORMAT',
                    },
                    validate(value, helpers) {
                        if (value === 0) {
                            return;
                        }
                        // Base validation regardless of the rules applied
                        const strValue = _.toString(value);
                        const date = moment(value, 'YYYYMM');
                        if (strValue.length !== 6 || !date.isValid()) {
                            return {
                                value,
                                errors: helpers.error('monthNumber.format'),
                            };
                        }

                        return;
                    },
                };
            });
        } catch (error) {
            console.log(error, 'parseMonthNumberError');
            return;
        }
    };

    const validate = (input, locale: string = 'VI') => {
        const valid = (joiSchema: {
            [k: string]: Joi.SchemaLike | Joi.SchemaLike[];
        }) => {
            const schema = Joi.object(joiSchema);

            const { error, value } = schema.validate(input, {
                allowUnknown: true,
            });

            if (error) {
                if (error.details.length != 0) {
                    const errorDetail = error.details[0];
                    const { type: typeOrigin, context } = errorDetail;

                    const [type, errorType] = typeOrigin.split('.');

                    if (type && errorType && context && context.label) {
                        const {
                            is_array: isArray,
                            is_object: isObject,
                            label,
                        } = formatLabel(context.label);

                        const errorMessage = formatErrorMessage({
                            type: type as Types,
                            error_type: errorType,
                            is_array: isArray,
                            is_object: isObject,
                        });

                        throw new Exception(
                            {
                                phrase: errorMessage,
                                locale,
                                replace: {
                                    value: label,
                                    limit: context['limit'],
                                },
                            },
                            ExceptionCode.VALIDATE_FAILED,
                        );
                    }

                    throw new Exception(
                        `Validation error: ${error.message}`,
                        ExceptionCode.VALIDATE_FAILED,
                    );
                }
                throw new Exception(
                    `Validation error: ${error.message}`,
                    ExceptionCode.VALIDATE_FAILED,
                );
            }

            return value;
        };

        return {
            valid,
        };
    };

    const joiTimeNumber = () => {
        try {
            return Joi.extend(joi => {
                return {
                    type: 'timeNumber',
                    base: joi.number(),
                    messages: {
                        'timeNumber.format':
                            'JOI_VALIDATE_OBJECT_TIMENUMBER_FORMAT',
                    },
                    validate(value, helpers) {
                        if (value === 0) {
                            return;
                        }

                        // Base validation regardless of the rules applied
                        const valueTime =
                            otherHelper(iCradle).formatHour(value);
                        const date = moment(valueTime, 'HHmm', true);
                        if (!date.isValid()) {
                            return {
                                value,
                                errors: helpers.error('timeNumber.format'),
                            };
                        }

                        return;
                    },
                };
            });
        } catch (error) {
            console.log(error, 'parseTimeNumberError');
            return;
        }
    };

    return {
        validate,
        joiDateTimeNumber,
        joiDateNumber,
        joiMonthNumber,
        joiTimeNumber,
    };
};

export { Joi };
