"use strict";
window.WindowController = (function () {
    function WindowController() {
        this.id = Math.random();
        this.callbacks = {};
        window.addEventListener('storage', this, false);
        window.addEventListener('unload', this, false);
    }
    WindowController.prototype.handleEvent = function (event) {
        if (event.type === 'unload') {
            this.destroy();
        }
        else if (event.key === 'broadcast') {
            try {
                var data_1 = JSON.parse(event.newValue);
                if (data_1.id !== this.id) {
                    if (typeof this[data_1.type] === 'function') {
                        this[data_1.type](data_1);
                        return;
                    }
                    if (this.callbacks[data_1.type]) {
                        this.callbacks[data_1.type].forEach(function (fn) { return fn(data_1); });
                    }
                }
            }
            catch (error) {
            }
        }
    };
    WindowController.prototype.destroy = function () {
        window.removeEventListener('storage', this, false);
        window.removeEventListener('unload', this, false);
    };
    WindowController.prototype._broadcast = function (type, data) {
        var event = {
            id: this.id,
            type: type
        };
        if (data) {
            event['data'] = data;
        }
        try {
            localStorage.setItem('broadcast', JSON.stringify(event));
        }
        catch (error) {
        }
    };
    WindowController.prototype.broadcast = function (type, data) {
        if (typeof this[type] === 'function') {
            throw Error('Reserved events');
        }
        this._broadcast(type, data);
    };
    WindowController.prototype.on = function (name, callback) {
        if (typeof this[name] === 'function') {
            throw new Error('Reserved callback');
        }
        if (typeof this.callbacks[name] === 'undefined') {
            this.callbacks[name] = [];
        }
        this.callbacks[name][this.callbacks[name].length] = callback;
        return this;
    };
    WindowController.prototype.off = function (name, callback) {
        if (this.callbacks[name] === undefined) {
            return;
        }
        if (callback === undefined || callback === null) {
            delete this.callbacks[name];
        }
        else {
            var index = this.callbacks[name].indexOf(callback, 0);
            if (index > -1) {
                this.callbacks[name].splice(index, 1);
            }
        }
    };
    return WindowController;
}());
