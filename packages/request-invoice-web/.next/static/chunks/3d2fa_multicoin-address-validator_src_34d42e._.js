(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/3d2fa_multicoin-address-validator_src_34d42e._.js", {

"[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/blake256.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/next@15.1.3_react-dom@19.0.0_react@19.0.0/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)");
'use strict';
/**
 * Credits to https://github.com/cryptocoinjs/blake-hash
 */ Blake256.sigma = [
    [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15
    ],
    [
        14,
        10,
        4,
        8,
        9,
        15,
        13,
        6,
        1,
        12,
        0,
        2,
        11,
        7,
        5,
        3
    ],
    [
        11,
        8,
        12,
        0,
        5,
        2,
        15,
        13,
        10,
        14,
        3,
        6,
        7,
        1,
        9,
        4
    ],
    [
        7,
        9,
        3,
        1,
        13,
        12,
        11,
        14,
        2,
        6,
        5,
        10,
        4,
        0,
        15,
        8
    ],
    [
        9,
        0,
        5,
        7,
        2,
        4,
        10,
        15,
        14,
        1,
        11,
        12,
        6,
        8,
        3,
        13
    ],
    [
        2,
        12,
        6,
        10,
        0,
        11,
        8,
        3,
        4,
        13,
        7,
        5,
        15,
        14,
        1,
        9
    ],
    [
        12,
        5,
        1,
        15,
        14,
        13,
        4,
        10,
        0,
        7,
        6,
        3,
        9,
        2,
        8,
        11
    ],
    [
        13,
        11,
        7,
        14,
        12,
        1,
        3,
        9,
        5,
        0,
        15,
        4,
        8,
        6,
        2,
        10
    ],
    [
        6,
        15,
        14,
        9,
        11,
        3,
        0,
        8,
        12,
        2,
        13,
        7,
        1,
        4,
        10,
        5
    ],
    [
        10,
        2,
        8,
        4,
        7,
        6,
        1,
        5,
        15,
        11,
        9,
        14,
        3,
        12,
        13,
        0
    ],
    [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15
    ],
    [
        14,
        10,
        4,
        8,
        9,
        15,
        13,
        6,
        1,
        12,
        0,
        2,
        11,
        7,
        5,
        3
    ],
    [
        11,
        8,
        12,
        0,
        5,
        2,
        15,
        13,
        10,
        14,
        3,
        6,
        7,
        1,
        9,
        4
    ],
    [
        7,
        9,
        3,
        1,
        13,
        12,
        11,
        14,
        2,
        6,
        5,
        10,
        4,
        0,
        15,
        8
    ],
    [
        9,
        0,
        5,
        7,
        2,
        4,
        10,
        15,
        14,
        1,
        11,
        12,
        6,
        8,
        3,
        13
    ],
    [
        2,
        12,
        6,
        10,
        0,
        11,
        8,
        3,
        4,
        13,
        7,
        5,
        15,
        14,
        1,
        9
    ]
];
Blake256.u256 = [
    0x243f6a88,
    0x85a308d3,
    0x13198a2e,
    0x03707344,
    0xa4093822,
    0x299f31d0,
    0x082efa98,
    0xec4e6c89,
    0x452821e6,
    0x38d01377,
    0xbe5466cf,
    0x34e90c6c,
    0xc0ac29b7,
    0xc97c50dd,
    0x3f84d5b5,
    0xb5470917
];
Blake256.padding = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from([
    0x80,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
]);
Blake256.prototype._length_carry = function(arr) {
    for(var j = 0; j < arr.length; ++j){
        if (arr[j] < 0x0100000000) break;
        arr[j] -= 0x0100000000;
        arr[j + 1] += 1;
    }
};
Blake256.prototype.update = function(data, encoding) {
    data = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(data, encoding);
    var block = this._block;
    var offset = 0;
    while(this._blockOffset + data.length - offset >= block.length){
        for(var i = this._blockOffset; i < block.length;)block[i++] = data[offset++];
        this._length[0] += block.length * 8;
        this._length_carry(this._length);
        this._compress();
        this._blockOffset = 0;
    }
    while(offset < data.length)block[this._blockOffset++] = data[offset++];
    return this;
};
var zo = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from([
    0x01
]);
var oo = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from([
    0x81
]);
function rot(x, n) {
    return (x << 32 - n | x >>> n) >>> 0;
}
function g(v, m, i, a, b, c, d, e) {
    var sigma = Blake256.sigma;
    var u256 = Blake256.u256;
    v[a] = v[a] + ((m[sigma[i][e]] ^ u256[sigma[i][e + 1]]) >>> 0) + v[b] >>> 0;
    v[d] = rot(v[d] ^ v[a], 16);
    v[c] = v[c] + v[d] >>> 0;
    v[b] = rot(v[b] ^ v[c], 12);
    v[a] = v[a] + ((m[sigma[i][e + 1]] ^ u256[sigma[i][e]]) >>> 0) + v[b] >>> 0;
    v[d] = rot(v[d] ^ v[a], 8);
    v[c] = v[c] + v[d] >>> 0;
    v[b] = rot(v[b] ^ v[c], 7);
}
function Blake256() {
    this._h = [
        0x6a09e667,
        0xbb67ae85,
        0x3c6ef372,
        0xa54ff53a,
        0x510e527f,
        0x9b05688c,
        0x1f83d9ab,
        0x5be0cd19
    ];
    this._s = [
        0,
        0,
        0,
        0
    ];
    this._block = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].allocUnsafe(64);
    this._blockOffset = 0;
    this._length = [
        0,
        0
    ];
    this._nullt = false;
    this._zo = zo;
    this._oo = oo;
}
Blake256.prototype._compress = function() {
    var u256 = Blake256.u256;
    var v = new Array(16);
    var m = new Array(16);
    var i;
    for(i = 0; i < 16; ++i)m[i] = this._block.readUInt32BE(i * 4);
    for(i = 0; i < 8; ++i)v[i] = this._h[i] >>> 0;
    for(i = 8; i < 12; ++i)v[i] = (this._s[i - 8] ^ u256[i - 8]) >>> 0;
    for(i = 12; i < 16; ++i)v[i] = u256[i - 8];
    if (!this._nullt) {
        v[12] = (v[12] ^ this._length[0]) >>> 0;
        v[13] = (v[13] ^ this._length[0]) >>> 0;
        v[14] = (v[14] ^ this._length[1]) >>> 0;
        v[15] = (v[15] ^ this._length[1]) >>> 0;
    }
    for(i = 0; i < 14; ++i){
        /* column step */ g(v, m, i, 0, 4, 8, 12, 0);
        g(v, m, i, 1, 5, 9, 13, 2);
        g(v, m, i, 2, 6, 10, 14, 4);
        g(v, m, i, 3, 7, 11, 15, 6);
        /* diagonal step */ g(v, m, i, 0, 5, 10, 15, 8);
        g(v, m, i, 1, 6, 11, 12, 10);
        g(v, m, i, 2, 7, 8, 13, 12);
        g(v, m, i, 3, 4, 9, 14, 14);
    }
    for(i = 0; i < 16; ++i)this._h[i % 8] = (this._h[i % 8] ^ v[i]) >>> 0;
    for(i = 0; i < 8; ++i)this._h[i] = (this._h[i] ^ this._s[i % 4]) >>> 0;
};
Blake256.prototype._padding = function() {
    var lo = this._length[0] + this._blockOffset * 8;
    var hi = this._length[1];
    if (lo >= 0x0100000000) {
        lo -= 0x0100000000;
        hi += 1;
    }
    var msglen = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].allocUnsafe(8);
    msglen.writeUInt32BE(hi, 0);
    msglen.writeUInt32BE(lo, 4);
    if (this._blockOffset === 55) {
        this._length[0] -= 8;
        this.update(this._oo);
    } else {
        if (this._blockOffset < 55) {
            if (this._blockOffset === 0) this._nullt = true;
            this._length[0] -= (55 - this._blockOffset) * 8;
            this.update(Blake256.padding.slice(0, 55 - this._blockOffset));
        } else {
            this._length[0] -= (64 - this._blockOffset) * 8;
            this.update(Blake256.padding.slice(0, 64 - this._blockOffset));
            this._length[0] -= 55 * 8;
            this.update(Blake256.padding.slice(1, 1 + 55));
            this._nullt = true;
        }
        this.update(this._zo);
        this._length[0] -= 8;
    }
    this._length[0] -= 64;
    this.update(msglen);
};
Blake256.prototype.digest = function(encoding) {
    this._padding();
    var buffer = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].allocUnsafe(32);
    for(var i = 0; i < 8; ++i)buffer.writeUInt32BE(this._h[i], i * 4);
    return buffer.toString(encoding);
};
module.exports = Blake256;
}}),
"[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/sha3.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
/**
 * [js-sha3]{@link https://github.com/emn178/js-sha3}
 *
 * @version 0.7.0
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2015-2017
 * @license MIT
 */ /*jslint bitwise: true */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/next@15.1.3_react-dom@19.0.0_react@19.0.0/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
var ERROR = 'input is invalid type';
var WINDOW = typeof window === 'object';
var root = WINDOW ? window : {};
if (root.JS_SHA3_NO_WINDOW) {
    WINDOW = false;
}
var WEB_WORKER = !WINDOW && typeof self === 'object';
var NODE_JS = !root.JS_SHA3_NO_NODE_JS && typeof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] === 'object' && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].versions && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].versions.node;
if (NODE_JS) {
    root = global;
} else if (WEB_WORKER) {
    root = self;
}
var ARRAY_BUFFER = !root.JS_SHA3_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';
var HEX_CHARS = '0123456789abcdef'.split('');
var SHAKE_PADDING = [
    31,
    7936,
    2031616,
    520093696
];
var CSHAKE_PADDING = [
    4,
    1024,
    262144,
    67108864
];
var KECCAK_PADDING = [
    1,
    256,
    65536,
    16777216
];
var PADDING = [
    6,
    1536,
    393216,
    100663296
];
var SHIFT = [
    0,
    8,
    16,
    24
];
var RC = [
    1,
    0,
    32898,
    0,
    32906,
    2147483648,
    2147516416,
    2147483648,
    32907,
    0,
    2147483649,
    0,
    2147516545,
    2147483648,
    32777,
    2147483648,
    138,
    0,
    136,
    0,
    2147516425,
    0,
    2147483658,
    0,
    2147516555,
    0,
    139,
    2147483648,
    32905,
    2147483648,
    32771,
    2147483648,
    32770,
    2147483648,
    128,
    2147483648,
    32778,
    0,
    2147483658,
    2147483648,
    2147516545,
    2147483648,
    32896,
    2147483648,
    2147483649,
    0,
    2147516424,
    2147483648
];
var BITS = [
    224,
    256,
    384,
    512
];
var SHAKE_BITS = [
    128,
    256
];
var OUTPUT_TYPES = [
    'hex',
    'buffer',
    'arrayBuffer',
    'array',
    'digest'
];
var CSHAKE_BYTEPAD = {
    '128': 168,
    '256': 136
};
if (root.JS_SHA3_NO_NODE_JS || !Array.isArray) {
    Array.isArray = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };
}
if (ARRAY_BUFFER && (root.JS_SHA3_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
    ArrayBuffer.isView = function(obj) {
        return typeof obj === 'object' && obj.buffer && obj.buffer.constructor === ArrayBuffer;
    };
}
var createOutputMethod = function(bits, padding, outputType) {
    return function(message) {
        return new Keccak(bits, padding, bits).update(message)[outputType]();
    };
};
var createShakeOutputMethod = function(bits, padding, outputType) {
    return function(message, outputBits) {
        return new Keccak(bits, padding, outputBits).update(message)[outputType]();
    };
};
var createCshakeOutputMethod = function(bits, padding, outputType) {
    return function(message, outputBits, n, s) {
        return methods['cshake' + bits].update(message, outputBits, n, s)[outputType]();
    };
};
var createKmacOutputMethod = function(bits, padding, outputType) {
    return function(key, message, outputBits, s) {
        return methods['kmac' + bits].update(key, message, outputBits, s)[outputType]();
    };
};
var createOutputMethods = function(method, createMethod, bits, padding) {
    for(var i = 0; i < OUTPUT_TYPES.length; ++i){
        var type = OUTPUT_TYPES[i];
        method[type] = createMethod(bits, padding, type);
    }
    return method;
};
var createMethod = function(bits, padding) {
    var method = createOutputMethod(bits, padding, 'hex');
    method.create = function() {
        return new Keccak(bits, padding, bits);
    };
    method.update = function(message) {
        return method.create().update(message);
    };
    return createOutputMethods(method, createOutputMethod, bits, padding);
};
var createShakeMethod = function(bits, padding) {
    var method = createShakeOutputMethod(bits, padding, 'hex');
    method.create = function(outputBits) {
        return new Keccak(bits, padding, outputBits);
    };
    method.update = function(message, outputBits) {
        return method.create(outputBits).update(message);
    };
    return createOutputMethods(method, createShakeOutputMethod, bits, padding);
};
var createCshakeMethod = function(bits, padding) {
    var w = CSHAKE_BYTEPAD[bits];
    var method = createCshakeOutputMethod(bits, padding, 'hex');
    method.create = function(outputBits, n, s) {
        if (!n && !s) {
            return methods['shake' + bits].create(outputBits);
        } else {
            return new Keccak(bits, padding, outputBits).bytepad([
                n,
                s
            ], w);
        }
    };
    method.update = function(message, outputBits, n, s) {
        return method.create(outputBits, n, s).update(message);
    };
    return createOutputMethods(method, createCshakeOutputMethod, bits, padding);
};
var createKmacMethod = function(bits, padding) {
    var w = CSHAKE_BYTEPAD[bits];
    var method = createKmacOutputMethod(bits, padding, 'hex');
    method.create = function(key, outputBits, s) {
        return new Kmac(bits, padding, outputBits).bytepad([
            'KMAC',
            s
        ], w).bytepad([
            key
        ], w);
    };
    method.update = function(key, message, outputBits, s) {
        return method.create(key, outputBits, s).update(message);
    };
    return createOutputMethods(method, createKmacOutputMethod, bits, padding);
};
var algorithms = [
    {
        name: 'keccak',
        padding: KECCAK_PADDING,
        bits: BITS,
        createMethod: createMethod
    },
    {
        name: 'sha3',
        padding: PADDING,
        bits: BITS,
        createMethod: createMethod
    },
    {
        name: 'shake',
        padding: SHAKE_PADDING,
        bits: SHAKE_BITS,
        createMethod: createShakeMethod
    },
    {
        name: 'cshake',
        padding: CSHAKE_PADDING,
        bits: SHAKE_BITS,
        createMethod: createCshakeMethod
    },
    {
        name: 'kmac',
        padding: CSHAKE_PADDING,
        bits: SHAKE_BITS,
        createMethod: createKmacMethod
    }
];
var methods = {}, methodNames = [];
for(var i = 0; i < algorithms.length; ++i){
    var algorithm = algorithms[i];
    var bits = algorithm.bits;
    for(var j = 0; j < bits.length; ++j){
        var methodName = algorithm.name + '_' + bits[j];
        methodNames.push(methodName);
        methods[methodName] = algorithm.createMethod(bits[j], algorithm.padding);
        if (algorithm.name !== 'sha3') {
            var newMethodName = algorithm.name + bits[j];
            methodNames.push(newMethodName);
            methods[newMethodName] = methods[methodName];
        }
    }
}
function Keccak(bits, padding, outputBits) {
    this.blocks = [];
    this.s = [];
    this.padding = padding;
    this.outputBits = outputBits;
    this.reset = true;
    this.finalized = false;
    this.block = 0;
    this.start = 0;
    this.blockCount = 1600 - (bits << 1) >> 5;
    this.byteCount = this.blockCount << 2;
    this.outputBlocks = outputBits >> 5;
    this.extraBytes = (outputBits & 31) >> 3;
    for(var i = 0; i < 50; ++i){
        this.s[i] = 0;
    }
}
Keccak.prototype.update = function(message) {
    if (this.finalized) {
        return;
    }
    var notString, type = typeof message;
    if (type !== 'string') {
        if (type === 'object') {
            if (message === null) {
                throw ERROR;
            } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
                message = new Uint8Array(message);
            } else if (!Array.isArray(message)) {
                if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
                    throw ERROR;
                }
            }
        } else {
            throw ERROR;
        }
        notString = true;
    }
    var blocks = this.blocks, byteCount = this.byteCount, length = message.length, blockCount = this.blockCount, index = 0, s = this.s, i, code;
    while(index < length){
        if (this.reset) {
            this.reset = false;
            blocks[0] = this.block;
            for(i = 1; i < blockCount + 1; ++i){
                blocks[i] = 0;
            }
        }
        if (notString) {
            for(i = this.start; index < length && i < byteCount; ++index){
                blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
            }
        } else {
            for(i = this.start; index < length && i < byteCount; ++index){
                code = message.charCodeAt(index);
                if (code < 0x80) {
                    blocks[i >> 2] |= code << SHIFT[i++ & 3];
                } else if (code < 0x800) {
                    blocks[i >> 2] |= (0xc0 | code >> 6) << SHIFT[i++ & 3];
                    blocks[i >> 2] |= (0x80 | code & 0x3f) << SHIFT[i++ & 3];
                } else if (code < 0xd800 || code >= 0xe000) {
                    blocks[i >> 2] |= (0xe0 | code >> 12) << SHIFT[i++ & 3];
                    blocks[i >> 2] |= (0x80 | code >> 6 & 0x3f) << SHIFT[i++ & 3];
                    blocks[i >> 2] |= (0x80 | code & 0x3f) << SHIFT[i++ & 3];
                } else {
                    code = 0x10000 + ((code & 0x3ff) << 10 | message.charCodeAt(++index) & 0x3ff);
                    blocks[i >> 2] |= (0xf0 | code >> 18) << SHIFT[i++ & 3];
                    blocks[i >> 2] |= (0x80 | code >> 12 & 0x3f) << SHIFT[i++ & 3];
                    blocks[i >> 2] |= (0x80 | code >> 6 & 0x3f) << SHIFT[i++ & 3];
                    blocks[i >> 2] |= (0x80 | code & 0x3f) << SHIFT[i++ & 3];
                }
            }
        }
        this.lastByteIndex = i;
        if (i >= byteCount) {
            this.start = i - byteCount;
            this.block = blocks[blockCount];
            for(i = 0; i < blockCount; ++i){
                s[i] ^= blocks[i];
            }
            f(s);
            this.reset = true;
        } else {
            this.start = i;
        }
    }
    return this;
};
Keccak.prototype.encode = function(x, right) {
    var o = x & 255, n = 1;
    var bytes = [
        o
    ];
    x = x >> 8;
    o = x & 255;
    while(o > 0){
        bytes.unshift(o);
        x = x >> 8;
        o = x & 255;
        ++n;
    }
    if (right) {
        bytes.push(n);
    } else {
        bytes.unshift(n);
    }
    this.update(bytes);
    return bytes.length;
};
Keccak.prototype.encodeString = function(str) {
    var notString, type = typeof str;
    if (type !== 'string') {
        if (type === 'object') {
            if (str === null) {
                throw ERROR;
            } else if (ARRAY_BUFFER && str.constructor === ArrayBuffer) {
                str = new Uint8Array(str);
            } else if (!Array.isArray(str)) {
                if (!ARRAY_BUFFER || !ArrayBuffer.isView(str)) {
                    throw ERROR;
                }
            }
        } else {
            throw ERROR;
        }
        notString = true;
    }
    var bytes = 0, length = str.length;
    if (notString) {
        bytes = length;
    } else {
        for(var i = 0; i < str.length; ++i){
            var code = str.charCodeAt(i);
            if (code < 0x80) {
                bytes += 1;
            } else if (code < 0x800) {
                bytes += 2;
            } else if (code < 0xd800 || code >= 0xe000) {
                bytes += 3;
            } else {
                code = 0x10000 + ((code & 0x3ff) << 10 | str.charCodeAt(++i) & 0x3ff);
                bytes += 4;
            }
        }
    }
    bytes += this.encode(bytes * 8);
    this.update(str);
    return bytes;
};
Keccak.prototype.bytepad = function(strs, w) {
    var bytes = this.encode(w);
    for(var i = 0; i < strs.length; ++i){
        bytes += this.encodeString(strs[i]);
    }
    var paddingBytes = w - bytes % w;
    var zeros = [];
    zeros.length = paddingBytes;
    this.update(zeros);
    return this;
};
Keccak.prototype.finalize = function() {
    if (this.finalized) {
        return;
    }
    this.finalized = true;
    var blocks = this.blocks, i = this.lastByteIndex, blockCount = this.blockCount, s = this.s;
    blocks[i >> 2] |= this.padding[i & 3];
    if (this.lastByteIndex === this.byteCount) {
        blocks[0] = blocks[blockCount];
        for(i = 1; i < blockCount + 1; ++i){
            blocks[i] = 0;
        }
    }
    blocks[blockCount - 1] |= 0x80000000;
    for(i = 0; i < blockCount; ++i){
        s[i] ^= blocks[i];
    }
    f(s);
};
Keccak.prototype.toString = Keccak.prototype.hex = function() {
    this.finalize();
    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks, extraBytes = this.extraBytes, i = 0, j = 0;
    var hex = '', block;
    while(j < outputBlocks){
        for(i = 0; i < blockCount && j < outputBlocks; ++i, ++j){
            block = s[i];
            hex += HEX_CHARS[block >> 4 & 0x0F] + HEX_CHARS[block & 0x0F] + HEX_CHARS[block >> 12 & 0x0F] + HEX_CHARS[block >> 8 & 0x0F] + HEX_CHARS[block >> 20 & 0x0F] + HEX_CHARS[block >> 16 & 0x0F] + HEX_CHARS[block >> 28 & 0x0F] + HEX_CHARS[block >> 24 & 0x0F];
        }
        if (j % blockCount === 0) {
            f(s);
            i = 0;
        }
    }
    if (extraBytes) {
        block = s[i];
        hex += HEX_CHARS[block >> 4 & 0x0F] + HEX_CHARS[block & 0x0F];
        if (extraBytes > 1) {
            hex += HEX_CHARS[block >> 12 & 0x0F] + HEX_CHARS[block >> 8 & 0x0F];
        }
        if (extraBytes > 2) {
            hex += HEX_CHARS[block >> 20 & 0x0F] + HEX_CHARS[block >> 16 & 0x0F];
        }
    }
    return hex;
};
Keccak.prototype.arrayBuffer = function() {
    this.finalize();
    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks, extraBytes = this.extraBytes, i = 0, j = 0;
    var bytes = this.outputBits >> 3;
    var buffer;
    if (extraBytes) {
        buffer = new ArrayBuffer(outputBlocks + 1 << 2);
    } else {
        buffer = new ArrayBuffer(bytes);
    }
    var array = new Uint32Array(buffer);
    while(j < outputBlocks){
        for(i = 0; i < blockCount && j < outputBlocks; ++i, ++j){
            array[j] = s[i];
        }
        if (j % blockCount === 0) {
            f(s);
        }
    }
    if (extraBytes) {
        array[i] = s[i];
        buffer = buffer.slice(0, bytes);
    }
    return buffer;
};
Keccak.prototype.buffer = Keccak.prototype.arrayBuffer;
Keccak.prototype.digest = Keccak.prototype.array = function() {
    this.finalize();
    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks, extraBytes = this.extraBytes, i = 0, j = 0;
    var array = [], offset, block;
    while(j < outputBlocks){
        for(i = 0; i < blockCount && j < outputBlocks; ++i, ++j){
            offset = j << 2;
            block = s[i];
            array[offset] = block & 0xFF;
            array[offset + 1] = block >> 8 & 0xFF;
            array[offset + 2] = block >> 16 & 0xFF;
            array[offset + 3] = block >> 24 & 0xFF;
        }
        if (j % blockCount === 0) {
            f(s);
        }
    }
    if (extraBytes) {
        offset = j << 2;
        block = s[i];
        array[offset] = block & 0xFF;
        if (extraBytes > 1) {
            array[offset + 1] = block >> 8 & 0xFF;
        }
        if (extraBytes > 2) {
            array[offset + 2] = block >> 16 & 0xFF;
        }
    }
    return array;
};
function Kmac(bits, padding, outputBits) {
    Keccak.call(this, bits, padding, outputBits);
}
Kmac.prototype = new Keccak();
Kmac.prototype.finalize = function() {
    this.encode(this.outputBits, true);
    return Keccak.prototype.finalize.call(this);
};
var f = function(s) {
    var h, l, n, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9, b0, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15, b16, b17, b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49;
    for(n = 0; n < 48; n += 2){
        c0 = s[0] ^ s[10] ^ s[20] ^ s[30] ^ s[40];
        c1 = s[1] ^ s[11] ^ s[21] ^ s[31] ^ s[41];
        c2 = s[2] ^ s[12] ^ s[22] ^ s[32] ^ s[42];
        c3 = s[3] ^ s[13] ^ s[23] ^ s[33] ^ s[43];
        c4 = s[4] ^ s[14] ^ s[24] ^ s[34] ^ s[44];
        c5 = s[5] ^ s[15] ^ s[25] ^ s[35] ^ s[45];
        c6 = s[6] ^ s[16] ^ s[26] ^ s[36] ^ s[46];
        c7 = s[7] ^ s[17] ^ s[27] ^ s[37] ^ s[47];
        c8 = s[8] ^ s[18] ^ s[28] ^ s[38] ^ s[48];
        c9 = s[9] ^ s[19] ^ s[29] ^ s[39] ^ s[49];
        h = c8 ^ (c2 << 1 | c3 >>> 31);
        l = c9 ^ (c3 << 1 | c2 >>> 31);
        s[0] ^= h;
        s[1] ^= l;
        s[10] ^= h;
        s[11] ^= l;
        s[20] ^= h;
        s[21] ^= l;
        s[30] ^= h;
        s[31] ^= l;
        s[40] ^= h;
        s[41] ^= l;
        h = c0 ^ (c4 << 1 | c5 >>> 31);
        l = c1 ^ (c5 << 1 | c4 >>> 31);
        s[2] ^= h;
        s[3] ^= l;
        s[12] ^= h;
        s[13] ^= l;
        s[22] ^= h;
        s[23] ^= l;
        s[32] ^= h;
        s[33] ^= l;
        s[42] ^= h;
        s[43] ^= l;
        h = c2 ^ (c6 << 1 | c7 >>> 31);
        l = c3 ^ (c7 << 1 | c6 >>> 31);
        s[4] ^= h;
        s[5] ^= l;
        s[14] ^= h;
        s[15] ^= l;
        s[24] ^= h;
        s[25] ^= l;
        s[34] ^= h;
        s[35] ^= l;
        s[44] ^= h;
        s[45] ^= l;
        h = c4 ^ (c8 << 1 | c9 >>> 31);
        l = c5 ^ (c9 << 1 | c8 >>> 31);
        s[6] ^= h;
        s[7] ^= l;
        s[16] ^= h;
        s[17] ^= l;
        s[26] ^= h;
        s[27] ^= l;
        s[36] ^= h;
        s[37] ^= l;
        s[46] ^= h;
        s[47] ^= l;
        h = c6 ^ (c0 << 1 | c1 >>> 31);
        l = c7 ^ (c1 << 1 | c0 >>> 31);
        s[8] ^= h;
        s[9] ^= l;
        s[18] ^= h;
        s[19] ^= l;
        s[28] ^= h;
        s[29] ^= l;
        s[38] ^= h;
        s[39] ^= l;
        s[48] ^= h;
        s[49] ^= l;
        b0 = s[0];
        b1 = s[1];
        b32 = s[11] << 4 | s[10] >>> 28;
        b33 = s[10] << 4 | s[11] >>> 28;
        b14 = s[20] << 3 | s[21] >>> 29;
        b15 = s[21] << 3 | s[20] >>> 29;
        b46 = s[31] << 9 | s[30] >>> 23;
        b47 = s[30] << 9 | s[31] >>> 23;
        b28 = s[40] << 18 | s[41] >>> 14;
        b29 = s[41] << 18 | s[40] >>> 14;
        b20 = s[2] << 1 | s[3] >>> 31;
        b21 = s[3] << 1 | s[2] >>> 31;
        b2 = s[13] << 12 | s[12] >>> 20;
        b3 = s[12] << 12 | s[13] >>> 20;
        b34 = s[22] << 10 | s[23] >>> 22;
        b35 = s[23] << 10 | s[22] >>> 22;
        b16 = s[33] << 13 | s[32] >>> 19;
        b17 = s[32] << 13 | s[33] >>> 19;
        b48 = s[42] << 2 | s[43] >>> 30;
        b49 = s[43] << 2 | s[42] >>> 30;
        b40 = s[5] << 30 | s[4] >>> 2;
        b41 = s[4] << 30 | s[5] >>> 2;
        b22 = s[14] << 6 | s[15] >>> 26;
        b23 = s[15] << 6 | s[14] >>> 26;
        b4 = s[25] << 11 | s[24] >>> 21;
        b5 = s[24] << 11 | s[25] >>> 21;
        b36 = s[34] << 15 | s[35] >>> 17;
        b37 = s[35] << 15 | s[34] >>> 17;
        b18 = s[45] << 29 | s[44] >>> 3;
        b19 = s[44] << 29 | s[45] >>> 3;
        b10 = s[6] << 28 | s[7] >>> 4;
        b11 = s[7] << 28 | s[6] >>> 4;
        b42 = s[17] << 23 | s[16] >>> 9;
        b43 = s[16] << 23 | s[17] >>> 9;
        b24 = s[26] << 25 | s[27] >>> 7;
        b25 = s[27] << 25 | s[26] >>> 7;
        b6 = s[36] << 21 | s[37] >>> 11;
        b7 = s[37] << 21 | s[36] >>> 11;
        b38 = s[47] << 24 | s[46] >>> 8;
        b39 = s[46] << 24 | s[47] >>> 8;
        b30 = s[8] << 27 | s[9] >>> 5;
        b31 = s[9] << 27 | s[8] >>> 5;
        b12 = s[18] << 20 | s[19] >>> 12;
        b13 = s[19] << 20 | s[18] >>> 12;
        b44 = s[29] << 7 | s[28] >>> 25;
        b45 = s[28] << 7 | s[29] >>> 25;
        b26 = s[38] << 8 | s[39] >>> 24;
        b27 = s[39] << 8 | s[38] >>> 24;
        b8 = s[48] << 14 | s[49] >>> 18;
        b9 = s[49] << 14 | s[48] >>> 18;
        s[0] = b0 ^ ~b2 & b4;
        s[1] = b1 ^ ~b3 & b5;
        s[10] = b10 ^ ~b12 & b14;
        s[11] = b11 ^ ~b13 & b15;
        s[20] = b20 ^ ~b22 & b24;
        s[21] = b21 ^ ~b23 & b25;
        s[30] = b30 ^ ~b32 & b34;
        s[31] = b31 ^ ~b33 & b35;
        s[40] = b40 ^ ~b42 & b44;
        s[41] = b41 ^ ~b43 & b45;
        s[2] = b2 ^ ~b4 & b6;
        s[3] = b3 ^ ~b5 & b7;
        s[12] = b12 ^ ~b14 & b16;
        s[13] = b13 ^ ~b15 & b17;
        s[22] = b22 ^ ~b24 & b26;
        s[23] = b23 ^ ~b25 & b27;
        s[32] = b32 ^ ~b34 & b36;
        s[33] = b33 ^ ~b35 & b37;
        s[42] = b42 ^ ~b44 & b46;
        s[43] = b43 ^ ~b45 & b47;
        s[4] = b4 ^ ~b6 & b8;
        s[5] = b5 ^ ~b7 & b9;
        s[14] = b14 ^ ~b16 & b18;
        s[15] = b15 ^ ~b17 & b19;
        s[24] = b24 ^ ~b26 & b28;
        s[25] = b25 ^ ~b27 & b29;
        s[34] = b34 ^ ~b36 & b38;
        s[35] = b35 ^ ~b37 & b39;
        s[44] = b44 ^ ~b46 & b48;
        s[45] = b45 ^ ~b47 & b49;
        s[6] = b6 ^ ~b8 & b0;
        s[7] = b7 ^ ~b9 & b1;
        s[16] = b16 ^ ~b18 & b10;
        s[17] = b17 ^ ~b19 & b11;
        s[26] = b26 ^ ~b28 & b20;
        s[27] = b27 ^ ~b29 & b21;
        s[36] = b36 ^ ~b38 & b30;
        s[37] = b37 ^ ~b39 & b31;
        s[46] = b46 ^ ~b48 & b40;
        s[47] = b47 ^ ~b49 & b41;
        s[8] = b8 ^ ~b0 & b2;
        s[9] = b9 ^ ~b1 & b3;
        s[18] = b18 ^ ~b10 & b12;
        s[19] = b19 ^ ~b11 & b13;
        s[28] = b28 ^ ~b20 & b22;
        s[29] = b29 ^ ~b21 & b23;
        s[38] = b38 ^ ~b30 & b32;
        s[39] = b39 ^ ~b31 & b33;
        s[48] = b48 ^ ~b40 & b42;
        s[49] = b49 ^ ~b41 & b43;
        s[0] ^= RC[n];
        s[1] ^= RC[n + 1];
    }
};
module.exports = methods;
}}),
"[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/blake2b.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
'use strict';
/**
 * Credits to https://github.com/emilbayes/blake2b
 *
 * Copyright (c) 2017, Emil Bay github@tixz.dk
 *
 * Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */ // 64-bit unsigned addition
// Sets v[a,a+1] += v[b,b+1]
// v should be a Uint32Array
function ADD64AA(v, a, b) {
    var o0 = v[a] + v[b];
    var o1 = v[a + 1] + v[b + 1];
    if (o0 >= 0x100000000) {
        o1++;
    }
    v[a] = o0;
    v[a + 1] = o1;
}
// 64-bit unsigned addition
// Sets v[a,a+1] += b
// b0 is the low 32 bits of b, b1 represents the high 32 bits
function ADD64AC(v, a, b0, b1) {
    var o0 = v[a] + b0;
    if (b0 < 0) {
        o0 += 0x100000000;
    }
    var o1 = v[a + 1] + b1;
    if (o0 >= 0x100000000) {
        o1++;
    }
    v[a] = o0;
    v[a + 1] = o1;
}
// Little-endian byte access
function B2B_GET32(arr, i) {
    return arr[i] ^ arr[i + 1] << 8 ^ arr[i + 2] << 16 ^ arr[i + 3] << 24;
}
// G Mixing function
// The ROTRs are inlined for speed
function B2B_G(a, b, c, d, ix, iy) {
    var x0 = m[ix];
    var x1 = m[ix + 1];
    var y0 = m[iy];
    var y1 = m[iy + 1];
    ADD64AA(v, a, b) // v[a,a+1] += v[b,b+1] ... in JS we must store a uint64 as two uint32s
    ;
    ADD64AC(v, a, x0, x1) // v[a, a+1] += x ... x0 is the low 32 bits of x, x1 is the high 32 bits
    ;
    // v[d,d+1] = (v[d,d+1] xor v[a,a+1]) rotated to the right by 32 bits
    var xor0 = v[d] ^ v[a];
    var xor1 = v[d + 1] ^ v[a + 1];
    v[d] = xor1;
    v[d + 1] = xor0;
    ADD64AA(v, c, d);
    // v[b,b+1] = (v[b,b+1] xor v[c,c+1]) rotated right by 24 bits
    xor0 = v[b] ^ v[c];
    xor1 = v[b + 1] ^ v[c + 1];
    v[b] = xor0 >>> 24 ^ xor1 << 8;
    v[b + 1] = xor1 >>> 24 ^ xor0 << 8;
    ADD64AA(v, a, b);
    ADD64AC(v, a, y0, y1);
    // v[d,d+1] = (v[d,d+1] xor v[a,a+1]) rotated right by 16 bits
    xor0 = v[d] ^ v[a];
    xor1 = v[d + 1] ^ v[a + 1];
    v[d] = xor0 >>> 16 ^ xor1 << 16;
    v[d + 1] = xor1 >>> 16 ^ xor0 << 16;
    ADD64AA(v, c, d);
    // v[b,b+1] = (v[b,b+1] xor v[c,c+1]) rotated right by 63 bits
    xor0 = v[b] ^ v[c];
    xor1 = v[b + 1] ^ v[c + 1];
    v[b] = xor1 >>> 31 ^ xor0 << 1;
    v[b + 1] = xor0 >>> 31 ^ xor1 << 1;
}
// Initialization Vector
var BLAKE2B_IV32 = new Uint32Array([
    0xF3BCC908,
    0x6A09E667,
    0x84CAA73B,
    0xBB67AE85,
    0xFE94F82B,
    0x3C6EF372,
    0x5F1D36F1,
    0xA54FF53A,
    0xADE682D1,
    0x510E527F,
    0x2B3E6C1F,
    0x9B05688C,
    0xFB41BD6B,
    0x1F83D9AB,
    0x137E2179,
    0x5BE0CD19
]);
var SIGMA8 = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    14,
    10,
    4,
    8,
    9,
    15,
    13,
    6,
    1,
    12,
    0,
    2,
    11,
    7,
    5,
    3,
    11,
    8,
    12,
    0,
    5,
    2,
    15,
    13,
    10,
    14,
    3,
    6,
    7,
    1,
    9,
    4,
    7,
    9,
    3,
    1,
    13,
    12,
    11,
    14,
    2,
    6,
    5,
    10,
    4,
    0,
    15,
    8,
    9,
    0,
    5,
    7,
    2,
    4,
    10,
    15,
    14,
    1,
    11,
    12,
    6,
    8,
    3,
    13,
    2,
    12,
    6,
    10,
    0,
    11,
    8,
    3,
    4,
    13,
    7,
    5,
    15,
    14,
    1,
    9,
    12,
    5,
    1,
    15,
    14,
    13,
    4,
    10,
    0,
    7,
    6,
    3,
    9,
    2,
    8,
    11,
    13,
    11,
    7,
    14,
    12,
    1,
    3,
    9,
    5,
    0,
    15,
    4,
    8,
    6,
    2,
    10,
    6,
    15,
    14,
    9,
    11,
    3,
    0,
    8,
    12,
    2,
    13,
    7,
    1,
    4,
    10,
    5,
    10,
    2,
    8,
    4,
    7,
    6,
    1,
    5,
    15,
    11,
    9,
    14,
    3,
    12,
    13,
    0,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    14,
    10,
    4,
    8,
    9,
    15,
    13,
    6,
    1,
    12,
    0,
    2,
    11,
    7,
    5,
    3
];
// These are offsets into a uint64 buffer.
// Multiply them all by 2 to make them offsets into a uint32 buffer,
// because this is Javascript and we don't have uint64s
var SIGMA82 = new Uint8Array(SIGMA8.map(function(x) {
    return x * 2;
}));
// Compression function. 'last' flag indicates last block.
// Note we're representing 16 uint64s as 32 uint32s
var v = new Uint32Array(32);
var m = new Uint32Array(32);
function blake2bCompress(ctx, last) {
    var i = 0;
    // init work variables
    for(i = 0; i < 16; i++){
        v[i] = ctx.h[i];
        v[i + 16] = BLAKE2B_IV32[i];
    }
    // low 64 bits of offset
    v[24] = v[24] ^ ctx.t;
    v[25] = v[25] ^ ctx.t / 0x100000000;
    // high 64 bits not supported, offset may not be higher than 2**53-1
    // last block flag set ?
    if (last) {
        v[28] = ~v[28];
        v[29] = ~v[29];
    }
    // get little-endian words
    for(i = 0; i < 32; i++){
        m[i] = B2B_GET32(ctx.b, 4 * i);
    }
    // twelve rounds of mixing
    for(i = 0; i < 12; i++){
        B2B_G(0, 8, 16, 24, SIGMA82[i * 16 + 0], SIGMA82[i * 16 + 1]);
        B2B_G(2, 10, 18, 26, SIGMA82[i * 16 + 2], SIGMA82[i * 16 + 3]);
        B2B_G(4, 12, 20, 28, SIGMA82[i * 16 + 4], SIGMA82[i * 16 + 5]);
        B2B_G(6, 14, 22, 30, SIGMA82[i * 16 + 6], SIGMA82[i * 16 + 7]);
        B2B_G(0, 10, 20, 30, SIGMA82[i * 16 + 8], SIGMA82[i * 16 + 9]);
        B2B_G(2, 12, 22, 24, SIGMA82[i * 16 + 10], SIGMA82[i * 16 + 11]);
        B2B_G(4, 14, 16, 26, SIGMA82[i * 16 + 12], SIGMA82[i * 16 + 13]);
        B2B_G(6, 8, 18, 28, SIGMA82[i * 16 + 14], SIGMA82[i * 16 + 15]);
    }
    for(i = 0; i < 16; i++){
        ctx.h[i] = ctx.h[i] ^ v[i] ^ v[i + 16];
    }
}
// reusable parameter_block
var parameter_block = new Uint8Array([
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0 // 60: personal
]);
// Creates a BLAKE2b hashing context
// Requires an output length between 1 and 64 bytes
// Takes an optional Uint8Array key
function Blake2b(outlen, key, salt, personal) {
    // zero out parameter_block before usage
    parameter_block.fill(0);
    // state, 'param block'
    this.b = new Uint8Array(128);
    this.h = new Uint32Array(16);
    this.t = 0 // input count
    ;
    this.c = 0 // pointer within buffer
    ;
    this.outlen = outlen // output length in bytes
    ;
    parameter_block[0] = outlen;
    if (key) parameter_block[1] = key.length;
    parameter_block[2] = 1 // fanout
    ;
    parameter_block[3] = 1 // depth
    ;
    if (salt) parameter_block.set(salt, 32);
    if (personal) parameter_block.set(personal, 48);
    // initialize hash state
    for(var i = 0; i < 16; i++){
        this.h[i] = BLAKE2B_IV32[i] ^ B2B_GET32(parameter_block, i * 4);
    }
    // key the hash, if applicable
    if (key) {
        blake2bUpdate(this, key);
        // at the end
        this.c = 128;
    }
}
Blake2b.prototype.update = function(input) {
    blake2bUpdate(this, input);
    return this;
};
Blake2b.prototype.digest = function(out) {
    var buf = !out || out === 'binary' || out === 'hex' ? new Uint8Array(this.outlen) : out;
    blake2bFinal(this, buf);
    if (out === 'hex') return hexSlice(buf);
    return buf;
};
Blake2b.prototype.final = Blake2b.prototype.digest;
// Updates a BLAKE2b streaming hash
// Requires hash context and Uint8Array (byte array)
function blake2bUpdate(ctx, input) {
    for(var i = 0; i < input.length; i++){
        if (ctx.c === 128) {
            ctx.t += ctx.c // add counters
            ;
            blake2bCompress(ctx, false) // compress (not last)
            ;
            ctx.c = 0 // counter to zero
            ;
        }
        ctx.b[ctx.c++] = input[i];
    }
}
// Completes a BLAKE2b streaming hash
// Returns a Uint8Array containing the message digest
function blake2bFinal(ctx, out) {
    ctx.t += ctx.c // mark last block offset
    ;
    while(ctx.c < 128){
        ctx.b[ctx.c++] = 0;
    }
    blake2bCompress(ctx, true) // final block flag = 1
    ;
    for(var i = 0; i < ctx.outlen; i++){
        out[i] = ctx.h[i >> 2] >> 8 * (i & 3);
    }
    return out;
}
function hexSlice(buf) {
    var str = '';
    for(var i = 0; i < buf.length; i++)str += toHex(buf[i]);
    return str;
}
function toHex(n) {
    if (n < 16) return '0' + n.toString(16);
    return n.toString(16);
}
module.exports = Blake2b;
}}),
"[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/base58.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
// Base58 encoding/decoding
// Originally written by Mike Hearn for BitcoinJ
// Copyright (c) 2011 Google Inc
// Ported to JavaScript by Stefan Thomas
// Merged Buffer refactorings from base58-native by Stephen Pair
// Copyright (c) 2013 BitPay Inc
var ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
var ALPHABET_MAP = {};
for(var i = 0; i < ALPHABET.length; ++i){
    ALPHABET_MAP[ALPHABET.charAt(i)] = i;
}
var BASE = ALPHABET.length;
module.exports = {
    decode: function(string) {
        if (string.length === 0) return [];
        var i, j, bytes = [
            0
        ];
        for(i = 0; i < string.length; ++i){
            var c = string[i];
            if (!(c in ALPHABET_MAP)) throw new Error('Non-base58 character');
            for(j = 0; j < bytes.length; ++j)bytes[j] *= BASE;
            bytes[0] += ALPHABET_MAP[c];
            var carry = 0;
            for(j = 0; j < bytes.length; ++j){
                bytes[j] += carry;
                carry = bytes[j] >> 8;
                bytes[j] &= 0xff;
            }
            while(carry){
                bytes.push(carry & 0xff);
                carry >>= 8;
            }
        }
        // deal with leading zeros
        for(i = 0; string[i] === '1' && i < string.length - 1; ++i){
            bytes.push(0);
        }
        return bytes.reverse();
    }
};
}}),
"[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/base32.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
/**
* Encode a string to base32
*/ var b32encode = function(s) {
    var parts = [];
    var quanta = Math.floor(s.length / 5);
    var leftover = s.length % 5;
    if (leftover != 0) {
        for(var i = 0; i < 5 - leftover; i++){
            s += '\x00';
        }
        quanta += 1;
    }
    for(var i = 0; i < quanta; i++){
        parts.push(alphabet.charAt(s.charCodeAt(i * 5) >> 3));
        parts.push(alphabet.charAt((s.charCodeAt(i * 5) & 0x07) << 2 | s.charCodeAt(i * 5 + 1) >> 6));
        parts.push(alphabet.charAt((s.charCodeAt(i * 5 + 1) & 0x3F) >> 1));
        parts.push(alphabet.charAt((s.charCodeAt(i * 5 + 1) & 0x01) << 4 | s.charCodeAt(i * 5 + 2) >> 4));
        parts.push(alphabet.charAt((s.charCodeAt(i * 5 + 2) & 0x0F) << 1 | s.charCodeAt(i * 5 + 3) >> 7));
        parts.push(alphabet.charAt((s.charCodeAt(i * 5 + 3) & 0x7F) >> 2));
        parts.push(alphabet.charAt((s.charCodeAt(i * 5 + 3) & 0x03) << 3 | s.charCodeAt(i * 5 + 4) >> 5));
        parts.push(alphabet.charAt(s.charCodeAt(i * 5 + 4) & 0x1F));
    }
    var replace = 0;
    if (leftover == 1) replace = 6;
    else if (leftover == 2) replace = 4;
    else if (leftover == 3) replace = 3;
    else if (leftover == 4) replace = 1;
    for(var i = 0; i < replace; i++)parts.pop();
    for(var i = 0; i < replace; i++)parts.push("=");
    return parts.join("");
};
/**
* Decode a base32 string.
* This is made specifically for our use, deals only with proper strings
*/ var b32decode = function(s) {
    var r = new ArrayBuffer(s.length * 5 / 8);
    var b = new Uint8Array(r);
    for(var j = 0; j < s.length / 8; j++){
        var v = [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        ];
        for(var i = 0; i < 8; ++i){
            v[i] = alphabet.indexOf(s[j * 8 + i]);
        }
        var i = 0;
        b[j * 5 + 0] = v[i + 0] << 3 | v[i + 1] >> 2;
        b[j * 5 + 1] = (v[i + 1] & 0x3) << 6 | v[i + 2] << 1 | v[i + 3] >> 4;
        b[j * 5 + 2] = (v[i + 3] & 0xf) << 4 | v[i + 4] >> 1;
        b[j * 5 + 3] = (v[i + 4] & 0x1) << 7 | v[i + 5] << 2 | v[i + 6] >> 3;
        b[j * 5 + 4] = (v[i + 6] & 0x7) << 5 | v[i + 7];
    }
    return b;
};
module.exports = {
    b32decode: b32decode,
    b32encode: b32encode
};
}}),
"[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/utils.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/next@15.1.3_react-dom@19.0.0_react@19.0.0/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)");
var jsSHA = __turbopack_require__("[project]/node_modules/.pnpm/jssha@2.4.2/node_modules/jssha/src/sha.js [app-client] (ecmascript)");
var sha512256 = __turbopack_require__("[project]/node_modules/.pnpm/js-sha512@0.8.0/node_modules/js-sha512/src/sha512.js [app-client] (ecmascript)").sha512_256;
var Blake256 = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/blake256.js [app-client] (ecmascript)");
var keccak256 = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/sha3.js [app-client] (ecmascript)")['keccak256'];
var Blake2B = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/blake2b.js [app-client] (ecmascript)");
var base58 = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/base58.js [app-client] (ecmascript)");
var base32 = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/base32.js [app-client] (ecmascript)");
var BigNum = __turbopack_require__("[project]/node_modules/.pnpm/browserify-bignum@1.3.0-2/node_modules/browserify-bignum/bignumber.js [app-client] (ecmascript)");
function numberToHex(number, length) {
    var hex = number.toString(16);
    if (hex.length % 2 === 1) {
        hex = '0' + hex;
    }
    return hex.padStart(length, '0');
}
function isHexChar(c) {
    if (c >= 'A' && c <= 'F' || c >= 'a' && c <= 'f' || c >= '0' && c <= '9') {
        return 1;
    }
    return 0;
}
/* Convert a hex char to value */ function hexChar2byte(c) {
    var d = 0;
    if (c >= 'A' && c <= 'F') {
        d = c.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
    } else if (c >= 'a' && c <= 'f') {
        d = c.charCodeAt(0) - 'a'.charCodeAt(0) + 10;
    } else if (c >= '0' && c <= '9') {
        d = c.charCodeAt(0) - '0'.charCodeAt(0);
    }
    return d;
}
/* Convert a byte to string */ function byte2hexStr(byte) {
    var hexByteMap = "0123456789ABCDEF";
    var str = "";
    str += hexByteMap.charAt(byte >> 4);
    str += hexByteMap.charAt(byte & 0x0f);
    return str;
}
function byteArray2hexStr(byteArray) {
    var str = "";
    for(var i = 0; i < byteArray.length - 1; i++){
        str += byte2hexStr(byteArray[i]);
    }
    str += byte2hexStr(byteArray[i]);
    return str;
}
function hexStr2byteArray(str) {
    var byteArray = Array();
    var d = 0;
    var i = 0;
    var j = 0;
    var k = 0;
    for(i = 0; i < str.length; i++){
        var c = str.charAt(i);
        if (isHexChar(c)) {
            d <<= 4;
            d += hexChar2byte(c);
            j++;
            if (0 === j % 2) {
                byteArray[k++] = d;
                d = 0;
            }
        }
    }
    return byteArray;
}
module.exports = {
    numberToHex: numberToHex,
    toHex: function(arrayOfBytes) {
        var hex = '';
        for(var i = 0; i < arrayOfBytes.length; i++){
            hex += numberToHex(arrayOfBytes[i]);
        }
        return hex;
    },
    sha256: function(payload, format = 'HEX') {
        var sha = new jsSHA('SHA-256', format);
        sha.update(payload);
        return sha.getHash(format);
    },
    sha256x2: function(buffer, format = 'HEX') {
        return this.sha256(this.sha256(buffer, format), format);
    },
    sha256Checksum: function(payload) {
        return this.sha256(this.sha256(payload)).substr(0, 8);
    },
    sha512_256: function(payload, format = 'HEX') {
        const hash = sha512256.create();
        hash.update(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(payload, format));
        return hash.hex().toUpperCase();
    },
    blake256: function(hexString) {
        return new Blake256().update(hexString, 'hex').digest('hex');
    },
    blake256Checksum: function(payload) {
        return this.blake256(this.blake256(payload)).substr(0, 8);
    },
    blake2b: function(hexString, outlen) {
        return new Blake2B(outlen).update(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(hexString, 'hex')).digest('hex');
    },
    keccak256: function(hexString) {
        return keccak256(hexString);
    },
    keccak256Checksum: function(payload) {
        return keccak256(payload).toString().substr(0, 8);
    },
    blake2b256: function(hexString) {
        return new Blake2B(32).update(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(hexString, 'hex'), 32).digest('hex');
    },
    base58: base58.decode,
    byteArray2hexStr: byteArray2hexStr,
    hexStr2byteArray: hexStr2byteArray,
    bigNumberToBuffer: function(bignumber, size) {
        return new BigNum(bignumber).toBuffer({
            size,
            endian: 'big'
        });
    },
    base32: base32
};
}}),
"[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/ripple_validator.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
var cryptoUtils = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/utils.js [app-client] (ecmascript)");
var baseX = __turbopack_require__("[project]/node_modules/.pnpm/base-x@3.0.10/node_modules/base-x/src/index.js [app-client] (ecmascript)");
var ALLOWED_CHARS = 'rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz';
var codec = baseX(ALLOWED_CHARS);
var regexp = new RegExp('^r[' + ALLOWED_CHARS + ']{27,35}$');
module.exports = {
    /**
     * ripple address validation
     */ isValidAddress: function(address) {
        if (regexp.test(address)) {
            return this.verifyChecksum(address);
        }
        return false;
    },
    verifyChecksum: function(address) {
        var bytes = codec.decode(address);
        var computedChecksum = cryptoUtils.sha256Checksum(cryptoUtils.toHex(bytes.slice(0, -4)));
        var checksum = cryptoUtils.toHex(bytes.slice(-4));
        return computedChecksum === checksum;
    }
};
}}),
"[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/ethereum_validator.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
var cryptoUtils = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/utils.js [app-client] (ecmascript)");
module.exports = {
    isValidAddress: function(address) {
        if (!/^0x[0-9a-fA-F]{40}$/.test(address)) {
            // Check if it has the basic requirements of an address
            return false;
        }
        if (/^0x[0-9a-f]{40}$/.test(address) || /^0x?[0-9A-F]{40}$/.test(address)) {
            // If it's all small caps or all all caps, return true
            return true;
        }
        // Otherwise check each case
        return this.verifyChecksum(address);
    },
    verifyChecksum: function(address) {
        // Check each case
        address = address.replace('0x', '');
        var addressHash = cryptoUtils.keccak256(address.toLowerCase());
        for(var i = 0; i < 40; i++){
            // The nth letter should be uppercase if the nth digit of casemap is 1
            if (parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i] || parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i]) {
                return false;
            }
        }
        return true;
    }
};
}}),
"[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/bech32.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
// Copyright (c) 2017, 2021 Pieter Wuille
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
var CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
var GENERATOR = [
    0x3b6a57b2,
    0x26508e6d,
    0x1ea119fa,
    0x3d4233dd,
    0x2a1462b3
];
const encodings = {
    BECH32: "bech32",
    BECH32M: "bech32m"
};
module.exports = {
    decode: decode,
    encode: encode,
    encodings: encodings,
    verifyChecksum: verifyChecksum
};
function getEncodingConst(enc) {
    if (enc == encodings.BECH32) {
        return 1;
    } else if (enc == encodings.BECH32M) {
        return 0x2bc830a3;
    } else {
        return null;
    }
}
function polymod(values) {
    var chk = 1;
    for(var p = 0; p < values.length; ++p){
        var top = chk >> 25;
        chk = (chk & 0x1ffffff) << 5 ^ values[p];
        for(var i = 0; i < 5; ++i){
            if (top >> i & 1) {
                chk ^= GENERATOR[i];
            }
        }
    }
    return chk;
}
function hrpExpand(hrp) {
    var ret = [];
    var p;
    for(p = 0; p < hrp.length; ++p){
        ret.push(hrp.charCodeAt(p) >> 5);
    }
    ret.push(0);
    for(p = 0; p < hrp.length; ++p){
        ret.push(hrp.charCodeAt(p) & 31);
    }
    return ret;
}
function verifyChecksum(hrp, data, enc) {
    return polymod(hrpExpand(hrp).concat(data)) === getEncodingConst(enc);
}
function createChecksum(hrp, data, enc) {
    var values = hrpExpand(hrp).concat(data).concat([
        0,
        0,
        0,
        0,
        0,
        0
    ]);
    var mod = polymod(values) ^ getEncodingConst(enc);
    var ret = [];
    for(var p = 0; p < 6; ++p){
        ret.push(mod >> 5 * (5 - p) & 31);
    }
    return ret;
}
function encode(hrp, data, enc) {
    var combined = data.concat(createChecksum(hrp, data, enc));
    var ret = hrp + '1';
    for(var p = 0; p < combined.length; ++p){
        ret += CHARSET.charAt(combined[p]);
    }
    return ret;
}
function decode(bechString, enc) {
    var p;
    var has_lower = false;
    var has_upper = false;
    for(p = 0; p < bechString.length; ++p){
        if (bechString.charCodeAt(p) < 33 || bechString.charCodeAt(p) > 126) {
            return null;
        }
        if (bechString.charCodeAt(p) >= 97 && bechString.charCodeAt(p) <= 122) {
            has_lower = true;
        }
        if (bechString.charCodeAt(p) >= 65 && bechString.charCodeAt(p) <= 90) {
            has_upper = true;
        }
    }
    if (has_lower && has_upper) {
        return null;
    }
    bechString = bechString.toLowerCase();
    var pos = bechString.lastIndexOf('1');
    if (pos < 1 || pos + 7 > bechString.length || bechString.length > 110) {
        return null;
    }
    var hrp = bechString.substring(0, pos);
    var data = [];
    for(p = pos + 1; p < bechString.length; ++p){
        var d = CHARSET.indexOf(bechString.charAt(p));
        if (d === -1) {
            return null;
        }
        data.push(d);
    }
    if (!verifyChecksum(hrp, data, enc)) {
        return null;
    }
    return {
        hrp: hrp,
        data: data.slice(0, data.length - 6)
    };
}
}}),
"[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/segwit_addr.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
// Copyright (c) 2017, 2021 Pieter Wuille
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
var bech32 = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/bech32.js [app-client] (ecmascript)");
function convertbits(data, frombits, tobits, pad) {
    var acc = 0;
    var bits = 0;
    var ret = [];
    var maxv = (1 << tobits) - 1;
    for(var p = 0; p < data.length; ++p){
        var value = data[p];
        if (value < 0 || value >> frombits !== 0) {
            return null;
        }
        acc = acc << frombits | value;
        bits += frombits;
        while(bits >= tobits){
            bits -= tobits;
            ret.push(acc >> bits & maxv);
        }
    }
    if (pad) {
        if (bits > 0) {
            ret.push(acc << tobits - bits & maxv);
        }
    } else if (bits >= frombits || acc << tobits - bits & maxv) {
        return null;
    }
    return ret;
}
function decode(hrp, addr) {
    var bech32m = false;
    var dec = bech32.decode(addr, bech32.encodings.BECH32);
    if (dec === null) {
        dec = bech32.decode(addr, bech32.encodings.BECH32M);
        bech32m = true;
    }
    if (dec === null || dec.hrp !== hrp || dec.data.length < 1 || dec.data[0] > 16) {
        return null;
    }
    var res = convertbits(dec.data.slice(1), 5, 8, false);
    if (res === null || res.length < 2 || res.length > 40) {
        return null;
    }
    if (dec.data[0] === 0 && res.length !== 20 && res.length !== 32) {
        return null;
    }
    if (dec.data[0] === 0 && bech32m) {
        return null;
    }
    if (dec.data[0] !== 0 && !bech32m) {
        return null;
    }
    return {
        version: dec.data[0],
        program: res
    };
}
function encode(hrp, version, program) {
    var enc = bech32.encodings.BECH32;
    if (version > 0) {
        enc = bech32.encodings.BECH32M;
    }
    var ret = bech32.encode(hrp, [
        version
    ].concat(convertbits(program, 8, 5, true)), enc);
    if (decode(hrp, ret, enc) === null) {
        return null;
    }
    return ret;
}
/////////////////////////////////////////////////////
var DEFAULT_NETWORK_TYPE = 'prod';
function isValidAddress(address, currency, opts = {}) {
    if (!currency.bech32Hrp || currency.bech32Hrp.length === 0) {
        return false;
    }
    const { networkType = DEFAULT_NETWORK_TYPE } = opts;
    var correctBech32Hrps;
    if (networkType === 'prod' || networkType === 'testnet') {
        correctBech32Hrps = currency.bech32Hrp[networkType];
    } else if (currency.bech32Hrp) {
        correctBech32Hrps = currency.bech32Hrp.prod.concat(currency.bech32Hrp.testnet);
    } else {
        return false;
    }
    for (var chrp of correctBech32Hrps){
        var ret = decode(chrp, address);
        if (ret) {
            return encode(chrp, ret.version, ret.program) === address.toLowerCase();
        }
    }
    return false;
}
module.exports = {
    encode: encode,
    decode: decode,
    isValidAddress: isValidAddress
};
}}),
"[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/bitcoin_validator.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/next@15.1.3_react-dom@19.0.0_react@19.0.0/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)");
var base58 = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/base58.js [app-client] (ecmascript)");
var segwit = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/segwit_addr.js [app-client] (ecmascript)");
var cryptoUtils = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/utils.js [app-client] (ecmascript)");
var DEFAULT_NETWORK_TYPE = 'prod';
function getDecoded(address) {
    try {
        return base58.decode(address);
    } catch (e) {
        // if decoding fails, assume invalid address
        return null;
    }
}
function getChecksum(hashFunction, payload) {
    // Each currency may implement different hashing algorithm
    switch(hashFunction){
        // blake then keccak hash chain
        case 'blake256keccak256':
            var blake = cryptoUtils.blake2b256(payload);
            return cryptoUtils.keccak256Checksum(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(blake, 'hex'));
        case 'blake256':
            return cryptoUtils.blake256Checksum(payload);
        case 'keccak256':
            return cryptoUtils.keccak256Checksum(payload);
        case 'sha256':
        default:
            return cryptoUtils.sha256Checksum(payload);
    }
}
function getAddressType(address, currency) {
    currency = currency || {};
    // should be 25 bytes per btc address spec and 26 decred
    var expectedLength = currency.expectedLength || 25;
    var hashFunction = currency.hashFunction || 'sha256';
    var decoded = getDecoded(address);
    if (decoded) {
        var length = decoded.length;
        if (length !== expectedLength) {
            return null;
        }
        if (currency.regex) {
            if (!currency.regex.test(address)) {
                return false;
            }
        }
        var checksum = cryptoUtils.toHex(decoded.slice(length - 4, length)), body = cryptoUtils.toHex(decoded.slice(0, length - 4)), goodChecksum = getChecksum(hashFunction, body);
        return checksum === goodChecksum ? cryptoUtils.toHex(decoded.slice(0, expectedLength - 24)) : null;
    }
    return null;
}
function isValidP2PKHandP2SHAddress(address, currency, opts) {
    const { networkType = DEFAULT_NETWORK_TYPE } = opts;
    var correctAddressTypes;
    var addressType = getAddressType(address, currency);
    if (addressType) {
        if (networkType === 'prod' || networkType === 'testnet') {
            correctAddressTypes = currency.addressTypes[networkType];
        } else if (currency.addressTypes) {
            correctAddressTypes = currency.addressTypes.prod.concat(currency.addressTypes.testnet);
        } else {
            return false;
        }
        return correctAddressTypes.indexOf(addressType) >= 0;
    }
    return false;
}
module.exports = {
    isValidAddress: function(address, currency, opts = {}) {
        return isValidP2PKHandP2SHAddress(address, currency, opts) || segwit.isValidAddress(address, currency, opts);
    }
};
}}),
"[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/bip173_validator.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
var bech32 = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/bech32.js [app-client] (ecmascript)");
// bip 173 bech 32 addresses (https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki)
module.exports = {
    isValidAddress: function(address, currency, opts = {}) {
        const { networkType = 'prod' } = opts;
        const decoded = bech32.decode(address, bech32.encodings.BECH32);
        if (!decoded) {
            return false;
        }
        const bech32Hrp = decoded.hrp;
        let correctBech32Hrps;
        if (networkType === 'prod' || networkType === 'testnet') {
            correctBech32Hrps = currency.bech32Hrp[networkType];
        } else if (currency.bech32Hrp) {
            correctBech32Hrps = currency.bech32Hrp.prod.concat(currency.bech32Hrp.testnet);
        } else {
            return false;
        }
        if (correctBech32Hrps.indexOf(bech32Hrp) === -1) {
            return false;
        }
        return true;
    }
};
}}),
"[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/ada_validator.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
var cbor = __turbopack_require__("[project]/node_modules/.pnpm/cbor-js@0.1.0/node_modules/cbor-js/cbor.js [app-client] (ecmascript)");
var CRC = __turbopack_require__("[project]/node_modules/.pnpm/crc@3.8.0/node_modules/crc/index.js [app-client] (ecmascript)");
var base58 = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/base58.js [app-client] (ecmascript)");
var BIP173Validator = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/bip173_validator.js [app-client] (ecmascript)");
function getDecoded(address) {
    try {
        var decoded = base58.decode(address);
        return cbor.decode(new Uint8Array(decoded).buffer);
    } catch (e) {
        // if decoding fails, assume invalid address
        return null;
    }
}
function isValidAddressV1(address) {
    var decoded = getDecoded(address);
    if (!decoded || !Array.isArray(decoded) && decoded.length != 2) {
        return false;
    }
    var tagged = decoded[0];
    var validCrc = decoded[1];
    if (typeof validCrc != 'number') {
        return false;
    }
    // get crc of the payload
    var crc = CRC.crc32(tagged);
    return crc == validCrc;
}
function isValidAddressShelley(address, currency, opts) {
    // shelley address are just bip 173 - bech32 addresses (https://cips.cardano.org/cips/cip4/)
    return BIP173Validator.isValidAddress(address, currency, opts);
}
module.exports = {
    isValidAddress: function(address, currency, opts = {}) {
        return isValidAddressV1(address) || isValidAddressShelley(address, currency, opts);
    }
};
}}),
"[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/biginteger.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
/*
	JavaScript BigInteger library version 0.9.1
	http://silentmatt.com/biginteger/
	Copyright (c) 2009 Matthew Crumley <email@matthewcrumley.com>
	Copyright (c) 2010,2011 by John Tobey <John.Tobey@gmail.com>
	Licensed under the MIT license.
	Support for arbitrary internal representation base was added by
	Vitaly Magerya.
*/ /*
	File: biginteger.js
	Exports:
		<BigInteger>
*/ (function(exports1) {
    "use strict";
    /*
        Class: BigInteger
        An arbitrarily-large integer.
        <BigInteger> objects should be considered immutable. None of the "built-in"
        methods modify *this* or their arguments. All properties should be
        considered private.
        All the methods of <BigInteger> instances can be called "statically". The
        static versions are convenient if you don't already have a <BigInteger>
        object.
        As an example, these calls are equivalent.
        > BigInteger(4).multiply(5); // returns BigInteger(20);
        > BigInteger.multiply(4, 5); // returns BigInteger(20);
        > var a = 42;
        > var a = BigInteger.toJSValue("0b101010"); // Not completely useless...
    */ var CONSTRUCT = {}; // Unique token to call "private" version of constructor
    /*
        Constructor: BigInteger()
        Convert a value to a <BigInteger>.
        Although <BigInteger()> is the constructor for <BigInteger> objects, it is
        best not to call it as a constructor. If *n* is a <BigInteger> object, it is
        simply returned as-is. Otherwise, <BigInteger()> is equivalent to <parse>
        without a radix argument.
        > var n0 = BigInteger();      // Same as <BigInteger.ZERO>
        > var n1 = BigInteger("123"); // Create a new <BigInteger> with value 123
        > var n2 = BigInteger(123);   // Create a new <BigInteger> with value 123
        > var n3 = BigInteger(n2);    // Return n2, unchanged
        The constructor form only takes an array and a sign. *n* must be an
        array of numbers in little-endian order, where each digit is between 0
        and BigInteger.base.  The second parameter sets the sign: -1 for
        negative, +1 for positive, or 0 for zero. The array is *not copied and
        may be modified*. If the array contains only zeros, the sign parameter
        is ignored and is forced to zero.
        > new BigInteger([5], -1): create a new BigInteger with value -5
        Parameters:
            n - Value to convert to a <BigInteger>.
        Returns:
            A <BigInteger> value.
        See Also:
            <parse>, <BigInteger>
    */ function BigInteger(n, s, token) {
        if (token !== CONSTRUCT) {
            if (n instanceof BigInteger) {
                return n;
            } else if (typeof n === "undefined") {
                return ZERO;
            }
            return BigInteger.parse(n);
        }
        n = n || []; // Provide the nullary constructor for subclasses.
        while(n.length && !n[n.length - 1]){
            --n.length;
        }
        this._d = n;
        this._s = n.length ? s || 1 : 0;
    }
    BigInteger._construct = function(n, s) {
        return new BigInteger(n, s, CONSTRUCT);
    };
    // Base-10 speedup hacks in parse, toString, exp10 and log functions
    // require base to be a power of 10. 10^7 is the largest such power
    // that won't cause a precision loss when digits are multiplied.
    var BigInteger_base = 10000000;
    var BigInteger_base_log10 = 7;
    BigInteger.base = BigInteger_base;
    BigInteger.base_log10 = BigInteger_base_log10;
    var ZERO = new BigInteger([], 0, CONSTRUCT);
    // Constant: ZERO
    // <BigInteger> 0.
    BigInteger.ZERO = ZERO;
    var ONE = new BigInteger([
        1
    ], 1, CONSTRUCT);
    // Constant: ONE
    // <BigInteger> 1.
    BigInteger.ONE = ONE;
    var M_ONE = new BigInteger(ONE._d, -1, CONSTRUCT);
    // Constant: M_ONE
    // <BigInteger> -1.
    BigInteger.M_ONE = M_ONE;
    // Constant: _0
    // Shortcut for <ZERO>.
    BigInteger._0 = ZERO;
    // Constant: _1
    // Shortcut for <ONE>.
    BigInteger._1 = ONE;
    /*
        Constant: small
        Array of <BigIntegers> from 0 to 36.
        These are used internally for parsing, but useful when you need a "small"
        <BigInteger>.
        See Also:
            <ZERO>, <ONE>, <_0>, <_1>
    */ BigInteger.small = [
        ZERO,
        ONE,
        /* Assuming BigInteger_base > 36 */ new BigInteger([
            2
        ], 1, CONSTRUCT),
        new BigInteger([
            3
        ], 1, CONSTRUCT),
        new BigInteger([
            4
        ], 1, CONSTRUCT),
        new BigInteger([
            5
        ], 1, CONSTRUCT),
        new BigInteger([
            6
        ], 1, CONSTRUCT),
        new BigInteger([
            7
        ], 1, CONSTRUCT),
        new BigInteger([
            8
        ], 1, CONSTRUCT),
        new BigInteger([
            9
        ], 1, CONSTRUCT),
        new BigInteger([
            10
        ], 1, CONSTRUCT),
        new BigInteger([
            11
        ], 1, CONSTRUCT),
        new BigInteger([
            12
        ], 1, CONSTRUCT),
        new BigInteger([
            13
        ], 1, CONSTRUCT),
        new BigInteger([
            14
        ], 1, CONSTRUCT),
        new BigInteger([
            15
        ], 1, CONSTRUCT),
        new BigInteger([
            16
        ], 1, CONSTRUCT),
        new BigInteger([
            17
        ], 1, CONSTRUCT),
        new BigInteger([
            18
        ], 1, CONSTRUCT),
        new BigInteger([
            19
        ], 1, CONSTRUCT),
        new BigInteger([
            20
        ], 1, CONSTRUCT),
        new BigInteger([
            21
        ], 1, CONSTRUCT),
        new BigInteger([
            22
        ], 1, CONSTRUCT),
        new BigInteger([
            23
        ], 1, CONSTRUCT),
        new BigInteger([
            24
        ], 1, CONSTRUCT),
        new BigInteger([
            25
        ], 1, CONSTRUCT),
        new BigInteger([
            26
        ], 1, CONSTRUCT),
        new BigInteger([
            27
        ], 1, CONSTRUCT),
        new BigInteger([
            28
        ], 1, CONSTRUCT),
        new BigInteger([
            29
        ], 1, CONSTRUCT),
        new BigInteger([
            30
        ], 1, CONSTRUCT),
        new BigInteger([
            31
        ], 1, CONSTRUCT),
        new BigInteger([
            32
        ], 1, CONSTRUCT),
        new BigInteger([
            33
        ], 1, CONSTRUCT),
        new BigInteger([
            34
        ], 1, CONSTRUCT),
        new BigInteger([
            35
        ], 1, CONSTRUCT),
        new BigInteger([
            36
        ], 1, CONSTRUCT)
    ];
    // Used for parsing/radix conversion
    BigInteger.digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    /*
        Method: toString
        Convert a <BigInteger> to a string.
        When *base* is greater than 10, letters are upper case.
        Parameters:
            base - Optional base to represent the number in (default is base 10).
                   Must be between 2 and 36 inclusive, or an Error will be thrown.
        Returns:
            The string representation of the <BigInteger>.
    */ BigInteger.prototype.toString = function(base) {
        base = +base || 10;
        if (base < 2 || base > 36) {
            throw new Error("illegal radix " + base + ".");
        }
        if (this._s === 0) {
            return "0";
        }
        if (base === 10) {
            var str = this._s < 0 ? "-" : "";
            str += this._d[this._d.length - 1].toString();
            for(var i = this._d.length - 2; i >= 0; i--){
                var group = this._d[i].toString();
                while(group.length < BigInteger_base_log10)group = '0' + group;
                str += group;
            }
            return str;
        } else {
            var numerals = BigInteger.digits;
            base = BigInteger.small[base];
            var sign = this._s;
            var n = this.abs();
            var digits = [];
            var digit;
            while(n._s !== 0){
                var divmod = n.divRem(base);
                n = divmod[0];
                digit = divmod[1];
                // TODO: This could be changed to unshift instead of reversing at the end.
                // Benchmark both to compare speeds.
                digits.push(numerals[digit.valueOf()]);
            }
            return (sign < 0 ? "-" : "") + digits.reverse().join("");
        }
    };
    // Verify strings for parsing
    BigInteger.radixRegex = [
        /^$/,
        /^$/,
        /^[01]*$/,
        /^[012]*$/,
        /^[0-3]*$/,
        /^[0-4]*$/,
        /^[0-5]*$/,
        /^[0-6]*$/,
        /^[0-7]*$/,
        /^[0-8]*$/,
        /^[0-9]*$/,
        /^[0-9aA]*$/,
        /^[0-9abAB]*$/,
        /^[0-9abcABC]*$/,
        /^[0-9a-dA-D]*$/,
        /^[0-9a-eA-E]*$/,
        /^[0-9a-fA-F]*$/,
        /^[0-9a-gA-G]*$/,
        /^[0-9a-hA-H]*$/,
        /^[0-9a-iA-I]*$/,
        /^[0-9a-jA-J]*$/,
        /^[0-9a-kA-K]*$/,
        /^[0-9a-lA-L]*$/,
        /^[0-9a-mA-M]*$/,
        /^[0-9a-nA-N]*$/,
        /^[0-9a-oA-O]*$/,
        /^[0-9a-pA-P]*$/,
        /^[0-9a-qA-Q]*$/,
        /^[0-9a-rA-R]*$/,
        /^[0-9a-sA-S]*$/,
        /^[0-9a-tA-T]*$/,
        /^[0-9a-uA-U]*$/,
        /^[0-9a-vA-V]*$/,
        /^[0-9a-wA-W]*$/,
        /^[0-9a-xA-X]*$/,
        /^[0-9a-yA-Y]*$/,
        /^[0-9a-zA-Z]*$/
    ];
    /*
        Function: parse
        Parse a string into a <BigInteger>.
        *base* is optional but, if provided, must be from 2 to 36 inclusive. If
        *base* is not provided, it will be guessed based on the leading characters
        of *s* as follows:
        - "0x" or "0X": *base* = 16
        - "0c" or "0C": *base* = 8
        - "0b" or "0B": *base* = 2
        - else: *base* = 10
        If no base is provided, or *base* is 10, the number can be in exponential
        form. For example, these are all valid:
        > BigInteger.parse("1e9");              // Same as "1000000000"
        > BigInteger.parse("1.234*10^3");       // Same as 1234
        > BigInteger.parse("56789 * 10 ** -2"); // Same as 567
        If any characters fall outside the range defined by the radix, an exception
        will be thrown.
        Parameters:
            s - The string to parse.
            base - Optional radix (default is to guess based on *s*).
        Returns:
            a <BigInteger> instance.
    */ BigInteger.parse = function(s, base) {
        // Expands a number in exponential form to decimal form.
        // expandExponential("-13.441*10^5") === "1344100";
        // expandExponential("1.12300e-1") === "0.112300";
        // expandExponential(1000000000000000000000000000000) === "1000000000000000000000000000000";
        function expandExponential(str) {
            str = str.replace(/\s*[*xX]\s*10\s*(\^|\*\*)\s*/, "e");
            return str.replace(/^([+\-])?(\d+)\.?(\d*)[eE]([+\-]?\d+)$/, function(x, s, n, f, c) {
                c = +c;
                var l = c < 0;
                var i = n.length + c;
                x = (l ? n : f).length;
                c = (c = Math.abs(c)) >= x ? c - x + l : 0;
                var z = new Array(c + 1).join("0");
                var r = n + f;
                return (s || "") + (l ? r = z + r : r += z).substr(0, i += l ? z.length : 0) + (i < r.length ? "." + r.substr(i) : "");
            });
        }
        s = s.toString();
        if (typeof base === "undefined" || +base === 10) {
            s = expandExponential(s);
        }
        var prefixRE;
        if (typeof base === "undefined") {
            prefixRE = '0[xcb]';
        } else if (base == 16) {
            prefixRE = '0x';
        } else if (base == 8) {
            prefixRE = '0c';
        } else if (base == 2) {
            prefixRE = '0b';
        } else {
            prefixRE = '';
        }
        var parts = new RegExp('^([+\\-]?)(' + prefixRE + ')?([0-9a-z]*)(?:\\.\\d*)?$', 'i').exec(s);
        if (parts) {
            var sign = parts[1] || "+";
            var baseSection = parts[2] || "";
            var digits = parts[3] || "";
            if (typeof base === "undefined") {
                // Guess base
                if (baseSection === "0x" || baseSection === "0X") {
                    base = 16;
                } else if (baseSection === "0c" || baseSection === "0C") {
                    base = 8;
                } else if (baseSection === "0b" || baseSection === "0B") {
                    base = 2;
                } else {
                    base = 10;
                }
            } else if (base < 2 || base > 36) {
                throw new Error("Illegal radix " + base + ".");
            }
            base = +base;
            // Check for digits outside the range
            if (!BigInteger.radixRegex[base].test(digits)) {
                throw new Error("Bad digit for radix " + base);
            }
            // Strip leading zeros, and convert to array
            digits = digits.replace(/^0+/, "").split("");
            if (digits.length === 0) {
                return ZERO;
            }
            // Get the sign (we know it's not zero)
            sign = sign === "-" ? -1 : 1;
            // Optimize 10
            if (base == 10) {
                var d = [];
                while(digits.length >= BigInteger_base_log10){
                    d.push(parseInt(digits.splice(digits.length - BigInteger.base_log10, BigInteger.base_log10).join(''), 10));
                }
                d.push(parseInt(digits.join(''), 10));
                return new BigInteger(d, sign, CONSTRUCT);
            }
            // Do the conversion
            var d = ZERO;
            base = BigInteger.small[base];
            var small = BigInteger.small;
            for(var i = 0; i < digits.length; i++){
                d = d.multiply(base).add(small[parseInt(digits[i], 36)]);
            }
            return new BigInteger(d._d, sign, CONSTRUCT);
        } else {
            throw new Error("Invalid BigInteger format: " + s);
        }
    };
    /*
        Function: add
        Add two <BigIntegers>.
        Parameters:
            n - The number to add to *this*. Will be converted to a <BigInteger>.
        Returns:
            The numbers added together.
        See Also:
            <subtract>, <multiply>, <quotient>, <next>
    */ BigInteger.prototype.add = function(n) {
        if (this._s === 0) {
            return BigInteger(n);
        }
        n = BigInteger(n);
        if (n._s === 0) {
            return this;
        }
        if (this._s !== n._s) {
            n = n.negate();
            return this.subtract(n);
        }
        var a = this._d;
        var b = n._d;
        var al = a.length;
        var bl = b.length;
        var sum = new Array(Math.max(al, bl) + 1);
        var size = Math.min(al, bl);
        var carry = 0;
        var digit;
        for(var i = 0; i < size; i++){
            digit = a[i] + b[i] + carry;
            sum[i] = digit % BigInteger_base;
            carry = digit / BigInteger_base | 0;
        }
        if (bl > al) {
            a = b;
            al = bl;
        }
        for(i = size; carry && i < al; i++){
            digit = a[i] + carry;
            sum[i] = digit % BigInteger_base;
            carry = digit / BigInteger_base | 0;
        }
        if (carry) {
            sum[i] = carry;
        }
        for(; i < al; i++){
            sum[i] = a[i];
        }
        return new BigInteger(sum, this._s, CONSTRUCT);
    };
    /*
        Function: negate
        Get the additive inverse of a <BigInteger>.
        Returns:
            A <BigInteger> with the same magnatude, but with the opposite sign.
        See Also:
            <abs>
    */ BigInteger.prototype.negate = function() {
        return new BigInteger(this._d, -this._s | 0, CONSTRUCT);
    };
    /*
        Function: abs
        Get the absolute value of a <BigInteger>.
        Returns:
            A <BigInteger> with the same magnatude, but always positive (or zero).
        See Also:
            <negate>
    */ BigInteger.prototype.abs = function() {
        return this._s < 0 ? this.negate() : this;
    };
    /*
        Function: subtract
        Subtract two <BigIntegers>.
        Parameters:
            n - The number to subtract from *this*. Will be converted to a <BigInteger>.
        Returns:
            The *n* subtracted from *this*.
        See Also:
            <add>, <multiply>, <quotient>, <prev>
    */ BigInteger.prototype.subtract = function(n) {
        if (this._s === 0) {
            return BigInteger(n).negate();
        }
        n = BigInteger(n);
        if (n._s === 0) {
            return this;
        }
        if (this._s !== n._s) {
            n = n.negate();
            return this.add(n);
        }
        var m = this;
        // negative - negative => -|a| - -|b| => -|a| + |b| => |b| - |a|
        if (this._s < 0) {
            m = new BigInteger(n._d, 1, CONSTRUCT);
            n = new BigInteger(this._d, 1, CONSTRUCT);
        }
        // Both are positive => a - b
        var sign = m.compareAbs(n);
        if (sign === 0) {
            return ZERO;
        } else if (sign < 0) {
            // swap m and n
            var t = n;
            n = m;
            m = t;
        }
        // a > b
        var a = m._d;
        var b = n._d;
        var al = a.length;
        var bl = b.length;
        var diff = new Array(al); // al >= bl since a > b
        var borrow = 0;
        var i;
        var digit;
        for(i = 0; i < bl; i++){
            digit = a[i] - borrow - b[i];
            if (digit < 0) {
                digit += BigInteger_base;
                borrow = 1;
            } else {
                borrow = 0;
            }
            diff[i] = digit;
        }
        for(i = bl; i < al; i++){
            digit = a[i] - borrow;
            if (digit < 0) {
                digit += BigInteger_base;
            } else {
                diff[i++] = digit;
                break;
            }
            diff[i] = digit;
        }
        for(; i < al; i++){
            diff[i] = a[i];
        }
        return new BigInteger(diff, sign, CONSTRUCT);
    };
    (function() {
        function addOne(n, sign) {
            var a = n._d;
            var sum = a.slice();
            var carry = true;
            var i = 0;
            while(true){
                var digit = (a[i] || 0) + 1;
                sum[i] = digit % BigInteger_base;
                if (digit <= BigInteger_base - 1) {
                    break;
                }
                ++i;
            }
            return new BigInteger(sum, sign, CONSTRUCT);
        }
        function subtractOne(n, sign) {
            var a = n._d;
            var sum = a.slice();
            var borrow = true;
            var i = 0;
            while(true){
                var digit = (a[i] || 0) - 1;
                if (digit < 0) {
                    sum[i] = digit + BigInteger_base;
                } else {
                    sum[i] = digit;
                    break;
                }
                ++i;
            }
            return new BigInteger(sum, sign, CONSTRUCT);
        }
        /*
            Function: next
            Get the next <BigInteger> (add one).
            Returns:
                *this* + 1.
            See Also:
                <add>, <prev>
        */ BigInteger.prototype.next = function() {
            switch(this._s){
                case 0:
                    return ONE;
                case -1:
                    return subtractOne(this, -1);
                // case 1:
                default:
                    return addOne(this, 1);
            }
        };
        /*
            Function: prev
            Get the previous <BigInteger> (subtract one).
            Returns:
                *this* - 1.
            See Also:
                <next>, <subtract>
        */ BigInteger.prototype.prev = function() {
            switch(this._s){
                case 0:
                    return M_ONE;
                case -1:
                    return addOne(this, -1);
                // case 1:
                default:
                    return subtractOne(this, 1);
            }
        };
    })();
    /*
        Function: compareAbs
        Compare the absolute value of two <BigIntegers>.
        Calling <compareAbs> is faster than calling <abs> twice, then <compare>.
        Parameters:
            n - The number to compare to *this*. Will be converted to a <BigInteger>.
        Returns:
            -1, 0, or +1 if *|this|* is less than, equal to, or greater than *|n|*.
        See Also:
            <compare>, <abs>
    */ BigInteger.prototype.compareAbs = function(n) {
        if (this === n) {
            return 0;
        }
        if (!(n instanceof BigInteger)) {
            if (!isFinite(n)) {
                return isNaN(n) ? n : -1;
            }
            n = BigInteger(n);
        }
        if (this._s === 0) {
            return n._s !== 0 ? -1 : 0;
        }
        if (n._s === 0) {
            return 1;
        }
        var l = this._d.length;
        var nl = n._d.length;
        if (l < nl) {
            return -1;
        } else if (l > nl) {
            return 1;
        }
        var a = this._d;
        var b = n._d;
        for(var i = l - 1; i >= 0; i--){
            if (a[i] !== b[i]) {
                return a[i] < b[i] ? -1 : 1;
            }
        }
        return 0;
    };
    /*
        Function: compare
        Compare two <BigIntegers>.
        Parameters:
            n - The number to compare to *this*. Will be converted to a <BigInteger>.
        Returns:
            -1, 0, or +1 if *this* is less than, equal to, or greater than *n*.
        See Also:
            <compareAbs>, <isPositive>, <isNegative>, <isUnit>
    */ BigInteger.prototype.compare = function(n) {
        if (this === n) {
            return 0;
        }
        n = BigInteger(n);
        if (this._s === 0) {
            return -n._s;
        }
        if (this._s === n._s) {
            var cmp = this.compareAbs(n);
            return cmp * this._s;
        } else {
            return this._s;
        }
    };
    /*
        Function: isUnit
        Return true iff *this* is either 1 or -1.
        Returns:
            true if *this* compares equal to <BigInteger.ONE> or <BigInteger.M_ONE>.
        See Also:
            <isZero>, <isNegative>, <isPositive>, <compareAbs>, <compare>,
            <BigInteger.ONE>, <BigInteger.M_ONE>
    */ BigInteger.prototype.isUnit = function() {
        return this === ONE || this === M_ONE || this._d.length === 1 && this._d[0] === 1;
    };
    /*
        Function: multiply
        Multiply two <BigIntegers>.
        Parameters:
            n - The number to multiply *this* by. Will be converted to a
            <BigInteger>.
        Returns:
            The numbers multiplied together.
        See Also:
            <add>, <subtract>, <quotient>, <square>
    */ BigInteger.prototype.multiply = function(n) {
        // TODO: Consider adding Karatsuba multiplication for large numbers
        if (this._s === 0) {
            return ZERO;
        }
        n = BigInteger(n);
        if (n._s === 0) {
            return ZERO;
        }
        if (this.isUnit()) {
            if (this._s < 0) {
                return n.negate();
            }
            return n;
        }
        if (n.isUnit()) {
            if (n._s < 0) {
                return this.negate();
            }
            return this;
        }
        if (this === n) {
            return this.square();
        }
        var r = this._d.length >= n._d.length;
        var a = (r ? this : n)._d; // a will be longer than b
        var b = (r ? n : this)._d;
        var al = a.length;
        var bl = b.length;
        var pl = al + bl;
        var partial = new Array(pl);
        var i;
        for(i = 0; i < pl; i++){
            partial[i] = 0;
        }
        for(i = 0; i < bl; i++){
            var carry = 0;
            var bi = b[i];
            var jlimit = al + i;
            var digit;
            for(var j = i; j < jlimit; j++){
                digit = partial[j] + bi * a[j - i] + carry;
                carry = digit / BigInteger_base | 0;
                partial[j] = digit % BigInteger_base | 0;
            }
            if (carry) {
                digit = partial[j] + carry;
                carry = digit / BigInteger_base | 0;
                partial[j] = digit % BigInteger_base;
            }
        }
        return new BigInteger(partial, this._s * n._s, CONSTRUCT);
    };
    // Multiply a BigInteger by a single-digit native number
    // Assumes that this and n are >= 0
    // This is not really intended to be used outside the library itself
    BigInteger.prototype.multiplySingleDigit = function(n) {
        if (n === 0 || this._s === 0) {
            return ZERO;
        }
        if (n === 1) {
            return this;
        }
        var digit;
        if (this._d.length === 1) {
            digit = this._d[0] * n;
            if (digit >= BigInteger_base) {
                return new BigInteger([
                    digit % BigInteger_base | 0,
                    digit / BigInteger_base | 0
                ], 1, CONSTRUCT);
            }
            return new BigInteger([
                digit
            ], 1, CONSTRUCT);
        }
        if (n === 2) {
            return this.add(this);
        }
        if (this.isUnit()) {
            return new BigInteger([
                n
            ], 1, CONSTRUCT);
        }
        var a = this._d;
        var al = a.length;
        var pl = al + 1;
        var partial = new Array(pl);
        for(var i = 0; i < pl; i++){
            partial[i] = 0;
        }
        var carry = 0;
        for(var j = 0; j < al; j++){
            digit = n * a[j] + carry;
            carry = digit / BigInteger_base | 0;
            partial[j] = digit % BigInteger_base | 0;
        }
        if (carry) {
            partial[j] = carry;
        }
        return new BigInteger(partial, 1, CONSTRUCT);
    };
    /*
        Function: square
        Multiply a <BigInteger> by itself.
        This is slightly faster than regular multiplication, since it removes the
        duplicated multiplcations.
        Returns:
            > this.multiply(this)
        See Also:
            <multiply>
    */ BigInteger.prototype.square = function() {
        // Normally, squaring a 10-digit number would take 100 multiplications.
        // Of these 10 are unique diagonals, of the remaining 90 (100-10), 45 are repeated.
        // This procedure saves (N*(N-1))/2 multiplications, (e.g., 45 of 100 multiplies).
        // Based on code by Gary Darby, Intellitech Systems Inc., www.DelphiForFun.org
        if (this._s === 0) {
            return ZERO;
        }
        if (this.isUnit()) {
            return ONE;
        }
        var digits = this._d;
        var length = digits.length;
        var imult1 = new Array(length + length + 1);
        var product, carry, k;
        var i;
        // Calculate diagonal
        for(i = 0; i < length; i++){
            k = i * 2;
            product = digits[i] * digits[i];
            carry = product / BigInteger_base | 0;
            imult1[k] = product % BigInteger_base;
            imult1[k + 1] = carry;
        }
        // Calculate repeating part
        for(i = 0; i < length; i++){
            carry = 0;
            k = i * 2 + 1;
            for(var j = i + 1; j < length; j++, k++){
                product = digits[j] * digits[i] * 2 + imult1[k] + carry;
                carry = product / BigInteger_base | 0;
                imult1[k] = product % BigInteger_base;
            }
            k = length + i;
            var digit = carry + imult1[k];
            carry = digit / BigInteger_base | 0;
            imult1[k] = digit % BigInteger_base;
            imult1[k + 1] += carry;
        }
        return new BigInteger(imult1, 1, CONSTRUCT);
    };
    /*
        Function: quotient
        Divide two <BigIntegers> and truncate towards zero.
        <quotient> throws an exception if *n* is zero.
        Parameters:
            n - The number to divide *this* by. Will be converted to a <BigInteger>.
        Returns:
            The *this* / *n*, truncated to an integer.
        See Also:
            <add>, <subtract>, <multiply>, <divRem>, <remainder>
    */ BigInteger.prototype.quotient = function(n) {
        return this.divRem(n)[0];
    };
    /*
        Function: divide
        Deprecated synonym for <quotient>.
    */ BigInteger.prototype.divide = BigInteger.prototype.quotient;
    /*
        Function: remainder
        Calculate the remainder of two <BigIntegers>.
        <remainder> throws an exception if *n* is zero.
        Parameters:
            n - The remainder after *this* is divided *this* by *n*. Will be
                converted to a <BigInteger>.
        Returns:
            *this* % *n*.
        See Also:
            <divRem>, <quotient>
    */ BigInteger.prototype.remainder = function(n) {
        return this.divRem(n)[1];
    };
    /*
        Function: divRem
        Calculate the integer quotient and remainder of two <BigIntegers>.
        <divRem> throws an exception if *n* is zero.
        Parameters:
            n - The number to divide *this* by. Will be converted to a <BigInteger>.
        Returns:
            A two-element array containing the quotient and the remainder.
            > a.divRem(b)
            is exactly equivalent to
            > [a.quotient(b), a.remainder(b)]
            except it is faster, because they are calculated at the same time.
        See Also:
            <quotient>, <remainder>
    */ BigInteger.prototype.divRem = function(n) {
        n = BigInteger(n);
        if (n._s === 0) {
            throw new Error("Divide by zero");
        }
        if (this._s === 0) {
            return [
                ZERO,
                ZERO
            ];
        }
        if (n._d.length === 1) {
            return this.divRemSmall(n._s * n._d[0]);
        }
        // Test for easy cases -- |n1| <= |n2|
        switch(this.compareAbs(n)){
            case 0:
                return [
                    this._s === n._s ? ONE : M_ONE,
                    ZERO
                ];
            case -1:
                return [
                    ZERO,
                    this
                ];
        }
        var sign = this._s * n._s;
        var a = n.abs();
        var b_digits = this._d;
        var b_index = b_digits.length;
        var digits = n._d.length;
        var quot = [];
        var guess;
        var part = new BigInteger([], 0, CONSTRUCT);
        while(b_index){
            part._d.unshift(b_digits[--b_index]);
            part = new BigInteger(part._d, 1, CONSTRUCT);
            if (part.compareAbs(n) < 0) {
                quot.push(0);
                continue;
            }
            if (part._s === 0) {
                guess = 0;
            } else {
                var xlen = part._d.length, ylen = a._d.length;
                var highx = part._d[xlen - 1] * BigInteger_base + part._d[xlen - 2];
                var highy = a._d[ylen - 1] * BigInteger_base + a._d[ylen - 2];
                if (part._d.length > a._d.length) {
                    // The length of part._d can either match a._d length,
                    // or exceed it by one.
                    highx = (highx + 1) * BigInteger_base;
                }
                guess = Math.ceil(highx / highy);
            }
            do {
                var check = a.multiplySingleDigit(guess);
                if (check.compareAbs(part) <= 0) {
                    break;
                }
                guess--;
            }while (guess)
            quot.push(guess);
            if (!guess) {
                continue;
            }
            var diff = part.subtract(check);
            part._d = diff._d.slice();
        }
        return [
            new BigInteger(quot.reverse(), sign, CONSTRUCT),
            new BigInteger(part._d, this._s, CONSTRUCT)
        ];
    };
    // Throws an exception if n is outside of (-BigInteger.base, -1] or
    // [1, BigInteger.base).  It's not necessary to call this, since the
    // other division functions will call it if they are able to.
    BigInteger.prototype.divRemSmall = function(n) {
        var r;
        n = +n;
        if (n === 0) {
            throw new Error("Divide by zero");
        }
        var n_s = n < 0 ? -1 : 1;
        var sign = this._s * n_s;
        n = Math.abs(n);
        if (n < 1 || n >= BigInteger_base) {
            throw new Error("Argument out of range");
        }
        if (this._s === 0) {
            return [
                ZERO,
                ZERO
            ];
        }
        if (n === 1 || n === -1) {
            return [
                sign === 1 ? this.abs() : new BigInteger(this._d, sign, CONSTRUCT),
                ZERO
            ];
        }
        // 2 <= n < BigInteger_base
        // divide a single digit by a single digit
        if (this._d.length === 1) {
            var q = new BigInteger([
                this._d[0] / n | 0
            ], 1, CONSTRUCT);
            r = new BigInteger([
                this._d[0] % n | 0
            ], 1, CONSTRUCT);
            if (sign < 0) {
                q = q.negate();
            }
            if (this._s < 0) {
                r = r.negate();
            }
            return [
                q,
                r
            ];
        }
        var digits = this._d.slice();
        var quot = new Array(digits.length);
        var part = 0;
        var diff = 0;
        var i = 0;
        var guess;
        while(digits.length){
            part = part * BigInteger_base + digits[digits.length - 1];
            if (part < n) {
                quot[i++] = 0;
                digits.pop();
                diff = BigInteger_base * diff + part;
                continue;
            }
            if (part === 0) {
                guess = 0;
            } else {
                guess = part / n | 0;
            }
            var check = n * guess;
            diff = part - check;
            quot[i++] = guess;
            if (!guess) {
                digits.pop();
                continue;
            }
            digits.pop();
            part = diff;
        }
        r = new BigInteger([
            diff
        ], 1, CONSTRUCT);
        if (this._s < 0) {
            r = r.negate();
        }
        return [
            new BigInteger(quot.reverse(), sign, CONSTRUCT),
            r
        ];
    };
    /*
        Function: isEven
        Return true iff *this* is divisible by two.
        Note that <BigInteger.ZERO> is even.
        Returns:
            true if *this* is even, false otherwise.
        See Also:
            <isOdd>
    */ BigInteger.prototype.isEven = function() {
        var digits = this._d;
        return this._s === 0 || digits.length === 0 || digits[0] % 2 === 0;
    };
    /*
        Function: isOdd
        Return true iff *this* is not divisible by two.
        Returns:
            true if *this* is odd, false otherwise.
        See Also:
            <isEven>
    */ BigInteger.prototype.isOdd = function() {
        return !this.isEven();
    };
    /*
        Function: sign
        Get the sign of a <BigInteger>.
        Returns:
            * -1 if *this* < 0
            * 0 if *this* == 0
            * +1 if *this* > 0
        See Also:
            <isZero>, <isPositive>, <isNegative>, <compare>, <BigInteger.ZERO>
    */ BigInteger.prototype.sign = function() {
        return this._s;
    };
    /*
        Function: isPositive
        Return true iff *this* > 0.
        Returns:
            true if *this*.compare(<BigInteger.ZERO>) == 1.
        See Also:
            <sign>, <isZero>, <isNegative>, <isUnit>, <compare>, <BigInteger.ZERO>
    */ BigInteger.prototype.isPositive = function() {
        return this._s > 0;
    };
    /*
        Function: isNegative
        Return true iff *this* < 0.
        Returns:
            true if *this*.compare(<BigInteger.ZERO>) == -1.
        See Also:
            <sign>, <isPositive>, <isZero>, <isUnit>, <compare>, <BigInteger.ZERO>
    */ BigInteger.prototype.isNegative = function() {
        return this._s < 0;
    };
    /*
        Function: isZero
        Return true iff *this* == 0.
        Returns:
            true if *this*.compare(<BigInteger.ZERO>) == 0.
        See Also:
            <sign>, <isPositive>, <isNegative>, <isUnit>, <BigInteger.ZERO>
    */ BigInteger.prototype.isZero = function() {
        return this._s === 0;
    };
    /*
        Function: exp10
        Multiply a <BigInteger> by a power of 10.
        This is equivalent to, but faster than
        > if (n >= 0) {
        >     return this.multiply(BigInteger("1e" + n));
        > }
        > else { // n <= 0
        >     return this.quotient(BigInteger("1e" + -n));
        > }
        Parameters:
            n - The power of 10 to multiply *this* by. *n* is converted to a
            javascipt number and must be no greater than <BigInteger.MAX_EXP>
            (0x7FFFFFFF), or an exception will be thrown.
        Returns:
            *this* * (10 ** *n*), truncated to an integer if necessary.
        See Also:
            <pow>, <multiply>
    */ BigInteger.prototype.exp10 = function(n) {
        n = +n;
        if (n === 0) {
            return this;
        }
        if (Math.abs(n) > Number(MAX_EXP)) {
            throw new Error("exponent too large in BigInteger.exp10");
        }
        // Optimization for this == 0. This also keeps us from having to trim zeros in the positive n case
        if (this._s === 0) {
            return ZERO;
        }
        if (n > 0) {
            var k = new BigInteger(this._d.slice(), this._s, CONSTRUCT);
            for(; n >= BigInteger_base_log10; n -= BigInteger_base_log10){
                k._d.unshift(0);
            }
            if (n == 0) return k;
            k._s = 1;
            k = k.multiplySingleDigit(Math.pow(10, n));
            return this._s < 0 ? k.negate() : k;
        } else if (-n >= this._d.length * BigInteger_base_log10) {
            return ZERO;
        } else {
            var k = new BigInteger(this._d.slice(), this._s, CONSTRUCT);
            for(n = -n; n >= BigInteger_base_log10; n -= BigInteger_base_log10){
                k._d.shift();
            }
            return n == 0 ? k : k.divRemSmall(Math.pow(10, n))[0];
        }
    };
    /*
        Function: pow
        Raise a <BigInteger> to a power.
        In this implementation, 0**0 is 1.
        Parameters:
            n - The exponent to raise *this* by. *n* must be no greater than
            <BigInteger.MAX_EXP> (0x7FFFFFFF), or an exception will be thrown.
        Returns:
            *this* raised to the *nth* power.
        See Also:
            <modPow>
    */ BigInteger.prototype.pow = function(n) {
        if (this.isUnit()) {
            if (this._s > 0) {
                return this;
            } else {
                return BigInteger(n).isOdd() ? this : this.negate();
            }
        }
        n = BigInteger(n);
        if (n._s === 0) {
            return ONE;
        } else if (n._s < 0) {
            if (this._s === 0) {
                throw new Error("Divide by zero");
            } else {
                return ZERO;
            }
        }
        if (this._s === 0) {
            return ZERO;
        }
        if (n.isUnit()) {
            return this;
        }
        if (n.compareAbs(MAX_EXP) > 0) {
            throw new Error("exponent too large in BigInteger.pow");
        }
        var x = this;
        var aux = ONE;
        var two = BigInteger.small[2];
        while(n.isPositive()){
            if (n.isOdd()) {
                aux = aux.multiply(x);
                if (n.isUnit()) {
                    return aux;
                }
            }
            x = x.square();
            n = n.quotient(two);
        }
        return aux;
    };
    /*
        Function: modPow
        Raise a <BigInteger> to a power (mod m).
        Because it is reduced by a modulus, <modPow> is not limited by
        <BigInteger.MAX_EXP> like <pow>.
        Parameters:
            exponent - The exponent to raise *this* by. Must be positive.
            modulus - The modulus.
        Returns:
            *this* ^ *exponent* (mod *modulus*).
        See Also:
            <pow>, <mod>
    */ BigInteger.prototype.modPow = function(exponent, modulus) {
        var result = ONE;
        var base = this;
        while(exponent.isPositive()){
            if (exponent.isOdd()) {
                result = result.multiply(base).remainder(modulus);
            }
            exponent = exponent.quotient(BigInteger.small[2]);
            if (exponent.isPositive()) {
                base = base.square().remainder(modulus);
            }
        }
        return result;
    };
    /*
        Function: log
        Get the natural logarithm of a <BigInteger> as a native JavaScript number.
        This is equivalent to
        > Math.log(this.toJSValue())
        but handles values outside of the native number range.
        Returns:
            log( *this* )
        See Also:
            <toJSValue>
    */ BigInteger.prototype.log = function() {
        switch(this._s){
            case 0:
                return -Infinity;
            case -1:
                return NaN;
            default:
        }
        var l = this._d.length;
        if (l * BigInteger_base_log10 < 30) {
            return Math.log(this.valueOf());
        }
        var N = Math.ceil(30 / BigInteger_base_log10);
        var firstNdigits = this._d.slice(l - N);
        return Math.log(new BigInteger(firstNdigits, 1, CONSTRUCT).valueOf()) + (l - N) * Math.log(BigInteger_base);
    };
    /*
        Function: valueOf
        Convert a <BigInteger> to a native JavaScript integer.
        This is called automatically by JavaScipt to convert a <BigInteger> to a
        native value.
        Returns:
            > parseInt(this.toString(), 10)
        See Also:
            <toString>, <toJSValue>
    */ BigInteger.prototype.valueOf = function() {
        return parseInt(this.toString(), 10);
    };
    /*
        Function: toJSValue
        Convert a <BigInteger> to a native JavaScript integer.
        This is the same as valueOf, but more explicitly named.
        Returns:
            > parseInt(this.toString(), 10)
        See Also:
            <toString>, <valueOf>
    */ BigInteger.prototype.toJSValue = function() {
        return parseInt(this.toString(), 10);
    };
    /*
     Function: lowVal
     Author: Lucas Jones
     */ BigInteger.prototype.lowVal = function() {
        return this._d[0] || 0;
    };
    var MAX_EXP = BigInteger(0x7FFFFFFF);
    // Constant: MAX_EXP
    // The largest exponent allowed in <pow> and <exp10> (0x7FFFFFFF or 2147483647).
    BigInteger.MAX_EXP = MAX_EXP;
    (function() {
        function makeUnary(fn) {
            return function(a) {
                return fn.call(BigInteger(a));
            };
        }
        function makeBinary(fn) {
            return function(a, b) {
                return fn.call(BigInteger(a), BigInteger(b));
            };
        }
        function makeTrinary(fn) {
            return function(a, b, c) {
                return fn.call(BigInteger(a), BigInteger(b), BigInteger(c));
            };
        }
        (function() {
            var i, fn;
            var unary = "toJSValue,isEven,isOdd,sign,isZero,isNegative,abs,isUnit,square,negate,isPositive,toString,next,prev,log".split(",");
            var binary = "compare,remainder,divRem,subtract,add,quotient,divide,multiply,pow,compareAbs".split(",");
            var trinary = [
                "modPow"
            ];
            for(i = 0; i < unary.length; i++){
                fn = unary[i];
                BigInteger[fn] = makeUnary(BigInteger.prototype[fn]);
            }
            for(i = 0; i < binary.length; i++){
                fn = binary[i];
                BigInteger[fn] = makeBinary(BigInteger.prototype[fn]);
            }
            for(i = 0; i < trinary.length; i++){
                fn = trinary[i];
                BigInteger[fn] = makeTrinary(BigInteger.prototype[fn]);
            }
            BigInteger.exp10 = function(x, n) {
                return BigInteger(x).exp10(n);
            };
        })();
    })();
    exports1.JSBigInt = BigInteger; // exports.BigInteger changed to exports.JSBigInt
})(("TURBOPACK compile-time truthy", 1) ? exports : ("TURBOPACK unreachable", undefined));
}}),
"[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/cnBase58.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
var JSBigInt = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/biginteger.js [app-client] (ecmascript)")['JSBigInt'];
/**
Copyright (c) 2017, moneroexamples

All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
this list of conditions and the following disclaimer in the documentation
and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors
may be used to endorse or promote products derived from this software without
specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

Parts of the project are originally copyright (c) 2014-2017, MyMonero.com
*/ var cnBase58 = function() {
    var b58 = {};
    var alphabet_str = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    var alphabet = [];
    for(var i = 0; i < alphabet_str.length; i++){
        alphabet.push(alphabet_str.charCodeAt(i));
    }
    var encoded_block_sizes = [
        0,
        2,
        3,
        5,
        6,
        7,
        9,
        10,
        11
    ];
    var alphabet_size = alphabet.length;
    var full_block_size = 8;
    var full_encoded_block_size = 11;
    var UINT64_MAX = new JSBigInt(2).pow(64);
    function hextobin(hex) {
        if (hex.length % 2 !== 0) throw "Hex string has invalid length!";
        var res = new Uint8Array(hex.length / 2);
        for(var i = 0; i < hex.length / 2; ++i){
            res[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
        }
        return res;
    }
    function bintohex(bin) {
        var out = [];
        for(var i = 0; i < bin.length; ++i){
            out.push(("0" + bin[i].toString(16)).slice(-2));
        }
        return out.join("");
    }
    function strtobin(str) {
        var res = new Uint8Array(str.length);
        for(var i = 0; i < str.length; i++){
            res[i] = str.charCodeAt(i);
        }
        return res;
    }
    function bintostr(bin) {
        var out = [];
        for(var i = 0; i < bin.length; i++){
            out.push(String.fromCharCode(bin[i]));
        }
        return out.join("");
    }
    function uint8_be_to_64(data) {
        if (data.length < 1 || data.length > 8) {
            throw "Invalid input length";
        }
        var res = JSBigInt.ZERO;
        var twopow8 = new JSBigInt(2).pow(8);
        var i = 0;
        switch(9 - data.length){
            case 1:
                res = res.add(data[i++]);
            case 2:
                res = res.multiply(twopow8).add(data[i++]);
            case 3:
                res = res.multiply(twopow8).add(data[i++]);
            case 4:
                res = res.multiply(twopow8).add(data[i++]);
            case 5:
                res = res.multiply(twopow8).add(data[i++]);
            case 6:
                res = res.multiply(twopow8).add(data[i++]);
            case 7:
                res = res.multiply(twopow8).add(data[i++]);
            case 8:
                res = res.multiply(twopow8).add(data[i++]);
                break;
            default:
                throw "Impossible condition";
        }
        return res;
    }
    function uint64_to_8be(num, size) {
        var res = new Uint8Array(size);
        if (size < 1 || size > 8) {
            throw "Invalid input length";
        }
        var twopow8 = new JSBigInt(2).pow(8);
        for(var i = size - 1; i >= 0; i--){
            res[i] = num.remainder(twopow8).toJSValue();
            num = num.divide(twopow8);
        }
        return res;
    }
    b58.encode_block = function(data, buf, index) {
        if (data.length < 1 || data.length > full_encoded_block_size) {
            throw "Invalid block length: " + data.length;
        }
        var num = uint8_be_to_64(data);
        var i = encoded_block_sizes[data.length] - 1;
        // while num > 0
        while(num.compare(0) === 1){
            var div = num.divRem(alphabet_size);
            // remainder = num % alphabet_size
            var remainder = div[1];
            // num = num / alphabet_size
            num = div[0];
            buf[index + i] = alphabet[remainder.toJSValue()];
            i--;
        }
        return buf;
    };
    b58.encode = function(hex) {
        var data = hextobin(hex);
        if (data.length === 0) {
            return "";
        }
        var full_block_count = Math.floor(data.length / full_block_size);
        var last_block_size = data.length % full_block_size;
        var res_size = full_block_count * full_encoded_block_size + encoded_block_sizes[last_block_size];
        var res = new Uint8Array(res_size);
        var i;
        for(i = 0; i < res_size; ++i){
            res[i] = alphabet[0];
        }
        for(i = 0; i < full_block_count; i++){
            res = b58.encode_block(data.subarray(i * full_block_size, i * full_block_size + full_block_size), res, i * full_encoded_block_size);
        }
        if (last_block_size > 0) {
            res = b58.encode_block(data.subarray(full_block_count * full_block_size, full_block_count * full_block_size + last_block_size), res, full_block_count * full_encoded_block_size);
        }
        return bintostr(res);
    };
    b58.decode_block = function(data, buf, index) {
        if (data.length < 1 || data.length > full_encoded_block_size) {
            throw "Invalid block length: " + data.length;
        }
        var res_size = encoded_block_sizes.indexOf(data.length);
        if (res_size <= 0) {
            throw "Invalid block size";
        }
        var res_num = new JSBigInt(0);
        var order = new JSBigInt(1);
        for(var i = data.length - 1; i >= 0; i--){
            var digit = alphabet.indexOf(data[i]);
            if (digit < 0) {
                throw "Invalid symbol";
            }
            var product = order.multiply(digit).add(res_num);
            // if product > UINT64_MAX
            if (product.compare(UINT64_MAX) === 1) {
                throw "Overflow";
            }
            res_num = product;
            order = order.multiply(alphabet_size);
        }
        if (res_size < full_block_size && new JSBigInt(2).pow(8 * res_size).compare(res_num) <= 0) {
            throw "Overflow 2";
        }
        buf.set(uint64_to_8be(res_num, res_size), index);
        return buf;
    };
    b58.decode = function(enc) {
        enc = strtobin(enc);
        if (enc.length === 0) {
            return "";
        }
        var full_block_count = Math.floor(enc.length / full_encoded_block_size);
        var last_block_size = enc.length % full_encoded_block_size;
        var last_block_decoded_size = encoded_block_sizes.indexOf(last_block_size);
        if (last_block_decoded_size < 0) {
            throw "Invalid encoded length";
        }
        var data_size = full_block_count * full_block_size + last_block_decoded_size;
        var data = new Uint8Array(data_size);
        for(var i = 0; i < full_block_count; i++){
            data = b58.decode_block(enc.subarray(i * full_encoded_block_size, i * full_encoded_block_size + full_encoded_block_size), data, i * full_block_size);
        }
        if (last_block_size > 0) {
            data = b58.decode_block(enc.subarray(full_block_count * full_encoded_block_size, full_block_count * full_encoded_block_size + last_block_size), data, full_block_count * full_block_size);
        }
        return bintohex(data);
    };
    return b58;
}();
module.exports = cnBase58;
}}),
"[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/monero_validator.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
var cryptoUtils = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/utils.js [app-client] (ecmascript)");
var cnBase58 = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/cnBase58.js [app-client] (ecmascript)");
var DEFAULT_NETWORK_TYPE = 'prod';
var addressRegTest = new RegExp('^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{95}$');
var integratedAddressRegTest = new RegExp('^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{106}$');
function validateNetwork(decoded, currency, networkType, addressType) {
    var network = currency.addressTypes;
    if (addressType == 'integrated') {
        network = currency.iAddressTypes;
    }
    var at = parseInt(decoded.substr(0, 2), 16).toString();
    switch(networkType){
        case 'prod':
            return network.prod.indexOf(at) >= 0;
        case 'testnet':
            return network.testnet.indexOf(at) >= 0;
        case 'stagenet':
            return network.stagenet.indexOf(at) >= 0;
        case 'both':
            return network.prod.indexOf(at) >= 0 || network.testnet.indexOf(at) >= 0 || network.stagenet.indexOf(at) >= 0;
        default:
            return false;
    }
}
function hextobin(hex) {
    if (hex.length % 2 !== 0) return null;
    var res = new Uint8Array(hex.length / 2);
    for(var i = 0; i < hex.length / 2; ++i){
        res[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    }
    return res;
}
module.exports = {
    isValidAddress: function(address, currency, opts = {}) {
        const { networkType = DEFAULT_NETWORK_TYPE } = opts;
        var addressType = 'standard';
        if (!addressRegTest.test(address)) {
            if (integratedAddressRegTest.test(address)) {
                addressType = 'integrated';
            } else {
                return false;
            }
        }
        var decodedAddrStr = cnBase58.decode(address);
        if (!decodedAddrStr) return false;
        if (!validateNetwork(decodedAddrStr, currency, networkType, addressType)) return false;
        var addrChecksum = decodedAddrStr.slice(-8);
        var hashChecksum = cryptoUtils.keccak256Checksum(hextobin(decodedAddrStr.slice(0, -8)));
        return addrChecksum === hashChecksum;
    }
};
}}),
"[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/nano_validator.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
var cryptoUtils = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/utils.js [app-client] (ecmascript)");
var baseX = __turbopack_require__("[project]/node_modules/.pnpm/base-x@3.0.10/node_modules/base-x/src/index.js [app-client] (ecmascript)");
var ALLOWED_CHARS = '13456789abcdefghijkmnopqrstuwxyz';
var codec = baseX(ALLOWED_CHARS);
// https://github.com/nanocurrency/raiblocks/wiki/Accounts,-Keys,-Seeds,-and-Wallet-Identifiers
var regexp = new RegExp('^(xrb|nano)_([' + ALLOWED_CHARS + ']{60})$');
module.exports = {
    isValidAddress: function(address) {
        if (regexp.test(address)) {
            return this.verifyChecksum(address);
        }
        return false;
    },
    verifyChecksum: function(address) {
        var bytes = codec.decode(regexp.exec(address)[2]).slice(-37);
        // https://github.com/nanocurrency/raiblocks/blob/master/rai/lib/numbers.cpp#L73
        var computedChecksum = cryptoUtils.blake2b(cryptoUtils.toHex(bytes.slice(0, -5)), 5);
        var checksum = cryptoUtils.toHex(bytes.slice(-5).reverse());
        return computedChecksum === checksum;
    }
};
}}),
"[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/siacoin_validator.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
var cryptoUtils = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/utils.js [app-client] (ecmascript)");
var isEqual = __turbopack_require__("[project]/node_modules/.pnpm/lodash.isequal@4.5.0/node_modules/lodash.isequal/index.js [app-client] (ecmascript)");
function hexToBytes(hex) {
    var bytes = [];
    for(var c = 0; c < hex.length; c += 2){
        bytes.push(parseInt(hex.substr(c, 2), 16));
    }
    return bytes;
}
module.exports = {
    isValidAddress: function(address) {
        if (address.length !== 76) {
            // Check if it has the basic requirements of an address
            return false;
        }
        // Otherwise check each case
        return this.verifyChecksum(address);
    },
    verifyChecksum: function(address) {
        var checksumBytes = address.slice(0, 32 * 2);
        var check = address.slice(32 * 2, 38 * 2);
        var blakeHash = cryptoUtils.blake2b(checksumBytes, 32).slice(0, 6 * 2);
        return !!isEqual(blakeHash, check);
    }
};
}}),
"[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/tron_validator.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
var cryptoUtils = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/utils.js [app-client] (ecmascript)");
function decodeBase58Address(base58Sting) {
    if (typeof base58Sting !== 'string') {
        return false;
    }
    if (base58Sting.length <= 4) {
        return false;
    }
    try {
        var address = cryptoUtils.base58(base58Sting);
    } catch (e) {
        return false;
    }
    /*if (base58Sting.length <= 4) {
        return false;
    }*/ var len = address.length;
    var offset = len - 4;
    var checkSum = address.slice(offset);
    address = address.slice(0, offset);
    var hash0 = cryptoUtils.sha256(cryptoUtils.byteArray2hexStr(address));
    var hash1 = cryptoUtils.hexStr2byteArray(cryptoUtils.sha256(hash0));
    var checkSum1 = hash1.slice(0, 4);
    if (checkSum[0] === checkSum1[0] && checkSum[1] === checkSum1[1] && checkSum[2] === checkSum1[2] && checkSum[3] === checkSum1[3]) {
        return address;
    }
    return false;
}
function getEnv(currency, networkType) {
    var evn = networkType || 'prod';
    if (evn !== 'prod' && evn !== 'testnet') evn = 'prod';
    return currency.addressTypes[evn][0];
}
module.exports = {
    /**
     * tron address validation
     */ isValidAddress: function(mainAddress, currency, opts) {
        var networkType = opts ? opts.networkType : '';
        var address = decodeBase58Address(mainAddress);
        if (!address) {
            return false;
        }
        if (address.length !== 21) {
            return false;
        }
        return getEnv(currency, networkType) === address[0];
    }
};
}}),
"[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/nem_validator.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/next@15.1.3_react-dom@19.0.0_react@19.0.0/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)");
var cryptoUtils = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/utils.js [app-client] (ecmascript)");
/**
* Check if an address is valid
*
* @param {string} _address - An address
*
* @return {boolean} - True if address is valid, false otherwise
*/ var isValidAddress = function(_address) {
    var address = _address.toString().toUpperCase().replace(/-/g, '');
    if (!address || address.length !== 40) {
        return false;
    }
    var decoded = cryptoUtils.toHex(cryptoUtils.base32.b32decode(address));
    var stepThreeChecksum = cryptoUtils.keccak256Checksum(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(decoded.slice(0, 42), 'hex'));
    return stepThreeChecksum === decoded.slice(42);
};
module.exports = {
    isValidAddress: isValidAddress
};
}}),
"[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/bch_validator.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
var cryptoUtils = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/utils.js [app-client] (ecmascript)");
var bech32 = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/bech32.js [app-client] (ecmascript)");
var BTCValidator = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/bitcoin_validator.js [app-client] (ecmascript)");
function validateAddress(address, currency, opts) {
    var networkType = opts ? opts.networkType : '';
    var prefix = 'bitcoincash';
    var regexp = new RegExp(currency.regexp);
    var raw_address;
    var res = address.split(':');
    if (res.length === 1) {
        raw_address = address;
    } else {
        if (res[0] !== 'bitcoincash') {
            return false;
        }
        raw_address = res[1];
    }
    if (!regexp.test(raw_address)) {
        return false;
    }
    if (raw_address.toLowerCase() != raw_address && raw_address.toUpperCase() != raw_address) {
        return false;
    }
    var decoded = cryptoUtils.base32.b32decode(raw_address);
    if (networkType === 'testnet') {
        prefix = 'bchtest';
    }
    try {
        if (bech32.verifyChecksum(prefix, decoded, bech32.encodings.BECH32)) {
            return false;
        }
    } catch (e) {
        return false;
    }
    return true;
}
module.exports = {
    isValidAddress: function(address, currency, networkType) {
        return validateAddress(address, currency, networkType) || BTCValidator.isValidAddress(address, currency, networkType);
    }
};
}}),
"[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/stellar_validator.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
var baseX = __turbopack_require__("[project]/node_modules/.pnpm/base-x@3.0.10/node_modules/base-x/src/index.js [app-client] (ecmascript)");
var crc = __turbopack_require__("[project]/node_modules/.pnpm/crc@3.8.0/node_modules/crc/index.js [app-client] (ecmascript)");
var cryptoUtils = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/utils.js [app-client] (ecmascript)");
var ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
var base32 = baseX(ALPHABET);
var regexp = new RegExp('^[' + ALPHABET + ']{56}$');
var ed25519PublicKeyVersionByte = 6 << 3;
function swap16(number) {
    var lower = number & 0xFF;
    var upper = number >> 8 & 0xFF;
    return lower << 8 | upper;
}
module.exports = {
    isValidAddress: function(address) {
        if (regexp.test(address)) {
            return this.verifyChecksum(address);
        }
        return false;
    },
    verifyChecksum: function(address) {
        // based on https://github.com/stellar/js-stellar-base/blob/master/src/strkey.js#L126
        var bytes = base32.decode(address);
        if (bytes[0] !== ed25519PublicKeyVersionByte) {
            return false;
        }
        var computedChecksum = cryptoUtils.numberToHex(swap16(crc.crc16xmodem(bytes.slice(0, -2))), 4);
        var checksum = cryptoUtils.toHex(bytes.slice(-2));
        return computedChecksum === checksum;
    }
};
}}),
"[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/eos_validator.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
function isValidEOSAddress(address, currency, networkType) {
    var regex = /^[a-z0-9.]+$/g // Must be numbers, lowercase letters and decimal points only
    ;
    if (address.search(regex) !== -1 && address.length === 12) {
        return true;
    } else {
        return false;
    }
}
module.exports = {
    isValidAddress: function(address, currency, networkType) {
        return isValidEOSAddress(address, currency, networkType);
    }
};
}}),
"[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/tezos_validator.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
const base58 = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/base58.js [app-client] (ecmascript)");
const cryptoUtils = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/utils.js [app-client] (ecmascript)");
const prefix = new Uint8Array([
    6,
    161,
    159
]);
function decodeRaw(buffer) {
    let payload = buffer.slice(0, -4);
    let checksum = buffer.slice(-4);
    let newChecksum = cryptoUtils.hexStr2byteArray(cryptoUtils.sha256x2(cryptoUtils.byteArray2hexStr(payload)));
    if (checksum[0] ^ newChecksum[0] | checksum[1] ^ newChecksum[1] | checksum[2] ^ newChecksum[2] | checksum[3] ^ newChecksum[3]) return;
    return payload;
}
const isValidAddress = function(address) {
    try {
        let buffer = base58.decode(address);
        let payload = decodeRaw(buffer);
        if (!payload) return false;
        payload.slice(prefix.length);
        return true;
    } catch (e) {
        return false;
    }
};
module.exports = {
    isValidAddress
};
}}),
"[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/usdt_validator.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
var BTCValidator = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/bitcoin_validator.js [app-client] (ecmascript)");
var ETHValidator = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/ethereum_validator.js [app-client] (ecmascript)");
function checkBothValidators(address, currency, networkType) {
    var result = BTCValidator.isValidAddress(address, currency, networkType);
    return result ? result : ETHValidator.isValidAddress(address, currency, networkType);
}
module.exports = {
    isValidAddress: function(address, currency, opts) {
        if (opts) {
            if (opts.chainType === 'erc20') {
                return ETHValidator.isValidAddress(address, currency, opts.networkType);
            } else if (opts.chainType === 'omni') {
                return BTCValidator.isValidAddress(address, currency, opts.networkType);
            }
        }
        return checkBothValidators(address, currency, opts);
    }
};
}}),
"[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/algo_validator.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
const cryptoUtils = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/utils.js [app-client] (ecmascript)");
const ALGORAND_CHECKSUM_BYTE_LENGTH = 4;
const ALGORAND_ADDRESS_LENGTH = 58;
module.exports = {
    isValidAddress: function(address, currency, opts = {}) {
        const { networkType = 'prod' } = opts;
        return this.verifyChecksum(address);
    },
    verifyChecksum: function(address) {
        if (address.length !== ALGORAND_ADDRESS_LENGTH) {
            return false;
        } else {
            // Decode base32 Address
            const decoded = cryptoUtils.base32.b32decode(address);
            const addr = decoded.slice(0, decoded.length - ALGORAND_CHECKSUM_BYTE_LENGTH);
            const checksum = cryptoUtils.byteArray2hexStr(decoded.slice(-4)).toString('HEX');
            // Hash Address - Checksum
            const code = cryptoUtils.sha512_256(cryptoUtils.byteArray2hexStr(addr)).substr(-ALGORAND_CHECKSUM_BYTE_LENGTH * 2);
            return code === checksum;
        }
    }
};
}}),
"[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/dot_validator.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
const cryptoUtils = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/utils.js [app-client] (ecmascript)");
// from https://github.com/paritytech/substrate/wiki/External-Address-Format-(SS58)
const addressFormats = [
    {
        addressLength: 3,
        accountIndexLength: 1,
        checkSumLength: 1
    },
    {
        addressLength: 4,
        accountIndexLength: 2,
        checkSumLength: 1
    },
    {
        addressLength: 5,
        accountIndexLength: 2,
        checkSumLength: 2
    },
    {
        addressLength: 6,
        accountIndexLength: 4,
        checkSumLength: 1
    },
    {
        addressLength: 7,
        accountIndexLength: 4,
        checkSumLength: 2
    },
    {
        addressLength: 8,
        accountIndexLength: 4,
        checkSumLength: 3
    },
    {
        addressLength: 9,
        accountIndexLength: 4,
        checkSumLength: 4
    },
    {
        addressLength: 10,
        accountIndexLength: 8,
        checkSumLength: 1
    },
    {
        addressLength: 11,
        accountIndexLength: 8,
        checkSumLength: 2
    },
    {
        addressLength: 12,
        accountIndexLength: 8,
        checkSumLength: 3
    },
    {
        addressLength: 13,
        accountIndexLength: 8,
        checkSumLength: 4
    },
    {
        addressLength: 14,
        accountIndexLength: 8,
        checkSumLength: 5
    },
    {
        addressLength: 15,
        accountIndexLength: 8,
        checkSumLength: 6
    },
    {
        addressLength: 16,
        accountIndexLength: 8,
        checkSumLength: 7
    },
    {
        addressLength: 17,
        accountIndexLength: 8,
        checkSumLength: 8
    },
    {
        addressLength: 34,
        accountIndexLength: 32,
        checkSumLength: 2
    }
];
module.exports = {
    isValidAddress: function(address, currency, opts = {}) {
        const { networkType = 'prod' } = opts;
        return this.verifyChecksum(address);
    },
    verifyChecksum: function(address) {
        try {
            const preImage = '53533538505245';
            const decoded = cryptoUtils.base58(address);
            const addressType = cryptoUtils.byteArray2hexStr(decoded.slice(0, 1));
            const addressAndChecksum = decoded.slice(1);
            // get the address format
            const addressFormat = addressFormats.find((af)=>af.addressLength === addressAndChecksum.length);
            if (!addressFormat) {
                throw new Error('Invalid address length');
            }
            const decodedAddress = cryptoUtils.byteArray2hexStr(addressAndChecksum.slice(0, addressFormat.accountIndexLength));
            const checksum = cryptoUtils.byteArray2hexStr(addressAndChecksum.slice(-addressFormat.checkSumLength));
            const calculatedHash = cryptoUtils.blake2b(preImage + addressType + decodedAddress, 64).substr(0, addressFormat.checkSumLength * 2).toUpperCase();
            return calculatedHash == checksum;
        } catch (err) {
            return false;
        }
    }
};
}}),
"[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/base58_validator.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
const base58 = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/crypto/base58.js [app-client] (ecmascript)");
// simple base58 validator.  Just checks if it can be decoded.
module.exports = {
    isValidAddress: function(address, currency, opts = {}) {
        try {
            if (!address || address.length == 0) {
                return false;
            }
            if (currency.minLength && address.length < currency.minLength) {
                return false;
            }
            if (currency.maxLength && address.length > currency.maxLength) {
                return false;
            }
            try {
                const decoded = base58.decode(address);
                if (!decoded || !decoded.length) {
                    return false;
                }
            } catch (e) {
                // if decoding fails, assume invalid address
                return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    }
};
}}),
"[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/currencies.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
var XRPValidator = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/ripple_validator.js [app-client] (ecmascript)");
var ETHValidator = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/ethereum_validator.js [app-client] (ecmascript)");
var BTCValidator = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/bitcoin_validator.js [app-client] (ecmascript)");
var ADAValidator = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/ada_validator.js [app-client] (ecmascript)");
var XMRValidator = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/monero_validator.js [app-client] (ecmascript)");
var NANOValidator = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/nano_validator.js [app-client] (ecmascript)");
var SCValidator = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/siacoin_validator.js [app-client] (ecmascript)");
var TRXValidator = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/tron_validator.js [app-client] (ecmascript)");
var NEMValidator = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/nem_validator.js [app-client] (ecmascript)");
var BCHValidator = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/bch_validator.js [app-client] (ecmascript)");
var XLMValidator = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/stellar_validator.js [app-client] (ecmascript)");
var EOSValidator = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/eos_validator.js [app-client] (ecmascript)");
var XTZValidator = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/tezos_validator.js [app-client] (ecmascript)");
var USDTValidator = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/usdt_validator.js [app-client] (ecmascript)");
var AlgoValidator = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/algo_validator.js [app-client] (ecmascript)");
var DotValidator = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/dot_validator.js [app-client] (ecmascript)");
var BIP173Validator = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/bip173_validator.js [app-client] (ecmascript)");
var Base58Validator = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/base58_validator.js [app-client] (ecmascript)");
// defines P2PKH and P2SH address types for standard (prod) and testnet networks
var CURRENCIES = [
    {
        name: 'Bitcoin',
        symbol: 'btc',
        addressTypes: {
            prod: [
                '00',
                '05'
            ],
            testnet: [
                '6f',
                'c4',
                '3c',
                '26'
            ]
        },
        bech32Hrp: {
            prod: [
                'bc'
            ],
            testnet: [
                'tb'
            ]
        },
        validator: BTCValidator
    },
    {
        name: 'BitcoinCash',
        symbol: 'bch',
        regexp: '^[qQpP]{1}[0-9a-zA-Z]{41}$',
        addressTypes: {
            prod: [
                '00',
                '05'
            ],
            testnet: [
                '6f',
                'c4'
            ]
        },
        validator: BCHValidator
    },
    {
        name: 'Bitcoin SV',
        symbol: 'bsv',
        regexp: '^[qQ]{1}[0-9a-zA-Z]{41}$',
        addressTypes: {
            prod: [
                '00',
                '05'
            ],
            testnet: [
                '6f',
                'c4'
            ]
        },
        validator: BCHValidator
    },
    {
        name: 'LiteCoin',
        symbol: 'ltc',
        addressTypes: {
            prod: [
                '30',
                '05',
                '32'
            ],
            testnet: [
                '6f',
                'c4',
                '3a'
            ]
        },
        bech32Hrp: {
            prod: [
                'ltc'
            ],
            testnet: [
                'tltc'
            ]
        },
        validator: BTCValidator
    },
    {
        name: 'PeerCoin',
        symbol: 'ppc',
        addressTypes: {
            prod: [
                '37',
                '75'
            ],
            testnet: [
                '6f',
                'c4'
            ]
        },
        validator: BTCValidator
    },
    {
        name: 'DogeCoin',
        symbol: 'doge',
        addressTypes: {
            prod: [
                '1e',
                '16'
            ],
            testnet: [
                '71',
                'c4'
            ]
        },
        validator: BTCValidator
    },
    {
        name: 'BeaverCoin',
        symbol: 'bvc',
        addressTypes: {
            prod: [
                '19',
                '05'
            ],
            testnet: [
                '6f',
                'c4'
            ]
        },
        validator: BTCValidator
    },
    {
        name: 'FreiCoin',
        symbol: 'frc',
        addressTypes: {
            prod: [
                '00',
                '05'
            ],
            testnet: [
                '6f',
                'c4'
            ]
        },
        validator: BTCValidator
    },
    {
        name: 'ProtoShares',
        symbol: 'pts',
        addressTypes: {
            prod: [
                '38',
                '05'
            ],
            testnet: [
                '6f',
                'c4'
            ]
        },
        validator: BTCValidator
    },
    {
        name: 'MegaCoin',
        symbol: 'mec',
        addressTypes: {
            prod: [
                '32',
                '05'
            ],
            testnet: [
                '6f',
                'c4'
            ]
        },
        validator: BTCValidator
    },
    {
        name: 'PrimeCoin',
        symbol: 'xpm',
        addressTypes: {
            prod: [
                '17',
                '53'
            ],
            testnet: [
                '6f',
                'c4'
            ]
        },
        validator: BTCValidator
    },
    {
        name: 'AuroraCoin',
        symbol: 'aur',
        addressTypes: {
            prod: [
                '17',
                '05'
            ],
            testnet: [
                '6f',
                'c4'
            ]
        },
        validator: BTCValidator
    },
    {
        name: 'NameCoin',
        symbol: 'nmc',
        addressTypes: {
            prod: [
                '34'
            ],
            testnet: []
        },
        validator: BTCValidator
    },
    {
        name: 'BioCoin',
        symbol: 'bio',
        addressTypes: {
            prod: [
                '19',
                '14'
            ],
            testnet: [
                '6f',
                'c4'
            ]
        },
        validator: BTCValidator
    },
    {
        name: 'GarliCoin',
        symbol: 'grlc',
        addressTypes: {
            prod: [
                '26',
                '05'
            ],
            testnet: [
                '6f',
                'c4'
            ]
        },
        validator: BTCValidator
    },
    {
        name: 'VertCoin',
        symbol: 'vtc',
        addressTypes: {
            prod: [
                '0x',
                '47',
                '71',
                '05'
            ],
            testnet: [
                '6f',
                'c4'
            ]
        },
        bech32Hrp: {
            prod: [
                'vtc'
            ],
            testnet: [
                'tvtc'
            ]
        },
        validator: BTCValidator
    },
    {
        name: 'BitcoinGold',
        symbol: 'btg',
        addressTypes: {
            prod: [
                '26',
                '17'
            ],
            testnet: [
                '6f',
                'c4'
            ]
        },
        validator: BTCValidator
    },
    {
        name: 'Komodo',
        symbol: 'kmd',
        addressTypes: {
            prod: [
                '3c',
                '55'
            ],
            testnet: [
                '0',
                '5'
            ]
        },
        validator: BTCValidator
    },
    {
        name: 'BitcoinZ',
        symbol: 'btcz',
        expectedLength: 26,
        addressTypes: {
            prod: [
                '1cb8',
                '1cbd'
            ],
            testnet: [
                '1d25',
                '1cba'
            ]
        },
        validator: BTCValidator
    },
    {
        name: 'BitcoinPrivate',
        symbol: 'btcp',
        expectedLength: 26,
        addressTypes: {
            prod: [
                '1325',
                '13af'
            ],
            testnet: [
                '1957',
                '19e0'
            ]
        },
        validator: BTCValidator
    },
    {
        name: 'Hush',
        symbol: 'hush',
        expectedLength: 26,
        addressTypes: {
            prod: [
                '1cb8',
                '1cbd'
            ],
            testnet: [
                '1d25',
                '1cba'
            ]
        },
        validator: BTCValidator
    },
    {
        name: 'SnowGem',
        symbol: 'sng',
        expectedLength: 26,
        addressTypes: {
            prod: [
                '1c28',
                '1c2d'
            ],
            testnet: [
                '1d25',
                '1cba'
            ]
        },
        validator: BTCValidator
    },
    {
        name: 'ZCash',
        symbol: 'zec',
        expectedLength: 26,
        addressTypes: {
            prod: [
                '1cb8',
                '1cbd'
            ],
            testnet: [
                '1d25',
                '1cba'
            ]
        },
        validator: BTCValidator
    },
    {
        name: 'ZClassic',
        symbol: 'zcl',
        expectedLength: 26,
        addressTypes: {
            prod: [
                '1cb8',
                '1cbd'
            ],
            testnet: [
                '1d25',
                '1cba'
            ]
        },
        validator: BTCValidator
    },
    {
        name: 'ZenCash',
        symbol: 'zen',
        expectedLength: 26,
        addressTypes: {
            prod: [
                '2089',
                '2096'
            ],
            testnet: [
                '2092',
                '2098'
            ]
        },
        validator: BTCValidator
    },
    {
        name: 'VoteCoin',
        symbol: 'vot',
        expectedLength: 26,
        addressTypes: {
            prod: [
                '1cb8',
                '1cbd'
            ],
            testnet: [
                '1d25',
                '1cba'
            ]
        },
        validator: BTCValidator
    },
    {
        name: 'Decred',
        symbol: 'dcr',
        addressTypes: {
            prod: [
                '073f',
                '071a'
            ],
            testnet: [
                '0f21',
                '0efc'
            ]
        },
        hashFunction: 'blake256',
        expectedLength: 26,
        validator: BTCValidator
    },
    {
        name: 'GameCredits',
        symbol: 'game',
        addressTypes: {
            prod: [
                '26',
                '05'
            ],
            testnet: []
        },
        validator: ETHValidator
    },
    {
        name: 'PIVX',
        symbol: 'pivx',
        addressTypes: {
            prod: [
                '1e',
                '0d'
            ],
            testnet: []
        },
        validator: BTCValidator
    },
    {
        name: 'SolarCoin',
        symbol: 'slr',
        addressTypes: {
            prod: [
                '12',
                '05'
            ],
            testnet: []
        },
        validator: BTCValidator
    },
    {
        name: 'DigiByte',
        symbol: 'dgb',
        addressTypes: {
            prod: [
                '1e',
                '3f'
            ],
            testnet: []
        },
        bech32Hrp: {
            prod: [
                'dgb',
                'S'
            ],
            testnet: []
        },
        validator: BTCValidator
    },
    {
        name: 'Tether',
        symbol: 'usdt',
        addressTypes: {
            prod: [
                '00',
                '05'
            ],
            testnet: [
                '6f',
                'c4'
            ]
        },
        validator: USDTValidator
    },
    {
        name: 'Ripple',
        symbol: 'xrp',
        validator: XRPValidator
    },
    {
        name: 'Dash',
        symbol: 'dash',
        addressTypes: {
            prod: [
                '4c',
                '10'
            ],
            testnet: [
                '8c',
                '13'
            ]
        },
        validator: BTCValidator
    },
    {
        name: 'Neo',
        symbol: 'neo',
        addressTypes: {
            prod: [
                '17'
            ],
            testnet: []
        },
        validator: BTCValidator
    },
    {
        name: 'NeoGas',
        symbol: 'gas',
        addressTypes: {
            prod: [
                '17'
            ],
            testnet: []
        },
        validator: BTCValidator
    },
    {
        name: 'Qtum',
        symbol: 'qtum',
        addressTypes: {
            prod: [
                '3a',
                '32'
            ],
            testnet: [
                '78',
                '6e'
            ]
        },
        validator: BTCValidator
    },
    {
        name: 'Waves',
        symbol: 'waves',
        addressTypes: {
            prod: [
                '0157'
            ],
            testnet: [
                '0154'
            ]
        },
        expectedLength: 26,
        hashFunction: 'blake256keccak256',
        regex: /^[a-zA-Z0-9]{35}$/,
        validator: BTCValidator
    },
    {
        name: 'Ethereum',
        symbol: 'eth',
        validator: ETHValidator
    },
    {
        name: 'EthereumPow',
        symbol: 'ethw',
        validator: ETHValidator
    },
    {
        name: 'EtherZero',
        symbol: 'etz',
        validator: ETHValidator
    },
    {
        name: 'EthereumClassic',
        symbol: 'etc',
        validator: ETHValidator
    },
    {
        name: 'Celo',
        symbol: 'celo',
        validator: ETHValidator
    },
    {
        name: 'Callisto',
        symbol: 'clo',
        validator: ETHValidator
    },
    {
        name: 'Bankex',
        symbol: 'bkx',
        validator: ETHValidator
    },
    {
        name: 'Cardano',
        symbol: 'ada',
        bech32Hrp: {
            prod: [
                'addr'
            ],
            testnet: [
                'addr'
            ]
        },
        validator: ADAValidator
    },
    {
        name: 'Monero',
        symbol: 'xmr',
        addressTypes: {
            prod: [
                '18',
                '42'
            ],
            testnet: [
                '53',
                '63'
            ],
            stagenet: [
                '24'
            ]
        },
        iAddressTypes: {
            prod: [
                '19'
            ],
            testnet: [
                '54'
            ],
            stagenet: [
                '25'
            ]
        },
        validator: XMRValidator
    },
    {
        name: 'Aragon',
        symbol: 'ant',
        validator: ETHValidator
    },
    {
        name: 'Basic Attention Token',
        symbol: 'bat',
        validator: ETHValidator
    },
    {
        name: 'Bancor',
        symbol: 'bnt',
        validator: ETHValidator
    },
    {
        name: 'Civic',
        symbol: 'cvc',
        validator: ETHValidator
    },
    {
        name: 'District0x',
        symbol: 'dnt',
        validator: ETHValidator
    },
    {
        name: 'Gnosis',
        symbol: 'gno',
        validator: ETHValidator
    },
    {
        name: 'Golem (GNT)',
        symbol: 'gnt',
        validator: ETHValidator
    },
    {
        name: 'Golem',
        symbol: 'glm',
        validator: ETHValidator
    },
    {
        name: 'Matchpool',
        symbol: 'gup',
        validator: ETHValidator
    },
    {
        name: 'Melon',
        symbol: 'mln',
        validator: ETHValidator
    },
    {
        name: 'Numeraire',
        symbol: 'nmr',
        validator: ETHValidator
    },
    {
        name: 'OmiseGO',
        symbol: 'omg',
        validator: ETHValidator
    },
    {
        name: 'TenX',
        symbol: 'pay',
        validator: ETHValidator
    },
    {
        name: 'Ripio Credit Network',
        symbol: 'rcn',
        validator: ETHValidator
    },
    {
        name: 'Augur',
        symbol: 'rep',
        validator: ETHValidator
    },
    {
        name: 'iExec RLC',
        symbol: 'rlc',
        validator: ETHValidator
    },
    {
        name: 'Salt',
        symbol: 'salt',
        validator: ETHValidator
    },
    {
        name: 'Status',
        symbol: 'snt',
        validator: ETHValidator
    },
    {
        name: 'Storj',
        symbol: 'storj',
        validator: ETHValidator
    },
    {
        name: 'Swarm City',
        symbol: 'swt',
        validator: ETHValidator
    },
    {
        name: 'TrueUSD',
        symbol: 'tusd',
        validator: ETHValidator
    },
    {
        name: 'Wings',
        symbol: 'wings',
        validator: ETHValidator
    },
    {
        name: '0x',
        symbol: 'zrx',
        validator: ETHValidator
    },
    {
        name: 'Expanse',
        symbol: 'exp',
        validator: ETHValidator
    },
    {
        name: 'Viberate',
        symbol: 'vib',
        validator: ETHValidator
    },
    {
        name: 'Odyssey',
        symbol: 'ocn',
        validator: ETHValidator
    },
    {
        name: 'Polymath',
        symbol: 'poly',
        validator: ETHValidator
    },
    {
        name: 'Storm',
        symbol: 'storm',
        validator: ETHValidator
    },
    {
        name: 'Nano',
        symbol: 'nano',
        validator: NANOValidator
    },
    {
        name: 'RaiBlocks',
        symbol: 'xrb',
        validator: NANOValidator
    },
    {
        name: 'Siacoin',
        symbol: 'sc',
        validator: SCValidator
    },
    {
        name: 'HyperSpace',
        symbol: 'xsc',
        validator: SCValidator
    },
    {
        name: 'loki',
        symbol: 'loki',
        addressTypes: {
            prod: [
                '114',
                '115',
                '116'
            ],
            testnet: []
        },
        iAddressTypes: {
            prod: [
                '115'
            ],
            testnet: []
        },
        validator: XMRValidator
    },
    {
        name: 'LBRY Credits',
        symbol: 'lbc',
        addressTypes: {
            prod: [
                '55'
            ],
            testnet: []
        },
        validator: BTCValidator
    },
    {
        name: 'Tron',
        symbol: 'trx',
        addressTypes: {
            prod: [
                0x41
            ],
            testnet: [
                0xa0
            ]
        },
        validator: TRXValidator
    },
    {
        name: 'Nem',
        symbol: 'xem',
        validator: NEMValidator
    },
    {
        name: 'Stellar',
        symbol: 'xlm',
        validator: XLMValidator
    },
    {
        name: 'BTU Protocol',
        symbol: 'btu',
        validator: ETHValidator
    },
    {
        name: 'Crypto.com Coin',
        symbol: 'cro',
        bech32Hrp: {
            prod: [
                'cro'
            ],
            testnet: [
                'tcro'
            ]
        },
        validator: BIP173Validator
    },
    {
        name: 'Multi-collateral DAI',
        symbol: 'dai',
        validator: ETHValidator
    },
    {
        name: 'Enjin Coin',
        symbol: 'enj',
        validator: ETHValidator
    },
    {
        name: 'HedgeTrade',
        symbol: 'hedg',
        validator: ETHValidator
    },
    {
        name: 'Cred',
        symbol: 'lba',
        validator: ETHValidator
    },
    {
        name: 'Chainlink',
        symbol: 'link',
        validator: ETHValidator
    },
    {
        name: 'Loom Network',
        symbol: 'loom',
        validator: ETHValidator
    },
    {
        name: 'Maker',
        symbol: 'mkr',
        validator: ETHValidator
    },
    {
        name: 'Metal',
        symbol: 'mtl',
        validator: ETHValidator
    },
    {
        name: 'Ocean Protocol',
        symbol: 'ocean',
        validator: ETHValidator
    },
    {
        name: 'Quant',
        symbol: 'qnt',
        validator: ETHValidator
    },
    {
        name: 'Synthetix Network',
        symbol: 'snx',
        validator: ETHValidator
    },
    {
        name: 'SOLVE',
        symbol: 'solve',
        validator: ETHValidator
    },
    {
        name: 'Spendcoin',
        symbol: 'spnd',
        validator: ETHValidator
    },
    {
        name: 'TEMCO',
        symbol: 'temco',
        validator: ETHValidator
    },
    {
        name: 'EOS',
        symbol: 'eos',
        validator: EOSValidator
    },
    {
        name: 'Tezos',
        symbol: 'xtz',
        validator: XTZValidator
    },
    {
        name: 'VeChain',
        symbol: 'vet',
        validator: ETHValidator
    },
    {
        name: 'StormX',
        symbol: 'stmx',
        validator: ETHValidator
    },
    {
        name: 'AugurV2',
        symbol: 'repv2',
        validator: ETHValidator
    },
    {
        name: 'FirmaChain',
        symbol: 'fct',
        validator: ETHValidator
    },
    {
        name: 'BlockTrade',
        symbol: 'btt',
        validator: ETHValidator
    },
    {
        name: 'Quantum Resistant Ledger',
        symbol: 'qrl',
        validator: ETHValidator
    },
    {
        name: 'Serve',
        symbol: 'serv',
        validator: ETHValidator
    },
    {
        name: 'Tap',
        symbol: 'xtp',
        validator: ETHValidator
    },
    {
        name: 'Compound',
        symbol: 'comp',
        validator: ETHValidator
    },
    {
        name: 'Paxos',
        symbol: 'pax',
        validator: ETHValidator
    },
    {
        name: 'USD Coin',
        symbol: 'usdc',
        validator: ETHValidator
    },
    {
        name: 'CUSD',
        symbol: 'cusd',
        validator: ETHValidator
    },
    {
        name: 'Algorand',
        symbol: 'algo',
        validator: AlgoValidator
    },
    {
        name: 'Polkadot',
        symbol: 'dot',
        validator: DotValidator
    },
    {
        name: 'Uniswap Coin',
        symbol: 'uni',
        validator: ETHValidator
    },
    {
        name: 'Aave Coin',
        symbol: 'aave',
        validator: ETHValidator
    },
    {
        name: 'Matic',
        symbol: 'matic',
        validator: ETHValidator
    },
    {
        name: 'Decentraland',
        symbol: 'mana',
        validator: ETHValidator
    },
    {
        name: 'Solana',
        symbol: 'sol',
        validator: Base58Validator,
        maxLength: 44,
        minLength: 43
    },
    {
        name: 'Bonk',
        symbol: 'bonk',
        validator: Base58Validator,
        maxLength: 44,
        minLength: 43
    },
    {
        name: 'Binance',
        symbol: 'bnb',
        validator: ETHValidator
    },
    {
        name: 'Avalanche',
        symbol: 'avax',
        validator: ETHValidator
    },
    {
        name: 'Flare',
        symbol: 'flr',
        validator: ETHValidator
    },
    {
        name: 'Yearn.finance',
        symbol: 'yfi',
        validator: ETHValidator
    },
    {
        name: 'Optimism',
        symbol: 'op',
        validator: ETHValidator
    },
    {
        name: 'Lido DAO Token',
        symbol: 'ldo',
        validator: ETHValidator
    },
    {
        name: 'Curve DAO',
        symbol: 'crv',
        validator: ETHValidator
    },
    {
        name: 'Arbitrum',
        symbol: 'arb',
        validator: ETHValidator
    },
    {
        name: 'Hashflow',
        symbol: 'hft',
        validator: ETHValidator
    },
    {
        name: 'Apecoin',
        symbol: 'ape',
        validator: ETHValidator
    },
    {
        name: 'Band Protocol',
        symbol: 'band',
        validator: ETHValidator
    },
    {
        name: 'The Graph',
        symbol: 'grt',
        validator: ETHValidator
    },
    {
        name: 'Magic',
        symbol: 'magic',
        validator: ETHValidator
    },
    {
        name: 'Biconomy',
        symbol: 'bico',
        validator: ETHValidator
    },
    {
        name: 'API3',
        symbol: 'api3',
        validator: ETHValidator
    },
    {
        name: 'Axie Infinity',
        symbol: 'axs',
        validator: ETHValidator
    },
    {
        name: 'Blur',
        symbol: 'blur',
        validator: ETHValidator
    },
    {
        name: 'Chiliz',
        symbol: 'chz',
        validator: ETHValidator
    },
    {
        name: 'Ethereum Name Service',
        symbol: 'ens',
        validator: ETHValidator
    },
    {
        name: 'Fetch.ai',
        symbol: 'fet',
        validator: ETHValidator
    },
    {
        name: 'Illuvium',
        symbol: 'ilv',
        validator: ETHValidator
    },
    {
        name: 'Injective',
        symbol: 'inj',
        validator: ETHValidator
    },
    {
        name: 'Immutable',
        symbol: 'imx',
        validator: ETHValidator
    },
    {
        name: 'Mask Network',
        symbol: 'mask',
        validator: ETHValidator
    },
    {
        name: 'Origin Protocol',
        symbol: 'ogn',
        validator: ETHValidator
    },
    {
        name: 'Onyx Protocol',
        symbol: 'xcn',
        validator: ETHValidator
    },
    {
        name: 'Unifi Protocol DAO',
        symbol: 'unfi',
        validator: ETHValidator
    },
    {
        name: 'Tellor',
        symbol: 'trb',
        validator: ETHValidator
    },
    {
        name: 'SuperVerse',
        symbol: 'super',
        validator: ETHValidator
    },
    {
        name: 'Skale',
        symbol: 'skl',
        validator: ETHValidator
    },
    {
        name: 'The Sandbox',
        symbol: 'sand',
        validator: ETHValidator
    },
    {
        name: 'Vulcan Forged PYR',
        symbol: 'pyr',
        validator: ETHValidator
    },
    {
        name: 'Marlin',
        symbol: 'pond',
        validator: ETHValidator
    },
    {
        name: 'PayPal USD',
        symbol: 'pyusd',
        validator: ETHValidator
    }
];
module.exports = {
    getByNameOrSymbol: function(currencyNameOrSymbol) {
        var nameOrSymbol = currencyNameOrSymbol.toLowerCase();
        return CURRENCIES.find(function(currency) {
            return currency.name.toLowerCase() === nameOrSymbol || currency.symbol.toLowerCase() === nameOrSymbol;
        });
    },
    getAll: function() {
        return CURRENCIES;
    }
}; ////spit out details for readme.md
 // CURRENCIES
 //     .sort((a, b) => a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1)
 //     .forEach(c => console.log(`* ${c.name}/${c.symbol} \`'${c.name}'\` or \`'${c.symbol}'\` `));
 ////spit out keywords for package.json
 // CURRENCIES
 //     .sort((a, b) => a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1)
 //     .forEach(c => console.log(`"${c.name}","${c.symbol}",`));
 //
}}),
"[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/wallet_address_validator.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
var currencies = __turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/currencies.js [app-client] (ecmascript)");
var DEFAULT_CURRENCY_NAME = 'bitcoin';
module.exports = {
    //validate: function (address, currencyNameOrSymbol, networkType) {
    validate: function(address, currencyNameOrSymbol, opts) {
        var currency = currencies.getByNameOrSymbol(currencyNameOrSymbol || DEFAULT_CURRENCY_NAME);
        if (currency && currency.validator) {
            if (opts && typeof opts === 'string') {
                return currency.validator.isValidAddress(address, currency, {
                    networkType: opts
                });
            }
            return currency.validator.isValidAddress(address, currency, opts);
        }
        throw new Error('Missing validator for currency: ' + currencyNameOrSymbol);
    },
    getCurrencies: function() {
        return currencies.getAll();
    },
    findCurrency: function(symbol) {
        return currencies.getByNameOrSymbol(symbol) || null;
    }
};
}}),
}]);

//# sourceMappingURL=3d2fa_multicoin-address-validator_src_34d42e._.js.map