//get all data response
exports.getAllResponse = (res, data) => {
    res.status(200).json({
        success: true,
        code: 200,
        data
    });
}

//message data response
exports.createResponse = (res, data, message) => {
    res.status(201).json({
        message,
        success: true,
        code: 201,
        data
    });
}

//find data response
exports.getOneResponse = (res, data) => {
    res.send({
        success: true,
        code: 200,
        data
    });
}

//message response
exports.response = (res, message) => {
    res.send({
        success: true,
        code: 200,
        message
    });
}