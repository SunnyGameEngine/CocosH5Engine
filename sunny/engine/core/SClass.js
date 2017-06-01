/**
 * Black8 Game Studio By Sunny
 * @author 刘黎明（Sunny）
 * @version 创建时间：2017-04-10 15:00:00
 * SClass
 */
const engine = require("./SPredefine");

/**
 * Common getter setter configuration function
 * @function
 * @param {Object}   proto      A class prototype or an object to config<br/>
 * @param {String}   prop       Property name
 * @param {function} getter     Getter function for the property
 * @param {function} setter     Setter function for the property
 * @param {String}   getterName Name of getter function for the property
 * @param {String}   setterName Name of setter function for the property
 */
engine.defineGetterSetter = function (proto, prop, getter, setter, getterName, setterName) {
    if (proto.__defineGetter__) {
        getter && proto.__defineGetter__(prop, getter);
        setter && proto.__defineSetter__(prop, setter);
    } else if (Object.defineProperty) {
        var desc = {enumerable: false, configurable: true};
        getter && (desc.get = getter);
        setter && (desc.set = setter);
        Object.defineProperty(proto, prop, desc);
    } else {
        throw new Error("browser does not support getters");
    }

    if (!getterName && !setterName) {
        // Lookup getter/setter function
        var hasGetter = (getter != null), hasSetter = (setter != undefined), props = Object.getOwnPropertyNames(proto);
        for (var i = 0; i < props.length; i++) {
            var name = props[i];

            if ((proto.__lookupGetter__ ? proto.__lookupGetter__(name)
                    : Object.getOwnPropertyDescriptor(proto, name))
                || typeof proto[name] !== "function")
                continue;

            var func = proto[name];
            if (hasGetter && func === getter) {
                getterName = name;
                if (!hasSetter || setterName) break;
            }
            if (hasSetter && func === setter) {
                setterName = name;
                if (!hasGetter || getterName) break;
            }
        }
    }

    // Found getter/setter
    var ctor = proto.constructor;
    if (getterName) {
        if (!ctor.__getters__) {
            ctor.__getters__ = {};
        }
        ctor.__getters__[getterName] = prop;
    }
    if (setterName) {
        if (!ctor.__setters__) {
            ctor.__setters__ = {};
        }
        ctor.__setters__[setterName] = prop;
    }
};

/**
 * Create a new object and copy all properties in an exist object to the new object
 * @function
 * @param {object|Array} obj The source object
 * @return {Array|object} The created object
 */
engine.clone = function (obj) {
    var newObj = (obj.constructor) ? new obj.constructor : {};
    for (var key in obj) {
        var copy = obj[key];
        // Beware that typeof null == "object" !
        if (((typeof copy) === "object") && copy) {
            newObj[key] = engine.clone(copy);
        } else {
            newObj[key] = copy;
        }
    }
    return newObj;
};

engine.inject = function (srcPrototype, destPrototype) {
    for (var key in srcPrototype)
        destPrototype[key] = srcPrototype[key];
};

/**
 * @namespace
 * @name ClassManager
 */
var ClassManager = {
    id : (0|(Math.random()*998)),

    instanceId : (0|(Math.random()*998)),

    getNewID : function(){
        return this.id++;
    },

    getNewInstanceId : function(){
        return this.instanceId++;
    }
};

/* Managed JavaScript Inheritance
 * Based on John Resig's Simple JavaScript Inheritance http://ejohn.org/blog/simple-javascript-inheritance/
 * MIT Licensed.
 */
(function () {
    var fnTest = /\b_super\b/;

    /**
     * The base Class implementation (does nothing)
     * @class
     */
    engine.Class = function () {
    };

    /**
     * Create a new Class that inherits from this Class
     * @static
     * @param {object} props
     * @return {function}
     */
    engine.Class.extend = function (props) {
        var _super = this.prototype;
        var prototype = Object.create(_super);
        var desc = {writable: true, enumerable: false, configurable: true};

        // The dummy Class constructor
        var Class;
        if (engine.config && engine.CONFIG_KEY && engine.config[engine.CONFIG_KEY.exposeClassName]) {
            var constructor = "(function " + (props._className || "Class") + " (arg0, arg1, arg2, arg3, arg4, arg5) {\n";
            constructor += "    this.__instanceId = ClassManager.getNewInstanceId();\n";
            constructor += "    if (this.ctor) {\n";
            constructor += "        switch (arguments.length) {\n";
            constructor += "        case 0: this.ctor(); break;\n";
            constructor += "        case 1: this.ctor(arg0); break;\n";
            constructor += "        case 3: this.ctor(arg0, arg1, arg2); break;\n";
            constructor += "        case 4: this.ctor(arg0, arg1, arg2, arg3); break;\n";
            constructor += "        case 5: this.ctor(arg0, arg1, arg2, arg3, arg4); break;\n";
            constructor += "        default: this.ctor.apply(this, arguments);\n";
            constructor += "        }\n";
            constructor += "    }\n";
            constructor += "})";
            Class = eval(constructor);
        }
        else {
            Class = function (arg0, arg1, arg2, arg3, arg4) {
                this.__instanceId = ClassManager.getNewInstanceId();
                if (this.ctor) {
                    switch (arguments.length) {
                    case 0: this.ctor(); break;
                    case 1: this.ctor(arg0); break;
                    case 2: this.ctor(arg0, arg1); break;
                    case 3: this.ctor(arg0, arg1, arg2); break;
                    case 4: this.ctor(arg0, arg1, arg2, arg3); break;
                    case 5: this.ctor(arg0, arg1, arg2, arg3, arg4); break;
                    default: this.ctor.apply(this, arguments);
                    }
                }
            };
        }

        desc.value = ClassManager.getNewID();
        Object.defineProperty(prototype, '__pid', desc);

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        desc.value = Class;
        Object.defineProperty(prototype, 'constructor', desc);

        // Copy getter/setter
        this.__getters__ && (Class.__getters__ = engine.clone(this.__getters__));
        this.__setters__ && (Class.__setters__ = engine.clone(this.__setters__));

        for (var idx = 0, li = arguments.length; idx < li; ++idx) {
            var prop = arguments[idx];
            for (var name in prop) {
                var isFunc = (typeof prop[name] === "function");
                var override = (typeof _super[name] === "function");
                var hasSuperCall = fnTest.test(prop[name]);

                if (isFunc && override && hasSuperCall) {
                    desc.value = (function (name, fn) {
                        return function () {
                            var tmp = this._super;

                            // Add a new ._super() method that is the same method
                            // but on the super-Class
                            this._super = _super[name];

                            // The method only need to be bound temporarily, so we
                            // remove it when we're done executing
                            var ret = fn.apply(this, arguments);
                            this._super = tmp;

                            return ret;
                        };
                    })(name, prop[name]);
                    Object.defineProperty(prototype, name, desc);
                } else if (isFunc) {
                    desc.value = prop[name];
                    Object.defineProperty(prototype, name, desc);
                } else {
                    prototype[name] = prop[name];
                }

                if (isFunc) {
                    // Override registered getter/setter
                    var getter, setter, propertyName;
                    if (this.__getters__ && this.__getters__[name]) {
                        propertyName = this.__getters__[name];
                        for (var i in this.__setters__) {
                            if (this.__setters__[i] === propertyName) {
                                setter = i;
                                break;
                            }
                        }
                        engine.defineGetterSetter(prototype, propertyName, prop[name], prop[setter] ? prop[setter] : prototype[setter], name, setter);
                    }
                    if (this.__setters__ && this.__setters__[name]) {
                        propertyName = this.__setters__[name];
                        for (var i in this.__getters__) {
                            if (this.__getters__[i] === propertyName) {
                                getter = i;
                                break;
                            }
                        }
                        engine.defineGetterSetter(prototype, propertyName, prop[getter] ? prop[getter] : prototype[getter], prop[name], getter, name);
                    }
                }
            }
        }

        // And make this Class extendable
        Class.extend = engine.Class.extend;

        //add implementation method
        Class.implement = function (prop) {
            for (var name in prop) {
                prototype[name] = prop[name];
            }
        };
        return Class;
    };
})();
