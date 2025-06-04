import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace vector_tile. */
export namespace vector_tile {

    /** Properties of a Tile. */
    interface ITile {

        /** Tile layers */
        layers?: (vector_tile.Tile.ILayer[]|null);
    }

    /** Represents a Tile. */
    class Tile implements ITile {

        /**
         * Constructs a new Tile.
         * @param [properties] Properties to set
         */
        constructor(properties?: vector_tile.ITile);

        /** Tile layers. */
        public layers: vector_tile.Tile.ILayer[];

        /**
         * Creates a new Tile instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Tile instance
         */
        public static create(properties?: vector_tile.ITile): vector_tile.Tile;

        /**
         * Encodes the specified Tile message. Does not implicitly {@link vector_tile.Tile.verify|verify} messages.
         * @param message Tile message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: vector_tile.ITile, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Tile message, length delimited. Does not implicitly {@link vector_tile.Tile.verify|verify} messages.
         * @param message Tile message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: vector_tile.ITile, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Tile message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Tile
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vector_tile.Tile;

        /**
         * Decodes a Tile message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Tile
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vector_tile.Tile;

        /**
         * Verifies a Tile message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Tile message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Tile
         */
        public static fromObject(object: { [k: string]: any }): vector_tile.Tile;

        /**
         * Creates a plain object from a Tile message. Also converts values to other types if specified.
         * @param message Tile
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: vector_tile.Tile, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Tile to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Tile
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace Tile {

        /** GeomType enum. */
        enum GeomType {
            UNKNOWN = 0,
            POINT = 1,
            LINESTRING = 2,
            POLYGON = 3
        }

        /** Properties of a Value. */
        interface IValue {

            /** Value stringValue */
            stringValue?: (string|null);

            /** Value floatValue */
            floatValue?: (number|null);

            /** Value doubleValue */
            doubleValue?: (number|null);

            /** Value intValue */
            intValue?: (number|Long|null);

            /** Value uintValue */
            uintValue?: (number|Long|null);

            /** Value sintValue */
            sintValue?: (number|Long|null);

            /** Value boolValue */
            boolValue?: (boolean|null);
        }

        /** Represents a Value. */
        class Value implements IValue {

            /**
             * Constructs a new Value.
             * @param [properties] Properties to set
             */
            constructor(properties?: vector_tile.Tile.IValue);

            /** Value stringValue. */
            public stringValue: string;

            /** Value floatValue. */
            public floatValue: number;

            /** Value doubleValue. */
            public doubleValue: number;

            /** Value intValue. */
            public intValue: (number|Long);

            /** Value uintValue. */
            public uintValue: (number|Long);

            /** Value sintValue. */
            public sintValue: (number|Long);

            /** Value boolValue. */
            public boolValue: boolean;

            /**
             * Creates a new Value instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Value instance
             */
            public static create(properties?: vector_tile.Tile.IValue): vector_tile.Tile.Value;

            /**
             * Encodes the specified Value message. Does not implicitly {@link vector_tile.Tile.Value.verify|verify} messages.
             * @param message Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: vector_tile.Tile.IValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Value message, length delimited. Does not implicitly {@link vector_tile.Tile.Value.verify|verify} messages.
             * @param message Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: vector_tile.Tile.IValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Value message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vector_tile.Tile.Value;

            /**
             * Decodes a Value message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vector_tile.Tile.Value;

            /**
             * Verifies a Value message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Value message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Value
             */
            public static fromObject(object: { [k: string]: any }): vector_tile.Tile.Value;

            /**
             * Creates a plain object from a Value message. Also converts values to other types if specified.
             * @param message Value
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: vector_tile.Tile.Value, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Value to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Value
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a Feature. */
        interface IFeature {

            /** Feature id */
            id?: (number|Long|null);

            /** Feature tags */
            tags?: (number[]|null);

            /** Feature type */
            type?: (vector_tile.Tile.GeomType|null);

            /** Feature geometry */
            geometry?: (number[]|null);
        }

        /** Represents a Feature. */
        class Feature implements IFeature {

            /**
             * Constructs a new Feature.
             * @param [properties] Properties to set
             */
            constructor(properties?: vector_tile.Tile.IFeature);

            /** Feature id. */
            public id: (number|Long);

            /** Feature tags. */
            public tags: number[];

            /** Feature type. */
            public type: vector_tile.Tile.GeomType;

            /** Feature geometry. */
            public geometry: number[];

            /**
             * Creates a new Feature instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Feature instance
             */
            public static create(properties?: vector_tile.Tile.IFeature): vector_tile.Tile.Feature;

            /**
             * Encodes the specified Feature message. Does not implicitly {@link vector_tile.Tile.Feature.verify|verify} messages.
             * @param message Feature message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: vector_tile.Tile.IFeature, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Feature message, length delimited. Does not implicitly {@link vector_tile.Tile.Feature.verify|verify} messages.
             * @param message Feature message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: vector_tile.Tile.IFeature, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Feature message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Feature
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vector_tile.Tile.Feature;

            /**
             * Decodes a Feature message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Feature
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vector_tile.Tile.Feature;

            /**
             * Verifies a Feature message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Feature message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Feature
             */
            public static fromObject(object: { [k: string]: any }): vector_tile.Tile.Feature;

            /**
             * Creates a plain object from a Feature message. Also converts values to other types if specified.
             * @param message Feature
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: vector_tile.Tile.Feature, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Feature to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Feature
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a Layer. */
        interface ILayer {

            /** Layer version */
            version: number;

            /** Layer name */
            name: string;

            /** Layer features */
            features?: (vector_tile.Tile.IFeature[]|null);

            /** Layer keys */
            keys?: (string[]|null);

            /** Layer values */
            values?: (vector_tile.Tile.IValue[]|null);

            /** Layer extent */
            extent?: (number|null);
        }

        /** Represents a Layer. */
        class Layer implements ILayer {

            /**
             * Constructs a new Layer.
             * @param [properties] Properties to set
             */
            constructor(properties?: vector_tile.Tile.ILayer);

            /** Layer version. */
            public version: number;

            /** Layer name. */
            public name: string;

            /** Layer features. */
            public features: vector_tile.Tile.IFeature[];

            /** Layer keys. */
            public keys: string[];

            /** Layer values. */
            public values: vector_tile.Tile.IValue[];

            /** Layer extent. */
            public extent: number;

            /**
             * Creates a new Layer instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Layer instance
             */
            public static create(properties?: vector_tile.Tile.ILayer): vector_tile.Tile.Layer;

            /**
             * Encodes the specified Layer message. Does not implicitly {@link vector_tile.Tile.Layer.verify|verify} messages.
             * @param message Layer message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: vector_tile.Tile.ILayer, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Layer message, length delimited. Does not implicitly {@link vector_tile.Tile.Layer.verify|verify} messages.
             * @param message Layer message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: vector_tile.Tile.ILayer, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Layer message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Layer
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vector_tile.Tile.Layer;

            /**
             * Decodes a Layer message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Layer
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vector_tile.Tile.Layer;

            /**
             * Verifies a Layer message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Layer message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Layer
             */
            public static fromObject(object: { [k: string]: any }): vector_tile.Tile.Layer;

            /**
             * Creates a plain object from a Layer message. Also converts values to other types if specified.
             * @param message Layer
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: vector_tile.Tile.Layer, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Layer to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Layer
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }
}
