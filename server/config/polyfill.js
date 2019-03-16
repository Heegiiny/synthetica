if (!RegExp.escape) {
    RegExp.escape = function(s) {
        return String(s).replace(/[\\^$*+?.()|[\]{}]/g, "\\$&");
    };
}

if (!RegExp.fromString) {
    RegExp.fromString = function(s, opts) {
        return new RegExp(RegExp.escape(s), opts);
    };
}

if (!Array.prototype.last) {
    Array.prototype.last = function() {
        return this[this.length - 1];
    };
}
