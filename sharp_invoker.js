module.exports = (cb, functionName, ...args) => {
    cb(null, require('./naver')[functionName](...args));
};