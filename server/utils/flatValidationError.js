const objectPath = require("object-path");

module.exports = function(err) {
    Object.keys(err.errors).forEach(key => {
        if (typeof err.errors[key] === "object" && err.errors[key].message) {
            err.errors[key] = err.errors[key].message;
        }

        if (key.indexOf(".") !== -1) {
            objectPath.set(err.errors, key, err.errors[key]);
            delete err.errors[key];
        }
        /*
        const keySplit = key.split(".");
        if (keySplit.length > 1) {
            err.errors[keySplit[keySplit.length - 1]] = err.errors[key];
            delete err.errors[key];
        }*/
    });
    return err;
};
