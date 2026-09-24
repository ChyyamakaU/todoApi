/* eslint-disable no-undef */
const errorHandler = (err, req, res) => {
    console.error(err);

    return res.status(err.statusCode || 500).json({
        status: "error",
        message: err.message || "Something went wrong"
    });
};

module.exports = errorHandler;