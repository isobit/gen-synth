Math.randomFloatInRange = function(min, max) {
    return Math.random() * (max - min) + min;
};

Math.randomIntInRange = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};

Array.prototype.random = function() {
    return this[Math.randomIntInRange(0, this.length)];
};

Object.prototype.forEach = function(f) {
    var self = this;
    Object.keys(this).forEach(function(key){
        f({key: key, value: self[key]});
    });
};

Object.prototype.map = function(f) {
    var self = this;
    var o = {};
    Object.keys(this).forEach(function(key){
        o[key] = f({key: key, value: self[key]});
    });
    return o;
};

Object.clone = function(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = Object.clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
};


