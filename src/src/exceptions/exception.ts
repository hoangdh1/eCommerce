import ExceptionCode from './exceptionCode';
import * as i18n from 'i18n';
import _ from 'lodash';

interface IObject {
    [k: string]: string;
}

interface IErrorMessageParams {
    phrase: string;
    locale?: string;
    replace?: IObject;
}

class Exception extends Error {
    public code: number;
    public status_code: number;

    constructor(_message: string | IErrorMessageParams, code: ExceptionCode = ExceptionCode.UNKNOWN, status_code: number = 500, _locale: string = 'VI') {
        let locale = _locale;

        // Calling parent constructor of base Error class.
        let message: string = '';
        if (_.isObject(_message)) {
            if (_message.locale) {
                locale = _message.locale;
            }

            const replaceOptions = _message.replace && !_.isEmpty(_message.replace) ? _message.replace : {};

            try {
                message = i18n.__(
                    {
                        phrase: _message.phrase,
                        locale,
                    },
                    {
                        ...replaceOptions,
                    },
                );
            } catch (error) {

            }
        } else {
            message = i18n.__({ phrase: _message, locale });
        }

        // this.message = _message;
        super(message);

        // Saving class name in the property of our custom error as a shortcut

        this.name = 'Exception';

        // Capturing stack trace, excluding constructor call from it.
        Error.captureStackTrace(this, this.constructor);

        // You can use any additional properties you want.
        // I'm going to use preferred HTTP status for this eror types.
        // `500` is the default value if not specified.
        this.code = code;

        this.status_code = status_code;
    }
}

export default Exception;
