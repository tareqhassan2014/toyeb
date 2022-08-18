exports.successResponseObject = (data, message) => {
    return {
        data,
        messages: message ,
        hasErrors: false,
        isValid: true
    }
}

exports.errorResponseObject = (data, message) => {
    return {
        data,
        messages: message ,
        hasErrors: true,
        isValid: false
    }
}