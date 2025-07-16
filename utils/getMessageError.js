let message = `Some Fields contains values that do not match the terms and policy of the site`;

let getErrorMessages = (field) => {
    let message = `\'${field}\' contains values that do not match the terms and policy of the site`;
    return {
        // string
        "string.alphanum": `\'${field}\' must contain alphanumeric characters only`,
        "string.base": `\'${field}\' must be a string`,
        "string.base64": `\'${field}\' must be a valid base64 string`,
        "string.creditCard": `\'${field}\' must be a valid credit card number`,
        "string.dataUri": `\'${field}\' must be a valid data URI`,
        "string.domain": `\'${field}\' must contain a valid domain name`,
        "string.email": `\'${field}\' must be a valid email address`,
        "string.empty": `\'${field}\' must not be empty`,
        "string.guid": `\'${field}\' must be a valid GUID`,
        "string.hex": `\'${field}\' must only contain hexadecimal characters`,
        "string.hexAlign": `Hex decoded representation of \'${field}\' must be byte aligned`,
        "string.hostname": `\'${field}\' must be a valid hostname`,
        "string.ip": `\'${field}\' must be a valid IP address`,
        "string.ipVersion": `\'${field}\' must be a valid IP address of a specific version`,
        "string.isoDate": `\'${field}\' must be a valid ISO date`,
        "string.isoDuration": `\'${field}\' must be a valid ISO duration`,
        "string.length": message,
        "string.lowercase": message,
        "string.max": message,
        "string.normalize": message,
        "string.token": `\'${field}\' must only contain alphanumeric and underscore characters`,
        "string.pattern.base": message,
        "string.pattern.name": message,
        "string.pattern.invert.base": message,
        "string.pattern.invert.name": message,
        "string.trim": `\'${field}\' must not have leading or trailing whitespace`,
        "string.min": message,
        "string.uri": `\'${field}\' must be a valid URI`,
        "string.uriCustomScheme": message,
        "string.uriRelativeOnly": `\'${field}\' must be a valid relative URI`,
        "string.uppercase": message,
        // date
        "date.base": `\'${field}\' must be a valid date`,
        "date.empty": `\'${field}\' must not be empty`,
        "date.format": `\'${field}\' Invalid date format`,
        "date.min": message,
        "date.ref": message,
        // number
        "number.base": `\'${field}\' must be a number`,
        "number.max": message,
        "number.min": message,
        "number.integer": `\'${field}\' must be an integer`,
        "number.trim": `\'${field}\' must not have leading or trailing whitespace`,
        "number.greater": `\'${field}\' must be greater than the opening time`,
        // array
        "array.min": message,
        "any.required": `\'${field}\' is required`,
    };
};

export { getErrorMessages, message };
