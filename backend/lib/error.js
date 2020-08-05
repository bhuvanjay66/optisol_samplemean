//data error
//internal server error
exports.error500 = (res, message) => {
    return res.status(500).send({ message, code: 500, success: false, data: null});
}

//unauthorized error
exports.error402 = (res, message) => {
    return res.status(402).send({ message, code: 402, success: false, data: null });
}

//catch error
exports.error404 = (res, message) => {
    return res.status(404).send({ message, code: 404, success: false, data: null });
}

//validation error
exports.error422 = (res, err) => {
    if (err.name == "ValidationError") {
        const validatorError = [];
        for (const key in err.errors) {
            validatorError.push({
                key, message: err.errors[key].message
            });
        }
        return res.status(400).send({code: 422, success: false, data: null, validatorError});
    }
}