module.exports = {

"[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/_version.js [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "version": (()=>version)
});
const version = "abi/5.7.0"; //# sourceMappingURL=_version.js.map
}}),
"[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/coders/abstract-coder.js [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "Coder": (()=>Coder),
    "Reader": (()=>Reader),
    "Writer": (()=>Writer),
    "checkResultErrors": (()=>checkResultErrors)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+properties@5.7.0/node_modules/@ethersproject/properties/lib.esm/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+bytes@5.7.0/node_modules/@ethersproject/bytes/lib.esm/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+bignumber@5.7.0/node_modules/@ethersproject/bignumber/lib.esm/bignumber.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+logger@5.7.0/node_modules/@ethersproject/logger/lib.esm/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/_version.js [app-rsc] (ecmascript)");
"use strict";
;
;
;
;
;
const logger = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Logger"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["version"]);
function checkResultErrors(result) {
    // Find the first error (if any)
    const errors = [];
    const checkErrors = function(path, object) {
        if (!Array.isArray(object)) {
            return;
        }
        for(let key in object){
            const childPath = path.slice();
            childPath.push(key);
            try {
                checkErrors(childPath, object[key]);
            } catch (error) {
                errors.push({
                    path: childPath,
                    error: error
                });
            }
        }
    };
    checkErrors([], result);
    return errors;
}
class Coder {
    constructor(name, type, localName, dynamic){
        // @TODO: defineReadOnly these
        this.name = name;
        this.type = type;
        this.localName = localName;
        this.dynamic = dynamic;
    }
    _throwError(message, value) {
        logger.throwArgumentError(message, this.localName, value);
    }
}
class Writer {
    constructor(wordSize){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "wordSize", wordSize || 32);
        this._data = [];
        this._dataLength = 0;
        this._padding = new Uint8Array(wordSize);
    }
    get data() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hexConcat"])(this._data);
    }
    get length() {
        return this._dataLength;
    }
    _writeData(data) {
        this._data.push(data);
        this._dataLength += data.length;
        return data.length;
    }
    appendWriter(writer) {
        return this._writeData((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["concat"])(writer._data));
    }
    // Arrayish items; padded on the right to wordSize
    writeBytes(value) {
        let bytes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["arrayify"])(value);
        const paddingOffset = bytes.length % this.wordSize;
        if (paddingOffset) {
            bytes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["concat"])([
                bytes,
                this._padding.slice(paddingOffset)
            ]);
        }
        return this._writeData(bytes);
    }
    _getValue(value) {
        let bytes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["arrayify"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BigNumber"].from(value));
        if (bytes.length > this.wordSize) {
            logger.throwError("value out-of-bounds", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Logger"].errors.BUFFER_OVERRUN, {
                length: this.wordSize,
                offset: bytes.length
            });
        }
        if (bytes.length % this.wordSize) {
            bytes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["concat"])([
                this._padding.slice(bytes.length % this.wordSize),
                bytes
            ]);
        }
        return bytes;
    }
    // BigNumberish items; padded on the left to wordSize
    writeValue(value) {
        return this._writeData(this._getValue(value));
    }
    writeUpdatableValue() {
        const offset = this._data.length;
        this._data.push(this._padding);
        this._dataLength += this.wordSize;
        return (value)=>{
            this._data[offset] = this._getValue(value);
        };
    }
}
class Reader {
    constructor(data, wordSize, coerceFunc, allowLoose){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "_data", (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["arrayify"])(data));
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "wordSize", wordSize || 32);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "_coerceFunc", coerceFunc);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "allowLoose", allowLoose);
        this._offset = 0;
    }
    get data() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hexlify"])(this._data);
    }
    get consumed() {
        return this._offset;
    }
    // The default Coerce function
    static coerce(name, value) {
        let match = name.match("^u?int([0-9]+)$");
        if (match && parseInt(match[1]) <= 48) {
            value = value.toNumber();
        }
        return value;
    }
    coerce(name, value) {
        if (this._coerceFunc) {
            return this._coerceFunc(name, value);
        }
        return Reader.coerce(name, value);
    }
    _peekBytes(offset, length, loose) {
        let alignedLength = Math.ceil(length / this.wordSize) * this.wordSize;
        if (this._offset + alignedLength > this._data.length) {
            if (this.allowLoose && loose && this._offset + length <= this._data.length) {
                alignedLength = length;
            } else {
                logger.throwError("data out-of-bounds", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Logger"].errors.BUFFER_OVERRUN, {
                    length: this._data.length,
                    offset: this._offset + alignedLength
                });
            }
        }
        return this._data.slice(this._offset, this._offset + alignedLength);
    }
    subReader(offset) {
        return new Reader(this._data.slice(this._offset + offset), this.wordSize, this._coerceFunc, this.allowLoose);
    }
    readBytes(length, loose) {
        let bytes = this._peekBytes(0, length, !!loose);
        this._offset += bytes.length;
        // @TODO: Make sure the length..end bytes are all 0?
        return bytes.slice(0, length);
    }
    readValue() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BigNumber"].from(this.readBytes(this.wordSize));
    }
} //# sourceMappingURL=abstract-coder.js.map
}}),
"[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/fragments.js [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "ConstructorFragment": (()=>ConstructorFragment),
    "ErrorFragment": (()=>ErrorFragment),
    "EventFragment": (()=>EventFragment),
    "FormatTypes": (()=>FormatTypes),
    "Fragment": (()=>Fragment),
    "FunctionFragment": (()=>FunctionFragment),
    "ParamType": (()=>ParamType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+logger@5.7.0/node_modules/@ethersproject/logger/lib.esm/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/_version.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+properties@5.7.0/node_modules/@ethersproject/properties/lib.esm/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+bignumber@5.7.0/node_modules/@ethersproject/bignumber/lib.esm/bignumber.js [app-rsc] (ecmascript)");
"use strict";
;
;
;
;
const logger = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Logger"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["version"]);
;
const _constructorGuard = {};
let ModifiersBytes = {
    calldata: true,
    memory: true,
    storage: true
};
let ModifiersNest = {
    calldata: true,
    memory: true
};
function checkModifier(type, name) {
    if (type === "bytes" || type === "string") {
        if (ModifiersBytes[name]) {
            return true;
        }
    } else if (type === "address") {
        if (name === "payable") {
            return true;
        }
    } else if (type.indexOf("[") >= 0 || type === "tuple") {
        if (ModifiersNest[name]) {
            return true;
        }
    }
    if (ModifiersBytes[name] || name === "payable") {
        logger.throwArgumentError("invalid modifier", "name", name);
    }
    return false;
}
// @TODO: Make sure that children of an indexed tuple are marked with a null indexed
function parseParamType(param, allowIndexed) {
    let originalParam = param;
    function throwError(i) {
        logger.throwArgumentError(`unexpected character at position ${i}`, "param", param);
    }
    param = param.replace(/\s/g, " ");
    function newNode(parent) {
        let node = {
            type: "",
            name: "",
            parent: parent,
            state: {
                allowType: true
            }
        };
        if (allowIndexed) {
            node.indexed = false;
        }
        return node;
    }
    let parent = {
        type: "",
        name: "",
        state: {
            allowType: true
        }
    };
    let node = parent;
    for(let i = 0; i < param.length; i++){
        let c = param[i];
        switch(c){
            case "(":
                if (node.state.allowType && node.type === "") {
                    node.type = "tuple";
                } else if (!node.state.allowParams) {
                    throwError(i);
                }
                node.state.allowType = false;
                node.type = verifyType(node.type);
                node.components = [
                    newNode(node)
                ];
                node = node.components[0];
                break;
            case ")":
                delete node.state;
                if (node.name === "indexed") {
                    if (!allowIndexed) {
                        throwError(i);
                    }
                    node.indexed = true;
                    node.name = "";
                }
                if (checkModifier(node.type, node.name)) {
                    node.name = "";
                }
                node.type = verifyType(node.type);
                let child = node;
                node = node.parent;
                if (!node) {
                    throwError(i);
                }
                delete child.parent;
                node.state.allowParams = false;
                node.state.allowName = true;
                node.state.allowArray = true;
                break;
            case ",":
                delete node.state;
                if (node.name === "indexed") {
                    if (!allowIndexed) {
                        throwError(i);
                    }
                    node.indexed = true;
                    node.name = "";
                }
                if (checkModifier(node.type, node.name)) {
                    node.name = "";
                }
                node.type = verifyType(node.type);
                let sibling = newNode(node.parent);
                //{ type: "", name: "", parent: node.parent, state: { allowType: true } };
                node.parent.components.push(sibling);
                delete node.parent;
                node = sibling;
                break;
            // Hit a space...
            case " ":
                // If reading type, the type is done and may read a param or name
                if (node.state.allowType) {
                    if (node.type !== "") {
                        node.type = verifyType(node.type);
                        delete node.state.allowType;
                        node.state.allowName = true;
                        node.state.allowParams = true;
                    }
                }
                // If reading name, the name is done
                if (node.state.allowName) {
                    if (node.name !== "") {
                        if (node.name === "indexed") {
                            if (!allowIndexed) {
                                throwError(i);
                            }
                            if (node.indexed) {
                                throwError(i);
                            }
                            node.indexed = true;
                            node.name = "";
                        } else if (checkModifier(node.type, node.name)) {
                            node.name = "";
                        } else {
                            node.state.allowName = false;
                        }
                    }
                }
                break;
            case "[":
                if (!node.state.allowArray) {
                    throwError(i);
                }
                node.type += c;
                node.state.allowArray = false;
                node.state.allowName = false;
                node.state.readArray = true;
                break;
            case "]":
                if (!node.state.readArray) {
                    throwError(i);
                }
                node.type += c;
                node.state.readArray = false;
                node.state.allowArray = true;
                node.state.allowName = true;
                break;
            default:
                if (node.state.allowType) {
                    node.type += c;
                    node.state.allowParams = true;
                    node.state.allowArray = true;
                } else if (node.state.allowName) {
                    node.name += c;
                    delete node.state.allowArray;
                } else if (node.state.readArray) {
                    node.type += c;
                } else {
                    throwError(i);
                }
        }
    }
    if (node.parent) {
        logger.throwArgumentError("unexpected eof", "param", param);
    }
    delete parent.state;
    if (node.name === "indexed") {
        if (!allowIndexed) {
            throwError(originalParam.length - 7);
        }
        if (node.indexed) {
            throwError(originalParam.length - 7);
        }
        node.indexed = true;
        node.name = "";
    } else if (checkModifier(node.type, node.name)) {
        node.name = "";
    }
    parent.type = verifyType(parent.type);
    return parent;
}
function populate(object, params) {
    for(let key in params){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["defineReadOnly"])(object, key, params[key]);
    }
}
const FormatTypes = Object.freeze({
    // Bare formatting, as is needed for computing a sighash of an event or function
    sighash: "sighash",
    // Human-Readable with Minimal spacing and without names (compact human-readable)
    minimal: "minimal",
    // Human-Readable with nice spacing, including all names
    full: "full",
    // JSON-format a la Solidity
    json: "json"
});
const paramTypeArray = new RegExp(/^(.*)\[([0-9]*)\]$/);
class ParamType {
    constructor(constructorGuard, params){
        if (constructorGuard !== _constructorGuard) {
            logger.throwError("use fromString", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Logger"].errors.UNSUPPORTED_OPERATION, {
                operation: "new ParamType()"
            });
        }
        populate(this, params);
        let match = this.type.match(paramTypeArray);
        if (match) {
            populate(this, {
                arrayLength: parseInt(match[2] || "-1"),
                arrayChildren: ParamType.fromObject({
                    type: match[1],
                    components: this.components
                }),
                baseType: "array"
            });
        } else {
            populate(this, {
                arrayLength: null,
                arrayChildren: null,
                baseType: this.components != null ? "tuple" : this.type
            });
        }
        this._isParamType = true;
        Object.freeze(this);
    }
    // Format the parameter fragment
    //   - sighash: "(uint256,address)"
    //   - minimal: "tuple(uint256,address) indexed"
    //   - full:    "tuple(uint256 foo, address bar) indexed baz"
    format(format) {
        if (!format) {
            format = FormatTypes.sighash;
        }
        if (!FormatTypes[format]) {
            logger.throwArgumentError("invalid format type", "format", format);
        }
        if (format === FormatTypes.json) {
            let result = {
                type: this.baseType === "tuple" ? "tuple" : this.type,
                name: this.name || undefined
            };
            if (typeof this.indexed === "boolean") {
                result.indexed = this.indexed;
            }
            if (this.components) {
                result.components = this.components.map((comp)=>JSON.parse(comp.format(format)));
            }
            return JSON.stringify(result);
        }
        let result = "";
        // Array
        if (this.baseType === "array") {
            result += this.arrayChildren.format(format);
            result += "[" + (this.arrayLength < 0 ? "" : String(this.arrayLength)) + "]";
        } else {
            if (this.baseType === "tuple") {
                if (format !== FormatTypes.sighash) {
                    result += this.type;
                }
                result += "(" + this.components.map((comp)=>comp.format(format)).join(format === FormatTypes.full ? ", " : ",") + ")";
            } else {
                result += this.type;
            }
        }
        if (format !== FormatTypes.sighash) {
            if (this.indexed === true) {
                result += " indexed";
            }
            if (format === FormatTypes.full && this.name) {
                result += " " + this.name;
            }
        }
        return result;
    }
    static from(value, allowIndexed) {
        if (typeof value === "string") {
            return ParamType.fromString(value, allowIndexed);
        }
        return ParamType.fromObject(value);
    }
    static fromObject(value) {
        if (ParamType.isParamType(value)) {
            return value;
        }
        return new ParamType(_constructorGuard, {
            name: value.name || null,
            type: verifyType(value.type),
            indexed: value.indexed == null ? null : !!value.indexed,
            components: value.components ? value.components.map(ParamType.fromObject) : null
        });
    }
    static fromString(value, allowIndexed) {
        function ParamTypify(node) {
            return ParamType.fromObject({
                name: node.name,
                type: node.type,
                indexed: node.indexed,
                components: node.components
            });
        }
        return ParamTypify(parseParamType(value, !!allowIndexed));
    }
    static isParamType(value) {
        return !!(value != null && value._isParamType);
    }
}
;
function parseParams(value, allowIndex) {
    return splitNesting(value).map((param)=>ParamType.fromString(param, allowIndex));
}
class Fragment {
    constructor(constructorGuard, params){
        if (constructorGuard !== _constructorGuard) {
            logger.throwError("use a static from method", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Logger"].errors.UNSUPPORTED_OPERATION, {
                operation: "new Fragment()"
            });
        }
        populate(this, params);
        this._isFragment = true;
        Object.freeze(this);
    }
    static from(value) {
        if (Fragment.isFragment(value)) {
            return value;
        }
        if (typeof value === "string") {
            return Fragment.fromString(value);
        }
        return Fragment.fromObject(value);
    }
    static fromObject(value) {
        if (Fragment.isFragment(value)) {
            return value;
        }
        switch(value.type){
            case "function":
                return FunctionFragment.fromObject(value);
            case "event":
                return EventFragment.fromObject(value);
            case "constructor":
                return ConstructorFragment.fromObject(value);
            case "error":
                return ErrorFragment.fromObject(value);
            case "fallback":
            case "receive":
                // @TODO: Something? Maybe return a FunctionFragment? A custom DefaultFunctionFragment?
                return null;
        }
        return logger.throwArgumentError("invalid fragment object", "value", value);
    }
    static fromString(value) {
        // Make sure the "returns" is surrounded by a space and all whitespace is exactly one space
        value = value.replace(/\s/g, " ");
        value = value.replace(/\(/g, " (").replace(/\)/g, ") ").replace(/\s+/g, " ");
        value = value.trim();
        if (value.split(" ")[0] === "event") {
            return EventFragment.fromString(value.substring(5).trim());
        } else if (value.split(" ")[0] === "function") {
            return FunctionFragment.fromString(value.substring(8).trim());
        } else if (value.split("(")[0].trim() === "constructor") {
            return ConstructorFragment.fromString(value.trim());
        } else if (value.split(" ")[0] === "error") {
            return ErrorFragment.fromString(value.substring(5).trim());
        }
        return logger.throwArgumentError("unsupported fragment", "value", value);
    }
    static isFragment(value) {
        return !!(value && value._isFragment);
    }
}
class EventFragment extends Fragment {
    format(format) {
        if (!format) {
            format = FormatTypes.sighash;
        }
        if (!FormatTypes[format]) {
            logger.throwArgumentError("invalid format type", "format", format);
        }
        if (format === FormatTypes.json) {
            return JSON.stringify({
                type: "event",
                anonymous: this.anonymous,
                name: this.name,
                inputs: this.inputs.map((input)=>JSON.parse(input.format(format)))
            });
        }
        let result = "";
        if (format !== FormatTypes.sighash) {
            result += "event ";
        }
        result += this.name + "(" + this.inputs.map((input)=>input.format(format)).join(format === FormatTypes.full ? ", " : ",") + ") ";
        if (format !== FormatTypes.sighash) {
            if (this.anonymous) {
                result += "anonymous ";
            }
        }
        return result.trim();
    }
    static from(value) {
        if (typeof value === "string") {
            return EventFragment.fromString(value);
        }
        return EventFragment.fromObject(value);
    }
    static fromObject(value) {
        if (EventFragment.isEventFragment(value)) {
            return value;
        }
        if (value.type !== "event") {
            logger.throwArgumentError("invalid event object", "value", value);
        }
        const params = {
            name: verifyIdentifier(value.name),
            anonymous: value.anonymous,
            inputs: value.inputs ? value.inputs.map(ParamType.fromObject) : [],
            type: "event"
        };
        return new EventFragment(_constructorGuard, params);
    }
    static fromString(value) {
        let match = value.match(regexParen);
        if (!match) {
            logger.throwArgumentError("invalid event string", "value", value);
        }
        let anonymous = false;
        match[3].split(" ").forEach((modifier)=>{
            switch(modifier.trim()){
                case "anonymous":
                    anonymous = true;
                    break;
                case "":
                    break;
                default:
                    logger.warn("unknown modifier: " + modifier);
            }
        });
        return EventFragment.fromObject({
            name: match[1].trim(),
            anonymous: anonymous,
            inputs: parseParams(match[2], true),
            type: "event"
        });
    }
    static isEventFragment(value) {
        return value && value._isFragment && value.type === "event";
    }
}
function parseGas(value, params) {
    params.gas = null;
    let comps = value.split("@");
    if (comps.length !== 1) {
        if (comps.length > 2) {
            logger.throwArgumentError("invalid human-readable ABI signature", "value", value);
        }
        if (!comps[1].match(/^[0-9]+$/)) {
            logger.throwArgumentError("invalid human-readable ABI signature gas", "value", value);
        }
        params.gas = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BigNumber"].from(comps[1]);
        return comps[0];
    }
    return value;
}
function parseModifiers(value, params) {
    params.constant = false;
    params.payable = false;
    params.stateMutability = "nonpayable";
    value.split(" ").forEach((modifier)=>{
        switch(modifier.trim()){
            case "constant":
                params.constant = true;
                break;
            case "payable":
                params.payable = true;
                params.stateMutability = "payable";
                break;
            case "nonpayable":
                params.payable = false;
                params.stateMutability = "nonpayable";
                break;
            case "pure":
                params.constant = true;
                params.stateMutability = "pure";
                break;
            case "view":
                params.constant = true;
                params.stateMutability = "view";
                break;
            case "external":
            case "public":
            case "":
                break;
            default:
                console.log("unknown modifier: " + modifier);
        }
    });
}
function verifyState(value) {
    let result = {
        constant: false,
        payable: true,
        stateMutability: "payable"
    };
    if (value.stateMutability != null) {
        result.stateMutability = value.stateMutability;
        // Set (and check things are consistent) the constant property
        result.constant = result.stateMutability === "view" || result.stateMutability === "pure";
        if (value.constant != null) {
            if (!!value.constant !== result.constant) {
                logger.throwArgumentError("cannot have constant function with mutability " + result.stateMutability, "value", value);
            }
        }
        // Set (and check things are consistent) the payable property
        result.payable = result.stateMutability === "payable";
        if (value.payable != null) {
            if (!!value.payable !== result.payable) {
                logger.throwArgumentError("cannot have payable function with mutability " + result.stateMutability, "value", value);
            }
        }
    } else if (value.payable != null) {
        result.payable = !!value.payable;
        // If payable we can assume non-constant; otherwise we can't assume
        if (value.constant == null && !result.payable && value.type !== "constructor") {
            logger.throwArgumentError("unable to determine stateMutability", "value", value);
        }
        result.constant = !!value.constant;
        if (result.constant) {
            result.stateMutability = "view";
        } else {
            result.stateMutability = result.payable ? "payable" : "nonpayable";
        }
        if (result.payable && result.constant) {
            logger.throwArgumentError("cannot have constant payable function", "value", value);
        }
    } else if (value.constant != null) {
        result.constant = !!value.constant;
        result.payable = !result.constant;
        result.stateMutability = result.constant ? "view" : "payable";
    } else if (value.type !== "constructor") {
        logger.throwArgumentError("unable to determine stateMutability", "value", value);
    }
    return result;
}
class ConstructorFragment extends Fragment {
    format(format) {
        if (!format) {
            format = FormatTypes.sighash;
        }
        if (!FormatTypes[format]) {
            logger.throwArgumentError("invalid format type", "format", format);
        }
        if (format === FormatTypes.json) {
            return JSON.stringify({
                type: "constructor",
                stateMutability: this.stateMutability !== "nonpayable" ? this.stateMutability : undefined,
                payable: this.payable,
                gas: this.gas ? this.gas.toNumber() : undefined,
                inputs: this.inputs.map((input)=>JSON.parse(input.format(format)))
            });
        }
        if (format === FormatTypes.sighash) {
            logger.throwError("cannot format a constructor for sighash", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Logger"].errors.UNSUPPORTED_OPERATION, {
                operation: "format(sighash)"
            });
        }
        let result = "constructor(" + this.inputs.map((input)=>input.format(format)).join(format === FormatTypes.full ? ", " : ",") + ") ";
        if (this.stateMutability && this.stateMutability !== "nonpayable") {
            result += this.stateMutability + " ";
        }
        return result.trim();
    }
    static from(value) {
        if (typeof value === "string") {
            return ConstructorFragment.fromString(value);
        }
        return ConstructorFragment.fromObject(value);
    }
    static fromObject(value) {
        if (ConstructorFragment.isConstructorFragment(value)) {
            return value;
        }
        if (value.type !== "constructor") {
            logger.throwArgumentError("invalid constructor object", "value", value);
        }
        let state = verifyState(value);
        if (state.constant) {
            logger.throwArgumentError("constructor cannot be constant", "value", value);
        }
        const params = {
            name: null,
            type: value.type,
            inputs: value.inputs ? value.inputs.map(ParamType.fromObject) : [],
            payable: state.payable,
            stateMutability: state.stateMutability,
            gas: value.gas ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BigNumber"].from(value.gas) : null
        };
        return new ConstructorFragment(_constructorGuard, params);
    }
    static fromString(value) {
        let params = {
            type: "constructor"
        };
        value = parseGas(value, params);
        let parens = value.match(regexParen);
        if (!parens || parens[1].trim() !== "constructor") {
            logger.throwArgumentError("invalid constructor string", "value", value);
        }
        params.inputs = parseParams(parens[2].trim(), false);
        parseModifiers(parens[3].trim(), params);
        return ConstructorFragment.fromObject(params);
    }
    static isConstructorFragment(value) {
        return value && value._isFragment && value.type === "constructor";
    }
}
class FunctionFragment extends ConstructorFragment {
    format(format) {
        if (!format) {
            format = FormatTypes.sighash;
        }
        if (!FormatTypes[format]) {
            logger.throwArgumentError("invalid format type", "format", format);
        }
        if (format === FormatTypes.json) {
            return JSON.stringify({
                type: "function",
                name: this.name,
                constant: this.constant,
                stateMutability: this.stateMutability !== "nonpayable" ? this.stateMutability : undefined,
                payable: this.payable,
                gas: this.gas ? this.gas.toNumber() : undefined,
                inputs: this.inputs.map((input)=>JSON.parse(input.format(format))),
                outputs: this.outputs.map((output)=>JSON.parse(output.format(format)))
            });
        }
        let result = "";
        if (format !== FormatTypes.sighash) {
            result += "function ";
        }
        result += this.name + "(" + this.inputs.map((input)=>input.format(format)).join(format === FormatTypes.full ? ", " : ",") + ") ";
        if (format !== FormatTypes.sighash) {
            if (this.stateMutability) {
                if (this.stateMutability !== "nonpayable") {
                    result += this.stateMutability + " ";
                }
            } else if (this.constant) {
                result += "view ";
            }
            if (this.outputs && this.outputs.length) {
                result += "returns (" + this.outputs.map((output)=>output.format(format)).join(", ") + ") ";
            }
            if (this.gas != null) {
                result += "@" + this.gas.toString() + " ";
            }
        }
        return result.trim();
    }
    static from(value) {
        if (typeof value === "string") {
            return FunctionFragment.fromString(value);
        }
        return FunctionFragment.fromObject(value);
    }
    static fromObject(value) {
        if (FunctionFragment.isFunctionFragment(value)) {
            return value;
        }
        if (value.type !== "function") {
            logger.throwArgumentError("invalid function object", "value", value);
        }
        let state = verifyState(value);
        const params = {
            type: value.type,
            name: verifyIdentifier(value.name),
            constant: state.constant,
            inputs: value.inputs ? value.inputs.map(ParamType.fromObject) : [],
            outputs: value.outputs ? value.outputs.map(ParamType.fromObject) : [],
            payable: state.payable,
            stateMutability: state.stateMutability,
            gas: value.gas ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BigNumber"].from(value.gas) : null
        };
        return new FunctionFragment(_constructorGuard, params);
    }
    static fromString(value) {
        let params = {
            type: "function"
        };
        value = parseGas(value, params);
        let comps = value.split(" returns ");
        if (comps.length > 2) {
            logger.throwArgumentError("invalid function string", "value", value);
        }
        let parens = comps[0].match(regexParen);
        if (!parens) {
            logger.throwArgumentError("invalid function signature", "value", value);
        }
        params.name = parens[1].trim();
        if (params.name) {
            verifyIdentifier(params.name);
        }
        params.inputs = parseParams(parens[2], false);
        parseModifiers(parens[3].trim(), params);
        // We have outputs
        if (comps.length > 1) {
            let returns = comps[1].match(regexParen);
            if (returns[1].trim() != "" || returns[3].trim() != "") {
                logger.throwArgumentError("unexpected tokens", "value", value);
            }
            params.outputs = parseParams(returns[2], false);
        } else {
            params.outputs = [];
        }
        return FunctionFragment.fromObject(params);
    }
    static isFunctionFragment(value) {
        return value && value._isFragment && value.type === "function";
    }
}
//export class StructFragment extends Fragment {
//}
function checkForbidden(fragment) {
    const sig = fragment.format();
    if (sig === "Error(string)" || sig === "Panic(uint256)") {
        logger.throwArgumentError(`cannot specify user defined ${sig} error`, "fragment", fragment);
    }
    return fragment;
}
class ErrorFragment extends Fragment {
    format(format) {
        if (!format) {
            format = FormatTypes.sighash;
        }
        if (!FormatTypes[format]) {
            logger.throwArgumentError("invalid format type", "format", format);
        }
        if (format === FormatTypes.json) {
            return JSON.stringify({
                type: "error",
                name: this.name,
                inputs: this.inputs.map((input)=>JSON.parse(input.format(format)))
            });
        }
        let result = "";
        if (format !== FormatTypes.sighash) {
            result += "error ";
        }
        result += this.name + "(" + this.inputs.map((input)=>input.format(format)).join(format === FormatTypes.full ? ", " : ",") + ") ";
        return result.trim();
    }
    static from(value) {
        if (typeof value === "string") {
            return ErrorFragment.fromString(value);
        }
        return ErrorFragment.fromObject(value);
    }
    static fromObject(value) {
        if (ErrorFragment.isErrorFragment(value)) {
            return value;
        }
        if (value.type !== "error") {
            logger.throwArgumentError("invalid error object", "value", value);
        }
        const params = {
            type: value.type,
            name: verifyIdentifier(value.name),
            inputs: value.inputs ? value.inputs.map(ParamType.fromObject) : []
        };
        return checkForbidden(new ErrorFragment(_constructorGuard, params));
    }
    static fromString(value) {
        let params = {
            type: "error"
        };
        let parens = value.match(regexParen);
        if (!parens) {
            logger.throwArgumentError("invalid error signature", "value", value);
        }
        params.name = parens[1].trim();
        if (params.name) {
            verifyIdentifier(params.name);
        }
        params.inputs = parseParams(parens[2], false);
        return checkForbidden(ErrorFragment.fromObject(params));
    }
    static isErrorFragment(value) {
        return value && value._isFragment && value.type === "error";
    }
}
function verifyType(type) {
    // These need to be transformed to their full description
    if (type.match(/^uint($|[^1-9])/)) {
        type = "uint256" + type.substring(4);
    } else if (type.match(/^int($|[^1-9])/)) {
        type = "int256" + type.substring(3);
    }
    // @TODO: more verification
    return type;
}
// See: https://github.com/ethereum/solidity/blob/1f8f1a3db93a548d0555e3e14cfc55a10e25b60e/docs/grammar/SolidityLexer.g4#L234
const regexIdentifier = new RegExp("^[a-zA-Z$_][a-zA-Z0-9$_]*$");
function verifyIdentifier(value) {
    if (!value || !value.match(regexIdentifier)) {
        logger.throwArgumentError(`invalid identifier "${value}"`, "value", value);
    }
    return value;
}
const regexParen = new RegExp("^([^)(]*)\\((.*)\\)([^)(]*)$");
function splitNesting(value) {
    value = value.trim();
    let result = [];
    let accum = "";
    let depth = 0;
    for(let offset = 0; offset < value.length; offset++){
        let c = value[offset];
        if (c === "," && depth === 0) {
            result.push(accum);
            accum = "";
        } else {
            accum += c;
            if (c === "(") {
                depth++;
            } else if (c === ")") {
                depth--;
                if (depth === -1) {
                    logger.throwArgumentError("unbalanced parenthesis", "value", value);
                }
            }
        }
    }
    if (accum) {
        result.push(accum);
    }
    return result;
} //# sourceMappingURL=fragments.js.map
}}),
"[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/coders/address.js [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "AddressCoder": (()=>AddressCoder)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$address$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$address$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+address@5.7.0/node_modules/@ethersproject/address/lib.esm/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+bytes@5.7.0/node_modules/@ethersproject/bytes/lib.esm/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$abstract$2d$coder$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/coders/abstract-coder.js [app-rsc] (ecmascript)");
"use strict";
;
;
;
class AddressCoder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$abstract$2d$coder$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Coder"] {
    constructor(localName){
        super("address", "address", localName, false);
    }
    defaultValue() {
        return "0x0000000000000000000000000000000000000000";
    }
    encode(writer, value) {
        try {
            value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$address$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$address$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAddress"])(value);
        } catch (error) {
            this._throwError(error.message, value);
        }
        return writer.writeValue(value);
    }
    decode(reader) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$address$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$address$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAddress"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hexZeroPad"])(reader.readValue().toHexString(), 20));
    }
} //# sourceMappingURL=address.js.map
}}),
"[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/coders/boolean.js [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "BooleanCoder": (()=>BooleanCoder)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$abstract$2d$coder$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/coders/abstract-coder.js [app-rsc] (ecmascript)");
"use strict";
;
class BooleanCoder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$abstract$2d$coder$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Coder"] {
    constructor(localName){
        super("bool", "bool", localName, false);
    }
    defaultValue() {
        return false;
    }
    encode(writer, value) {
        return writer.writeValue(value ? 1 : 0);
    }
    decode(reader) {
        return reader.coerce(this.type, !reader.readValue().isZero());
    }
} //# sourceMappingURL=boolean.js.map
}}),
"[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/coders/bytes.js [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "BytesCoder": (()=>BytesCoder),
    "DynamicBytesCoder": (()=>DynamicBytesCoder)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+bytes@5.7.0/node_modules/@ethersproject/bytes/lib.esm/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$abstract$2d$coder$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/coders/abstract-coder.js [app-rsc] (ecmascript)");
"use strict";
;
;
class DynamicBytesCoder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$abstract$2d$coder$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Coder"] {
    constructor(type, localName){
        super(type, type, localName, true);
    }
    defaultValue() {
        return "0x";
    }
    encode(writer, value) {
        value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["arrayify"])(value);
        let length = writer.writeValue(value.length);
        length += writer.writeBytes(value);
        return length;
    }
    decode(reader) {
        return reader.readBytes(reader.readValue().toNumber(), true);
    }
}
class BytesCoder extends DynamicBytesCoder {
    constructor(localName){
        super("bytes", localName);
    }
    decode(reader) {
        return reader.coerce(this.name, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hexlify"])(super.decode(reader)));
    }
} //# sourceMappingURL=bytes.js.map
}}),
"[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/coders/string.js [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "StringCoder": (()=>StringCoder)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$strings$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$strings$2f$lib$2e$esm$2f$utf8$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+strings@5.7.0/node_modules/@ethersproject/strings/lib.esm/utf8.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$bytes$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/coders/bytes.js [app-rsc] (ecmascript)");
"use strict";
;
;
class StringCoder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$bytes$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DynamicBytesCoder"] {
    constructor(localName){
        super("string", localName);
    }
    defaultValue() {
        return "";
    }
    encode(writer, value) {
        return super.encode(writer, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$strings$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$strings$2f$lib$2e$esm$2f$utf8$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toUtf8Bytes"])(value));
    }
    decode(reader) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$strings$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$strings$2f$lib$2e$esm$2f$utf8$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toUtf8String"])(super.decode(reader));
    }
} //# sourceMappingURL=string.js.map
}}),
"[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/coders/anonymous.js [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "AnonymousCoder": (()=>AnonymousCoder)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$abstract$2d$coder$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/coders/abstract-coder.js [app-rsc] (ecmascript)");
"use strict";
;
class AnonymousCoder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$abstract$2d$coder$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Coder"] {
    constructor(coder){
        super(coder.name, coder.type, undefined, coder.dynamic);
        this.coder = coder;
    }
    defaultValue() {
        return this.coder.defaultValue();
    }
    encode(writer, value) {
        return this.coder.encode(writer, value);
    }
    decode(reader) {
        return this.coder.decode(reader);
    }
} //# sourceMappingURL=anonymous.js.map
}}),
"[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/coders/array.js [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "ArrayCoder": (()=>ArrayCoder),
    "pack": (()=>pack),
    "unpack": (()=>unpack)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+logger@5.7.0/node_modules/@ethersproject/logger/lib.esm/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$anonymous$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/coders/anonymous.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$abstract$2d$coder$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/coders/abstract-coder.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/_version.js [app-rsc] (ecmascript)");
"use strict";
;
;
const logger = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Logger"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["version"]);
;
;
function pack(writer, coders, values) {
    let arrayValues = null;
    if (Array.isArray(values)) {
        arrayValues = values;
    } else if (values && typeof values === "object") {
        let unique = {};
        arrayValues = coders.map((coder)=>{
            const name = coder.localName;
            if (!name) {
                logger.throwError("cannot encode object for signature with missing names", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Logger"].errors.INVALID_ARGUMENT, {
                    argument: "values",
                    coder: coder,
                    value: values
                });
            }
            if (unique[name]) {
                logger.throwError("cannot encode object for signature with duplicate names", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Logger"].errors.INVALID_ARGUMENT, {
                    argument: "values",
                    coder: coder,
                    value: values
                });
            }
            unique[name] = true;
            return values[name];
        });
    } else {
        logger.throwArgumentError("invalid tuple value", "tuple", values);
    }
    if (coders.length !== arrayValues.length) {
        logger.throwArgumentError("types/value length mismatch", "tuple", values);
    }
    let staticWriter = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$abstract$2d$coder$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Writer"](writer.wordSize);
    let dynamicWriter = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$abstract$2d$coder$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Writer"](writer.wordSize);
    let updateFuncs = [];
    coders.forEach((coder, index)=>{
        let value = arrayValues[index];
        if (coder.dynamic) {
            // Get current dynamic offset (for the future pointer)
            let dynamicOffset = dynamicWriter.length;
            // Encode the dynamic value into the dynamicWriter
            coder.encode(dynamicWriter, value);
            // Prepare to populate the correct offset once we are done
            let updateFunc = staticWriter.writeUpdatableValue();
            updateFuncs.push((baseOffset)=>{
                updateFunc(baseOffset + dynamicOffset);
            });
        } else {
            coder.encode(staticWriter, value);
        }
    });
    // Backfill all the dynamic offsets, now that we know the static length
    updateFuncs.forEach((func)=>{
        func(staticWriter.length);
    });
    let length = writer.appendWriter(staticWriter);
    length += writer.appendWriter(dynamicWriter);
    return length;
}
function unpack(reader, coders) {
    let values = [];
    // A reader anchored to this base
    let baseReader = reader.subReader(0);
    coders.forEach((coder)=>{
        let value = null;
        if (coder.dynamic) {
            let offset = reader.readValue();
            let offsetReader = baseReader.subReader(offset.toNumber());
            try {
                value = coder.decode(offsetReader);
            } catch (error) {
                // Cannot recover from this
                if (error.code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Logger"].errors.BUFFER_OVERRUN) {
                    throw error;
                }
                value = error;
                value.baseType = coder.name;
                value.name = coder.localName;
                value.type = coder.type;
            }
        } else {
            try {
                value = coder.decode(reader);
            } catch (error) {
                // Cannot recover from this
                if (error.code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Logger"].errors.BUFFER_OVERRUN) {
                    throw error;
                }
                value = error;
                value.baseType = coder.name;
                value.name = coder.localName;
                value.type = coder.type;
            }
        }
        if (value != undefined) {
            values.push(value);
        }
    });
    // We only output named properties for uniquely named coders
    const uniqueNames = coders.reduce((accum, coder)=>{
        const name = coder.localName;
        if (name) {
            if (!accum[name]) {
                accum[name] = 0;
            }
            accum[name]++;
        }
        return accum;
    }, {});
    // Add any named parameters (i.e. tuples)
    coders.forEach((coder, index)=>{
        let name = coder.localName;
        if (!name || uniqueNames[name] !== 1) {
            return;
        }
        if (name === "length") {
            name = "_length";
        }
        if (values[name] != null) {
            return;
        }
        const value = values[index];
        if (value instanceof Error) {
            Object.defineProperty(values, name, {
                enumerable: true,
                get: ()=>{
                    throw value;
                }
            });
        } else {
            values[name] = value;
        }
    });
    for(let i = 0; i < values.length; i++){
        const value = values[i];
        if (value instanceof Error) {
            Object.defineProperty(values, i, {
                enumerable: true,
                get: ()=>{
                    throw value;
                }
            });
        }
    }
    return Object.freeze(values);
}
class ArrayCoder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$abstract$2d$coder$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Coder"] {
    constructor(coder, length, localName){
        const type = coder.type + "[" + (length >= 0 ? length : "") + "]";
        const dynamic = length === -1 || coder.dynamic;
        super("array", type, localName, dynamic);
        this.coder = coder;
        this.length = length;
    }
    defaultValue() {
        // Verifies the child coder is valid (even if the array is dynamic or 0-length)
        const defaultChild = this.coder.defaultValue();
        const result = [];
        for(let i = 0; i < this.length; i++){
            result.push(defaultChild);
        }
        return result;
    }
    encode(writer, value) {
        if (!Array.isArray(value)) {
            this._throwError("expected array value", value);
        }
        let count = this.length;
        if (count === -1) {
            count = value.length;
            writer.writeValue(value.length);
        }
        logger.checkArgumentCount(value.length, count, "coder array" + (this.localName ? " " + this.localName : ""));
        let coders = [];
        for(let i = 0; i < value.length; i++){
            coders.push(this.coder);
        }
        return pack(writer, coders, value);
    }
    decode(reader) {
        let count = this.length;
        if (count === -1) {
            count = reader.readValue().toNumber();
            // Check that there is *roughly* enough data to ensure
            // stray random data is not being read as a length. Each
            // slot requires at least 32 bytes for their value (or 32
            // bytes as a link to the data). This could use a much
            // tighter bound, but we are erroring on the side of safety.
            if (count * 32 > reader._data.length) {
                logger.throwError("insufficient data length", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Logger"].errors.BUFFER_OVERRUN, {
                    length: reader._data.length,
                    count: count
                });
            }
        }
        let coders = [];
        for(let i = 0; i < count; i++){
            coders.push(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$anonymous$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AnonymousCoder"](this.coder));
        }
        return reader.coerce(this.name, unpack(reader, coders));
    }
} //# sourceMappingURL=array.js.map
}}),
"[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/coders/tuple.js [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "TupleCoder": (()=>TupleCoder)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$array$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/coders/array.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$abstract$2d$coder$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/coders/abstract-coder.js [app-rsc] (ecmascript)");
"use strict";
;
;
class TupleCoder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$abstract$2d$coder$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Coder"] {
    constructor(coders, localName){
        let dynamic = false;
        const types = [];
        coders.forEach((coder)=>{
            if (coder.dynamic) {
                dynamic = true;
            }
            types.push(coder.type);
        });
        const type = "tuple(" + types.join(",") + ")";
        super("tuple", type, localName, dynamic);
        this.coders = coders;
    }
    defaultValue() {
        const values = [];
        this.coders.forEach((coder)=>{
            values.push(coder.defaultValue());
        });
        // We only output named properties for uniquely named coders
        const uniqueNames = this.coders.reduce((accum, coder)=>{
            const name = coder.localName;
            if (name) {
                if (!accum[name]) {
                    accum[name] = 0;
                }
                accum[name]++;
            }
            return accum;
        }, {});
        // Add named values
        this.coders.forEach((coder, index)=>{
            let name = coder.localName;
            if (!name || uniqueNames[name] !== 1) {
                return;
            }
            if (name === "length") {
                name = "_length";
            }
            if (values[name] != null) {
                return;
            }
            values[name] = values[index];
        });
        return Object.freeze(values);
    }
    encode(writer, value) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$array$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["pack"])(writer, this.coders, value);
    }
    decode(reader) {
        return reader.coerce(this.name, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$array$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unpack"])(reader, this.coders));
    }
} //# sourceMappingURL=tuple.js.map
}}),
"[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/coders/null.js [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "NullCoder": (()=>NullCoder)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$abstract$2d$coder$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/coders/abstract-coder.js [app-rsc] (ecmascript)");
"use strict";
;
class NullCoder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$abstract$2d$coder$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Coder"] {
    constructor(localName){
        super("null", "", localName, false);
    }
    defaultValue() {
        return null;
    }
    encode(writer, value) {
        if (value != null) {
            this._throwError("not null", value);
        }
        return writer.writeBytes([]);
    }
    decode(reader) {
        reader.readBytes(0);
        return reader.coerce(this.name, null);
    }
} //# sourceMappingURL=null.js.map
}}),
"[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/coders/fixed-bytes.js [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "FixedBytesCoder": (()=>FixedBytesCoder)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+bytes@5.7.0/node_modules/@ethersproject/bytes/lib.esm/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$abstract$2d$coder$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/coders/abstract-coder.js [app-rsc] (ecmascript)");
"use strict";
;
;
class FixedBytesCoder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$abstract$2d$coder$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Coder"] {
    constructor(size, localName){
        let name = "bytes" + String(size);
        super(name, name, localName, false);
        this.size = size;
    }
    defaultValue() {
        return "0x0000000000000000000000000000000000000000000000000000000000000000".substring(0, 2 + this.size * 2);
    }
    encode(writer, value) {
        let data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["arrayify"])(value);
        if (data.length !== this.size) {
            this._throwError("incorrect data length", value);
        }
        return writer.writeBytes(data);
    }
    decode(reader) {
        return reader.coerce(this.name, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hexlify"])(reader.readBytes(this.size)));
    }
} //# sourceMappingURL=fixed-bytes.js.map
}}),
"[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/coders/number.js [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "NumberCoder": (()=>NumberCoder)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+bignumber@5.7.0/node_modules/@ethersproject/bignumber/lib.esm/bignumber.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$constants$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$constants$2f$lib$2e$esm$2f$bignumbers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+constants@5.7.0/node_modules/@ethersproject/constants/lib.esm/bignumbers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$abstract$2d$coder$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/coders/abstract-coder.js [app-rsc] (ecmascript)");
"use strict";
;
;
;
class NumberCoder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$abstract$2d$coder$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Coder"] {
    constructor(size, signed, localName){
        const name = (signed ? "int" : "uint") + size * 8;
        super(name, name, localName, false);
        this.size = size;
        this.signed = signed;
    }
    defaultValue() {
        return 0;
    }
    encode(writer, value) {
        let v = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BigNumber"].from(value);
        // Check bounds are safe for encoding
        let maxUintValue = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$constants$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$constants$2f$lib$2e$esm$2f$bignumbers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MaxUint256"].mask(writer.wordSize * 8);
        if (this.signed) {
            let bounds = maxUintValue.mask(this.size * 8 - 1);
            if (v.gt(bounds) || v.lt(bounds.add(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$constants$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$constants$2f$lib$2e$esm$2f$bignumbers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["One"]).mul(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$constants$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$constants$2f$lib$2e$esm$2f$bignumbers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NegativeOne"]))) {
                this._throwError("value out-of-bounds", value);
            }
        } else if (v.lt(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$constants$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$constants$2f$lib$2e$esm$2f$bignumbers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Zero"]) || v.gt(maxUintValue.mask(this.size * 8))) {
            this._throwError("value out-of-bounds", value);
        }
        v = v.toTwos(this.size * 8).mask(this.size * 8);
        if (this.signed) {
            v = v.fromTwos(this.size * 8).toTwos(8 * writer.wordSize);
        }
        return writer.writeValue(v);
    }
    decode(reader) {
        let value = reader.readValue().mask(this.size * 8);
        if (this.signed) {
            value = value.fromTwos(this.size * 8);
        }
        return reader.coerce(this.name, value);
    }
} //# sourceMappingURL=number.js.map
}}),
"[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/abi-coder.js [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "AbiCoder": (()=>AbiCoder),
    "defaultAbiCoder": (()=>defaultAbiCoder)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+logger@5.7.0/node_modules/@ethersproject/logger/lib.esm/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/_version.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+properties@5.7.0/node_modules/@ethersproject/properties/lib.esm/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$address$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/coders/address.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$boolean$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/coders/boolean.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$string$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/coders/string.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$bytes$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/coders/bytes.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$array$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/coders/array.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$tuple$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/coders/tuple.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$null$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/coders/null.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$fixed$2d$bytes$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/coders/fixed-bytes.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$number$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/coders/number.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$abstract$2d$coder$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/coders/abstract-coder.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$fragments$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/fragments.js [app-rsc] (ecmascript)");
// See: https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+bytes@5.7.0/node_modules/@ethersproject/bytes/lib.esm/index.js [app-rsc] (ecmascript)");
"use strict";
;
;
;
;
const logger = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Logger"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["version"]);
;
;
;
;
;
;
;
;
;
;
;
const paramTypeBytes = new RegExp(/^bytes([0-9]*)$/);
const paramTypeNumber = new RegExp(/^(u?int)([0-9]*)$/);
class AbiCoder {
    constructor(coerceFunc){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "coerceFunc", coerceFunc || null);
    }
    _getCoder(param) {
        switch(param.baseType){
            case "address":
                return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$address$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AddressCoder"](param.name);
            case "bool":
                return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$boolean$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BooleanCoder"](param.name);
            case "string":
                return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$string$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StringCoder"](param.name);
            case "bytes":
                return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$bytes$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BytesCoder"](param.name);
            case "array":
                return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$array$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ArrayCoder"](this._getCoder(param.arrayChildren), param.arrayLength, param.name);
            case "tuple":
                return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$tuple$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TupleCoder"]((param.components || []).map((component)=>{
                    return this._getCoder(component);
                }), param.name);
            case "":
                return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$null$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NullCoder"](param.name);
        }
        // u?int[0-9]*
        let match = param.type.match(paramTypeNumber);
        if (match) {
            let size = parseInt(match[2] || "256");
            if (size === 0 || size > 256 || size % 8 !== 0) {
                logger.throwArgumentError("invalid " + match[1] + " bit length", "param", param);
            }
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$number$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NumberCoder"](size / 8, match[1] === "int", param.name);
        }
        // bytes[0-9]+
        match = param.type.match(paramTypeBytes);
        if (match) {
            let size = parseInt(match[1]);
            if (size === 0 || size > 32) {
                logger.throwArgumentError("invalid bytes length", "param", param);
            }
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$fixed$2d$bytes$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FixedBytesCoder"](size, param.name);
        }
        return logger.throwArgumentError("invalid type", "type", param.type);
    }
    _getWordSize() {
        return 32;
    }
    _getReader(data, allowLoose) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$abstract$2d$coder$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Reader"](data, this._getWordSize(), this.coerceFunc, allowLoose);
    }
    _getWriter() {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$abstract$2d$coder$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Writer"](this._getWordSize());
    }
    getDefaultValue(types) {
        const coders = types.map((type)=>this._getCoder(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$fragments$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ParamType"].from(type)));
        const coder = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$tuple$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TupleCoder"](coders, "_");
        return coder.defaultValue();
    }
    encode(types, values) {
        if (types.length !== values.length) {
            logger.throwError("types/values length mismatch", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Logger"].errors.INVALID_ARGUMENT, {
                count: {
                    types: types.length,
                    values: values.length
                },
                value: {
                    types: types,
                    values: values
                }
            });
        }
        const coders = types.map((type)=>this._getCoder(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$fragments$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ParamType"].from(type)));
        const coder = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$tuple$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TupleCoder"](coders, "_");
        const writer = this._getWriter();
        coder.encode(writer, values);
        return writer.data;
    }
    decode(types, data, loose) {
        const coders = types.map((type)=>this._getCoder(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$fragments$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ParamType"].from(type)));
        const coder = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$tuple$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TupleCoder"](coders, "_");
        return coder.decode(this._getReader((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["arrayify"])(data), loose));
    }
}
const defaultAbiCoder = new AbiCoder(); //# sourceMappingURL=abi-coder.js.map
}}),
"[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/interface.js [app-rsc] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "ErrorDescription": (()=>ErrorDescription),
    "Indexed": (()=>Indexed),
    "Interface": (()=>Interface),
    "LogDescription": (()=>LogDescription),
    "TransactionDescription": (()=>TransactionDescription)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+properties@5.7.0/node_modules/@ethersproject/properties/lib.esm/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$fragments$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/fragments.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$abi$2d$coder$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/abi-coder.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$address$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$address$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+address@5.7.0/node_modules/@ethersproject/address/lib.esm/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+bytes@5.7.0/node_modules/@ethersproject/bytes/lib.esm/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$hash$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$hash$2f$lib$2e$esm$2f$id$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+hash@5.7.0/node_modules/@ethersproject/hash/lib.esm/id.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+logger@5.7.0/node_modules/@ethersproject/logger/lib.esm/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+bignumber@5.7.0/node_modules/@ethersproject/bignumber/lib.esm/bignumber.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$keccak256$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$keccak256$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+keccak256@5.7.0/node_modules/@ethersproject/keccak256/lib.esm/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/_version.js [app-rsc] (ecmascript)");
"use strict";
;
;
;
;
;
;
;
;
;
;
;
const logger = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Logger"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["version"]);
;
class LogDescription extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Description"] {
}
class TransactionDescription extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Description"] {
}
class ErrorDescription extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Description"] {
}
class Indexed extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Description"] {
    static isIndexed(value) {
        return !!(value && value._isIndexed);
    }
}
const BuiltinErrors = {
    "0x08c379a0": {
        signature: "Error(string)",
        name: "Error",
        inputs: [
            "string"
        ],
        reason: true
    },
    "0x4e487b71": {
        signature: "Panic(uint256)",
        name: "Panic",
        inputs: [
            "uint256"
        ]
    }
};
function wrapAccessError(property, error) {
    const wrap = new Error(`deferred error during ABI decoding triggered accessing ${property}`);
    wrap.error = error;
    return wrap;
}
class Interface {
    constructor(fragments){
        let abi = [];
        if (typeof fragments === "string") {
            abi = JSON.parse(fragments);
        } else {
            abi = fragments;
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "fragments", abi.map((fragment)=>{
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$fragments$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"].from(fragment);
        }).filter((fragment)=>fragment != null));
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "_abiCoder", (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStatic"])(new.target, "getAbiCoder")());
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "functions", {});
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "errors", {});
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "events", {});
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "structs", {});
        // Add all fragments by their signature
        this.fragments.forEach((fragment)=>{
            let bucket = null;
            switch(fragment.type){
                case "constructor":
                    if (this.deploy) {
                        logger.warn("duplicate definition - constructor");
                        return;
                    }
                    //checkNames(fragment, "input", fragment.inputs);
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "deploy", fragment);
                    return;
                case "function":
                    //checkNames(fragment, "input", fragment.inputs);
                    //checkNames(fragment, "output", (<FunctionFragment>fragment).outputs);
                    bucket = this.functions;
                    break;
                case "event":
                    //checkNames(fragment, "input", fragment.inputs);
                    bucket = this.events;
                    break;
                case "error":
                    bucket = this.errors;
                    break;
                default:
                    return;
            }
            let signature = fragment.format();
            if (bucket[signature]) {
                logger.warn("duplicate definition - " + signature);
                return;
            }
            bucket[signature] = fragment;
        });
        // If we do not have a constructor add a default
        if (!this.deploy) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "deploy", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$fragments$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ConstructorFragment"].from({
                payable: false,
                type: "constructor"
            }));
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "_isInterface", true);
    }
    format(format) {
        if (!format) {
            format = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$fragments$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FormatTypes"].full;
        }
        if (format === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$fragments$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FormatTypes"].sighash) {
            logger.throwArgumentError("interface does not support formatting sighash", "format", format);
        }
        const abi = this.fragments.map((fragment)=>fragment.format(format));
        // We need to re-bundle the JSON fragments a bit
        if (format === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$fragments$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FormatTypes"].json) {
            return JSON.stringify(abi.map((j)=>JSON.parse(j)));
        }
        return abi;
    }
    // Sub-classes can override these to handle other blockchains
    static getAbiCoder() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$abi$2d$coder$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["defaultAbiCoder"];
    }
    static getAddress(address) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$address$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$address$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAddress"])(address);
    }
    static getSighash(fragment) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hexDataSlice"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$hash$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$hash$2f$lib$2e$esm$2f$id$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["id"])(fragment.format()), 0, 4);
    }
    static getEventTopic(eventFragment) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$hash$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$hash$2f$lib$2e$esm$2f$id$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["id"])(eventFragment.format());
    }
    // Find a function definition by any means necessary (unless it is ambiguous)
    getFunction(nameOrSignatureOrSighash) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isHexString"])(nameOrSignatureOrSighash)) {
            for(const name in this.functions){
                if (nameOrSignatureOrSighash === this.getSighash(name)) {
                    return this.functions[name];
                }
            }
            logger.throwArgumentError("no matching function", "sighash", nameOrSignatureOrSighash);
        }
        // It is a bare name, look up the function (will return null if ambiguous)
        if (nameOrSignatureOrSighash.indexOf("(") === -1) {
            const name = nameOrSignatureOrSighash.trim();
            const matching = Object.keys(this.functions).filter((f)=>f.split("(" /* fix:) */ )[0] === name);
            if (matching.length === 0) {
                logger.throwArgumentError("no matching function", "name", name);
            } else if (matching.length > 1) {
                logger.throwArgumentError("multiple matching functions", "name", name);
            }
            return this.functions[matching[0]];
        }
        // Normalize the signature and lookup the function
        const result = this.functions[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$fragments$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FunctionFragment"].fromString(nameOrSignatureOrSighash).format()];
        if (!result) {
            logger.throwArgumentError("no matching function", "signature", nameOrSignatureOrSighash);
        }
        return result;
    }
    // Find an event definition by any means necessary (unless it is ambiguous)
    getEvent(nameOrSignatureOrTopic) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isHexString"])(nameOrSignatureOrTopic)) {
            const topichash = nameOrSignatureOrTopic.toLowerCase();
            for(const name in this.events){
                if (topichash === this.getEventTopic(name)) {
                    return this.events[name];
                }
            }
            logger.throwArgumentError("no matching event", "topichash", topichash);
        }
        // It is a bare name, look up the function (will return null if ambiguous)
        if (nameOrSignatureOrTopic.indexOf("(") === -1) {
            const name = nameOrSignatureOrTopic.trim();
            const matching = Object.keys(this.events).filter((f)=>f.split("(" /* fix:) */ )[0] === name);
            if (matching.length === 0) {
                logger.throwArgumentError("no matching event", "name", name);
            } else if (matching.length > 1) {
                logger.throwArgumentError("multiple matching events", "name", name);
            }
            return this.events[matching[0]];
        }
        // Normalize the signature and lookup the function
        const result = this.events[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$fragments$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EventFragment"].fromString(nameOrSignatureOrTopic).format()];
        if (!result) {
            logger.throwArgumentError("no matching event", "signature", nameOrSignatureOrTopic);
        }
        return result;
    }
    // Find a function definition by any means necessary (unless it is ambiguous)
    getError(nameOrSignatureOrSighash) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isHexString"])(nameOrSignatureOrSighash)) {
            const getSighash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStatic"])(this.constructor, "getSighash");
            for(const name in this.errors){
                const error = this.errors[name];
                if (nameOrSignatureOrSighash === getSighash(error)) {
                    return this.errors[name];
                }
            }
            logger.throwArgumentError("no matching error", "sighash", nameOrSignatureOrSighash);
        }
        // It is a bare name, look up the function (will return null if ambiguous)
        if (nameOrSignatureOrSighash.indexOf("(") === -1) {
            const name = nameOrSignatureOrSighash.trim();
            const matching = Object.keys(this.errors).filter((f)=>f.split("(" /* fix:) */ )[0] === name);
            if (matching.length === 0) {
                logger.throwArgumentError("no matching error", "name", name);
            } else if (matching.length > 1) {
                logger.throwArgumentError("multiple matching errors", "name", name);
            }
            return this.errors[matching[0]];
        }
        // Normalize the signature and lookup the function
        const result = this.errors[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$fragments$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FunctionFragment"].fromString(nameOrSignatureOrSighash).format()];
        if (!result) {
            logger.throwArgumentError("no matching error", "signature", nameOrSignatureOrSighash);
        }
        return result;
    }
    // Get the sighash (the bytes4 selector) used by Solidity to identify a function
    getSighash(fragment) {
        if (typeof fragment === "string") {
            try {
                fragment = this.getFunction(fragment);
            } catch (error) {
                try {
                    fragment = this.getError(fragment);
                } catch (_) {
                    throw error;
                }
            }
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStatic"])(this.constructor, "getSighash")(fragment);
    }
    // Get the topic (the bytes32 hash) used by Solidity to identify an event
    getEventTopic(eventFragment) {
        if (typeof eventFragment === "string") {
            eventFragment = this.getEvent(eventFragment);
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStatic"])(this.constructor, "getEventTopic")(eventFragment);
    }
    _decodeParams(params, data) {
        return this._abiCoder.decode(params, data);
    }
    _encodeParams(params, values) {
        return this._abiCoder.encode(params, values);
    }
    encodeDeploy(values) {
        return this._encodeParams(this.deploy.inputs, values || []);
    }
    decodeErrorResult(fragment, data) {
        if (typeof fragment === "string") {
            fragment = this.getError(fragment);
        }
        const bytes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["arrayify"])(data);
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hexlify"])(bytes.slice(0, 4)) !== this.getSighash(fragment)) {
            logger.throwArgumentError(`data signature does not match error ${fragment.name}.`, "data", (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hexlify"])(bytes));
        }
        return this._decodeParams(fragment.inputs, bytes.slice(4));
    }
    encodeErrorResult(fragment, values) {
        if (typeof fragment === "string") {
            fragment = this.getError(fragment);
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hexlify"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["concat"])([
            this.getSighash(fragment),
            this._encodeParams(fragment.inputs, values || [])
        ]));
    }
    // Decode the data for a function call (e.g. tx.data)
    decodeFunctionData(functionFragment, data) {
        if (typeof functionFragment === "string") {
            functionFragment = this.getFunction(functionFragment);
        }
        const bytes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["arrayify"])(data);
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hexlify"])(bytes.slice(0, 4)) !== this.getSighash(functionFragment)) {
            logger.throwArgumentError(`data signature does not match function ${functionFragment.name}.`, "data", (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hexlify"])(bytes));
        }
        return this._decodeParams(functionFragment.inputs, bytes.slice(4));
    }
    // Encode the data for a function call (e.g. tx.data)
    encodeFunctionData(functionFragment, values) {
        if (typeof functionFragment === "string") {
            functionFragment = this.getFunction(functionFragment);
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hexlify"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["concat"])([
            this.getSighash(functionFragment),
            this._encodeParams(functionFragment.inputs, values || [])
        ]));
    }
    // Decode the result from a function call (e.g. from eth_call)
    decodeFunctionResult(functionFragment, data) {
        if (typeof functionFragment === "string") {
            functionFragment = this.getFunction(functionFragment);
        }
        let bytes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["arrayify"])(data);
        let reason = null;
        let message = "";
        let errorArgs = null;
        let errorName = null;
        let errorSignature = null;
        switch(bytes.length % this._abiCoder._getWordSize()){
            case 0:
                try {
                    return this._abiCoder.decode(functionFragment.outputs, bytes);
                } catch (error) {}
                break;
            case 4:
                {
                    const selector = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hexlify"])(bytes.slice(0, 4));
                    const builtin = BuiltinErrors[selector];
                    if (builtin) {
                        errorArgs = this._abiCoder.decode(builtin.inputs, bytes.slice(4));
                        errorName = builtin.name;
                        errorSignature = builtin.signature;
                        if (builtin.reason) {
                            reason = errorArgs[0];
                        }
                        if (errorName === "Error") {
                            message = `; VM Exception while processing transaction: reverted with reason string ${JSON.stringify(errorArgs[0])}`;
                        } else if (errorName === "Panic") {
                            message = `; VM Exception while processing transaction: reverted with panic code ${errorArgs[0]}`;
                        }
                    } else {
                        try {
                            const error = this.getError(selector);
                            errorArgs = this._abiCoder.decode(error.inputs, bytes.slice(4));
                            errorName = error.name;
                            errorSignature = error.format();
                        } catch (error) {}
                    }
                    break;
                }
        }
        return logger.throwError("call revert exception" + message, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Logger"].errors.CALL_EXCEPTION, {
            method: functionFragment.format(),
            data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hexlify"])(data),
            errorArgs,
            errorName,
            errorSignature,
            reason
        });
    }
    // Encode the result for a function call (e.g. for eth_call)
    encodeFunctionResult(functionFragment, values) {
        if (typeof functionFragment === "string") {
            functionFragment = this.getFunction(functionFragment);
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hexlify"])(this._abiCoder.encode(functionFragment.outputs, values || []));
    }
    // Create the filter for the event with search criteria (e.g. for eth_filterLog)
    encodeFilterTopics(eventFragment, values) {
        if (typeof eventFragment === "string") {
            eventFragment = this.getEvent(eventFragment);
        }
        if (values.length > eventFragment.inputs.length) {
            logger.throwError("too many arguments for " + eventFragment.format(), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Logger"].errors.UNEXPECTED_ARGUMENT, {
                argument: "values",
                value: values
            });
        }
        let topics = [];
        if (!eventFragment.anonymous) {
            topics.push(this.getEventTopic(eventFragment));
        }
        const encodeTopic = (param, value)=>{
            if (param.type === "string") {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$hash$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$hash$2f$lib$2e$esm$2f$id$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["id"])(value);
            } else if (param.type === "bytes") {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$keccak256$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$keccak256$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["keccak256"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hexlify"])(value));
            }
            if (param.type === "bool" && typeof value === "boolean") {
                value = value ? "0x01" : "0x00";
            }
            if (param.type.match(/^u?int/)) {
                value = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BigNumber"].from(value).toHexString();
            }
            // Check addresses are valid
            if (param.type === "address") {
                this._abiCoder.encode([
                    "address"
                ], [
                    value
                ]);
            }
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hexZeroPad"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hexlify"])(value), 32);
        };
        values.forEach((value, index)=>{
            let param = eventFragment.inputs[index];
            if (!param.indexed) {
                if (value != null) {
                    logger.throwArgumentError("cannot filter non-indexed parameters; must be null", "contract." + param.name, value);
                }
                return;
            }
            if (value == null) {
                topics.push(null);
            } else if (param.baseType === "array" || param.baseType === "tuple") {
                logger.throwArgumentError("filtering with tuples or arrays not supported", "contract." + param.name, value);
            } else if (Array.isArray(value)) {
                topics.push(value.map((value)=>encodeTopic(param, value)));
            } else {
                topics.push(encodeTopic(param, value));
            }
        });
        // Trim off trailing nulls
        while(topics.length && topics[topics.length - 1] === null){
            topics.pop();
        }
        return topics;
    }
    encodeEventLog(eventFragment, values) {
        if (typeof eventFragment === "string") {
            eventFragment = this.getEvent(eventFragment);
        }
        const topics = [];
        const dataTypes = [];
        const dataValues = [];
        if (!eventFragment.anonymous) {
            topics.push(this.getEventTopic(eventFragment));
        }
        if (values.length !== eventFragment.inputs.length) {
            logger.throwArgumentError("event arguments/values mismatch", "values", values);
        }
        eventFragment.inputs.forEach((param, index)=>{
            const value = values[index];
            if (param.indexed) {
                if (param.type === "string") {
                    topics.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$hash$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$hash$2f$lib$2e$esm$2f$id$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["id"])(value));
                } else if (param.type === "bytes") {
                    topics.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$keccak256$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$keccak256$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["keccak256"])(value));
                } else if (param.baseType === "tuple" || param.baseType === "array") {
                    // @TODO
                    throw new Error("not implemented");
                } else {
                    topics.push(this._abiCoder.encode([
                        param.type
                    ], [
                        value
                    ]));
                }
            } else {
                dataTypes.push(param);
                dataValues.push(value);
            }
        });
        return {
            data: this._abiCoder.encode(dataTypes, dataValues),
            topics: topics
        };
    }
    // Decode a filter for the event and the search criteria
    decodeEventLog(eventFragment, data, topics) {
        if (typeof eventFragment === "string") {
            eventFragment = this.getEvent(eventFragment);
        }
        if (topics != null && !eventFragment.anonymous) {
            let topicHash = this.getEventTopic(eventFragment);
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isHexString"])(topics[0], 32) || topics[0].toLowerCase() !== topicHash) {
                logger.throwError("fragment/topic mismatch", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Logger"].errors.INVALID_ARGUMENT, {
                    argument: "topics[0]",
                    expected: topicHash,
                    value: topics[0]
                });
            }
            topics = topics.slice(1);
        }
        let indexed = [];
        let nonIndexed = [];
        let dynamic = [];
        eventFragment.inputs.forEach((param, index)=>{
            if (param.indexed) {
                if (param.type === "string" || param.type === "bytes" || param.baseType === "tuple" || param.baseType === "array") {
                    indexed.push(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$fragments$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ParamType"].fromObject({
                        type: "bytes32",
                        name: param.name
                    }));
                    dynamic.push(true);
                } else {
                    indexed.push(param);
                    dynamic.push(false);
                }
            } else {
                nonIndexed.push(param);
                dynamic.push(false);
            }
        });
        let resultIndexed = topics != null ? this._abiCoder.decode(indexed, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["concat"])(topics)) : null;
        let resultNonIndexed = this._abiCoder.decode(nonIndexed, data, true);
        let result = [];
        let nonIndexedIndex = 0, indexedIndex = 0;
        eventFragment.inputs.forEach((param, index)=>{
            if (param.indexed) {
                if (resultIndexed == null) {
                    result[index] = new Indexed({
                        _isIndexed: true,
                        hash: null
                    });
                } else if (dynamic[index]) {
                    result[index] = new Indexed({
                        _isIndexed: true,
                        hash: resultIndexed[indexedIndex++]
                    });
                } else {
                    try {
                        result[index] = resultIndexed[indexedIndex++];
                    } catch (error) {
                        result[index] = error;
                    }
                }
            } else {
                try {
                    result[index] = resultNonIndexed[nonIndexedIndex++];
                } catch (error) {
                    result[index] = error;
                }
            }
            // Add the keyword argument if named and safe
            if (param.name && result[param.name] == null) {
                const value = result[index];
                // Make error named values throw on access
                if (value instanceof Error) {
                    Object.defineProperty(result, param.name, {
                        enumerable: true,
                        get: ()=>{
                            throw wrapAccessError(`property ${JSON.stringify(param.name)}`, value);
                        }
                    });
                } else {
                    result[param.name] = value;
                }
            }
        });
        // Make all error indexed values throw on access
        for(let i = 0; i < result.length; i++){
            const value = result[i];
            if (value instanceof Error) {
                Object.defineProperty(result, i, {
                    enumerable: true,
                    get: ()=>{
                        throw wrapAccessError(`index ${i}`, value);
                    }
                });
            }
        }
        return Object.freeze(result);
    }
    // Given a transaction, find the matching function fragment (if any) and
    // determine all its properties and call parameters
    parseTransaction(tx) {
        let fragment = this.getFunction(tx.data.substring(0, 10).toLowerCase());
        if (!fragment) {
            return null;
        }
        return new TransactionDescription({
            args: this._abiCoder.decode(fragment.inputs, "0x" + tx.data.substring(10)),
            functionFragment: fragment,
            name: fragment.name,
            signature: fragment.format(),
            sighash: this.getSighash(fragment),
            value: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BigNumber"].from(tx.value || "0")
        });
    }
    // @TODO
    //parseCallResult(data: BytesLike): ??
    // Given an event log, find the matching event fragment (if any) and
    // determine all its properties and values
    parseLog(log) {
        let fragment = this.getEvent(log.topics[0]);
        if (!fragment || fragment.anonymous) {
            return null;
        }
        // @TODO: If anonymous, and the only method, and the input count matches, should we parse?
        //        Probably not, because just because it is the only event in the ABI does
        //        not mean we have the full ABI; maybe just a fragment?
        return new LogDescription({
            eventFragment: fragment,
            name: fragment.name,
            signature: fragment.format(),
            topic: this.getEventTopic(fragment),
            args: this.decodeEventLog(fragment, log.data, log.topics)
        });
    }
    parseError(data) {
        const hexData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hexlify"])(data);
        let fragment = this.getError(hexData.substring(0, 10).toLowerCase());
        if (!fragment) {
            return null;
        }
        return new ErrorDescription({
            args: this._abiCoder.decode(fragment.inputs, "0x" + hexData.substring(10)),
            errorFragment: fragment,
            name: fragment.name,
            signature: fragment.format(),
            sighash: this.getSighash(fragment)
        });
    }
    /*
    static from(value: Array<Fragment | string | JsonAbi> | string | Interface) {
        if (Interface.isInterface(value)) {
            return value;
        }
        if (typeof(value) === "string") {
            return new Interface(JSON.parse(value));
        }
        return new Interface(value);
    }
    */ static isInterface(value) {
        return !!(value && value._isInterface);
    }
} //# sourceMappingURL=interface.js.map
}}),
"[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/index.js [app-rsc] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({});
"use strict";
;
;
;
;
 //# sourceMappingURL=index.js.map
}}),
"[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/index.js [app-rsc] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_esm__({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/index.js [app-rsc] (ecmascript) <locals>");
}}),
"[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/index.js [app-rsc] (ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_esm__({
    "AbiCoder": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$abi$2d$coder$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AbiCoder"]),
    "ConstructorFragment": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$fragments$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ConstructorFragment"]),
    "ErrorFragment": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$fragments$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ErrorFragment"]),
    "EventFragment": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$fragments$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EventFragment"]),
    "FormatTypes": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$fragments$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FormatTypes"]),
    "Fragment": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$fragments$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"]),
    "FunctionFragment": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$fragments$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FunctionFragment"]),
    "Indexed": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$interface$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Indexed"]),
    "Interface": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$interface$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Interface"]),
    "LogDescription": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$interface$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["LogDescription"]),
    "ParamType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$fragments$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ParamType"]),
    "TransactionDescription": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$interface$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["TransactionDescription"]),
    "checkResultErrors": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$abstract$2d$coder$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["checkResultErrors"]),
    "defaultAbiCoder": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$abi$2d$coder$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["defaultAbiCoder"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$abi$2d$coder$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/abi-coder.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$fragments$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/fragments.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$interface$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/interface.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$coders$2f$abstract$2d$coder$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/coders/abstract-coder.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/index.js [app-rsc] (ecmascript) <locals>");
}}),
"[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/index.js [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_esm__({
    "AbiCoder": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$exports$3e$__["AbiCoder"]),
    "ConstructorFragment": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$exports$3e$__["ConstructorFragment"]),
    "ErrorFragment": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$exports$3e$__["ErrorFragment"]),
    "EventFragment": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$exports$3e$__["EventFragment"]),
    "FormatTypes": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$exports$3e$__["FormatTypes"]),
    "Fragment": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$exports$3e$__["Fragment"]),
    "FunctionFragment": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$exports$3e$__["FunctionFragment"]),
    "Indexed": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$exports$3e$__["Indexed"]),
    "Interface": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$exports$3e$__["Interface"]),
    "LogDescription": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$exports$3e$__["LogDescription"]),
    "ParamType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$exports$3e$__["ParamType"]),
    "TransactionDescription": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$exports$3e$__["TransactionDescription"]),
    "checkResultErrors": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$exports$3e$__["checkResultErrors"]),
    "defaultAbiCoder": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$exports$3e$__["defaultAbiCoder"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/index.js [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abi$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abi$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$exports$3e$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abi@5.7.0/node_modules/@ethersproject/abi/lib.esm/index.js [app-rsc] (ecmascript) <exports>");
}}),

};

//# sourceMappingURL=5fcb0_%40ethersproject_abi_lib_esm_847ebf._.js.map