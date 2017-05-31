/*eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.com = (function() {

    /**
     * Namespace com.
     * @exports com
     * @namespace
     */
    var com = {};

    com.sunny = (function() {

        /**
         * Namespace sunny.
         * @exports com.sunny
         * @namespace
         */
        var sunny = {};

        sunny.proto = (function() {

            /**
             * Namespace proto.
             * @exports com.sunny.proto
             * @namespace
             */
            var proto = {};

            proto.MapConfigMessage = (function() {

                /**
                 * Properties of a MapConfigMessage.
                 * @typedef com.sunny.proto.MapConfigMessage$Properties
                 * @type {Object}
                 * @property {number} [mapWidth] MapConfigMessage mapWidth.
                 * @property {number} [mapHeight] MapConfigMessage mapHeight.
                 * @property {number} [sliceWidth] MapConfigMessage sliceWidth.
                 * @property {number} [sliceHeight] MapConfigMessage sliceHeight.
                 */

                /**
                 * Constructs a new MapConfigMessage.
                 * @exports com.sunny.proto.MapConfigMessage
                 * @constructor
                 * @param {com.sunny.proto.MapConfigMessage$Properties=} [properties] Properties to set
                 */
                function MapConfigMessage(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * MapConfigMessage mapWidth.
                 * @type {number}
                 */
                MapConfigMessage.prototype.mapWidth = 0;

                /**
                 * MapConfigMessage mapHeight.
                 * @type {number}
                 */
                MapConfigMessage.prototype.mapHeight = 0;

                /**
                 * MapConfigMessage sliceWidth.
                 * @type {number}
                 */
                MapConfigMessage.prototype.sliceWidth = 0;

                /**
                 * MapConfigMessage sliceHeight.
                 * @type {number}
                 */
                MapConfigMessage.prototype.sliceHeight = 0;

                /**
                 * Creates a new MapConfigMessage instance using the specified properties.
                 * @param {com.sunny.proto.MapConfigMessage$Properties=} [properties] Properties to set
                 * @returns {com.sunny.proto.MapConfigMessage} MapConfigMessage instance
                 */
                MapConfigMessage.create = function create(properties) {
                    return new MapConfigMessage(properties);
                };

                /**
                 * Encodes the specified MapConfigMessage message. Does not implicitly {@link com.sunny.proto.MapConfigMessage.verify|verify} messages.
                 * @param {com.sunny.proto.MapConfigMessage$Properties} message MapConfigMessage message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                MapConfigMessage.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.mapWidth != null && message.hasOwnProperty("mapWidth"))
                        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.mapWidth);
                    if (message.mapHeight != null && message.hasOwnProperty("mapHeight"))
                        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.mapHeight);
                    if (message.sliceWidth != null && message.hasOwnProperty("sliceWidth"))
                        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.sliceWidth);
                    if (message.sliceHeight != null && message.hasOwnProperty("sliceHeight"))
                        writer.uint32(/* id 4, wireType 0 =*/32).int32(message.sliceHeight);
                    return writer;
                };

                /**
                 * Encodes the specified MapConfigMessage message, length delimited. Does not implicitly {@link com.sunny.proto.MapConfigMessage.verify|verify} messages.
                 * @param {com.sunny.proto.MapConfigMessage$Properties} message MapConfigMessage message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                MapConfigMessage.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a MapConfigMessage message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {com.sunny.proto.MapConfigMessage} MapConfigMessage
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                MapConfigMessage.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.sunny.proto.MapConfigMessage();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.mapWidth = reader.int32();
                            break;
                        case 2:
                            message.mapHeight = reader.int32();
                            break;
                        case 3:
                            message.sliceWidth = reader.int32();
                            break;
                        case 4:
                            message.sliceHeight = reader.int32();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a MapConfigMessage message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {com.sunny.proto.MapConfigMessage} MapConfigMessage
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                MapConfigMessage.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a MapConfigMessage message.
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                MapConfigMessage.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.mapWidth != null && message.hasOwnProperty("mapWidth"))
                        if (!$util.isInteger(message.mapWidth))
                            return "mapWidth: integer expected";
                    if (message.mapHeight != null && message.hasOwnProperty("mapHeight"))
                        if (!$util.isInteger(message.mapHeight))
                            return "mapHeight: integer expected";
                    if (message.sliceWidth != null && message.hasOwnProperty("sliceWidth"))
                        if (!$util.isInteger(message.sliceWidth))
                            return "sliceWidth: integer expected";
                    if (message.sliceHeight != null && message.hasOwnProperty("sliceHeight"))
                        if (!$util.isInteger(message.sliceHeight))
                            return "sliceHeight: integer expected";
                    return null;
                };

                /**
                 * Creates a MapConfigMessage message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {com.sunny.proto.MapConfigMessage} MapConfigMessage
                 */
                MapConfigMessage.fromObject = function fromObject(object) {
                    if (object instanceof $root.com.sunny.proto.MapConfigMessage)
                        return object;
                    var message = new $root.com.sunny.proto.MapConfigMessage();
                    if (object.mapWidth != null)
                        message.mapWidth = object.mapWidth | 0;
                    if (object.mapHeight != null)
                        message.mapHeight = object.mapHeight | 0;
                    if (object.sliceWidth != null)
                        message.sliceWidth = object.sliceWidth | 0;
                    if (object.sliceHeight != null)
                        message.sliceHeight = object.sliceHeight | 0;
                    return message;
                };

                /**
                 * Creates a MapConfigMessage message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link com.sunny.proto.MapConfigMessage.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {com.sunny.proto.MapConfigMessage} MapConfigMessage
                 */
                MapConfigMessage.from = MapConfigMessage.fromObject;

                /**
                 * Creates a plain object from a MapConfigMessage message. Also converts values to other types if specified.
                 * @param {com.sunny.proto.MapConfigMessage} message MapConfigMessage
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                MapConfigMessage.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.mapWidth = 0;
                        object.mapHeight = 0;
                        object.sliceWidth = 0;
                        object.sliceHeight = 0;
                    }
                    if (message.mapWidth != null && message.hasOwnProperty("mapWidth"))
                        object.mapWidth = message.mapWidth;
                    if (message.mapHeight != null && message.hasOwnProperty("mapHeight"))
                        object.mapHeight = message.mapHeight;
                    if (message.sliceWidth != null && message.hasOwnProperty("sliceWidth"))
                        object.sliceWidth = message.sliceWidth;
                    if (message.sliceHeight != null && message.hasOwnProperty("sliceHeight"))
                        object.sliceHeight = message.sliceHeight;
                    return object;
                };

                /**
                 * Creates a plain object from this MapConfigMessage message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                MapConfigMessage.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };

                /**
                 * Converts this MapConfigMessage to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                MapConfigMessage.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return MapConfigMessage;
            })();

            return proto;
        })();

        return sunny;
    })();

    return com;
})();

module.exports = $root;
