"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn2, res) => function __init() {
  return fn2 && (res = (0, fn2[__getOwnPropNames(fn2)[0]])(fn2 = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to2, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to2, key) && key !== except)
        __defProp(to2, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to2;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/web-streams-polyfill/dist/ponyfill.es2018.js
var require_ponyfill_es2018 = __commonJS({
  "node_modules/web-streams-polyfill/dist/ponyfill.es2018.js"(exports2, module2) {
    (function(global2, factory) {
      typeof exports2 === "object" && typeof module2 !== "undefined" ? factory(exports2) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global2 = typeof globalThis !== "undefined" ? globalThis : global2 || self, factory(global2.WebStreamsPolyfill = {}));
    })(exports2, function(exports3) {
      "use strict";
      function noop2() {
        return void 0;
      }
      function typeIsObject(x3) {
        return typeof x3 === "object" && x3 !== null || typeof x3 === "function";
      }
      const rethrowAssertionErrorRejection = noop2;
      function setFunctionName(fn2, name) {
        try {
          Object.defineProperty(fn2, "name", {
            value: name,
            configurable: true
          });
        } catch (_a3) {
        }
      }
      const originalPromise = Promise;
      const originalPromiseThen = Promise.prototype.then;
      const originalPromiseReject = Promise.reject.bind(originalPromise);
      function newPromise(executor) {
        return new originalPromise(executor);
      }
      function promiseResolvedWith(value) {
        return newPromise((resolve) => resolve(value));
      }
      function promiseRejectedWith(reason) {
        return originalPromiseReject(reason);
      }
      function PerformPromiseThen(promise, onFulfilled, onRejected) {
        return originalPromiseThen.call(promise, onFulfilled, onRejected);
      }
      function uponPromise(promise, onFulfilled, onRejected) {
        PerformPromiseThen(PerformPromiseThen(promise, onFulfilled, onRejected), void 0, rethrowAssertionErrorRejection);
      }
      function uponFulfillment(promise, onFulfilled) {
        uponPromise(promise, onFulfilled);
      }
      function uponRejection(promise, onRejected) {
        uponPromise(promise, void 0, onRejected);
      }
      function transformPromiseWith(promise, fulfillmentHandler, rejectionHandler) {
        return PerformPromiseThen(promise, fulfillmentHandler, rejectionHandler);
      }
      function setPromiseIsHandledToTrue(promise) {
        PerformPromiseThen(promise, void 0, rethrowAssertionErrorRejection);
      }
      let _queueMicrotask = (callback) => {
        if (typeof queueMicrotask === "function") {
          _queueMicrotask = queueMicrotask;
        } else {
          const resolvedPromise = promiseResolvedWith(void 0);
          _queueMicrotask = (cb) => PerformPromiseThen(resolvedPromise, cb);
        }
        return _queueMicrotask(callback);
      };
      function reflectCall(F3, V2, args) {
        if (typeof F3 !== "function") {
          throw new TypeError("Argument is not a function");
        }
        return Function.prototype.apply.call(F3, V2, args);
      }
      function promiseCall(F3, V2, args) {
        try {
          return promiseResolvedWith(reflectCall(F3, V2, args));
        } catch (value) {
          return promiseRejectedWith(value);
        }
      }
      const QUEUE_MAX_ARRAY_SIZE = 16384;
      class SimpleQueue {
        constructor() {
          this._cursor = 0;
          this._size = 0;
          this._front = {
            _elements: [],
            _next: void 0
          };
          this._back = this._front;
          this._cursor = 0;
          this._size = 0;
        }
        get length() {
          return this._size;
        }
        // For exception safety, this method is structured in order:
        // 1. Read state
        // 2. Calculate required state mutations
        // 3. Perform state mutations
        push(element) {
          const oldBack = this._back;
          let newBack = oldBack;
          if (oldBack._elements.length === QUEUE_MAX_ARRAY_SIZE - 1) {
            newBack = {
              _elements: [],
              _next: void 0
            };
          }
          oldBack._elements.push(element);
          if (newBack !== oldBack) {
            this._back = newBack;
            oldBack._next = newBack;
          }
          ++this._size;
        }
        // Like push(), shift() follows the read -> calculate -> mutate pattern for
        // exception safety.
        shift() {
          const oldFront = this._front;
          let newFront = oldFront;
          const oldCursor = this._cursor;
          let newCursor = oldCursor + 1;
          const elements = oldFront._elements;
          const element = elements[oldCursor];
          if (newCursor === QUEUE_MAX_ARRAY_SIZE) {
            newFront = oldFront._next;
            newCursor = 0;
          }
          --this._size;
          this._cursor = newCursor;
          if (oldFront !== newFront) {
            this._front = newFront;
          }
          elements[oldCursor] = void 0;
          return element;
        }
        // The tricky thing about forEach() is that it can be called
        // re-entrantly. The queue may be mutated inside the callback. It is easy to
        // see that push() within the callback has no negative effects since the end
        // of the queue is checked for on every iteration. If shift() is called
        // repeatedly within the callback then the next iteration may return an
        // element that has been removed. In this case the callback will be called
        // with undefined values until we either "catch up" with elements that still
        // exist or reach the back of the queue.
        forEach(callback) {
          let i2 = this._cursor;
          let node = this._front;
          let elements = node._elements;
          while (i2 !== elements.length || node._next !== void 0) {
            if (i2 === elements.length) {
              node = node._next;
              elements = node._elements;
              i2 = 0;
              if (elements.length === 0) {
                break;
              }
            }
            callback(elements[i2]);
            ++i2;
          }
        }
        // Return the element that would be returned if shift() was called now,
        // without modifying the queue.
        peek() {
          const front = this._front;
          const cursor = this._cursor;
          return front._elements[cursor];
        }
      }
      const AbortSteps = Symbol("[[AbortSteps]]");
      const ErrorSteps = Symbol("[[ErrorSteps]]");
      const CancelSteps = Symbol("[[CancelSteps]]");
      const PullSteps = Symbol("[[PullSteps]]");
      const ReleaseSteps = Symbol("[[ReleaseSteps]]");
      function ReadableStreamReaderGenericInitialize(reader, stream) {
        reader._ownerReadableStream = stream;
        stream._reader = reader;
        if (stream._state === "readable") {
          defaultReaderClosedPromiseInitialize(reader);
        } else if (stream._state === "closed") {
          defaultReaderClosedPromiseInitializeAsResolved(reader);
        } else {
          defaultReaderClosedPromiseInitializeAsRejected(reader, stream._storedError);
        }
      }
      function ReadableStreamReaderGenericCancel(reader, reason) {
        const stream = reader._ownerReadableStream;
        return ReadableStreamCancel(stream, reason);
      }
      function ReadableStreamReaderGenericRelease(reader) {
        const stream = reader._ownerReadableStream;
        if (stream._state === "readable") {
          defaultReaderClosedPromiseReject(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
        } else {
          defaultReaderClosedPromiseResetToRejected(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
        }
        stream._readableStreamController[ReleaseSteps]();
        stream._reader = void 0;
        reader._ownerReadableStream = void 0;
      }
      function readerLockException(name) {
        return new TypeError("Cannot " + name + " a stream using a released reader");
      }
      function defaultReaderClosedPromiseInitialize(reader) {
        reader._closedPromise = newPromise((resolve, reject) => {
          reader._closedPromise_resolve = resolve;
          reader._closedPromise_reject = reject;
        });
      }
      function defaultReaderClosedPromiseInitializeAsRejected(reader, reason) {
        defaultReaderClosedPromiseInitialize(reader);
        defaultReaderClosedPromiseReject(reader, reason);
      }
      function defaultReaderClosedPromiseInitializeAsResolved(reader) {
        defaultReaderClosedPromiseInitialize(reader);
        defaultReaderClosedPromiseResolve(reader);
      }
      function defaultReaderClosedPromiseReject(reader, reason) {
        if (reader._closedPromise_reject === void 0) {
          return;
        }
        setPromiseIsHandledToTrue(reader._closedPromise);
        reader._closedPromise_reject(reason);
        reader._closedPromise_resolve = void 0;
        reader._closedPromise_reject = void 0;
      }
      function defaultReaderClosedPromiseResetToRejected(reader, reason) {
        defaultReaderClosedPromiseInitializeAsRejected(reader, reason);
      }
      function defaultReaderClosedPromiseResolve(reader) {
        if (reader._closedPromise_resolve === void 0) {
          return;
        }
        reader._closedPromise_resolve(void 0);
        reader._closedPromise_resolve = void 0;
        reader._closedPromise_reject = void 0;
      }
      const NumberIsFinite = Number.isFinite || function(x3) {
        return typeof x3 === "number" && isFinite(x3);
      };
      const MathTrunc = Math.trunc || function(v) {
        return v < 0 ? Math.ceil(v) : Math.floor(v);
      };
      function isDictionary(x3) {
        return typeof x3 === "object" || typeof x3 === "function";
      }
      function assertDictionary(obj, context) {
        if (obj !== void 0 && !isDictionary(obj)) {
          throw new TypeError(`${context} is not an object.`);
        }
      }
      function assertFunction(x3, context) {
        if (typeof x3 !== "function") {
          throw new TypeError(`${context} is not a function.`);
        }
      }
      function isObject(x3) {
        return typeof x3 === "object" && x3 !== null || typeof x3 === "function";
      }
      function assertObject(x3, context) {
        if (!isObject(x3)) {
          throw new TypeError(`${context} is not an object.`);
        }
      }
      function assertRequiredArgument(x3, position, context) {
        if (x3 === void 0) {
          throw new TypeError(`Parameter ${position} is required in '${context}'.`);
        }
      }
      function assertRequiredField(x3, field, context) {
        if (x3 === void 0) {
          throw new TypeError(`${field} is required in '${context}'.`);
        }
      }
      function convertUnrestrictedDouble(value) {
        return Number(value);
      }
      function censorNegativeZero(x3) {
        return x3 === 0 ? 0 : x3;
      }
      function integerPart(x3) {
        return censorNegativeZero(MathTrunc(x3));
      }
      function convertUnsignedLongLongWithEnforceRange(value, context) {
        const lowerBound = 0;
        const upperBound = Number.MAX_SAFE_INTEGER;
        let x3 = Number(value);
        x3 = censorNegativeZero(x3);
        if (!NumberIsFinite(x3)) {
          throw new TypeError(`${context} is not a finite number`);
        }
        x3 = integerPart(x3);
        if (x3 < lowerBound || x3 > upperBound) {
          throw new TypeError(`${context} is outside the accepted range of ${lowerBound} to ${upperBound}, inclusive`);
        }
        if (!NumberIsFinite(x3) || x3 === 0) {
          return 0;
        }
        return x3;
      }
      function assertReadableStream(x3, context) {
        if (!IsReadableStream(x3)) {
          throw new TypeError(`${context} is not a ReadableStream.`);
        }
      }
      function AcquireReadableStreamDefaultReader(stream) {
        return new ReadableStreamDefaultReader(stream);
      }
      function ReadableStreamAddReadRequest(stream, readRequest) {
        stream._reader._readRequests.push(readRequest);
      }
      function ReadableStreamFulfillReadRequest(stream, chunk, done) {
        const reader = stream._reader;
        const readRequest = reader._readRequests.shift();
        if (done) {
          readRequest._closeSteps();
        } else {
          readRequest._chunkSteps(chunk);
        }
      }
      function ReadableStreamGetNumReadRequests(stream) {
        return stream._reader._readRequests.length;
      }
      function ReadableStreamHasDefaultReader(stream) {
        const reader = stream._reader;
        if (reader === void 0) {
          return false;
        }
        if (!IsReadableStreamDefaultReader(reader)) {
          return false;
        }
        return true;
      }
      class ReadableStreamDefaultReader {
        constructor(stream) {
          assertRequiredArgument(stream, 1, "ReadableStreamDefaultReader");
          assertReadableStream(stream, "First parameter");
          if (IsReadableStreamLocked(stream)) {
            throw new TypeError("This stream has already been locked for exclusive reading by another reader");
          }
          ReadableStreamReaderGenericInitialize(this, stream);
          this._readRequests = new SimpleQueue();
        }
        /**
         * Returns a promise that will be fulfilled when the stream becomes closed,
         * or rejected if the stream ever errors or the reader's lock is released before the stream finishes closing.
         */
        get closed() {
          if (!IsReadableStreamDefaultReader(this)) {
            return promiseRejectedWith(defaultReaderBrandCheckException("closed"));
          }
          return this._closedPromise;
        }
        /**
         * If the reader is active, behaves the same as {@link ReadableStream.cancel | stream.cancel(reason)}.
         */
        cancel(reason = void 0) {
          if (!IsReadableStreamDefaultReader(this)) {
            return promiseRejectedWith(defaultReaderBrandCheckException("cancel"));
          }
          if (this._ownerReadableStream === void 0) {
            return promiseRejectedWith(readerLockException("cancel"));
          }
          return ReadableStreamReaderGenericCancel(this, reason);
        }
        /**
         * Returns a promise that allows access to the next chunk from the stream's internal queue, if available.
         *
         * If reading a chunk causes the queue to become empty, more data will be pulled from the underlying source.
         */
        read() {
          if (!IsReadableStreamDefaultReader(this)) {
            return promiseRejectedWith(defaultReaderBrandCheckException("read"));
          }
          if (this._ownerReadableStream === void 0) {
            return promiseRejectedWith(readerLockException("read from"));
          }
          let resolvePromise;
          let rejectPromise;
          const promise = newPromise((resolve, reject) => {
            resolvePromise = resolve;
            rejectPromise = reject;
          });
          const readRequest = {
            _chunkSteps: (chunk) => resolvePromise({ value: chunk, done: false }),
            _closeSteps: () => resolvePromise({ value: void 0, done: true }),
            _errorSteps: (e2) => rejectPromise(e2)
          };
          ReadableStreamDefaultReaderRead(this, readRequest);
          return promise;
        }
        /**
         * Releases the reader's lock on the corresponding stream. After the lock is released, the reader is no longer active.
         * If the associated stream is errored when the lock is released, the reader will appear errored in the same way
         * from now on; otherwise, the reader will appear closed.
         *
         * A reader's lock cannot be released while it still has a pending read request, i.e., if a promise returned by
         * the reader's {@link ReadableStreamDefaultReader.read | read()} method has not yet been settled. Attempting to
         * do so will throw a `TypeError` and leave the reader locked to the stream.
         */
        releaseLock() {
          if (!IsReadableStreamDefaultReader(this)) {
            throw defaultReaderBrandCheckException("releaseLock");
          }
          if (this._ownerReadableStream === void 0) {
            return;
          }
          ReadableStreamDefaultReaderRelease(this);
        }
      }
      Object.defineProperties(ReadableStreamDefaultReader.prototype, {
        cancel: { enumerable: true },
        read: { enumerable: true },
        releaseLock: { enumerable: true },
        closed: { enumerable: true }
      });
      setFunctionName(ReadableStreamDefaultReader.prototype.cancel, "cancel");
      setFunctionName(ReadableStreamDefaultReader.prototype.read, "read");
      setFunctionName(ReadableStreamDefaultReader.prototype.releaseLock, "releaseLock");
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(ReadableStreamDefaultReader.prototype, Symbol.toStringTag, {
          value: "ReadableStreamDefaultReader",
          configurable: true
        });
      }
      function IsReadableStreamDefaultReader(x3) {
        if (!typeIsObject(x3)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x3, "_readRequests")) {
          return false;
        }
        return x3 instanceof ReadableStreamDefaultReader;
      }
      function ReadableStreamDefaultReaderRead(reader, readRequest) {
        const stream = reader._ownerReadableStream;
        stream._disturbed = true;
        if (stream._state === "closed") {
          readRequest._closeSteps();
        } else if (stream._state === "errored") {
          readRequest._errorSteps(stream._storedError);
        } else {
          stream._readableStreamController[PullSteps](readRequest);
        }
      }
      function ReadableStreamDefaultReaderRelease(reader) {
        ReadableStreamReaderGenericRelease(reader);
        const e2 = new TypeError("Reader was released");
        ReadableStreamDefaultReaderErrorReadRequests(reader, e2);
      }
      function ReadableStreamDefaultReaderErrorReadRequests(reader, e2) {
        const readRequests = reader._readRequests;
        reader._readRequests = new SimpleQueue();
        readRequests.forEach((readRequest) => {
          readRequest._errorSteps(e2);
        });
      }
      function defaultReaderBrandCheckException(name) {
        return new TypeError(`ReadableStreamDefaultReader.prototype.${name} can only be used on a ReadableStreamDefaultReader`);
      }
      const AsyncIteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {
      }).prototype);
      class ReadableStreamAsyncIteratorImpl {
        constructor(reader, preventCancel) {
          this._ongoingPromise = void 0;
          this._isFinished = false;
          this._reader = reader;
          this._preventCancel = preventCancel;
        }
        next() {
          const nextSteps = () => this._nextSteps();
          this._ongoingPromise = this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, nextSteps, nextSteps) : nextSteps();
          return this._ongoingPromise;
        }
        return(value) {
          const returnSteps = () => this._returnSteps(value);
          return this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, returnSteps, returnSteps) : returnSteps();
        }
        _nextSteps() {
          if (this._isFinished) {
            return Promise.resolve({ value: void 0, done: true });
          }
          const reader = this._reader;
          let resolvePromise;
          let rejectPromise;
          const promise = newPromise((resolve, reject) => {
            resolvePromise = resolve;
            rejectPromise = reject;
          });
          const readRequest = {
            _chunkSteps: (chunk) => {
              this._ongoingPromise = void 0;
              _queueMicrotask(() => resolvePromise({ value: chunk, done: false }));
            },
            _closeSteps: () => {
              this._ongoingPromise = void 0;
              this._isFinished = true;
              ReadableStreamReaderGenericRelease(reader);
              resolvePromise({ value: void 0, done: true });
            },
            _errorSteps: (reason) => {
              this._ongoingPromise = void 0;
              this._isFinished = true;
              ReadableStreamReaderGenericRelease(reader);
              rejectPromise(reason);
            }
          };
          ReadableStreamDefaultReaderRead(reader, readRequest);
          return promise;
        }
        _returnSteps(value) {
          if (this._isFinished) {
            return Promise.resolve({ value, done: true });
          }
          this._isFinished = true;
          const reader = this._reader;
          if (!this._preventCancel) {
            const result = ReadableStreamReaderGenericCancel(reader, value);
            ReadableStreamReaderGenericRelease(reader);
            return transformPromiseWith(result, () => ({ value, done: true }));
          }
          ReadableStreamReaderGenericRelease(reader);
          return promiseResolvedWith({ value, done: true });
        }
      }
      const ReadableStreamAsyncIteratorPrototype = {
        next() {
          if (!IsReadableStreamAsyncIterator(this)) {
            return promiseRejectedWith(streamAsyncIteratorBrandCheckException("next"));
          }
          return this._asyncIteratorImpl.next();
        },
        return(value) {
          if (!IsReadableStreamAsyncIterator(this)) {
            return promiseRejectedWith(streamAsyncIteratorBrandCheckException("return"));
          }
          return this._asyncIteratorImpl.return(value);
        }
      };
      Object.setPrototypeOf(ReadableStreamAsyncIteratorPrototype, AsyncIteratorPrototype);
      function AcquireReadableStreamAsyncIterator(stream, preventCancel) {
        const reader = AcquireReadableStreamDefaultReader(stream);
        const impl = new ReadableStreamAsyncIteratorImpl(reader, preventCancel);
        const iterator = Object.create(ReadableStreamAsyncIteratorPrototype);
        iterator._asyncIteratorImpl = impl;
        return iterator;
      }
      function IsReadableStreamAsyncIterator(x3) {
        if (!typeIsObject(x3)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x3, "_asyncIteratorImpl")) {
          return false;
        }
        try {
          return x3._asyncIteratorImpl instanceof ReadableStreamAsyncIteratorImpl;
        } catch (_a3) {
          return false;
        }
      }
      function streamAsyncIteratorBrandCheckException(name) {
        return new TypeError(`ReadableStreamAsyncIterator.${name} can only be used on a ReadableSteamAsyncIterator`);
      }
      const NumberIsNaN = Number.isNaN || function(x3) {
        return x3 !== x3;
      };
      var _a2, _b, _c2;
      function CreateArrayFromList(elements) {
        return elements.slice();
      }
      function CopyDataBlockBytes(dest, destOffset, src, srcOffset, n) {
        new Uint8Array(dest).set(new Uint8Array(src, srcOffset, n), destOffset);
      }
      let TransferArrayBuffer = (O) => {
        if (typeof O.transfer === "function") {
          TransferArrayBuffer = (buffer) => buffer.transfer();
        } else if (typeof structuredClone === "function") {
          TransferArrayBuffer = (buffer) => structuredClone(buffer, { transfer: [buffer] });
        } else {
          TransferArrayBuffer = (buffer) => buffer;
        }
        return TransferArrayBuffer(O);
      };
      let IsDetachedBuffer = (O) => {
        if (typeof O.detached === "boolean") {
          IsDetachedBuffer = (buffer) => buffer.detached;
        } else {
          IsDetachedBuffer = (buffer) => buffer.byteLength === 0;
        }
        return IsDetachedBuffer(O);
      };
      function ArrayBufferSlice(buffer, begin, end) {
        if (buffer.slice) {
          return buffer.slice(begin, end);
        }
        const length = end - begin;
        const slice = new ArrayBuffer(length);
        CopyDataBlockBytes(slice, 0, buffer, begin, length);
        return slice;
      }
      function GetMethod(receiver, prop) {
        const func = receiver[prop];
        if (func === void 0 || func === null) {
          return void 0;
        }
        if (typeof func !== "function") {
          throw new TypeError(`${String(prop)} is not a function`);
        }
        return func;
      }
      function CreateAsyncFromSyncIterator(syncIteratorRecord) {
        const syncIterable = {
          [Symbol.iterator]: () => syncIteratorRecord.iterator
        };
        const asyncIterator = async function* () {
          return yield* syncIterable;
        }();
        const nextMethod = asyncIterator.next;
        return { iterator: asyncIterator, nextMethod, done: false };
      }
      const SymbolAsyncIterator = (_c2 = (_a2 = Symbol.asyncIterator) !== null && _a2 !== void 0 ? _a2 : (_b = Symbol.for) === null || _b === void 0 ? void 0 : _b.call(Symbol, "Symbol.asyncIterator")) !== null && _c2 !== void 0 ? _c2 : "@@asyncIterator";
      function GetIterator(obj, hint = "sync", method) {
        if (method === void 0) {
          if (hint === "async") {
            method = GetMethod(obj, SymbolAsyncIterator);
            if (method === void 0) {
              const syncMethod = GetMethod(obj, Symbol.iterator);
              const syncIteratorRecord = GetIterator(obj, "sync", syncMethod);
              return CreateAsyncFromSyncIterator(syncIteratorRecord);
            }
          } else {
            method = GetMethod(obj, Symbol.iterator);
          }
        }
        if (method === void 0) {
          throw new TypeError("The object is not iterable");
        }
        const iterator = reflectCall(method, obj, []);
        if (!typeIsObject(iterator)) {
          throw new TypeError("The iterator method must return an object");
        }
        const nextMethod = iterator.next;
        return { iterator, nextMethod, done: false };
      }
      function IteratorNext(iteratorRecord) {
        const result = reflectCall(iteratorRecord.nextMethod, iteratorRecord.iterator, []);
        if (!typeIsObject(result)) {
          throw new TypeError("The iterator.next() method must return an object");
        }
        return result;
      }
      function IteratorComplete(iterResult) {
        return Boolean(iterResult.done);
      }
      function IteratorValue(iterResult) {
        return iterResult.value;
      }
      function IsNonNegativeNumber(v) {
        if (typeof v !== "number") {
          return false;
        }
        if (NumberIsNaN(v)) {
          return false;
        }
        if (v < 0) {
          return false;
        }
        return true;
      }
      function CloneAsUint8Array(O) {
        const buffer = ArrayBufferSlice(O.buffer, O.byteOffset, O.byteOffset + O.byteLength);
        return new Uint8Array(buffer);
      }
      function DequeueValue(container) {
        const pair = container._queue.shift();
        container._queueTotalSize -= pair.size;
        if (container._queueTotalSize < 0) {
          container._queueTotalSize = 0;
        }
        return pair.value;
      }
      function EnqueueValueWithSize(container, value, size) {
        if (!IsNonNegativeNumber(size) || size === Infinity) {
          throw new RangeError("Size must be a finite, non-NaN, non-negative number.");
        }
        container._queue.push({ value, size });
        container._queueTotalSize += size;
      }
      function PeekQueueValue(container) {
        const pair = container._queue.peek();
        return pair.value;
      }
      function ResetQueue(container) {
        container._queue = new SimpleQueue();
        container._queueTotalSize = 0;
      }
      function isDataViewConstructor(ctor) {
        return ctor === DataView;
      }
      function isDataView(view) {
        return isDataViewConstructor(view.constructor);
      }
      function arrayBufferViewElementSize(ctor) {
        if (isDataViewConstructor(ctor)) {
          return 1;
        }
        return ctor.BYTES_PER_ELEMENT;
      }
      class ReadableStreamBYOBRequest {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        /**
         * Returns the view for writing in to, or `null` if the BYOB request has already been responded to.
         */
        get view() {
          if (!IsReadableStreamBYOBRequest(this)) {
            throw byobRequestBrandCheckException("view");
          }
          return this._view;
        }
        respond(bytesWritten) {
          if (!IsReadableStreamBYOBRequest(this)) {
            throw byobRequestBrandCheckException("respond");
          }
          assertRequiredArgument(bytesWritten, 1, "respond");
          bytesWritten = convertUnsignedLongLongWithEnforceRange(bytesWritten, "First parameter");
          if (this._associatedReadableByteStreamController === void 0) {
            throw new TypeError("This BYOB request has been invalidated");
          }
          if (IsDetachedBuffer(this._view.buffer)) {
            throw new TypeError(`The BYOB request's buffer has been detached and so cannot be used as a response`);
          }
          ReadableByteStreamControllerRespond(this._associatedReadableByteStreamController, bytesWritten);
        }
        respondWithNewView(view) {
          if (!IsReadableStreamBYOBRequest(this)) {
            throw byobRequestBrandCheckException("respondWithNewView");
          }
          assertRequiredArgument(view, 1, "respondWithNewView");
          if (!ArrayBuffer.isView(view)) {
            throw new TypeError("You can only respond with array buffer views");
          }
          if (this._associatedReadableByteStreamController === void 0) {
            throw new TypeError("This BYOB request has been invalidated");
          }
          if (IsDetachedBuffer(view.buffer)) {
            throw new TypeError("The given view's buffer has been detached and so cannot be used as a response");
          }
          ReadableByteStreamControllerRespondWithNewView(this._associatedReadableByteStreamController, view);
        }
      }
      Object.defineProperties(ReadableStreamBYOBRequest.prototype, {
        respond: { enumerable: true },
        respondWithNewView: { enumerable: true },
        view: { enumerable: true }
      });
      setFunctionName(ReadableStreamBYOBRequest.prototype.respond, "respond");
      setFunctionName(ReadableStreamBYOBRequest.prototype.respondWithNewView, "respondWithNewView");
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(ReadableStreamBYOBRequest.prototype, Symbol.toStringTag, {
          value: "ReadableStreamBYOBRequest",
          configurable: true
        });
      }
      class ReadableByteStreamController {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        /**
         * Returns the current BYOB pull request, or `null` if there isn't one.
         */
        get byobRequest() {
          if (!IsReadableByteStreamController(this)) {
            throw byteStreamControllerBrandCheckException("byobRequest");
          }
          return ReadableByteStreamControllerGetBYOBRequest(this);
        }
        /**
         * Returns the desired size to fill the controlled stream's internal queue. It can be negative, if the queue is
         * over-full. An underlying byte source ought to use this information to determine when and how to apply backpressure.
         */
        get desiredSize() {
          if (!IsReadableByteStreamController(this)) {
            throw byteStreamControllerBrandCheckException("desiredSize");
          }
          return ReadableByteStreamControllerGetDesiredSize(this);
        }
        /**
         * Closes the controlled readable stream. Consumers will still be able to read any previously-enqueued chunks from
         * the stream, but once those are read, the stream will become closed.
         */
        close() {
          if (!IsReadableByteStreamController(this)) {
            throw byteStreamControllerBrandCheckException("close");
          }
          if (this._closeRequested) {
            throw new TypeError("The stream has already been closed; do not close it again!");
          }
          const state = this._controlledReadableByteStream._state;
          if (state !== "readable") {
            throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be closed`);
          }
          ReadableByteStreamControllerClose(this);
        }
        enqueue(chunk) {
          if (!IsReadableByteStreamController(this)) {
            throw byteStreamControllerBrandCheckException("enqueue");
          }
          assertRequiredArgument(chunk, 1, "enqueue");
          if (!ArrayBuffer.isView(chunk)) {
            throw new TypeError("chunk must be an array buffer view");
          }
          if (chunk.byteLength === 0) {
            throw new TypeError("chunk must have non-zero byteLength");
          }
          if (chunk.buffer.byteLength === 0) {
            throw new TypeError(`chunk's buffer must have non-zero byteLength`);
          }
          if (this._closeRequested) {
            throw new TypeError("stream is closed or draining");
          }
          const state = this._controlledReadableByteStream._state;
          if (state !== "readable") {
            throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be enqueued to`);
          }
          ReadableByteStreamControllerEnqueue(this, chunk);
        }
        /**
         * Errors the controlled readable stream, making all future interactions with it fail with the given error `e`.
         */
        error(e2 = void 0) {
          if (!IsReadableByteStreamController(this)) {
            throw byteStreamControllerBrandCheckException("error");
          }
          ReadableByteStreamControllerError(this, e2);
        }
        /** @internal */
        [CancelSteps](reason) {
          ReadableByteStreamControllerClearPendingPullIntos(this);
          ResetQueue(this);
          const result = this._cancelAlgorithm(reason);
          ReadableByteStreamControllerClearAlgorithms(this);
          return result;
        }
        /** @internal */
        [PullSteps](readRequest) {
          const stream = this._controlledReadableByteStream;
          if (this._queueTotalSize > 0) {
            ReadableByteStreamControllerFillReadRequestFromQueue(this, readRequest);
            return;
          }
          const autoAllocateChunkSize = this._autoAllocateChunkSize;
          if (autoAllocateChunkSize !== void 0) {
            let buffer;
            try {
              buffer = new ArrayBuffer(autoAllocateChunkSize);
            } catch (bufferE) {
              readRequest._errorSteps(bufferE);
              return;
            }
            const pullIntoDescriptor = {
              buffer,
              bufferByteLength: autoAllocateChunkSize,
              byteOffset: 0,
              byteLength: autoAllocateChunkSize,
              bytesFilled: 0,
              minimumFill: 1,
              elementSize: 1,
              viewConstructor: Uint8Array,
              readerType: "default"
            };
            this._pendingPullIntos.push(pullIntoDescriptor);
          }
          ReadableStreamAddReadRequest(stream, readRequest);
          ReadableByteStreamControllerCallPullIfNeeded(this);
        }
        /** @internal */
        [ReleaseSteps]() {
          if (this._pendingPullIntos.length > 0) {
            const firstPullInto = this._pendingPullIntos.peek();
            firstPullInto.readerType = "none";
            this._pendingPullIntos = new SimpleQueue();
            this._pendingPullIntos.push(firstPullInto);
          }
        }
      }
      Object.defineProperties(ReadableByteStreamController.prototype, {
        close: { enumerable: true },
        enqueue: { enumerable: true },
        error: { enumerable: true },
        byobRequest: { enumerable: true },
        desiredSize: { enumerable: true }
      });
      setFunctionName(ReadableByteStreamController.prototype.close, "close");
      setFunctionName(ReadableByteStreamController.prototype.enqueue, "enqueue");
      setFunctionName(ReadableByteStreamController.prototype.error, "error");
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(ReadableByteStreamController.prototype, Symbol.toStringTag, {
          value: "ReadableByteStreamController",
          configurable: true
        });
      }
      function IsReadableByteStreamController(x3) {
        if (!typeIsObject(x3)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x3, "_controlledReadableByteStream")) {
          return false;
        }
        return x3 instanceof ReadableByteStreamController;
      }
      function IsReadableStreamBYOBRequest(x3) {
        if (!typeIsObject(x3)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x3, "_associatedReadableByteStreamController")) {
          return false;
        }
        return x3 instanceof ReadableStreamBYOBRequest;
      }
      function ReadableByteStreamControllerCallPullIfNeeded(controller) {
        const shouldPull = ReadableByteStreamControllerShouldCallPull(controller);
        if (!shouldPull) {
          return;
        }
        if (controller._pulling) {
          controller._pullAgain = true;
          return;
        }
        controller._pulling = true;
        const pullPromise = controller._pullAlgorithm();
        uponPromise(pullPromise, () => {
          controller._pulling = false;
          if (controller._pullAgain) {
            controller._pullAgain = false;
            ReadableByteStreamControllerCallPullIfNeeded(controller);
          }
          return null;
        }, (e2) => {
          ReadableByteStreamControllerError(controller, e2);
          return null;
        });
      }
      function ReadableByteStreamControllerClearPendingPullIntos(controller) {
        ReadableByteStreamControllerInvalidateBYOBRequest(controller);
        controller._pendingPullIntos = new SimpleQueue();
      }
      function ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor) {
        let done = false;
        if (stream._state === "closed") {
          done = true;
        }
        const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
        if (pullIntoDescriptor.readerType === "default") {
          ReadableStreamFulfillReadRequest(stream, filledView, done);
        } else {
          ReadableStreamFulfillReadIntoRequest(stream, filledView, done);
        }
      }
      function ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor) {
        const bytesFilled = pullIntoDescriptor.bytesFilled;
        const elementSize = pullIntoDescriptor.elementSize;
        return new pullIntoDescriptor.viewConstructor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, bytesFilled / elementSize);
      }
      function ReadableByteStreamControllerEnqueueChunkToQueue(controller, buffer, byteOffset, byteLength) {
        controller._queue.push({ buffer, byteOffset, byteLength });
        controller._queueTotalSize += byteLength;
      }
      function ReadableByteStreamControllerEnqueueClonedChunkToQueue(controller, buffer, byteOffset, byteLength) {
        let clonedChunk;
        try {
          clonedChunk = ArrayBufferSlice(buffer, byteOffset, byteOffset + byteLength);
        } catch (cloneE) {
          ReadableByteStreamControllerError(controller, cloneE);
          throw cloneE;
        }
        ReadableByteStreamControllerEnqueueChunkToQueue(controller, clonedChunk, 0, byteLength);
      }
      function ReadableByteStreamControllerEnqueueDetachedPullIntoToQueue(controller, firstDescriptor) {
        if (firstDescriptor.bytesFilled > 0) {
          ReadableByteStreamControllerEnqueueClonedChunkToQueue(controller, firstDescriptor.buffer, firstDescriptor.byteOffset, firstDescriptor.bytesFilled);
        }
        ReadableByteStreamControllerShiftPendingPullInto(controller);
      }
      function ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor) {
        const maxBytesToCopy = Math.min(controller._queueTotalSize, pullIntoDescriptor.byteLength - pullIntoDescriptor.bytesFilled);
        const maxBytesFilled = pullIntoDescriptor.bytesFilled + maxBytesToCopy;
        let totalBytesToCopyRemaining = maxBytesToCopy;
        let ready = false;
        const remainderBytes = maxBytesFilled % pullIntoDescriptor.elementSize;
        const maxAlignedBytes = maxBytesFilled - remainderBytes;
        if (maxAlignedBytes >= pullIntoDescriptor.minimumFill) {
          totalBytesToCopyRemaining = maxAlignedBytes - pullIntoDescriptor.bytesFilled;
          ready = true;
        }
        const queue = controller._queue;
        while (totalBytesToCopyRemaining > 0) {
          const headOfQueue = queue.peek();
          const bytesToCopy = Math.min(totalBytesToCopyRemaining, headOfQueue.byteLength);
          const destStart = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
          CopyDataBlockBytes(pullIntoDescriptor.buffer, destStart, headOfQueue.buffer, headOfQueue.byteOffset, bytesToCopy);
          if (headOfQueue.byteLength === bytesToCopy) {
            queue.shift();
          } else {
            headOfQueue.byteOffset += bytesToCopy;
            headOfQueue.byteLength -= bytesToCopy;
          }
          controller._queueTotalSize -= bytesToCopy;
          ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesToCopy, pullIntoDescriptor);
          totalBytesToCopyRemaining -= bytesToCopy;
        }
        return ready;
      }
      function ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, size, pullIntoDescriptor) {
        pullIntoDescriptor.bytesFilled += size;
      }
      function ReadableByteStreamControllerHandleQueueDrain(controller) {
        if (controller._queueTotalSize === 0 && controller._closeRequested) {
          ReadableByteStreamControllerClearAlgorithms(controller);
          ReadableStreamClose(controller._controlledReadableByteStream);
        } else {
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
      }
      function ReadableByteStreamControllerInvalidateBYOBRequest(controller) {
        if (controller._byobRequest === null) {
          return;
        }
        controller._byobRequest._associatedReadableByteStreamController = void 0;
        controller._byobRequest._view = null;
        controller._byobRequest = null;
      }
      function ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller) {
        while (controller._pendingPullIntos.length > 0) {
          if (controller._queueTotalSize === 0) {
            return;
          }
          const pullIntoDescriptor = controller._pendingPullIntos.peek();
          if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
            ReadableByteStreamControllerShiftPendingPullInto(controller);
            ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
          }
        }
      }
      function ReadableByteStreamControllerProcessReadRequestsUsingQueue(controller) {
        const reader = controller._controlledReadableByteStream._reader;
        while (reader._readRequests.length > 0) {
          if (controller._queueTotalSize === 0) {
            return;
          }
          const readRequest = reader._readRequests.shift();
          ReadableByteStreamControllerFillReadRequestFromQueue(controller, readRequest);
        }
      }
      function ReadableByteStreamControllerPullInto(controller, view, min, readIntoRequest) {
        const stream = controller._controlledReadableByteStream;
        const ctor = view.constructor;
        const elementSize = arrayBufferViewElementSize(ctor);
        const { byteOffset, byteLength } = view;
        const minimumFill = min * elementSize;
        let buffer;
        try {
          buffer = TransferArrayBuffer(view.buffer);
        } catch (e2) {
          readIntoRequest._errorSteps(e2);
          return;
        }
        const pullIntoDescriptor = {
          buffer,
          bufferByteLength: buffer.byteLength,
          byteOffset,
          byteLength,
          bytesFilled: 0,
          minimumFill,
          elementSize,
          viewConstructor: ctor,
          readerType: "byob"
        };
        if (controller._pendingPullIntos.length > 0) {
          controller._pendingPullIntos.push(pullIntoDescriptor);
          ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
          return;
        }
        if (stream._state === "closed") {
          const emptyView = new ctor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, 0);
          readIntoRequest._closeSteps(emptyView);
          return;
        }
        if (controller._queueTotalSize > 0) {
          if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
            const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
            ReadableByteStreamControllerHandleQueueDrain(controller);
            readIntoRequest._chunkSteps(filledView);
            return;
          }
          if (controller._closeRequested) {
            const e2 = new TypeError("Insufficient bytes to fill elements in the given buffer");
            ReadableByteStreamControllerError(controller, e2);
            readIntoRequest._errorSteps(e2);
            return;
          }
        }
        controller._pendingPullIntos.push(pullIntoDescriptor);
        ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
        ReadableByteStreamControllerCallPullIfNeeded(controller);
      }
      function ReadableByteStreamControllerRespondInClosedState(controller, firstDescriptor) {
        if (firstDescriptor.readerType === "none") {
          ReadableByteStreamControllerShiftPendingPullInto(controller);
        }
        const stream = controller._controlledReadableByteStream;
        if (ReadableStreamHasBYOBReader(stream)) {
          while (ReadableStreamGetNumReadIntoRequests(stream) > 0) {
            const pullIntoDescriptor = ReadableByteStreamControllerShiftPendingPullInto(controller);
            ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor);
          }
        }
      }
      function ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, pullIntoDescriptor) {
        ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesWritten, pullIntoDescriptor);
        if (pullIntoDescriptor.readerType === "none") {
          ReadableByteStreamControllerEnqueueDetachedPullIntoToQueue(controller, pullIntoDescriptor);
          ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
          return;
        }
        if (pullIntoDescriptor.bytesFilled < pullIntoDescriptor.minimumFill) {
          return;
        }
        ReadableByteStreamControllerShiftPendingPullInto(controller);
        const remainderSize = pullIntoDescriptor.bytesFilled % pullIntoDescriptor.elementSize;
        if (remainderSize > 0) {
          const end = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
          ReadableByteStreamControllerEnqueueClonedChunkToQueue(controller, pullIntoDescriptor.buffer, end - remainderSize, remainderSize);
        }
        pullIntoDescriptor.bytesFilled -= remainderSize;
        ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
        ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
      }
      function ReadableByteStreamControllerRespondInternal(controller, bytesWritten) {
        const firstDescriptor = controller._pendingPullIntos.peek();
        ReadableByteStreamControllerInvalidateBYOBRequest(controller);
        const state = controller._controlledReadableByteStream._state;
        if (state === "closed") {
          ReadableByteStreamControllerRespondInClosedState(controller, firstDescriptor);
        } else {
          ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, firstDescriptor);
        }
        ReadableByteStreamControllerCallPullIfNeeded(controller);
      }
      function ReadableByteStreamControllerShiftPendingPullInto(controller) {
        const descriptor = controller._pendingPullIntos.shift();
        return descriptor;
      }
      function ReadableByteStreamControllerShouldCallPull(controller) {
        const stream = controller._controlledReadableByteStream;
        if (stream._state !== "readable") {
          return false;
        }
        if (controller._closeRequested) {
          return false;
        }
        if (!controller._started) {
          return false;
        }
        if (ReadableStreamHasDefaultReader(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
          return true;
        }
        if (ReadableStreamHasBYOBReader(stream) && ReadableStreamGetNumReadIntoRequests(stream) > 0) {
          return true;
        }
        const desiredSize = ReadableByteStreamControllerGetDesiredSize(controller);
        if (desiredSize > 0) {
          return true;
        }
        return false;
      }
      function ReadableByteStreamControllerClearAlgorithms(controller) {
        controller._pullAlgorithm = void 0;
        controller._cancelAlgorithm = void 0;
      }
      function ReadableByteStreamControllerClose(controller) {
        const stream = controller._controlledReadableByteStream;
        if (controller._closeRequested || stream._state !== "readable") {
          return;
        }
        if (controller._queueTotalSize > 0) {
          controller._closeRequested = true;
          return;
        }
        if (controller._pendingPullIntos.length > 0) {
          const firstPendingPullInto = controller._pendingPullIntos.peek();
          if (firstPendingPullInto.bytesFilled % firstPendingPullInto.elementSize !== 0) {
            const e2 = new TypeError("Insufficient bytes to fill elements in the given buffer");
            ReadableByteStreamControllerError(controller, e2);
            throw e2;
          }
        }
        ReadableByteStreamControllerClearAlgorithms(controller);
        ReadableStreamClose(stream);
      }
      function ReadableByteStreamControllerEnqueue(controller, chunk) {
        const stream = controller._controlledReadableByteStream;
        if (controller._closeRequested || stream._state !== "readable") {
          return;
        }
        const { buffer, byteOffset, byteLength } = chunk;
        if (IsDetachedBuffer(buffer)) {
          throw new TypeError("chunk's buffer is detached and so cannot be enqueued");
        }
        const transferredBuffer = TransferArrayBuffer(buffer);
        if (controller._pendingPullIntos.length > 0) {
          const firstPendingPullInto = controller._pendingPullIntos.peek();
          if (IsDetachedBuffer(firstPendingPullInto.buffer)) {
            throw new TypeError("The BYOB request's buffer has been detached and so cannot be filled with an enqueued chunk");
          }
          ReadableByteStreamControllerInvalidateBYOBRequest(controller);
          firstPendingPullInto.buffer = TransferArrayBuffer(firstPendingPullInto.buffer);
          if (firstPendingPullInto.readerType === "none") {
            ReadableByteStreamControllerEnqueueDetachedPullIntoToQueue(controller, firstPendingPullInto);
          }
        }
        if (ReadableStreamHasDefaultReader(stream)) {
          ReadableByteStreamControllerProcessReadRequestsUsingQueue(controller);
          if (ReadableStreamGetNumReadRequests(stream) === 0) {
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
          } else {
            if (controller._pendingPullIntos.length > 0) {
              ReadableByteStreamControllerShiftPendingPullInto(controller);
            }
            const transferredView = new Uint8Array(transferredBuffer, byteOffset, byteLength);
            ReadableStreamFulfillReadRequest(stream, transferredView, false);
          }
        } else if (ReadableStreamHasBYOBReader(stream)) {
          ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
          ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
        } else {
          ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
        }
        ReadableByteStreamControllerCallPullIfNeeded(controller);
      }
      function ReadableByteStreamControllerError(controller, e2) {
        const stream = controller._controlledReadableByteStream;
        if (stream._state !== "readable") {
          return;
        }
        ReadableByteStreamControllerClearPendingPullIntos(controller);
        ResetQueue(controller);
        ReadableByteStreamControllerClearAlgorithms(controller);
        ReadableStreamError(stream, e2);
      }
      function ReadableByteStreamControllerFillReadRequestFromQueue(controller, readRequest) {
        const entry = controller._queue.shift();
        controller._queueTotalSize -= entry.byteLength;
        ReadableByteStreamControllerHandleQueueDrain(controller);
        const view = new Uint8Array(entry.buffer, entry.byteOffset, entry.byteLength);
        readRequest._chunkSteps(view);
      }
      function ReadableByteStreamControllerGetBYOBRequest(controller) {
        if (controller._byobRequest === null && controller._pendingPullIntos.length > 0) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          const view = new Uint8Array(firstDescriptor.buffer, firstDescriptor.byteOffset + firstDescriptor.bytesFilled, firstDescriptor.byteLength - firstDescriptor.bytesFilled);
          const byobRequest = Object.create(ReadableStreamBYOBRequest.prototype);
          SetUpReadableStreamBYOBRequest(byobRequest, controller, view);
          controller._byobRequest = byobRequest;
        }
        return controller._byobRequest;
      }
      function ReadableByteStreamControllerGetDesiredSize(controller) {
        const state = controller._controlledReadableByteStream._state;
        if (state === "errored") {
          return null;
        }
        if (state === "closed") {
          return 0;
        }
        return controller._strategyHWM - controller._queueTotalSize;
      }
      function ReadableByteStreamControllerRespond(controller, bytesWritten) {
        const firstDescriptor = controller._pendingPullIntos.peek();
        const state = controller._controlledReadableByteStream._state;
        if (state === "closed") {
          if (bytesWritten !== 0) {
            throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream");
          }
        } else {
          if (bytesWritten === 0) {
            throw new TypeError("bytesWritten must be greater than 0 when calling respond() on a readable stream");
          }
          if (firstDescriptor.bytesFilled + bytesWritten > firstDescriptor.byteLength) {
            throw new RangeError("bytesWritten out of range");
          }
        }
        firstDescriptor.buffer = TransferArrayBuffer(firstDescriptor.buffer);
        ReadableByteStreamControllerRespondInternal(controller, bytesWritten);
      }
      function ReadableByteStreamControllerRespondWithNewView(controller, view) {
        const firstDescriptor = controller._pendingPullIntos.peek();
        const state = controller._controlledReadableByteStream._state;
        if (state === "closed") {
          if (view.byteLength !== 0) {
            throw new TypeError("The view's length must be 0 when calling respondWithNewView() on a closed stream");
          }
        } else {
          if (view.byteLength === 0) {
            throw new TypeError("The view's length must be greater than 0 when calling respondWithNewView() on a readable stream");
          }
        }
        if (firstDescriptor.byteOffset + firstDescriptor.bytesFilled !== view.byteOffset) {
          throw new RangeError("The region specified by view does not match byobRequest");
        }
        if (firstDescriptor.bufferByteLength !== view.buffer.byteLength) {
          throw new RangeError("The buffer of view has different capacity than byobRequest");
        }
        if (firstDescriptor.bytesFilled + view.byteLength > firstDescriptor.byteLength) {
          throw new RangeError("The region specified by view is larger than byobRequest");
        }
        const viewByteLength = view.byteLength;
        firstDescriptor.buffer = TransferArrayBuffer(view.buffer);
        ReadableByteStreamControllerRespondInternal(controller, viewByteLength);
      }
      function SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize) {
        controller._controlledReadableByteStream = stream;
        controller._pullAgain = false;
        controller._pulling = false;
        controller._byobRequest = null;
        controller._queue = controller._queueTotalSize = void 0;
        ResetQueue(controller);
        controller._closeRequested = false;
        controller._started = false;
        controller._strategyHWM = highWaterMark;
        controller._pullAlgorithm = pullAlgorithm;
        controller._cancelAlgorithm = cancelAlgorithm;
        controller._autoAllocateChunkSize = autoAllocateChunkSize;
        controller._pendingPullIntos = new SimpleQueue();
        stream._readableStreamController = controller;
        const startResult = startAlgorithm();
        uponPromise(promiseResolvedWith(startResult), () => {
          controller._started = true;
          ReadableByteStreamControllerCallPullIfNeeded(controller);
          return null;
        }, (r2) => {
          ReadableByteStreamControllerError(controller, r2);
          return null;
        });
      }
      function SetUpReadableByteStreamControllerFromUnderlyingSource(stream, underlyingByteSource, highWaterMark) {
        const controller = Object.create(ReadableByteStreamController.prototype);
        let startAlgorithm;
        let pullAlgorithm;
        let cancelAlgorithm;
        if (underlyingByteSource.start !== void 0) {
          startAlgorithm = () => underlyingByteSource.start(controller);
        } else {
          startAlgorithm = () => void 0;
        }
        if (underlyingByteSource.pull !== void 0) {
          pullAlgorithm = () => underlyingByteSource.pull(controller);
        } else {
          pullAlgorithm = () => promiseResolvedWith(void 0);
        }
        if (underlyingByteSource.cancel !== void 0) {
          cancelAlgorithm = (reason) => underlyingByteSource.cancel(reason);
        } else {
          cancelAlgorithm = () => promiseResolvedWith(void 0);
        }
        const autoAllocateChunkSize = underlyingByteSource.autoAllocateChunkSize;
        if (autoAllocateChunkSize === 0) {
          throw new TypeError("autoAllocateChunkSize must be greater than 0");
        }
        SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize);
      }
      function SetUpReadableStreamBYOBRequest(request, controller, view) {
        request._associatedReadableByteStreamController = controller;
        request._view = view;
      }
      function byobRequestBrandCheckException(name) {
        return new TypeError(`ReadableStreamBYOBRequest.prototype.${name} can only be used on a ReadableStreamBYOBRequest`);
      }
      function byteStreamControllerBrandCheckException(name) {
        return new TypeError(`ReadableByteStreamController.prototype.${name} can only be used on a ReadableByteStreamController`);
      }
      function convertReaderOptions(options, context) {
        assertDictionary(options, context);
        const mode = options === null || options === void 0 ? void 0 : options.mode;
        return {
          mode: mode === void 0 ? void 0 : convertReadableStreamReaderMode(mode, `${context} has member 'mode' that`)
        };
      }
      function convertReadableStreamReaderMode(mode, context) {
        mode = `${mode}`;
        if (mode !== "byob") {
          throw new TypeError(`${context} '${mode}' is not a valid enumeration value for ReadableStreamReaderMode`);
        }
        return mode;
      }
      function convertByobReadOptions(options, context) {
        var _a3;
        assertDictionary(options, context);
        const min = (_a3 = options === null || options === void 0 ? void 0 : options.min) !== null && _a3 !== void 0 ? _a3 : 1;
        return {
          min: convertUnsignedLongLongWithEnforceRange(min, `${context} has member 'min' that`)
        };
      }
      function AcquireReadableStreamBYOBReader(stream) {
        return new ReadableStreamBYOBReader(stream);
      }
      function ReadableStreamAddReadIntoRequest(stream, readIntoRequest) {
        stream._reader._readIntoRequests.push(readIntoRequest);
      }
      function ReadableStreamFulfillReadIntoRequest(stream, chunk, done) {
        const reader = stream._reader;
        const readIntoRequest = reader._readIntoRequests.shift();
        if (done) {
          readIntoRequest._closeSteps(chunk);
        } else {
          readIntoRequest._chunkSteps(chunk);
        }
      }
      function ReadableStreamGetNumReadIntoRequests(stream) {
        return stream._reader._readIntoRequests.length;
      }
      function ReadableStreamHasBYOBReader(stream) {
        const reader = stream._reader;
        if (reader === void 0) {
          return false;
        }
        if (!IsReadableStreamBYOBReader(reader)) {
          return false;
        }
        return true;
      }
      class ReadableStreamBYOBReader {
        constructor(stream) {
          assertRequiredArgument(stream, 1, "ReadableStreamBYOBReader");
          assertReadableStream(stream, "First parameter");
          if (IsReadableStreamLocked(stream)) {
            throw new TypeError("This stream has already been locked for exclusive reading by another reader");
          }
          if (!IsReadableByteStreamController(stream._readableStreamController)) {
            throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");
          }
          ReadableStreamReaderGenericInitialize(this, stream);
          this._readIntoRequests = new SimpleQueue();
        }
        /**
         * Returns a promise that will be fulfilled when the stream becomes closed, or rejected if the stream ever errors or
         * the reader's lock is released before the stream finishes closing.
         */
        get closed() {
          if (!IsReadableStreamBYOBReader(this)) {
            return promiseRejectedWith(byobReaderBrandCheckException("closed"));
          }
          return this._closedPromise;
        }
        /**
         * If the reader is active, behaves the same as {@link ReadableStream.cancel | stream.cancel(reason)}.
         */
        cancel(reason = void 0) {
          if (!IsReadableStreamBYOBReader(this)) {
            return promiseRejectedWith(byobReaderBrandCheckException("cancel"));
          }
          if (this._ownerReadableStream === void 0) {
            return promiseRejectedWith(readerLockException("cancel"));
          }
          return ReadableStreamReaderGenericCancel(this, reason);
        }
        read(view, rawOptions = {}) {
          if (!IsReadableStreamBYOBReader(this)) {
            return promiseRejectedWith(byobReaderBrandCheckException("read"));
          }
          if (!ArrayBuffer.isView(view)) {
            return promiseRejectedWith(new TypeError("view must be an array buffer view"));
          }
          if (view.byteLength === 0) {
            return promiseRejectedWith(new TypeError("view must have non-zero byteLength"));
          }
          if (view.buffer.byteLength === 0) {
            return promiseRejectedWith(new TypeError(`view's buffer must have non-zero byteLength`));
          }
          if (IsDetachedBuffer(view.buffer)) {
            return promiseRejectedWith(new TypeError("view's buffer has been detached"));
          }
          let options;
          try {
            options = convertByobReadOptions(rawOptions, "options");
          } catch (e2) {
            return promiseRejectedWith(e2);
          }
          const min = options.min;
          if (min === 0) {
            return promiseRejectedWith(new TypeError("options.min must be greater than 0"));
          }
          if (!isDataView(view)) {
            if (min > view.length) {
              return promiseRejectedWith(new RangeError("options.min must be less than or equal to view's length"));
            }
          } else if (min > view.byteLength) {
            return promiseRejectedWith(new RangeError("options.min must be less than or equal to view's byteLength"));
          }
          if (this._ownerReadableStream === void 0) {
            return promiseRejectedWith(readerLockException("read from"));
          }
          let resolvePromise;
          let rejectPromise;
          const promise = newPromise((resolve, reject) => {
            resolvePromise = resolve;
            rejectPromise = reject;
          });
          const readIntoRequest = {
            _chunkSteps: (chunk) => resolvePromise({ value: chunk, done: false }),
            _closeSteps: (chunk) => resolvePromise({ value: chunk, done: true }),
            _errorSteps: (e2) => rejectPromise(e2)
          };
          ReadableStreamBYOBReaderRead(this, view, min, readIntoRequest);
          return promise;
        }
        /**
         * Releases the reader's lock on the corresponding stream. After the lock is released, the reader is no longer active.
         * If the associated stream is errored when the lock is released, the reader will appear errored in the same way
         * from now on; otherwise, the reader will appear closed.
         *
         * A reader's lock cannot be released while it still has a pending read request, i.e., if a promise returned by
         * the reader's {@link ReadableStreamBYOBReader.read | read()} method has not yet been settled. Attempting to
         * do so will throw a `TypeError` and leave the reader locked to the stream.
         */
        releaseLock() {
          if (!IsReadableStreamBYOBReader(this)) {
            throw byobReaderBrandCheckException("releaseLock");
          }
          if (this._ownerReadableStream === void 0) {
            return;
          }
          ReadableStreamBYOBReaderRelease(this);
        }
      }
      Object.defineProperties(ReadableStreamBYOBReader.prototype, {
        cancel: { enumerable: true },
        read: { enumerable: true },
        releaseLock: { enumerable: true },
        closed: { enumerable: true }
      });
      setFunctionName(ReadableStreamBYOBReader.prototype.cancel, "cancel");
      setFunctionName(ReadableStreamBYOBReader.prototype.read, "read");
      setFunctionName(ReadableStreamBYOBReader.prototype.releaseLock, "releaseLock");
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(ReadableStreamBYOBReader.prototype, Symbol.toStringTag, {
          value: "ReadableStreamBYOBReader",
          configurable: true
        });
      }
      function IsReadableStreamBYOBReader(x3) {
        if (!typeIsObject(x3)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x3, "_readIntoRequests")) {
          return false;
        }
        return x3 instanceof ReadableStreamBYOBReader;
      }
      function ReadableStreamBYOBReaderRead(reader, view, min, readIntoRequest) {
        const stream = reader._ownerReadableStream;
        stream._disturbed = true;
        if (stream._state === "errored") {
          readIntoRequest._errorSteps(stream._storedError);
        } else {
          ReadableByteStreamControllerPullInto(stream._readableStreamController, view, min, readIntoRequest);
        }
      }
      function ReadableStreamBYOBReaderRelease(reader) {
        ReadableStreamReaderGenericRelease(reader);
        const e2 = new TypeError("Reader was released");
        ReadableStreamBYOBReaderErrorReadIntoRequests(reader, e2);
      }
      function ReadableStreamBYOBReaderErrorReadIntoRequests(reader, e2) {
        const readIntoRequests = reader._readIntoRequests;
        reader._readIntoRequests = new SimpleQueue();
        readIntoRequests.forEach((readIntoRequest) => {
          readIntoRequest._errorSteps(e2);
        });
      }
      function byobReaderBrandCheckException(name) {
        return new TypeError(`ReadableStreamBYOBReader.prototype.${name} can only be used on a ReadableStreamBYOBReader`);
      }
      function ExtractHighWaterMark(strategy, defaultHWM) {
        const { highWaterMark } = strategy;
        if (highWaterMark === void 0) {
          return defaultHWM;
        }
        if (NumberIsNaN(highWaterMark) || highWaterMark < 0) {
          throw new RangeError("Invalid highWaterMark");
        }
        return highWaterMark;
      }
      function ExtractSizeAlgorithm(strategy) {
        const { size } = strategy;
        if (!size) {
          return () => 1;
        }
        return size;
      }
      function convertQueuingStrategy(init, context) {
        assertDictionary(init, context);
        const highWaterMark = init === null || init === void 0 ? void 0 : init.highWaterMark;
        const size = init === null || init === void 0 ? void 0 : init.size;
        return {
          highWaterMark: highWaterMark === void 0 ? void 0 : convertUnrestrictedDouble(highWaterMark),
          size: size === void 0 ? void 0 : convertQueuingStrategySize(size, `${context} has member 'size' that`)
        };
      }
      function convertQueuingStrategySize(fn2, context) {
        assertFunction(fn2, context);
        return (chunk) => convertUnrestrictedDouble(fn2(chunk));
      }
      function convertUnderlyingSink(original, context) {
        assertDictionary(original, context);
        const abort = original === null || original === void 0 ? void 0 : original.abort;
        const close = original === null || original === void 0 ? void 0 : original.close;
        const start = original === null || original === void 0 ? void 0 : original.start;
        const type = original === null || original === void 0 ? void 0 : original.type;
        const write = original === null || original === void 0 ? void 0 : original.write;
        return {
          abort: abort === void 0 ? void 0 : convertUnderlyingSinkAbortCallback(abort, original, `${context} has member 'abort' that`),
          close: close === void 0 ? void 0 : convertUnderlyingSinkCloseCallback(close, original, `${context} has member 'close' that`),
          start: start === void 0 ? void 0 : convertUnderlyingSinkStartCallback(start, original, `${context} has member 'start' that`),
          write: write === void 0 ? void 0 : convertUnderlyingSinkWriteCallback(write, original, `${context} has member 'write' that`),
          type
        };
      }
      function convertUnderlyingSinkAbortCallback(fn2, original, context) {
        assertFunction(fn2, context);
        return (reason) => promiseCall(fn2, original, [reason]);
      }
      function convertUnderlyingSinkCloseCallback(fn2, original, context) {
        assertFunction(fn2, context);
        return () => promiseCall(fn2, original, []);
      }
      function convertUnderlyingSinkStartCallback(fn2, original, context) {
        assertFunction(fn2, context);
        return (controller) => reflectCall(fn2, original, [controller]);
      }
      function convertUnderlyingSinkWriteCallback(fn2, original, context) {
        assertFunction(fn2, context);
        return (chunk, controller) => promiseCall(fn2, original, [chunk, controller]);
      }
      function assertWritableStream(x3, context) {
        if (!IsWritableStream(x3)) {
          throw new TypeError(`${context} is not a WritableStream.`);
        }
      }
      function isAbortSignal2(value) {
        if (typeof value !== "object" || value === null) {
          return false;
        }
        try {
          return typeof value.aborted === "boolean";
        } catch (_a3) {
          return false;
        }
      }
      const supportsAbortController = typeof AbortController === "function";
      function createAbortController() {
        if (supportsAbortController) {
          return new AbortController();
        }
        return void 0;
      }
      class WritableStream {
        constructor(rawUnderlyingSink = {}, rawStrategy = {}) {
          if (rawUnderlyingSink === void 0) {
            rawUnderlyingSink = null;
          } else {
            assertObject(rawUnderlyingSink, "First parameter");
          }
          const strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
          const underlyingSink = convertUnderlyingSink(rawUnderlyingSink, "First parameter");
          InitializeWritableStream(this);
          const type = underlyingSink.type;
          if (type !== void 0) {
            throw new RangeError("Invalid type is specified");
          }
          const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
          const highWaterMark = ExtractHighWaterMark(strategy, 1);
          SetUpWritableStreamDefaultControllerFromUnderlyingSink(this, underlyingSink, highWaterMark, sizeAlgorithm);
        }
        /**
         * Returns whether or not the writable stream is locked to a writer.
         */
        get locked() {
          if (!IsWritableStream(this)) {
            throw streamBrandCheckException$2("locked");
          }
          return IsWritableStreamLocked(this);
        }
        /**
         * Aborts the stream, signaling that the producer can no longer successfully write to the stream and it is to be
         * immediately moved to an errored state, with any queued-up writes discarded. This will also execute any abort
         * mechanism of the underlying sink.
         *
         * The returned promise will fulfill if the stream shuts down successfully, or reject if the underlying sink signaled
         * that there was an error doing so. Additionally, it will reject with a `TypeError` (without attempting to cancel
         * the stream) if the stream is currently locked.
         */
        abort(reason = void 0) {
          if (!IsWritableStream(this)) {
            return promiseRejectedWith(streamBrandCheckException$2("abort"));
          }
          if (IsWritableStreamLocked(this)) {
            return promiseRejectedWith(new TypeError("Cannot abort a stream that already has a writer"));
          }
          return WritableStreamAbort(this, reason);
        }
        /**
         * Closes the stream. The underlying sink will finish processing any previously-written chunks, before invoking its
         * close behavior. During this time any further attempts to write will fail (without erroring the stream).
         *
         * The method returns a promise that will fulfill if all remaining chunks are successfully written and the stream
         * successfully closes, or rejects if an error is encountered during this process. Additionally, it will reject with
         * a `TypeError` (without attempting to cancel the stream) if the stream is currently locked.
         */
        close() {
          if (!IsWritableStream(this)) {
            return promiseRejectedWith(streamBrandCheckException$2("close"));
          }
          if (IsWritableStreamLocked(this)) {
            return promiseRejectedWith(new TypeError("Cannot close a stream that already has a writer"));
          }
          if (WritableStreamCloseQueuedOrInFlight(this)) {
            return promiseRejectedWith(new TypeError("Cannot close an already-closing stream"));
          }
          return WritableStreamClose(this);
        }
        /**
         * Creates a {@link WritableStreamDefaultWriter | writer} and locks the stream to the new writer. While the stream
         * is locked, no other writer can be acquired until this one is released.
         *
         * This functionality is especially useful for creating abstractions that desire the ability to write to a stream
         * without interruption or interleaving. By getting a writer for the stream, you can ensure nobody else can write at
         * the same time, which would cause the resulting written data to be unpredictable and probably useless.
         */
        getWriter() {
          if (!IsWritableStream(this)) {
            throw streamBrandCheckException$2("getWriter");
          }
          return AcquireWritableStreamDefaultWriter(this);
        }
      }
      Object.defineProperties(WritableStream.prototype, {
        abort: { enumerable: true },
        close: { enumerable: true },
        getWriter: { enumerable: true },
        locked: { enumerable: true }
      });
      setFunctionName(WritableStream.prototype.abort, "abort");
      setFunctionName(WritableStream.prototype.close, "close");
      setFunctionName(WritableStream.prototype.getWriter, "getWriter");
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(WritableStream.prototype, Symbol.toStringTag, {
          value: "WritableStream",
          configurable: true
        });
      }
      function AcquireWritableStreamDefaultWriter(stream) {
        return new WritableStreamDefaultWriter(stream);
      }
      function CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
        const stream = Object.create(WritableStream.prototype);
        InitializeWritableStream(stream);
        const controller = Object.create(WritableStreamDefaultController.prototype);
        SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
        return stream;
      }
      function InitializeWritableStream(stream) {
        stream._state = "writable";
        stream._storedError = void 0;
        stream._writer = void 0;
        stream._writableStreamController = void 0;
        stream._writeRequests = new SimpleQueue();
        stream._inFlightWriteRequest = void 0;
        stream._closeRequest = void 0;
        stream._inFlightCloseRequest = void 0;
        stream._pendingAbortRequest = void 0;
        stream._backpressure = false;
      }
      function IsWritableStream(x3) {
        if (!typeIsObject(x3)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x3, "_writableStreamController")) {
          return false;
        }
        return x3 instanceof WritableStream;
      }
      function IsWritableStreamLocked(stream) {
        if (stream._writer === void 0) {
          return false;
        }
        return true;
      }
      function WritableStreamAbort(stream, reason) {
        var _a3;
        if (stream._state === "closed" || stream._state === "errored") {
          return promiseResolvedWith(void 0);
        }
        stream._writableStreamController._abortReason = reason;
        (_a3 = stream._writableStreamController._abortController) === null || _a3 === void 0 ? void 0 : _a3.abort(reason);
        const state = stream._state;
        if (state === "closed" || state === "errored") {
          return promiseResolvedWith(void 0);
        }
        if (stream._pendingAbortRequest !== void 0) {
          return stream._pendingAbortRequest._promise;
        }
        let wasAlreadyErroring = false;
        if (state === "erroring") {
          wasAlreadyErroring = true;
          reason = void 0;
        }
        const promise = newPromise((resolve, reject) => {
          stream._pendingAbortRequest = {
            _promise: void 0,
            _resolve: resolve,
            _reject: reject,
            _reason: reason,
            _wasAlreadyErroring: wasAlreadyErroring
          };
        });
        stream._pendingAbortRequest._promise = promise;
        if (!wasAlreadyErroring) {
          WritableStreamStartErroring(stream, reason);
        }
        return promise;
      }
      function WritableStreamClose(stream) {
        const state = stream._state;
        if (state === "closed" || state === "errored") {
          return promiseRejectedWith(new TypeError(`The stream (in ${state} state) is not in the writable state and cannot be closed`));
        }
        const promise = newPromise((resolve, reject) => {
          const closeRequest = {
            _resolve: resolve,
            _reject: reject
          };
          stream._closeRequest = closeRequest;
        });
        const writer = stream._writer;
        if (writer !== void 0 && stream._backpressure && state === "writable") {
          defaultWriterReadyPromiseResolve(writer);
        }
        WritableStreamDefaultControllerClose(stream._writableStreamController);
        return promise;
      }
      function WritableStreamAddWriteRequest(stream) {
        const promise = newPromise((resolve, reject) => {
          const writeRequest = {
            _resolve: resolve,
            _reject: reject
          };
          stream._writeRequests.push(writeRequest);
        });
        return promise;
      }
      function WritableStreamDealWithRejection(stream, error) {
        const state = stream._state;
        if (state === "writable") {
          WritableStreamStartErroring(stream, error);
          return;
        }
        WritableStreamFinishErroring(stream);
      }
      function WritableStreamStartErroring(stream, reason) {
        const controller = stream._writableStreamController;
        stream._state = "erroring";
        stream._storedError = reason;
        const writer = stream._writer;
        if (writer !== void 0) {
          WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, reason);
        }
        if (!WritableStreamHasOperationMarkedInFlight(stream) && controller._started) {
          WritableStreamFinishErroring(stream);
        }
      }
      function WritableStreamFinishErroring(stream) {
        stream._state = "errored";
        stream._writableStreamController[ErrorSteps]();
        const storedError = stream._storedError;
        stream._writeRequests.forEach((writeRequest) => {
          writeRequest._reject(storedError);
        });
        stream._writeRequests = new SimpleQueue();
        if (stream._pendingAbortRequest === void 0) {
          WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          return;
        }
        const abortRequest = stream._pendingAbortRequest;
        stream._pendingAbortRequest = void 0;
        if (abortRequest._wasAlreadyErroring) {
          abortRequest._reject(storedError);
          WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          return;
        }
        const promise = stream._writableStreamController[AbortSteps](abortRequest._reason);
        uponPromise(promise, () => {
          abortRequest._resolve();
          WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          return null;
        }, (reason) => {
          abortRequest._reject(reason);
          WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          return null;
        });
      }
      function WritableStreamFinishInFlightWrite(stream) {
        stream._inFlightWriteRequest._resolve(void 0);
        stream._inFlightWriteRequest = void 0;
      }
      function WritableStreamFinishInFlightWriteWithError(stream, error) {
        stream._inFlightWriteRequest._reject(error);
        stream._inFlightWriteRequest = void 0;
        WritableStreamDealWithRejection(stream, error);
      }
      function WritableStreamFinishInFlightClose(stream) {
        stream._inFlightCloseRequest._resolve(void 0);
        stream._inFlightCloseRequest = void 0;
        const state = stream._state;
        if (state === "erroring") {
          stream._storedError = void 0;
          if (stream._pendingAbortRequest !== void 0) {
            stream._pendingAbortRequest._resolve();
            stream._pendingAbortRequest = void 0;
          }
        }
        stream._state = "closed";
        const writer = stream._writer;
        if (writer !== void 0) {
          defaultWriterClosedPromiseResolve(writer);
        }
      }
      function WritableStreamFinishInFlightCloseWithError(stream, error) {
        stream._inFlightCloseRequest._reject(error);
        stream._inFlightCloseRequest = void 0;
        if (stream._pendingAbortRequest !== void 0) {
          stream._pendingAbortRequest._reject(error);
          stream._pendingAbortRequest = void 0;
        }
        WritableStreamDealWithRejection(stream, error);
      }
      function WritableStreamCloseQueuedOrInFlight(stream) {
        if (stream._closeRequest === void 0 && stream._inFlightCloseRequest === void 0) {
          return false;
        }
        return true;
      }
      function WritableStreamHasOperationMarkedInFlight(stream) {
        if (stream._inFlightWriteRequest === void 0 && stream._inFlightCloseRequest === void 0) {
          return false;
        }
        return true;
      }
      function WritableStreamMarkCloseRequestInFlight(stream) {
        stream._inFlightCloseRequest = stream._closeRequest;
        stream._closeRequest = void 0;
      }
      function WritableStreamMarkFirstWriteRequestInFlight(stream) {
        stream._inFlightWriteRequest = stream._writeRequests.shift();
      }
      function WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream) {
        if (stream._closeRequest !== void 0) {
          stream._closeRequest._reject(stream._storedError);
          stream._closeRequest = void 0;
        }
        const writer = stream._writer;
        if (writer !== void 0) {
          defaultWriterClosedPromiseReject(writer, stream._storedError);
        }
      }
      function WritableStreamUpdateBackpressure(stream, backpressure) {
        const writer = stream._writer;
        if (writer !== void 0 && backpressure !== stream._backpressure) {
          if (backpressure) {
            defaultWriterReadyPromiseReset(writer);
          } else {
            defaultWriterReadyPromiseResolve(writer);
          }
        }
        stream._backpressure = backpressure;
      }
      class WritableStreamDefaultWriter {
        constructor(stream) {
          assertRequiredArgument(stream, 1, "WritableStreamDefaultWriter");
          assertWritableStream(stream, "First parameter");
          if (IsWritableStreamLocked(stream)) {
            throw new TypeError("This stream has already been locked for exclusive writing by another writer");
          }
          this._ownerWritableStream = stream;
          stream._writer = this;
          const state = stream._state;
          if (state === "writable") {
            if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._backpressure) {
              defaultWriterReadyPromiseInitialize(this);
            } else {
              defaultWriterReadyPromiseInitializeAsResolved(this);
            }
            defaultWriterClosedPromiseInitialize(this);
          } else if (state === "erroring") {
            defaultWriterReadyPromiseInitializeAsRejected(this, stream._storedError);
            defaultWriterClosedPromiseInitialize(this);
          } else if (state === "closed") {
            defaultWriterReadyPromiseInitializeAsResolved(this);
            defaultWriterClosedPromiseInitializeAsResolved(this);
          } else {
            const storedError = stream._storedError;
            defaultWriterReadyPromiseInitializeAsRejected(this, storedError);
            defaultWriterClosedPromiseInitializeAsRejected(this, storedError);
          }
        }
        /**
         * Returns a promise that will be fulfilled when the stream becomes closed, or rejected if the stream ever errors or
         * the writer’s lock is released before the stream finishes closing.
         */
        get closed() {
          if (!IsWritableStreamDefaultWriter(this)) {
            return promiseRejectedWith(defaultWriterBrandCheckException("closed"));
          }
          return this._closedPromise;
        }
        /**
         * Returns the desired size to fill the stream’s internal queue. It can be negative, if the queue is over-full.
         * A producer can use this information to determine the right amount of data to write.
         *
         * It will be `null` if the stream cannot be successfully written to (due to either being errored, or having an abort
         * queued up). It will return zero if the stream is closed. And the getter will throw an exception if invoked when
         * the writer’s lock is released.
         */
        get desiredSize() {
          if (!IsWritableStreamDefaultWriter(this)) {
            throw defaultWriterBrandCheckException("desiredSize");
          }
          if (this._ownerWritableStream === void 0) {
            throw defaultWriterLockException("desiredSize");
          }
          return WritableStreamDefaultWriterGetDesiredSize(this);
        }
        /**
         * Returns a promise that will be fulfilled when the desired size to fill the stream’s internal queue transitions
         * from non-positive to positive, signaling that it is no longer applying backpressure. Once the desired size dips
         * back to zero or below, the getter will return a new promise that stays pending until the next transition.
         *
         * If the stream becomes errored or aborted, or the writer’s lock is released, the returned promise will become
         * rejected.
         */
        get ready() {
          if (!IsWritableStreamDefaultWriter(this)) {
            return promiseRejectedWith(defaultWriterBrandCheckException("ready"));
          }
          return this._readyPromise;
        }
        /**
         * If the reader is active, behaves the same as {@link WritableStream.abort | stream.abort(reason)}.
         */
        abort(reason = void 0) {
          if (!IsWritableStreamDefaultWriter(this)) {
            return promiseRejectedWith(defaultWriterBrandCheckException("abort"));
          }
          if (this._ownerWritableStream === void 0) {
            return promiseRejectedWith(defaultWriterLockException("abort"));
          }
          return WritableStreamDefaultWriterAbort(this, reason);
        }
        /**
         * If the reader is active, behaves the same as {@link WritableStream.close | stream.close()}.
         */
        close() {
          if (!IsWritableStreamDefaultWriter(this)) {
            return promiseRejectedWith(defaultWriterBrandCheckException("close"));
          }
          const stream = this._ownerWritableStream;
          if (stream === void 0) {
            return promiseRejectedWith(defaultWriterLockException("close"));
          }
          if (WritableStreamCloseQueuedOrInFlight(stream)) {
            return promiseRejectedWith(new TypeError("Cannot close an already-closing stream"));
          }
          return WritableStreamDefaultWriterClose(this);
        }
        /**
         * Releases the writer’s lock on the corresponding stream. After the lock is released, the writer is no longer active.
         * If the associated stream is errored when the lock is released, the writer will appear errored in the same way from
         * now on; otherwise, the writer will appear closed.
         *
         * Note that the lock can still be released even if some ongoing writes have not yet finished (i.e. even if the
         * promises returned from previous calls to {@link WritableStreamDefaultWriter.write | write()} have not yet settled).
         * It’s not necessary to hold the lock on the writer for the duration of the write; the lock instead simply prevents
         * other producers from writing in an interleaved manner.
         */
        releaseLock() {
          if (!IsWritableStreamDefaultWriter(this)) {
            throw defaultWriterBrandCheckException("releaseLock");
          }
          const stream = this._ownerWritableStream;
          if (stream === void 0) {
            return;
          }
          WritableStreamDefaultWriterRelease(this);
        }
        write(chunk = void 0) {
          if (!IsWritableStreamDefaultWriter(this)) {
            return promiseRejectedWith(defaultWriterBrandCheckException("write"));
          }
          if (this._ownerWritableStream === void 0) {
            return promiseRejectedWith(defaultWriterLockException("write to"));
          }
          return WritableStreamDefaultWriterWrite(this, chunk);
        }
      }
      Object.defineProperties(WritableStreamDefaultWriter.prototype, {
        abort: { enumerable: true },
        close: { enumerable: true },
        releaseLock: { enumerable: true },
        write: { enumerable: true },
        closed: { enumerable: true },
        desiredSize: { enumerable: true },
        ready: { enumerable: true }
      });
      setFunctionName(WritableStreamDefaultWriter.prototype.abort, "abort");
      setFunctionName(WritableStreamDefaultWriter.prototype.close, "close");
      setFunctionName(WritableStreamDefaultWriter.prototype.releaseLock, "releaseLock");
      setFunctionName(WritableStreamDefaultWriter.prototype.write, "write");
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(WritableStreamDefaultWriter.prototype, Symbol.toStringTag, {
          value: "WritableStreamDefaultWriter",
          configurable: true
        });
      }
      function IsWritableStreamDefaultWriter(x3) {
        if (!typeIsObject(x3)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x3, "_ownerWritableStream")) {
          return false;
        }
        return x3 instanceof WritableStreamDefaultWriter;
      }
      function WritableStreamDefaultWriterAbort(writer, reason) {
        const stream = writer._ownerWritableStream;
        return WritableStreamAbort(stream, reason);
      }
      function WritableStreamDefaultWriterClose(writer) {
        const stream = writer._ownerWritableStream;
        return WritableStreamClose(stream);
      }
      function WritableStreamDefaultWriterCloseWithErrorPropagation(writer) {
        const stream = writer._ownerWritableStream;
        const state = stream._state;
        if (WritableStreamCloseQueuedOrInFlight(stream) || state === "closed") {
          return promiseResolvedWith(void 0);
        }
        if (state === "errored") {
          return promiseRejectedWith(stream._storedError);
        }
        return WritableStreamDefaultWriterClose(writer);
      }
      function WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, error) {
        if (writer._closedPromiseState === "pending") {
          defaultWriterClosedPromiseReject(writer, error);
        } else {
          defaultWriterClosedPromiseResetToRejected(writer, error);
        }
      }
      function WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, error) {
        if (writer._readyPromiseState === "pending") {
          defaultWriterReadyPromiseReject(writer, error);
        } else {
          defaultWriterReadyPromiseResetToRejected(writer, error);
        }
      }
      function WritableStreamDefaultWriterGetDesiredSize(writer) {
        const stream = writer._ownerWritableStream;
        const state = stream._state;
        if (state === "errored" || state === "erroring") {
          return null;
        }
        if (state === "closed") {
          return 0;
        }
        return WritableStreamDefaultControllerGetDesiredSize(stream._writableStreamController);
      }
      function WritableStreamDefaultWriterRelease(writer) {
        const stream = writer._ownerWritableStream;
        const releasedError = new TypeError(`Writer was released and can no longer be used to monitor the stream's closedness`);
        WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, releasedError);
        WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, releasedError);
        stream._writer = void 0;
        writer._ownerWritableStream = void 0;
      }
      function WritableStreamDefaultWriterWrite(writer, chunk) {
        const stream = writer._ownerWritableStream;
        const controller = stream._writableStreamController;
        const chunkSize = WritableStreamDefaultControllerGetChunkSize(controller, chunk);
        if (stream !== writer._ownerWritableStream) {
          return promiseRejectedWith(defaultWriterLockException("write to"));
        }
        const state = stream._state;
        if (state === "errored") {
          return promiseRejectedWith(stream._storedError);
        }
        if (WritableStreamCloseQueuedOrInFlight(stream) || state === "closed") {
          return promiseRejectedWith(new TypeError("The stream is closing or closed and cannot be written to"));
        }
        if (state === "erroring") {
          return promiseRejectedWith(stream._storedError);
        }
        const promise = WritableStreamAddWriteRequest(stream);
        WritableStreamDefaultControllerWrite(controller, chunk, chunkSize);
        return promise;
      }
      const closeSentinel = {};
      class WritableStreamDefaultController {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        /**
         * The reason which was passed to `WritableStream.abort(reason)` when the stream was aborted.
         *
         * @deprecated
         *  This property has been removed from the specification, see https://github.com/whatwg/streams/pull/1177.
         *  Use {@link WritableStreamDefaultController.signal}'s `reason` instead.
         */
        get abortReason() {
          if (!IsWritableStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException$2("abortReason");
          }
          return this._abortReason;
        }
        /**
         * An `AbortSignal` that can be used to abort the pending write or close operation when the stream is aborted.
         */
        get signal() {
          if (!IsWritableStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException$2("signal");
          }
          if (this._abortController === void 0) {
            throw new TypeError("WritableStreamDefaultController.prototype.signal is not supported");
          }
          return this._abortController.signal;
        }
        /**
         * Closes the controlled writable stream, making all future interactions with it fail with the given error `e`.
         *
         * This method is rarely used, since usually it suffices to return a rejected promise from one of the underlying
         * sink's methods. However, it can be useful for suddenly shutting down a stream in response to an event outside the
         * normal lifecycle of interactions with the underlying sink.
         */
        error(e2 = void 0) {
          if (!IsWritableStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException$2("error");
          }
          const state = this._controlledWritableStream._state;
          if (state !== "writable") {
            return;
          }
          WritableStreamDefaultControllerError(this, e2);
        }
        /** @internal */
        [AbortSteps](reason) {
          const result = this._abortAlgorithm(reason);
          WritableStreamDefaultControllerClearAlgorithms(this);
          return result;
        }
        /** @internal */
        [ErrorSteps]() {
          ResetQueue(this);
        }
      }
      Object.defineProperties(WritableStreamDefaultController.prototype, {
        abortReason: { enumerable: true },
        signal: { enumerable: true },
        error: { enumerable: true }
      });
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(WritableStreamDefaultController.prototype, Symbol.toStringTag, {
          value: "WritableStreamDefaultController",
          configurable: true
        });
      }
      function IsWritableStreamDefaultController(x3) {
        if (!typeIsObject(x3)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x3, "_controlledWritableStream")) {
          return false;
        }
        return x3 instanceof WritableStreamDefaultController;
      }
      function SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm) {
        controller._controlledWritableStream = stream;
        stream._writableStreamController = controller;
        controller._queue = void 0;
        controller._queueTotalSize = void 0;
        ResetQueue(controller);
        controller._abortReason = void 0;
        controller._abortController = createAbortController();
        controller._started = false;
        controller._strategySizeAlgorithm = sizeAlgorithm;
        controller._strategyHWM = highWaterMark;
        controller._writeAlgorithm = writeAlgorithm;
        controller._closeAlgorithm = closeAlgorithm;
        controller._abortAlgorithm = abortAlgorithm;
        const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
        WritableStreamUpdateBackpressure(stream, backpressure);
        const startResult = startAlgorithm();
        const startPromise = promiseResolvedWith(startResult);
        uponPromise(startPromise, () => {
          controller._started = true;
          WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
          return null;
        }, (r2) => {
          controller._started = true;
          WritableStreamDealWithRejection(stream, r2);
          return null;
        });
      }
      function SetUpWritableStreamDefaultControllerFromUnderlyingSink(stream, underlyingSink, highWaterMark, sizeAlgorithm) {
        const controller = Object.create(WritableStreamDefaultController.prototype);
        let startAlgorithm;
        let writeAlgorithm;
        let closeAlgorithm;
        let abortAlgorithm;
        if (underlyingSink.start !== void 0) {
          startAlgorithm = () => underlyingSink.start(controller);
        } else {
          startAlgorithm = () => void 0;
        }
        if (underlyingSink.write !== void 0) {
          writeAlgorithm = (chunk) => underlyingSink.write(chunk, controller);
        } else {
          writeAlgorithm = () => promiseResolvedWith(void 0);
        }
        if (underlyingSink.close !== void 0) {
          closeAlgorithm = () => underlyingSink.close();
        } else {
          closeAlgorithm = () => promiseResolvedWith(void 0);
        }
        if (underlyingSink.abort !== void 0) {
          abortAlgorithm = (reason) => underlyingSink.abort(reason);
        } else {
          abortAlgorithm = () => promiseResolvedWith(void 0);
        }
        SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
      }
      function WritableStreamDefaultControllerClearAlgorithms(controller) {
        controller._writeAlgorithm = void 0;
        controller._closeAlgorithm = void 0;
        controller._abortAlgorithm = void 0;
        controller._strategySizeAlgorithm = void 0;
      }
      function WritableStreamDefaultControllerClose(controller) {
        EnqueueValueWithSize(controller, closeSentinel, 0);
        WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
      }
      function WritableStreamDefaultControllerGetChunkSize(controller, chunk) {
        try {
          return controller._strategySizeAlgorithm(chunk);
        } catch (chunkSizeE) {
          WritableStreamDefaultControllerErrorIfNeeded(controller, chunkSizeE);
          return 1;
        }
      }
      function WritableStreamDefaultControllerGetDesiredSize(controller) {
        return controller._strategyHWM - controller._queueTotalSize;
      }
      function WritableStreamDefaultControllerWrite(controller, chunk, chunkSize) {
        try {
          EnqueueValueWithSize(controller, chunk, chunkSize);
        } catch (enqueueE) {
          WritableStreamDefaultControllerErrorIfNeeded(controller, enqueueE);
          return;
        }
        const stream = controller._controlledWritableStream;
        if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._state === "writable") {
          const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
          WritableStreamUpdateBackpressure(stream, backpressure);
        }
        WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
      }
      function WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller) {
        const stream = controller._controlledWritableStream;
        if (!controller._started) {
          return;
        }
        if (stream._inFlightWriteRequest !== void 0) {
          return;
        }
        const state = stream._state;
        if (state === "erroring") {
          WritableStreamFinishErroring(stream);
          return;
        }
        if (controller._queue.length === 0) {
          return;
        }
        const value = PeekQueueValue(controller);
        if (value === closeSentinel) {
          WritableStreamDefaultControllerProcessClose(controller);
        } else {
          WritableStreamDefaultControllerProcessWrite(controller, value);
        }
      }
      function WritableStreamDefaultControllerErrorIfNeeded(controller, error) {
        if (controller._controlledWritableStream._state === "writable") {
          WritableStreamDefaultControllerError(controller, error);
        }
      }
      function WritableStreamDefaultControllerProcessClose(controller) {
        const stream = controller._controlledWritableStream;
        WritableStreamMarkCloseRequestInFlight(stream);
        DequeueValue(controller);
        const sinkClosePromise = controller._closeAlgorithm();
        WritableStreamDefaultControllerClearAlgorithms(controller);
        uponPromise(sinkClosePromise, () => {
          WritableStreamFinishInFlightClose(stream);
          return null;
        }, (reason) => {
          WritableStreamFinishInFlightCloseWithError(stream, reason);
          return null;
        });
      }
      function WritableStreamDefaultControllerProcessWrite(controller, chunk) {
        const stream = controller._controlledWritableStream;
        WritableStreamMarkFirstWriteRequestInFlight(stream);
        const sinkWritePromise = controller._writeAlgorithm(chunk);
        uponPromise(sinkWritePromise, () => {
          WritableStreamFinishInFlightWrite(stream);
          const state = stream._state;
          DequeueValue(controller);
          if (!WritableStreamCloseQueuedOrInFlight(stream) && state === "writable") {
            const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
            WritableStreamUpdateBackpressure(stream, backpressure);
          }
          WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
          return null;
        }, (reason) => {
          if (stream._state === "writable") {
            WritableStreamDefaultControllerClearAlgorithms(controller);
          }
          WritableStreamFinishInFlightWriteWithError(stream, reason);
          return null;
        });
      }
      function WritableStreamDefaultControllerGetBackpressure(controller) {
        const desiredSize = WritableStreamDefaultControllerGetDesiredSize(controller);
        return desiredSize <= 0;
      }
      function WritableStreamDefaultControllerError(controller, error) {
        const stream = controller._controlledWritableStream;
        WritableStreamDefaultControllerClearAlgorithms(controller);
        WritableStreamStartErroring(stream, error);
      }
      function streamBrandCheckException$2(name) {
        return new TypeError(`WritableStream.prototype.${name} can only be used on a WritableStream`);
      }
      function defaultControllerBrandCheckException$2(name) {
        return new TypeError(`WritableStreamDefaultController.prototype.${name} can only be used on a WritableStreamDefaultController`);
      }
      function defaultWriterBrandCheckException(name) {
        return new TypeError(`WritableStreamDefaultWriter.prototype.${name} can only be used on a WritableStreamDefaultWriter`);
      }
      function defaultWriterLockException(name) {
        return new TypeError("Cannot " + name + " a stream using a released writer");
      }
      function defaultWriterClosedPromiseInitialize(writer) {
        writer._closedPromise = newPromise((resolve, reject) => {
          writer._closedPromise_resolve = resolve;
          writer._closedPromise_reject = reject;
          writer._closedPromiseState = "pending";
        });
      }
      function defaultWriterClosedPromiseInitializeAsRejected(writer, reason) {
        defaultWriterClosedPromiseInitialize(writer);
        defaultWriterClosedPromiseReject(writer, reason);
      }
      function defaultWriterClosedPromiseInitializeAsResolved(writer) {
        defaultWriterClosedPromiseInitialize(writer);
        defaultWriterClosedPromiseResolve(writer);
      }
      function defaultWriterClosedPromiseReject(writer, reason) {
        if (writer._closedPromise_reject === void 0) {
          return;
        }
        setPromiseIsHandledToTrue(writer._closedPromise);
        writer._closedPromise_reject(reason);
        writer._closedPromise_resolve = void 0;
        writer._closedPromise_reject = void 0;
        writer._closedPromiseState = "rejected";
      }
      function defaultWriterClosedPromiseResetToRejected(writer, reason) {
        defaultWriterClosedPromiseInitializeAsRejected(writer, reason);
      }
      function defaultWriterClosedPromiseResolve(writer) {
        if (writer._closedPromise_resolve === void 0) {
          return;
        }
        writer._closedPromise_resolve(void 0);
        writer._closedPromise_resolve = void 0;
        writer._closedPromise_reject = void 0;
        writer._closedPromiseState = "resolved";
      }
      function defaultWriterReadyPromiseInitialize(writer) {
        writer._readyPromise = newPromise((resolve, reject) => {
          writer._readyPromise_resolve = resolve;
          writer._readyPromise_reject = reject;
        });
        writer._readyPromiseState = "pending";
      }
      function defaultWriterReadyPromiseInitializeAsRejected(writer, reason) {
        defaultWriterReadyPromiseInitialize(writer);
        defaultWriterReadyPromiseReject(writer, reason);
      }
      function defaultWriterReadyPromiseInitializeAsResolved(writer) {
        defaultWriterReadyPromiseInitialize(writer);
        defaultWriterReadyPromiseResolve(writer);
      }
      function defaultWriterReadyPromiseReject(writer, reason) {
        if (writer._readyPromise_reject === void 0) {
          return;
        }
        setPromiseIsHandledToTrue(writer._readyPromise);
        writer._readyPromise_reject(reason);
        writer._readyPromise_resolve = void 0;
        writer._readyPromise_reject = void 0;
        writer._readyPromiseState = "rejected";
      }
      function defaultWriterReadyPromiseReset(writer) {
        defaultWriterReadyPromiseInitialize(writer);
      }
      function defaultWriterReadyPromiseResetToRejected(writer, reason) {
        defaultWriterReadyPromiseInitializeAsRejected(writer, reason);
      }
      function defaultWriterReadyPromiseResolve(writer) {
        if (writer._readyPromise_resolve === void 0) {
          return;
        }
        writer._readyPromise_resolve(void 0);
        writer._readyPromise_resolve = void 0;
        writer._readyPromise_reject = void 0;
        writer._readyPromiseState = "fulfilled";
      }
      function getGlobals() {
        if (typeof globalThis !== "undefined") {
          return globalThis;
        } else if (typeof self !== "undefined") {
          return self;
        } else if (typeof global !== "undefined") {
          return global;
        }
        return void 0;
      }
      const globals = getGlobals();
      function isDOMExceptionConstructor(ctor) {
        if (!(typeof ctor === "function" || typeof ctor === "object")) {
          return false;
        }
        if (ctor.name !== "DOMException") {
          return false;
        }
        try {
          new ctor();
          return true;
        } catch (_a3) {
          return false;
        }
      }
      function getFromGlobal() {
        const ctor = globals === null || globals === void 0 ? void 0 : globals.DOMException;
        return isDOMExceptionConstructor(ctor) ? ctor : void 0;
      }
      function createPolyfill() {
        const ctor = function DOMException3(message, name) {
          this.message = message || "";
          this.name = name || "Error";
          if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
          }
        };
        setFunctionName(ctor, "DOMException");
        ctor.prototype = Object.create(Error.prototype);
        Object.defineProperty(ctor.prototype, "constructor", { value: ctor, writable: true, configurable: true });
        return ctor;
      }
      const DOMException2 = getFromGlobal() || createPolyfill();
      function ReadableStreamPipeTo(source, dest, preventClose, preventAbort, preventCancel, signal) {
        const reader = AcquireReadableStreamDefaultReader(source);
        const writer = AcquireWritableStreamDefaultWriter(dest);
        source._disturbed = true;
        let shuttingDown = false;
        let currentWrite = promiseResolvedWith(void 0);
        return newPromise((resolve, reject) => {
          let abortAlgorithm;
          if (signal !== void 0) {
            abortAlgorithm = () => {
              const error = signal.reason !== void 0 ? signal.reason : new DOMException2("Aborted", "AbortError");
              const actions = [];
              if (!preventAbort) {
                actions.push(() => {
                  if (dest._state === "writable") {
                    return WritableStreamAbort(dest, error);
                  }
                  return promiseResolvedWith(void 0);
                });
              }
              if (!preventCancel) {
                actions.push(() => {
                  if (source._state === "readable") {
                    return ReadableStreamCancel(source, error);
                  }
                  return promiseResolvedWith(void 0);
                });
              }
              shutdownWithAction(() => Promise.all(actions.map((action) => action())), true, error);
            };
            if (signal.aborted) {
              abortAlgorithm();
              return;
            }
            signal.addEventListener("abort", abortAlgorithm);
          }
          function pipeLoop() {
            return newPromise((resolveLoop, rejectLoop) => {
              function next(done) {
                if (done) {
                  resolveLoop();
                } else {
                  PerformPromiseThen(pipeStep(), next, rejectLoop);
                }
              }
              next(false);
            });
          }
          function pipeStep() {
            if (shuttingDown) {
              return promiseResolvedWith(true);
            }
            return PerformPromiseThen(writer._readyPromise, () => {
              return newPromise((resolveRead, rejectRead) => {
                ReadableStreamDefaultReaderRead(reader, {
                  _chunkSteps: (chunk) => {
                    currentWrite = PerformPromiseThen(WritableStreamDefaultWriterWrite(writer, chunk), void 0, noop2);
                    resolveRead(false);
                  },
                  _closeSteps: () => resolveRead(true),
                  _errorSteps: rejectRead
                });
              });
            });
          }
          isOrBecomesErrored(source, reader._closedPromise, (storedError) => {
            if (!preventAbort) {
              shutdownWithAction(() => WritableStreamAbort(dest, storedError), true, storedError);
            } else {
              shutdown(true, storedError);
            }
            return null;
          });
          isOrBecomesErrored(dest, writer._closedPromise, (storedError) => {
            if (!preventCancel) {
              shutdownWithAction(() => ReadableStreamCancel(source, storedError), true, storedError);
            } else {
              shutdown(true, storedError);
            }
            return null;
          });
          isOrBecomesClosed(source, reader._closedPromise, () => {
            if (!preventClose) {
              shutdownWithAction(() => WritableStreamDefaultWriterCloseWithErrorPropagation(writer));
            } else {
              shutdown();
            }
            return null;
          });
          if (WritableStreamCloseQueuedOrInFlight(dest) || dest._state === "closed") {
            const destClosed = new TypeError("the destination writable stream closed before all data could be piped to it");
            if (!preventCancel) {
              shutdownWithAction(() => ReadableStreamCancel(source, destClosed), true, destClosed);
            } else {
              shutdown(true, destClosed);
            }
          }
          setPromiseIsHandledToTrue(pipeLoop());
          function waitForWritesToFinish() {
            const oldCurrentWrite = currentWrite;
            return PerformPromiseThen(currentWrite, () => oldCurrentWrite !== currentWrite ? waitForWritesToFinish() : void 0);
          }
          function isOrBecomesErrored(stream, promise, action) {
            if (stream._state === "errored") {
              action(stream._storedError);
            } else {
              uponRejection(promise, action);
            }
          }
          function isOrBecomesClosed(stream, promise, action) {
            if (stream._state === "closed") {
              action();
            } else {
              uponFulfillment(promise, action);
            }
          }
          function shutdownWithAction(action, originalIsError, originalError) {
            if (shuttingDown) {
              return;
            }
            shuttingDown = true;
            if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) {
              uponFulfillment(waitForWritesToFinish(), doTheRest);
            } else {
              doTheRest();
            }
            function doTheRest() {
              uponPromise(action(), () => finalize(originalIsError, originalError), (newError) => finalize(true, newError));
              return null;
            }
          }
          function shutdown(isError, error) {
            if (shuttingDown) {
              return;
            }
            shuttingDown = true;
            if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) {
              uponFulfillment(waitForWritesToFinish(), () => finalize(isError, error));
            } else {
              finalize(isError, error);
            }
          }
          function finalize(isError, error) {
            WritableStreamDefaultWriterRelease(writer);
            ReadableStreamReaderGenericRelease(reader);
            if (signal !== void 0) {
              signal.removeEventListener("abort", abortAlgorithm);
            }
            if (isError) {
              reject(error);
            } else {
              resolve(void 0);
            }
            return null;
          }
        });
      }
      class ReadableStreamDefaultController {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        /**
         * Returns the desired size to fill the controlled stream's internal queue. It can be negative, if the queue is
         * over-full. An underlying source ought to use this information to determine when and how to apply backpressure.
         */
        get desiredSize() {
          if (!IsReadableStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException$1("desiredSize");
          }
          return ReadableStreamDefaultControllerGetDesiredSize(this);
        }
        /**
         * Closes the controlled readable stream. Consumers will still be able to read any previously-enqueued chunks from
         * the stream, but once those are read, the stream will become closed.
         */
        close() {
          if (!IsReadableStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException$1("close");
          }
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
            throw new TypeError("The stream is not in a state that permits close");
          }
          ReadableStreamDefaultControllerClose(this);
        }
        enqueue(chunk = void 0) {
          if (!IsReadableStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException$1("enqueue");
          }
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
            throw new TypeError("The stream is not in a state that permits enqueue");
          }
          return ReadableStreamDefaultControllerEnqueue(this, chunk);
        }
        /**
         * Errors the controlled readable stream, making all future interactions with it fail with the given error `e`.
         */
        error(e2 = void 0) {
          if (!IsReadableStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException$1("error");
          }
          ReadableStreamDefaultControllerError(this, e2);
        }
        /** @internal */
        [CancelSteps](reason) {
          ResetQueue(this);
          const result = this._cancelAlgorithm(reason);
          ReadableStreamDefaultControllerClearAlgorithms(this);
          return result;
        }
        /** @internal */
        [PullSteps](readRequest) {
          const stream = this._controlledReadableStream;
          if (this._queue.length > 0) {
            const chunk = DequeueValue(this);
            if (this._closeRequested && this._queue.length === 0) {
              ReadableStreamDefaultControllerClearAlgorithms(this);
              ReadableStreamClose(stream);
            } else {
              ReadableStreamDefaultControllerCallPullIfNeeded(this);
            }
            readRequest._chunkSteps(chunk);
          } else {
            ReadableStreamAddReadRequest(stream, readRequest);
            ReadableStreamDefaultControllerCallPullIfNeeded(this);
          }
        }
        /** @internal */
        [ReleaseSteps]() {
        }
      }
      Object.defineProperties(ReadableStreamDefaultController.prototype, {
        close: { enumerable: true },
        enqueue: { enumerable: true },
        error: { enumerable: true },
        desiredSize: { enumerable: true }
      });
      setFunctionName(ReadableStreamDefaultController.prototype.close, "close");
      setFunctionName(ReadableStreamDefaultController.prototype.enqueue, "enqueue");
      setFunctionName(ReadableStreamDefaultController.prototype.error, "error");
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(ReadableStreamDefaultController.prototype, Symbol.toStringTag, {
          value: "ReadableStreamDefaultController",
          configurable: true
        });
      }
      function IsReadableStreamDefaultController(x3) {
        if (!typeIsObject(x3)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x3, "_controlledReadableStream")) {
          return false;
        }
        return x3 instanceof ReadableStreamDefaultController;
      }
      function ReadableStreamDefaultControllerCallPullIfNeeded(controller) {
        const shouldPull = ReadableStreamDefaultControllerShouldCallPull(controller);
        if (!shouldPull) {
          return;
        }
        if (controller._pulling) {
          controller._pullAgain = true;
          return;
        }
        controller._pulling = true;
        const pullPromise = controller._pullAlgorithm();
        uponPromise(pullPromise, () => {
          controller._pulling = false;
          if (controller._pullAgain) {
            controller._pullAgain = false;
            ReadableStreamDefaultControllerCallPullIfNeeded(controller);
          }
          return null;
        }, (e2) => {
          ReadableStreamDefaultControllerError(controller, e2);
          return null;
        });
      }
      function ReadableStreamDefaultControllerShouldCallPull(controller) {
        const stream = controller._controlledReadableStream;
        if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
          return false;
        }
        if (!controller._started) {
          return false;
        }
        if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
          return true;
        }
        const desiredSize = ReadableStreamDefaultControllerGetDesiredSize(controller);
        if (desiredSize > 0) {
          return true;
        }
        return false;
      }
      function ReadableStreamDefaultControllerClearAlgorithms(controller) {
        controller._pullAlgorithm = void 0;
        controller._cancelAlgorithm = void 0;
        controller._strategySizeAlgorithm = void 0;
      }
      function ReadableStreamDefaultControllerClose(controller) {
        if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
          return;
        }
        const stream = controller._controlledReadableStream;
        controller._closeRequested = true;
        if (controller._queue.length === 0) {
          ReadableStreamDefaultControllerClearAlgorithms(controller);
          ReadableStreamClose(stream);
        }
      }
      function ReadableStreamDefaultControllerEnqueue(controller, chunk) {
        if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
          return;
        }
        const stream = controller._controlledReadableStream;
        if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
          ReadableStreamFulfillReadRequest(stream, chunk, false);
        } else {
          let chunkSize;
          try {
            chunkSize = controller._strategySizeAlgorithm(chunk);
          } catch (chunkSizeE) {
            ReadableStreamDefaultControllerError(controller, chunkSizeE);
            throw chunkSizeE;
          }
          try {
            EnqueueValueWithSize(controller, chunk, chunkSize);
          } catch (enqueueE) {
            ReadableStreamDefaultControllerError(controller, enqueueE);
            throw enqueueE;
          }
        }
        ReadableStreamDefaultControllerCallPullIfNeeded(controller);
      }
      function ReadableStreamDefaultControllerError(controller, e2) {
        const stream = controller._controlledReadableStream;
        if (stream._state !== "readable") {
          return;
        }
        ResetQueue(controller);
        ReadableStreamDefaultControllerClearAlgorithms(controller);
        ReadableStreamError(stream, e2);
      }
      function ReadableStreamDefaultControllerGetDesiredSize(controller) {
        const state = controller._controlledReadableStream._state;
        if (state === "errored") {
          return null;
        }
        if (state === "closed") {
          return 0;
        }
        return controller._strategyHWM - controller._queueTotalSize;
      }
      function ReadableStreamDefaultControllerHasBackpressure(controller) {
        if (ReadableStreamDefaultControllerShouldCallPull(controller)) {
          return false;
        }
        return true;
      }
      function ReadableStreamDefaultControllerCanCloseOrEnqueue(controller) {
        const state = controller._controlledReadableStream._state;
        if (!controller._closeRequested && state === "readable") {
          return true;
        }
        return false;
      }
      function SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm) {
        controller._controlledReadableStream = stream;
        controller._queue = void 0;
        controller._queueTotalSize = void 0;
        ResetQueue(controller);
        controller._started = false;
        controller._closeRequested = false;
        controller._pullAgain = false;
        controller._pulling = false;
        controller._strategySizeAlgorithm = sizeAlgorithm;
        controller._strategyHWM = highWaterMark;
        controller._pullAlgorithm = pullAlgorithm;
        controller._cancelAlgorithm = cancelAlgorithm;
        stream._readableStreamController = controller;
        const startResult = startAlgorithm();
        uponPromise(promiseResolvedWith(startResult), () => {
          controller._started = true;
          ReadableStreamDefaultControllerCallPullIfNeeded(controller);
          return null;
        }, (r2) => {
          ReadableStreamDefaultControllerError(controller, r2);
          return null;
        });
      }
      function SetUpReadableStreamDefaultControllerFromUnderlyingSource(stream, underlyingSource, highWaterMark, sizeAlgorithm) {
        const controller = Object.create(ReadableStreamDefaultController.prototype);
        let startAlgorithm;
        let pullAlgorithm;
        let cancelAlgorithm;
        if (underlyingSource.start !== void 0) {
          startAlgorithm = () => underlyingSource.start(controller);
        } else {
          startAlgorithm = () => void 0;
        }
        if (underlyingSource.pull !== void 0) {
          pullAlgorithm = () => underlyingSource.pull(controller);
        } else {
          pullAlgorithm = () => promiseResolvedWith(void 0);
        }
        if (underlyingSource.cancel !== void 0) {
          cancelAlgorithm = (reason) => underlyingSource.cancel(reason);
        } else {
          cancelAlgorithm = () => promiseResolvedWith(void 0);
        }
        SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
      }
      function defaultControllerBrandCheckException$1(name) {
        return new TypeError(`ReadableStreamDefaultController.prototype.${name} can only be used on a ReadableStreamDefaultController`);
      }
      function ReadableStreamTee(stream, cloneForBranch2) {
        if (IsReadableByteStreamController(stream._readableStreamController)) {
          return ReadableByteStreamTee(stream);
        }
        return ReadableStreamDefaultTee(stream);
      }
      function ReadableStreamDefaultTee(stream, cloneForBranch2) {
        const reader = AcquireReadableStreamDefaultReader(stream);
        let reading = false;
        let readAgain = false;
        let canceled1 = false;
        let canceled2 = false;
        let reason1;
        let reason2;
        let branch1;
        let branch2;
        let resolveCancelPromise;
        const cancelPromise = newPromise((resolve) => {
          resolveCancelPromise = resolve;
        });
        function pullAlgorithm() {
          if (reading) {
            readAgain = true;
            return promiseResolvedWith(void 0);
          }
          reading = true;
          const readRequest = {
            _chunkSteps: (chunk) => {
              _queueMicrotask(() => {
                readAgain = false;
                const chunk1 = chunk;
                const chunk2 = chunk;
                if (!canceled1) {
                  ReadableStreamDefaultControllerEnqueue(branch1._readableStreamController, chunk1);
                }
                if (!canceled2) {
                  ReadableStreamDefaultControllerEnqueue(branch2._readableStreamController, chunk2);
                }
                reading = false;
                if (readAgain) {
                  pullAlgorithm();
                }
              });
            },
            _closeSteps: () => {
              reading = false;
              if (!canceled1) {
                ReadableStreamDefaultControllerClose(branch1._readableStreamController);
              }
              if (!canceled2) {
                ReadableStreamDefaultControllerClose(branch2._readableStreamController);
              }
              if (!canceled1 || !canceled2) {
                resolveCancelPromise(void 0);
              }
            },
            _errorSteps: () => {
              reading = false;
            }
          };
          ReadableStreamDefaultReaderRead(reader, readRequest);
          return promiseResolvedWith(void 0);
        }
        function cancel1Algorithm(reason) {
          canceled1 = true;
          reason1 = reason;
          if (canceled2) {
            const compositeReason = CreateArrayFromList([reason1, reason2]);
            const cancelResult = ReadableStreamCancel(stream, compositeReason);
            resolveCancelPromise(cancelResult);
          }
          return cancelPromise;
        }
        function cancel2Algorithm(reason) {
          canceled2 = true;
          reason2 = reason;
          if (canceled1) {
            const compositeReason = CreateArrayFromList([reason1, reason2]);
            const cancelResult = ReadableStreamCancel(stream, compositeReason);
            resolveCancelPromise(cancelResult);
          }
          return cancelPromise;
        }
        function startAlgorithm() {
        }
        branch1 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel1Algorithm);
        branch2 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel2Algorithm);
        uponRejection(reader._closedPromise, (r2) => {
          ReadableStreamDefaultControllerError(branch1._readableStreamController, r2);
          ReadableStreamDefaultControllerError(branch2._readableStreamController, r2);
          if (!canceled1 || !canceled2) {
            resolveCancelPromise(void 0);
          }
          return null;
        });
        return [branch1, branch2];
      }
      function ReadableByteStreamTee(stream) {
        let reader = AcquireReadableStreamDefaultReader(stream);
        let reading = false;
        let readAgainForBranch1 = false;
        let readAgainForBranch2 = false;
        let canceled1 = false;
        let canceled2 = false;
        let reason1;
        let reason2;
        let branch1;
        let branch2;
        let resolveCancelPromise;
        const cancelPromise = newPromise((resolve) => {
          resolveCancelPromise = resolve;
        });
        function forwardReaderError(thisReader) {
          uponRejection(thisReader._closedPromise, (r2) => {
            if (thisReader !== reader) {
              return null;
            }
            ReadableByteStreamControllerError(branch1._readableStreamController, r2);
            ReadableByteStreamControllerError(branch2._readableStreamController, r2);
            if (!canceled1 || !canceled2) {
              resolveCancelPromise(void 0);
            }
            return null;
          });
        }
        function pullWithDefaultReader() {
          if (IsReadableStreamBYOBReader(reader)) {
            ReadableStreamReaderGenericRelease(reader);
            reader = AcquireReadableStreamDefaultReader(stream);
            forwardReaderError(reader);
          }
          const readRequest = {
            _chunkSteps: (chunk) => {
              _queueMicrotask(() => {
                readAgainForBranch1 = false;
                readAgainForBranch2 = false;
                const chunk1 = chunk;
                let chunk2 = chunk;
                if (!canceled1 && !canceled2) {
                  try {
                    chunk2 = CloneAsUint8Array(chunk);
                  } catch (cloneE) {
                    ReadableByteStreamControllerError(branch1._readableStreamController, cloneE);
                    ReadableByteStreamControllerError(branch2._readableStreamController, cloneE);
                    resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
                    return;
                  }
                }
                if (!canceled1) {
                  ReadableByteStreamControllerEnqueue(branch1._readableStreamController, chunk1);
                }
                if (!canceled2) {
                  ReadableByteStreamControllerEnqueue(branch2._readableStreamController, chunk2);
                }
                reading = false;
                if (readAgainForBranch1) {
                  pull1Algorithm();
                } else if (readAgainForBranch2) {
                  pull2Algorithm();
                }
              });
            },
            _closeSteps: () => {
              reading = false;
              if (!canceled1) {
                ReadableByteStreamControllerClose(branch1._readableStreamController);
              }
              if (!canceled2) {
                ReadableByteStreamControllerClose(branch2._readableStreamController);
              }
              if (branch1._readableStreamController._pendingPullIntos.length > 0) {
                ReadableByteStreamControllerRespond(branch1._readableStreamController, 0);
              }
              if (branch2._readableStreamController._pendingPullIntos.length > 0) {
                ReadableByteStreamControllerRespond(branch2._readableStreamController, 0);
              }
              if (!canceled1 || !canceled2) {
                resolveCancelPromise(void 0);
              }
            },
            _errorSteps: () => {
              reading = false;
            }
          };
          ReadableStreamDefaultReaderRead(reader, readRequest);
        }
        function pullWithBYOBReader(view, forBranch2) {
          if (IsReadableStreamDefaultReader(reader)) {
            ReadableStreamReaderGenericRelease(reader);
            reader = AcquireReadableStreamBYOBReader(stream);
            forwardReaderError(reader);
          }
          const byobBranch = forBranch2 ? branch2 : branch1;
          const otherBranch = forBranch2 ? branch1 : branch2;
          const readIntoRequest = {
            _chunkSteps: (chunk) => {
              _queueMicrotask(() => {
                readAgainForBranch1 = false;
                readAgainForBranch2 = false;
                const byobCanceled = forBranch2 ? canceled2 : canceled1;
                const otherCanceled = forBranch2 ? canceled1 : canceled2;
                if (!otherCanceled) {
                  let clonedChunk;
                  try {
                    clonedChunk = CloneAsUint8Array(chunk);
                  } catch (cloneE) {
                    ReadableByteStreamControllerError(byobBranch._readableStreamController, cloneE);
                    ReadableByteStreamControllerError(otherBranch._readableStreamController, cloneE);
                    resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
                    return;
                  }
                  if (!byobCanceled) {
                    ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                  }
                  ReadableByteStreamControllerEnqueue(otherBranch._readableStreamController, clonedChunk);
                } else if (!byobCanceled) {
                  ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                }
                reading = false;
                if (readAgainForBranch1) {
                  pull1Algorithm();
                } else if (readAgainForBranch2) {
                  pull2Algorithm();
                }
              });
            },
            _closeSteps: (chunk) => {
              reading = false;
              const byobCanceled = forBranch2 ? canceled2 : canceled1;
              const otherCanceled = forBranch2 ? canceled1 : canceled2;
              if (!byobCanceled) {
                ReadableByteStreamControllerClose(byobBranch._readableStreamController);
              }
              if (!otherCanceled) {
                ReadableByteStreamControllerClose(otherBranch._readableStreamController);
              }
              if (chunk !== void 0) {
                if (!byobCanceled) {
                  ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                }
                if (!otherCanceled && otherBranch._readableStreamController._pendingPullIntos.length > 0) {
                  ReadableByteStreamControllerRespond(otherBranch._readableStreamController, 0);
                }
              }
              if (!byobCanceled || !otherCanceled) {
                resolveCancelPromise(void 0);
              }
            },
            _errorSteps: () => {
              reading = false;
            }
          };
          ReadableStreamBYOBReaderRead(reader, view, 1, readIntoRequest);
        }
        function pull1Algorithm() {
          if (reading) {
            readAgainForBranch1 = true;
            return promiseResolvedWith(void 0);
          }
          reading = true;
          const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch1._readableStreamController);
          if (byobRequest === null) {
            pullWithDefaultReader();
          } else {
            pullWithBYOBReader(byobRequest._view, false);
          }
          return promiseResolvedWith(void 0);
        }
        function pull2Algorithm() {
          if (reading) {
            readAgainForBranch2 = true;
            return promiseResolvedWith(void 0);
          }
          reading = true;
          const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch2._readableStreamController);
          if (byobRequest === null) {
            pullWithDefaultReader();
          } else {
            pullWithBYOBReader(byobRequest._view, true);
          }
          return promiseResolvedWith(void 0);
        }
        function cancel1Algorithm(reason) {
          canceled1 = true;
          reason1 = reason;
          if (canceled2) {
            const compositeReason = CreateArrayFromList([reason1, reason2]);
            const cancelResult = ReadableStreamCancel(stream, compositeReason);
            resolveCancelPromise(cancelResult);
          }
          return cancelPromise;
        }
        function cancel2Algorithm(reason) {
          canceled2 = true;
          reason2 = reason;
          if (canceled1) {
            const compositeReason = CreateArrayFromList([reason1, reason2]);
            const cancelResult = ReadableStreamCancel(stream, compositeReason);
            resolveCancelPromise(cancelResult);
          }
          return cancelPromise;
        }
        function startAlgorithm() {
          return;
        }
        branch1 = CreateReadableByteStream(startAlgorithm, pull1Algorithm, cancel1Algorithm);
        branch2 = CreateReadableByteStream(startAlgorithm, pull2Algorithm, cancel2Algorithm);
        forwardReaderError(reader);
        return [branch1, branch2];
      }
      function isReadableStreamLike(stream) {
        return typeIsObject(stream) && typeof stream.getReader !== "undefined";
      }
      function ReadableStreamFrom(source) {
        if (isReadableStreamLike(source)) {
          return ReadableStreamFromDefaultReader(source.getReader());
        }
        return ReadableStreamFromIterable(source);
      }
      function ReadableStreamFromIterable(asyncIterable) {
        let stream;
        const iteratorRecord = GetIterator(asyncIterable, "async");
        const startAlgorithm = noop2;
        function pullAlgorithm() {
          let nextResult;
          try {
            nextResult = IteratorNext(iteratorRecord);
          } catch (e2) {
            return promiseRejectedWith(e2);
          }
          const nextPromise = promiseResolvedWith(nextResult);
          return transformPromiseWith(nextPromise, (iterResult) => {
            if (!typeIsObject(iterResult)) {
              throw new TypeError("The promise returned by the iterator.next() method must fulfill with an object");
            }
            const done = IteratorComplete(iterResult);
            if (done) {
              ReadableStreamDefaultControllerClose(stream._readableStreamController);
            } else {
              const value = IteratorValue(iterResult);
              ReadableStreamDefaultControllerEnqueue(stream._readableStreamController, value);
            }
          });
        }
        function cancelAlgorithm(reason) {
          const iterator = iteratorRecord.iterator;
          let returnMethod;
          try {
            returnMethod = GetMethod(iterator, "return");
          } catch (e2) {
            return promiseRejectedWith(e2);
          }
          if (returnMethod === void 0) {
            return promiseResolvedWith(void 0);
          }
          let returnResult;
          try {
            returnResult = reflectCall(returnMethod, iterator, [reason]);
          } catch (e2) {
            return promiseRejectedWith(e2);
          }
          const returnPromise = promiseResolvedWith(returnResult);
          return transformPromiseWith(returnPromise, (iterResult) => {
            if (!typeIsObject(iterResult)) {
              throw new TypeError("The promise returned by the iterator.return() method must fulfill with an object");
            }
            return void 0;
          });
        }
        stream = CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, 0);
        return stream;
      }
      function ReadableStreamFromDefaultReader(reader) {
        let stream;
        const startAlgorithm = noop2;
        function pullAlgorithm() {
          let readPromise;
          try {
            readPromise = reader.read();
          } catch (e2) {
            return promiseRejectedWith(e2);
          }
          return transformPromiseWith(readPromise, (readResult) => {
            if (!typeIsObject(readResult)) {
              throw new TypeError("The promise returned by the reader.read() method must fulfill with an object");
            }
            if (readResult.done) {
              ReadableStreamDefaultControllerClose(stream._readableStreamController);
            } else {
              const value = readResult.value;
              ReadableStreamDefaultControllerEnqueue(stream._readableStreamController, value);
            }
          });
        }
        function cancelAlgorithm(reason) {
          try {
            return promiseResolvedWith(reader.cancel(reason));
          } catch (e2) {
            return promiseRejectedWith(e2);
          }
        }
        stream = CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, 0);
        return stream;
      }
      function convertUnderlyingDefaultOrByteSource(source, context) {
        assertDictionary(source, context);
        const original = source;
        const autoAllocateChunkSize = original === null || original === void 0 ? void 0 : original.autoAllocateChunkSize;
        const cancel = original === null || original === void 0 ? void 0 : original.cancel;
        const pull = original === null || original === void 0 ? void 0 : original.pull;
        const start = original === null || original === void 0 ? void 0 : original.start;
        const type = original === null || original === void 0 ? void 0 : original.type;
        return {
          autoAllocateChunkSize: autoAllocateChunkSize === void 0 ? void 0 : convertUnsignedLongLongWithEnforceRange(autoAllocateChunkSize, `${context} has member 'autoAllocateChunkSize' that`),
          cancel: cancel === void 0 ? void 0 : convertUnderlyingSourceCancelCallback(cancel, original, `${context} has member 'cancel' that`),
          pull: pull === void 0 ? void 0 : convertUnderlyingSourcePullCallback(pull, original, `${context} has member 'pull' that`),
          start: start === void 0 ? void 0 : convertUnderlyingSourceStartCallback(start, original, `${context} has member 'start' that`),
          type: type === void 0 ? void 0 : convertReadableStreamType(type, `${context} has member 'type' that`)
        };
      }
      function convertUnderlyingSourceCancelCallback(fn2, original, context) {
        assertFunction(fn2, context);
        return (reason) => promiseCall(fn2, original, [reason]);
      }
      function convertUnderlyingSourcePullCallback(fn2, original, context) {
        assertFunction(fn2, context);
        return (controller) => promiseCall(fn2, original, [controller]);
      }
      function convertUnderlyingSourceStartCallback(fn2, original, context) {
        assertFunction(fn2, context);
        return (controller) => reflectCall(fn2, original, [controller]);
      }
      function convertReadableStreamType(type, context) {
        type = `${type}`;
        if (type !== "bytes") {
          throw new TypeError(`${context} '${type}' is not a valid enumeration value for ReadableStreamType`);
        }
        return type;
      }
      function convertIteratorOptions(options, context) {
        assertDictionary(options, context);
        const preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
        return { preventCancel: Boolean(preventCancel) };
      }
      function convertPipeOptions(options, context) {
        assertDictionary(options, context);
        const preventAbort = options === null || options === void 0 ? void 0 : options.preventAbort;
        const preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
        const preventClose = options === null || options === void 0 ? void 0 : options.preventClose;
        const signal = options === null || options === void 0 ? void 0 : options.signal;
        if (signal !== void 0) {
          assertAbortSignal(signal, `${context} has member 'signal' that`);
        }
        return {
          preventAbort: Boolean(preventAbort),
          preventCancel: Boolean(preventCancel),
          preventClose: Boolean(preventClose),
          signal
        };
      }
      function assertAbortSignal(signal, context) {
        if (!isAbortSignal2(signal)) {
          throw new TypeError(`${context} is not an AbortSignal.`);
        }
      }
      function convertReadableWritablePair(pair, context) {
        assertDictionary(pair, context);
        const readable = pair === null || pair === void 0 ? void 0 : pair.readable;
        assertRequiredField(readable, "readable", "ReadableWritablePair");
        assertReadableStream(readable, `${context} has member 'readable' that`);
        const writable = pair === null || pair === void 0 ? void 0 : pair.writable;
        assertRequiredField(writable, "writable", "ReadableWritablePair");
        assertWritableStream(writable, `${context} has member 'writable' that`);
        return { readable, writable };
      }
      class ReadableStream2 {
        constructor(rawUnderlyingSource = {}, rawStrategy = {}) {
          if (rawUnderlyingSource === void 0) {
            rawUnderlyingSource = null;
          } else {
            assertObject(rawUnderlyingSource, "First parameter");
          }
          const strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
          const underlyingSource = convertUnderlyingDefaultOrByteSource(rawUnderlyingSource, "First parameter");
          InitializeReadableStream(this);
          if (underlyingSource.type === "bytes") {
            if (strategy.size !== void 0) {
              throw new RangeError("The strategy for a byte stream cannot have a size function");
            }
            const highWaterMark = ExtractHighWaterMark(strategy, 0);
            SetUpReadableByteStreamControllerFromUnderlyingSource(this, underlyingSource, highWaterMark);
          } else {
            const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
            const highWaterMark = ExtractHighWaterMark(strategy, 1);
            SetUpReadableStreamDefaultControllerFromUnderlyingSource(this, underlyingSource, highWaterMark, sizeAlgorithm);
          }
        }
        /**
         * Whether or not the readable stream is locked to a {@link ReadableStreamDefaultReader | reader}.
         */
        get locked() {
          if (!IsReadableStream(this)) {
            throw streamBrandCheckException$1("locked");
          }
          return IsReadableStreamLocked(this);
        }
        /**
         * Cancels the stream, signaling a loss of interest in the stream by a consumer.
         *
         * The supplied `reason` argument will be given to the underlying source's {@link UnderlyingSource.cancel | cancel()}
         * method, which might or might not use it.
         */
        cancel(reason = void 0) {
          if (!IsReadableStream(this)) {
            return promiseRejectedWith(streamBrandCheckException$1("cancel"));
          }
          if (IsReadableStreamLocked(this)) {
            return promiseRejectedWith(new TypeError("Cannot cancel a stream that already has a reader"));
          }
          return ReadableStreamCancel(this, reason);
        }
        getReader(rawOptions = void 0) {
          if (!IsReadableStream(this)) {
            throw streamBrandCheckException$1("getReader");
          }
          const options = convertReaderOptions(rawOptions, "First parameter");
          if (options.mode === void 0) {
            return AcquireReadableStreamDefaultReader(this);
          }
          return AcquireReadableStreamBYOBReader(this);
        }
        pipeThrough(rawTransform, rawOptions = {}) {
          if (!IsReadableStream(this)) {
            throw streamBrandCheckException$1("pipeThrough");
          }
          assertRequiredArgument(rawTransform, 1, "pipeThrough");
          const transform = convertReadableWritablePair(rawTransform, "First parameter");
          const options = convertPipeOptions(rawOptions, "Second parameter");
          if (IsReadableStreamLocked(this)) {
            throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");
          }
          if (IsWritableStreamLocked(transform.writable)) {
            throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");
          }
          const promise = ReadableStreamPipeTo(this, transform.writable, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
          setPromiseIsHandledToTrue(promise);
          return transform.readable;
        }
        pipeTo(destination, rawOptions = {}) {
          if (!IsReadableStream(this)) {
            return promiseRejectedWith(streamBrandCheckException$1("pipeTo"));
          }
          if (destination === void 0) {
            return promiseRejectedWith(`Parameter 1 is required in 'pipeTo'.`);
          }
          if (!IsWritableStream(destination)) {
            return promiseRejectedWith(new TypeError(`ReadableStream.prototype.pipeTo's first argument must be a WritableStream`));
          }
          let options;
          try {
            options = convertPipeOptions(rawOptions, "Second parameter");
          } catch (e2) {
            return promiseRejectedWith(e2);
          }
          if (IsReadableStreamLocked(this)) {
            return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream"));
          }
          if (IsWritableStreamLocked(destination)) {
            return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream"));
          }
          return ReadableStreamPipeTo(this, destination, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
        }
        /**
         * Tees this readable stream, returning a two-element array containing the two resulting branches as
         * new {@link ReadableStream} instances.
         *
         * Teeing a stream will lock it, preventing any other consumer from acquiring a reader.
         * To cancel the stream, cancel both of the resulting branches; a composite cancellation reason will then be
         * propagated to the stream's underlying source.
         *
         * Note that the chunks seen in each branch will be the same object. If the chunks are not immutable,
         * this could allow interference between the two branches.
         */
        tee() {
          if (!IsReadableStream(this)) {
            throw streamBrandCheckException$1("tee");
          }
          const branches = ReadableStreamTee(this);
          return CreateArrayFromList(branches);
        }
        values(rawOptions = void 0) {
          if (!IsReadableStream(this)) {
            throw streamBrandCheckException$1("values");
          }
          const options = convertIteratorOptions(rawOptions, "First parameter");
          return AcquireReadableStreamAsyncIterator(this, options.preventCancel);
        }
        [SymbolAsyncIterator](options) {
          return this.values(options);
        }
        /**
         * Creates a new ReadableStream wrapping the provided iterable or async iterable.
         *
         * This can be used to adapt various kinds of objects into a readable stream,
         * such as an array, an async generator, or a Node.js readable stream.
         */
        static from(asyncIterable) {
          return ReadableStreamFrom(asyncIterable);
        }
      }
      Object.defineProperties(ReadableStream2, {
        from: { enumerable: true }
      });
      Object.defineProperties(ReadableStream2.prototype, {
        cancel: { enumerable: true },
        getReader: { enumerable: true },
        pipeThrough: { enumerable: true },
        pipeTo: { enumerable: true },
        tee: { enumerable: true },
        values: { enumerable: true },
        locked: { enumerable: true }
      });
      setFunctionName(ReadableStream2.from, "from");
      setFunctionName(ReadableStream2.prototype.cancel, "cancel");
      setFunctionName(ReadableStream2.prototype.getReader, "getReader");
      setFunctionName(ReadableStream2.prototype.pipeThrough, "pipeThrough");
      setFunctionName(ReadableStream2.prototype.pipeTo, "pipeTo");
      setFunctionName(ReadableStream2.prototype.tee, "tee");
      setFunctionName(ReadableStream2.prototype.values, "values");
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(ReadableStream2.prototype, Symbol.toStringTag, {
          value: "ReadableStream",
          configurable: true
        });
      }
      Object.defineProperty(ReadableStream2.prototype, SymbolAsyncIterator, {
        value: ReadableStream2.prototype.values,
        writable: true,
        configurable: true
      });
      function CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
        const stream = Object.create(ReadableStream2.prototype);
        InitializeReadableStream(stream);
        const controller = Object.create(ReadableStreamDefaultController.prototype);
        SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
        return stream;
      }
      function CreateReadableByteStream(startAlgorithm, pullAlgorithm, cancelAlgorithm) {
        const stream = Object.create(ReadableStream2.prototype);
        InitializeReadableStream(stream);
        const controller = Object.create(ReadableByteStreamController.prototype);
        SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, 0, void 0);
        return stream;
      }
      function InitializeReadableStream(stream) {
        stream._state = "readable";
        stream._reader = void 0;
        stream._storedError = void 0;
        stream._disturbed = false;
      }
      function IsReadableStream(x3) {
        if (!typeIsObject(x3)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x3, "_readableStreamController")) {
          return false;
        }
        return x3 instanceof ReadableStream2;
      }
      function IsReadableStreamLocked(stream) {
        if (stream._reader === void 0) {
          return false;
        }
        return true;
      }
      function ReadableStreamCancel(stream, reason) {
        stream._disturbed = true;
        if (stream._state === "closed") {
          return promiseResolvedWith(void 0);
        }
        if (stream._state === "errored") {
          return promiseRejectedWith(stream._storedError);
        }
        ReadableStreamClose(stream);
        const reader = stream._reader;
        if (reader !== void 0 && IsReadableStreamBYOBReader(reader)) {
          const readIntoRequests = reader._readIntoRequests;
          reader._readIntoRequests = new SimpleQueue();
          readIntoRequests.forEach((readIntoRequest) => {
            readIntoRequest._closeSteps(void 0);
          });
        }
        const sourceCancelPromise = stream._readableStreamController[CancelSteps](reason);
        return transformPromiseWith(sourceCancelPromise, noop2);
      }
      function ReadableStreamClose(stream) {
        stream._state = "closed";
        const reader = stream._reader;
        if (reader === void 0) {
          return;
        }
        defaultReaderClosedPromiseResolve(reader);
        if (IsReadableStreamDefaultReader(reader)) {
          const readRequests = reader._readRequests;
          reader._readRequests = new SimpleQueue();
          readRequests.forEach((readRequest) => {
            readRequest._closeSteps();
          });
        }
      }
      function ReadableStreamError(stream, e2) {
        stream._state = "errored";
        stream._storedError = e2;
        const reader = stream._reader;
        if (reader === void 0) {
          return;
        }
        defaultReaderClosedPromiseReject(reader, e2);
        if (IsReadableStreamDefaultReader(reader)) {
          ReadableStreamDefaultReaderErrorReadRequests(reader, e2);
        } else {
          ReadableStreamBYOBReaderErrorReadIntoRequests(reader, e2);
        }
      }
      function streamBrandCheckException$1(name) {
        return new TypeError(`ReadableStream.prototype.${name} can only be used on a ReadableStream`);
      }
      function convertQueuingStrategyInit(init, context) {
        assertDictionary(init, context);
        const highWaterMark = init === null || init === void 0 ? void 0 : init.highWaterMark;
        assertRequiredField(highWaterMark, "highWaterMark", "QueuingStrategyInit");
        return {
          highWaterMark: convertUnrestrictedDouble(highWaterMark)
        };
      }
      const byteLengthSizeFunction = (chunk) => {
        return chunk.byteLength;
      };
      setFunctionName(byteLengthSizeFunction, "size");
      class ByteLengthQueuingStrategy {
        constructor(options) {
          assertRequiredArgument(options, 1, "ByteLengthQueuingStrategy");
          options = convertQueuingStrategyInit(options, "First parameter");
          this._byteLengthQueuingStrategyHighWaterMark = options.highWaterMark;
        }
        /**
         * Returns the high water mark provided to the constructor.
         */
        get highWaterMark() {
          if (!IsByteLengthQueuingStrategy(this)) {
            throw byteLengthBrandCheckException("highWaterMark");
          }
          return this._byteLengthQueuingStrategyHighWaterMark;
        }
        /**
         * Measures the size of `chunk` by returning the value of its `byteLength` property.
         */
        get size() {
          if (!IsByteLengthQueuingStrategy(this)) {
            throw byteLengthBrandCheckException("size");
          }
          return byteLengthSizeFunction;
        }
      }
      Object.defineProperties(ByteLengthQueuingStrategy.prototype, {
        highWaterMark: { enumerable: true },
        size: { enumerable: true }
      });
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(ByteLengthQueuingStrategy.prototype, Symbol.toStringTag, {
          value: "ByteLengthQueuingStrategy",
          configurable: true
        });
      }
      function byteLengthBrandCheckException(name) {
        return new TypeError(`ByteLengthQueuingStrategy.prototype.${name} can only be used on a ByteLengthQueuingStrategy`);
      }
      function IsByteLengthQueuingStrategy(x3) {
        if (!typeIsObject(x3)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x3, "_byteLengthQueuingStrategyHighWaterMark")) {
          return false;
        }
        return x3 instanceof ByteLengthQueuingStrategy;
      }
      const countSizeFunction = () => {
        return 1;
      };
      setFunctionName(countSizeFunction, "size");
      class CountQueuingStrategy {
        constructor(options) {
          assertRequiredArgument(options, 1, "CountQueuingStrategy");
          options = convertQueuingStrategyInit(options, "First parameter");
          this._countQueuingStrategyHighWaterMark = options.highWaterMark;
        }
        /**
         * Returns the high water mark provided to the constructor.
         */
        get highWaterMark() {
          if (!IsCountQueuingStrategy(this)) {
            throw countBrandCheckException("highWaterMark");
          }
          return this._countQueuingStrategyHighWaterMark;
        }
        /**
         * Measures the size of `chunk` by always returning 1.
         * This ensures that the total queue size is a count of the number of chunks in the queue.
         */
        get size() {
          if (!IsCountQueuingStrategy(this)) {
            throw countBrandCheckException("size");
          }
          return countSizeFunction;
        }
      }
      Object.defineProperties(CountQueuingStrategy.prototype, {
        highWaterMark: { enumerable: true },
        size: { enumerable: true }
      });
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(CountQueuingStrategy.prototype, Symbol.toStringTag, {
          value: "CountQueuingStrategy",
          configurable: true
        });
      }
      function countBrandCheckException(name) {
        return new TypeError(`CountQueuingStrategy.prototype.${name} can only be used on a CountQueuingStrategy`);
      }
      function IsCountQueuingStrategy(x3) {
        if (!typeIsObject(x3)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x3, "_countQueuingStrategyHighWaterMark")) {
          return false;
        }
        return x3 instanceof CountQueuingStrategy;
      }
      function convertTransformer(original, context) {
        assertDictionary(original, context);
        const cancel = original === null || original === void 0 ? void 0 : original.cancel;
        const flush = original === null || original === void 0 ? void 0 : original.flush;
        const readableType = original === null || original === void 0 ? void 0 : original.readableType;
        const start = original === null || original === void 0 ? void 0 : original.start;
        const transform = original === null || original === void 0 ? void 0 : original.transform;
        const writableType = original === null || original === void 0 ? void 0 : original.writableType;
        return {
          cancel: cancel === void 0 ? void 0 : convertTransformerCancelCallback(cancel, original, `${context} has member 'cancel' that`),
          flush: flush === void 0 ? void 0 : convertTransformerFlushCallback(flush, original, `${context} has member 'flush' that`),
          readableType,
          start: start === void 0 ? void 0 : convertTransformerStartCallback(start, original, `${context} has member 'start' that`),
          transform: transform === void 0 ? void 0 : convertTransformerTransformCallback(transform, original, `${context} has member 'transform' that`),
          writableType
        };
      }
      function convertTransformerFlushCallback(fn2, original, context) {
        assertFunction(fn2, context);
        return (controller) => promiseCall(fn2, original, [controller]);
      }
      function convertTransformerStartCallback(fn2, original, context) {
        assertFunction(fn2, context);
        return (controller) => reflectCall(fn2, original, [controller]);
      }
      function convertTransformerTransformCallback(fn2, original, context) {
        assertFunction(fn2, context);
        return (chunk, controller) => promiseCall(fn2, original, [chunk, controller]);
      }
      function convertTransformerCancelCallback(fn2, original, context) {
        assertFunction(fn2, context);
        return (reason) => promiseCall(fn2, original, [reason]);
      }
      class TransformStream {
        constructor(rawTransformer = {}, rawWritableStrategy = {}, rawReadableStrategy = {}) {
          if (rawTransformer === void 0) {
            rawTransformer = null;
          }
          const writableStrategy = convertQueuingStrategy(rawWritableStrategy, "Second parameter");
          const readableStrategy = convertQueuingStrategy(rawReadableStrategy, "Third parameter");
          const transformer = convertTransformer(rawTransformer, "First parameter");
          if (transformer.readableType !== void 0) {
            throw new RangeError("Invalid readableType specified");
          }
          if (transformer.writableType !== void 0) {
            throw new RangeError("Invalid writableType specified");
          }
          const readableHighWaterMark = ExtractHighWaterMark(readableStrategy, 0);
          const readableSizeAlgorithm = ExtractSizeAlgorithm(readableStrategy);
          const writableHighWaterMark = ExtractHighWaterMark(writableStrategy, 1);
          const writableSizeAlgorithm = ExtractSizeAlgorithm(writableStrategy);
          let startPromise_resolve;
          const startPromise = newPromise((resolve) => {
            startPromise_resolve = resolve;
          });
          InitializeTransformStream(this, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
          SetUpTransformStreamDefaultControllerFromTransformer(this, transformer);
          if (transformer.start !== void 0) {
            startPromise_resolve(transformer.start(this._transformStreamController));
          } else {
            startPromise_resolve(void 0);
          }
        }
        /**
         * The readable side of the transform stream.
         */
        get readable() {
          if (!IsTransformStream(this)) {
            throw streamBrandCheckException("readable");
          }
          return this._readable;
        }
        /**
         * The writable side of the transform stream.
         */
        get writable() {
          if (!IsTransformStream(this)) {
            throw streamBrandCheckException("writable");
          }
          return this._writable;
        }
      }
      Object.defineProperties(TransformStream.prototype, {
        readable: { enumerable: true },
        writable: { enumerable: true }
      });
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(TransformStream.prototype, Symbol.toStringTag, {
          value: "TransformStream",
          configurable: true
        });
      }
      function InitializeTransformStream(stream, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm) {
        function startAlgorithm() {
          return startPromise;
        }
        function writeAlgorithm(chunk) {
          return TransformStreamDefaultSinkWriteAlgorithm(stream, chunk);
        }
        function abortAlgorithm(reason) {
          return TransformStreamDefaultSinkAbortAlgorithm(stream, reason);
        }
        function closeAlgorithm() {
          return TransformStreamDefaultSinkCloseAlgorithm(stream);
        }
        stream._writable = CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, writableHighWaterMark, writableSizeAlgorithm);
        function pullAlgorithm() {
          return TransformStreamDefaultSourcePullAlgorithm(stream);
        }
        function cancelAlgorithm(reason) {
          return TransformStreamDefaultSourceCancelAlgorithm(stream, reason);
        }
        stream._readable = CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
        stream._backpressure = void 0;
        stream._backpressureChangePromise = void 0;
        stream._backpressureChangePromise_resolve = void 0;
        TransformStreamSetBackpressure(stream, true);
        stream._transformStreamController = void 0;
      }
      function IsTransformStream(x3) {
        if (!typeIsObject(x3)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x3, "_transformStreamController")) {
          return false;
        }
        return x3 instanceof TransformStream;
      }
      function TransformStreamError(stream, e2) {
        ReadableStreamDefaultControllerError(stream._readable._readableStreamController, e2);
        TransformStreamErrorWritableAndUnblockWrite(stream, e2);
      }
      function TransformStreamErrorWritableAndUnblockWrite(stream, e2) {
        TransformStreamDefaultControllerClearAlgorithms(stream._transformStreamController);
        WritableStreamDefaultControllerErrorIfNeeded(stream._writable._writableStreamController, e2);
        TransformStreamUnblockWrite(stream);
      }
      function TransformStreamUnblockWrite(stream) {
        if (stream._backpressure) {
          TransformStreamSetBackpressure(stream, false);
        }
      }
      function TransformStreamSetBackpressure(stream, backpressure) {
        if (stream._backpressureChangePromise !== void 0) {
          stream._backpressureChangePromise_resolve();
        }
        stream._backpressureChangePromise = newPromise((resolve) => {
          stream._backpressureChangePromise_resolve = resolve;
        });
        stream._backpressure = backpressure;
      }
      class TransformStreamDefaultController {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        /**
         * Returns the desired size to fill the readable side’s internal queue. It can be negative, if the queue is over-full.
         */
        get desiredSize() {
          if (!IsTransformStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException("desiredSize");
          }
          const readableController = this._controlledTransformStream._readable._readableStreamController;
          return ReadableStreamDefaultControllerGetDesiredSize(readableController);
        }
        enqueue(chunk = void 0) {
          if (!IsTransformStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException("enqueue");
          }
          TransformStreamDefaultControllerEnqueue(this, chunk);
        }
        /**
         * Errors both the readable side and the writable side of the controlled transform stream, making all future
         * interactions with it fail with the given error `e`. Any chunks queued for transformation will be discarded.
         */
        error(reason = void 0) {
          if (!IsTransformStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException("error");
          }
          TransformStreamDefaultControllerError(this, reason);
        }
        /**
         * Closes the readable side and errors the writable side of the controlled transform stream. This is useful when the
         * transformer only needs to consume a portion of the chunks written to the writable side.
         */
        terminate() {
          if (!IsTransformStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException("terminate");
          }
          TransformStreamDefaultControllerTerminate(this);
        }
      }
      Object.defineProperties(TransformStreamDefaultController.prototype, {
        enqueue: { enumerable: true },
        error: { enumerable: true },
        terminate: { enumerable: true },
        desiredSize: { enumerable: true }
      });
      setFunctionName(TransformStreamDefaultController.prototype.enqueue, "enqueue");
      setFunctionName(TransformStreamDefaultController.prototype.error, "error");
      setFunctionName(TransformStreamDefaultController.prototype.terminate, "terminate");
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(TransformStreamDefaultController.prototype, Symbol.toStringTag, {
          value: "TransformStreamDefaultController",
          configurable: true
        });
      }
      function IsTransformStreamDefaultController(x3) {
        if (!typeIsObject(x3)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x3, "_controlledTransformStream")) {
          return false;
        }
        return x3 instanceof TransformStreamDefaultController;
      }
      function SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm, cancelAlgorithm) {
        controller._controlledTransformStream = stream;
        stream._transformStreamController = controller;
        controller._transformAlgorithm = transformAlgorithm;
        controller._flushAlgorithm = flushAlgorithm;
        controller._cancelAlgorithm = cancelAlgorithm;
        controller._finishPromise = void 0;
        controller._finishPromise_resolve = void 0;
        controller._finishPromise_reject = void 0;
      }
      function SetUpTransformStreamDefaultControllerFromTransformer(stream, transformer) {
        const controller = Object.create(TransformStreamDefaultController.prototype);
        let transformAlgorithm;
        let flushAlgorithm;
        let cancelAlgorithm;
        if (transformer.transform !== void 0) {
          transformAlgorithm = (chunk) => transformer.transform(chunk, controller);
        } else {
          transformAlgorithm = (chunk) => {
            try {
              TransformStreamDefaultControllerEnqueue(controller, chunk);
              return promiseResolvedWith(void 0);
            } catch (transformResultE) {
              return promiseRejectedWith(transformResultE);
            }
          };
        }
        if (transformer.flush !== void 0) {
          flushAlgorithm = () => transformer.flush(controller);
        } else {
          flushAlgorithm = () => promiseResolvedWith(void 0);
        }
        if (transformer.cancel !== void 0) {
          cancelAlgorithm = (reason) => transformer.cancel(reason);
        } else {
          cancelAlgorithm = () => promiseResolvedWith(void 0);
        }
        SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm, cancelAlgorithm);
      }
      function TransformStreamDefaultControllerClearAlgorithms(controller) {
        controller._transformAlgorithm = void 0;
        controller._flushAlgorithm = void 0;
        controller._cancelAlgorithm = void 0;
      }
      function TransformStreamDefaultControllerEnqueue(controller, chunk) {
        const stream = controller._controlledTransformStream;
        const readableController = stream._readable._readableStreamController;
        if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(readableController)) {
          throw new TypeError("Readable side is not in a state that permits enqueue");
        }
        try {
          ReadableStreamDefaultControllerEnqueue(readableController, chunk);
        } catch (e2) {
          TransformStreamErrorWritableAndUnblockWrite(stream, e2);
          throw stream._readable._storedError;
        }
        const backpressure = ReadableStreamDefaultControllerHasBackpressure(readableController);
        if (backpressure !== stream._backpressure) {
          TransformStreamSetBackpressure(stream, true);
        }
      }
      function TransformStreamDefaultControllerError(controller, e2) {
        TransformStreamError(controller._controlledTransformStream, e2);
      }
      function TransformStreamDefaultControllerPerformTransform(controller, chunk) {
        const transformPromise = controller._transformAlgorithm(chunk);
        return transformPromiseWith(transformPromise, void 0, (r2) => {
          TransformStreamError(controller._controlledTransformStream, r2);
          throw r2;
        });
      }
      function TransformStreamDefaultControllerTerminate(controller) {
        const stream = controller._controlledTransformStream;
        const readableController = stream._readable._readableStreamController;
        ReadableStreamDefaultControllerClose(readableController);
        const error = new TypeError("TransformStream terminated");
        TransformStreamErrorWritableAndUnblockWrite(stream, error);
      }
      function TransformStreamDefaultSinkWriteAlgorithm(stream, chunk) {
        const controller = stream._transformStreamController;
        if (stream._backpressure) {
          const backpressureChangePromise = stream._backpressureChangePromise;
          return transformPromiseWith(backpressureChangePromise, () => {
            const writable = stream._writable;
            const state = writable._state;
            if (state === "erroring") {
              throw writable._storedError;
            }
            return TransformStreamDefaultControllerPerformTransform(controller, chunk);
          });
        }
        return TransformStreamDefaultControllerPerformTransform(controller, chunk);
      }
      function TransformStreamDefaultSinkAbortAlgorithm(stream, reason) {
        const controller = stream._transformStreamController;
        if (controller._finishPromise !== void 0) {
          return controller._finishPromise;
        }
        const readable = stream._readable;
        controller._finishPromise = newPromise((resolve, reject) => {
          controller._finishPromise_resolve = resolve;
          controller._finishPromise_reject = reject;
        });
        const cancelPromise = controller._cancelAlgorithm(reason);
        TransformStreamDefaultControllerClearAlgorithms(controller);
        uponPromise(cancelPromise, () => {
          if (readable._state === "errored") {
            defaultControllerFinishPromiseReject(controller, readable._storedError);
          } else {
            ReadableStreamDefaultControllerError(readable._readableStreamController, reason);
            defaultControllerFinishPromiseResolve(controller);
          }
          return null;
        }, (r2) => {
          ReadableStreamDefaultControllerError(readable._readableStreamController, r2);
          defaultControllerFinishPromiseReject(controller, r2);
          return null;
        });
        return controller._finishPromise;
      }
      function TransformStreamDefaultSinkCloseAlgorithm(stream) {
        const controller = stream._transformStreamController;
        if (controller._finishPromise !== void 0) {
          return controller._finishPromise;
        }
        const readable = stream._readable;
        controller._finishPromise = newPromise((resolve, reject) => {
          controller._finishPromise_resolve = resolve;
          controller._finishPromise_reject = reject;
        });
        const flushPromise = controller._flushAlgorithm();
        TransformStreamDefaultControllerClearAlgorithms(controller);
        uponPromise(flushPromise, () => {
          if (readable._state === "errored") {
            defaultControllerFinishPromiseReject(controller, readable._storedError);
          } else {
            ReadableStreamDefaultControllerClose(readable._readableStreamController);
            defaultControllerFinishPromiseResolve(controller);
          }
          return null;
        }, (r2) => {
          ReadableStreamDefaultControllerError(readable._readableStreamController, r2);
          defaultControllerFinishPromiseReject(controller, r2);
          return null;
        });
        return controller._finishPromise;
      }
      function TransformStreamDefaultSourcePullAlgorithm(stream) {
        TransformStreamSetBackpressure(stream, false);
        return stream._backpressureChangePromise;
      }
      function TransformStreamDefaultSourceCancelAlgorithm(stream, reason) {
        const controller = stream._transformStreamController;
        if (controller._finishPromise !== void 0) {
          return controller._finishPromise;
        }
        const writable = stream._writable;
        controller._finishPromise = newPromise((resolve, reject) => {
          controller._finishPromise_resolve = resolve;
          controller._finishPromise_reject = reject;
        });
        const cancelPromise = controller._cancelAlgorithm(reason);
        TransformStreamDefaultControllerClearAlgorithms(controller);
        uponPromise(cancelPromise, () => {
          if (writable._state === "errored") {
            defaultControllerFinishPromiseReject(controller, writable._storedError);
          } else {
            WritableStreamDefaultControllerErrorIfNeeded(writable._writableStreamController, reason);
            TransformStreamUnblockWrite(stream);
            defaultControllerFinishPromiseResolve(controller);
          }
          return null;
        }, (r2) => {
          WritableStreamDefaultControllerErrorIfNeeded(writable._writableStreamController, r2);
          TransformStreamUnblockWrite(stream);
          defaultControllerFinishPromiseReject(controller, r2);
          return null;
        });
        return controller._finishPromise;
      }
      function defaultControllerBrandCheckException(name) {
        return new TypeError(`TransformStreamDefaultController.prototype.${name} can only be used on a TransformStreamDefaultController`);
      }
      function defaultControllerFinishPromiseResolve(controller) {
        if (controller._finishPromise_resolve === void 0) {
          return;
        }
        controller._finishPromise_resolve();
        controller._finishPromise_resolve = void 0;
        controller._finishPromise_reject = void 0;
      }
      function defaultControllerFinishPromiseReject(controller, reason) {
        if (controller._finishPromise_reject === void 0) {
          return;
        }
        setPromiseIsHandledToTrue(controller._finishPromise);
        controller._finishPromise_reject(reason);
        controller._finishPromise_resolve = void 0;
        controller._finishPromise_reject = void 0;
      }
      function streamBrandCheckException(name) {
        return new TypeError(`TransformStream.prototype.${name} can only be used on a TransformStream`);
      }
      exports3.ByteLengthQueuingStrategy = ByteLengthQueuingStrategy;
      exports3.CountQueuingStrategy = CountQueuingStrategy;
      exports3.ReadableByteStreamController = ReadableByteStreamController;
      exports3.ReadableStream = ReadableStream2;
      exports3.ReadableStreamBYOBReader = ReadableStreamBYOBReader;
      exports3.ReadableStreamBYOBRequest = ReadableStreamBYOBRequest;
      exports3.ReadableStreamDefaultController = ReadableStreamDefaultController;
      exports3.ReadableStreamDefaultReader = ReadableStreamDefaultReader;
      exports3.TransformStream = TransformStream;
      exports3.TransformStreamDefaultController = TransformStreamDefaultController;
      exports3.WritableStream = WritableStream;
      exports3.WritableStreamDefaultController = WritableStreamDefaultController;
      exports3.WritableStreamDefaultWriter = WritableStreamDefaultWriter;
    });
  }
});

// node_modules/fetch-blob/streams.cjs
var require_streams = __commonJS({
  "node_modules/fetch-blob/streams.cjs"() {
    var POOL_SIZE2 = 65536;
    if (!globalThis.ReadableStream) {
      try {
        const process2 = require("node:process");
        const { emitWarning } = process2;
        try {
          process2.emitWarning = () => {
          };
          Object.assign(globalThis, require("node:stream/web"));
          process2.emitWarning = emitWarning;
        } catch (error) {
          process2.emitWarning = emitWarning;
          throw error;
        }
      } catch (error) {
        Object.assign(globalThis, require_ponyfill_es2018());
      }
    }
    try {
      const { Blob: Blob3 } = require("buffer");
      if (Blob3 && !Blob3.prototype.stream) {
        Blob3.prototype.stream = function name(params) {
          let position = 0;
          const blob = this;
          return new ReadableStream({
            type: "bytes",
            async pull(ctrl) {
              const chunk = blob.slice(position, Math.min(blob.size, position + POOL_SIZE2));
              const buffer = await chunk.arrayBuffer();
              position += buffer.byteLength;
              ctrl.enqueue(new Uint8Array(buffer));
              if (position === blob.size) {
                ctrl.close();
              }
            }
          });
        };
      }
    } catch (error) {
    }
  }
});

// node_modules/fetch-blob/index.js
async function* toIterator(parts, clone2 = true) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* (
        /** @type {AsyncIterableIterator<Uint8Array>} */
        part.stream()
      );
    } else if (ArrayBuffer.isView(part)) {
      if (clone2) {
        let position = part.byteOffset;
        const end = part.byteOffset + part.byteLength;
        while (position !== end) {
          const size = Math.min(end - position, POOL_SIZE);
          const chunk = part.buffer.slice(position, position + size);
          position += chunk.byteLength;
          yield new Uint8Array(chunk);
        }
      } else {
        yield part;
      }
    } else {
      let position = 0, b2 = (
        /** @type {Blob} */
        part
      );
      while (position !== b2.size) {
        const chunk = b2.slice(position, Math.min(b2.size, position + POOL_SIZE));
        const buffer = await chunk.arrayBuffer();
        position += buffer.byteLength;
        yield new Uint8Array(buffer);
      }
    }
  }
}
var import_streams, POOL_SIZE, _Blob, Blob2, fetch_blob_default;
var init_fetch_blob = __esm({
  "node_modules/fetch-blob/index.js"() {
    import_streams = __toESM(require_streams(), 1);
    POOL_SIZE = 65536;
    _Blob = class Blob {
      /** @type {Array.<(Blob|Uint8Array)>} */
      #parts = [];
      #type = "";
      #size = 0;
      #endings = "transparent";
      /**
       * The Blob() constructor returns a new Blob object. The content
       * of the blob consists of the concatenation of the values given
       * in the parameter array.
       *
       * @param {*} blobParts
       * @param {{ type?: string, endings?: string }} [options]
       */
      constructor(blobParts = [], options = {}) {
        if (typeof blobParts !== "object" || blobParts === null) {
          throw new TypeError("Failed to construct 'Blob': The provided value cannot be converted to a sequence.");
        }
        if (typeof blobParts[Symbol.iterator] !== "function") {
          throw new TypeError("Failed to construct 'Blob': The object must have a callable @@iterator property.");
        }
        if (typeof options !== "object" && typeof options !== "function") {
          throw new TypeError("Failed to construct 'Blob': parameter 2 cannot convert to dictionary.");
        }
        if (options === null) options = {};
        const encoder = new TextEncoder();
        for (const element of blobParts) {
          let part;
          if (ArrayBuffer.isView(element)) {
            part = new Uint8Array(element.buffer.slice(element.byteOffset, element.byteOffset + element.byteLength));
          } else if (element instanceof ArrayBuffer) {
            part = new Uint8Array(element.slice(0));
          } else if (element instanceof Blob) {
            part = element;
          } else {
            part = encoder.encode(`${element}`);
          }
          this.#size += ArrayBuffer.isView(part) ? part.byteLength : part.size;
          this.#parts.push(part);
        }
        this.#endings = `${options.endings === void 0 ? "transparent" : options.endings}`;
        const type = options.type === void 0 ? "" : String(options.type);
        this.#type = /^[\x20-\x7E]*$/.test(type) ? type : "";
      }
      /**
       * The Blob interface's size property returns the
       * size of the Blob in bytes.
       */
      get size() {
        return this.#size;
      }
      /**
       * The type property of a Blob object returns the MIME type of the file.
       */
      get type() {
        return this.#type;
      }
      /**
       * The text() method in the Blob interface returns a Promise
       * that resolves with a string containing the contents of
       * the blob, interpreted as UTF-8.
       *
       * @return {Promise<string>}
       */
      async text() {
        const decoder = new TextDecoder();
        let str = "";
        for await (const part of toIterator(this.#parts, false)) {
          str += decoder.decode(part, { stream: true });
        }
        str += decoder.decode();
        return str;
      }
      /**
       * The arrayBuffer() method in the Blob interface returns a
       * Promise that resolves with the contents of the blob as
       * binary data contained in an ArrayBuffer.
       *
       * @return {Promise<ArrayBuffer>}
       */
      async arrayBuffer() {
        const data = new Uint8Array(this.size);
        let offset = 0;
        for await (const chunk of toIterator(this.#parts, false)) {
          data.set(chunk, offset);
          offset += chunk.length;
        }
        return data.buffer;
      }
      stream() {
        const it2 = toIterator(this.#parts, true);
        return new globalThis.ReadableStream({
          // @ts-ignore
          type: "bytes",
          async pull(ctrl) {
            const chunk = await it2.next();
            chunk.done ? ctrl.close() : ctrl.enqueue(chunk.value);
          },
          async cancel() {
            await it2.return();
          }
        });
      }
      /**
       * The Blob interface's slice() method creates and returns a
       * new Blob object which contains data from a subset of the
       * blob on which it's called.
       *
       * @param {number} [start]
       * @param {number} [end]
       * @param {string} [type]
       */
      slice(start = 0, end = this.size, type = "") {
        const { size } = this;
        let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
        let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
        const span = Math.max(relativeEnd - relativeStart, 0);
        const parts = this.#parts;
        const blobParts = [];
        let added = 0;
        for (const part of parts) {
          if (added >= span) {
            break;
          }
          const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
          if (relativeStart && size2 <= relativeStart) {
            relativeStart -= size2;
            relativeEnd -= size2;
          } else {
            let chunk;
            if (ArrayBuffer.isView(part)) {
              chunk = part.subarray(relativeStart, Math.min(size2, relativeEnd));
              added += chunk.byteLength;
            } else {
              chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
              added += chunk.size;
            }
            relativeEnd -= size2;
            blobParts.push(chunk);
            relativeStart = 0;
          }
        }
        const blob = new Blob([], { type: String(type).toLowerCase() });
        blob.#size = span;
        blob.#parts = blobParts;
        return blob;
      }
      get [Symbol.toStringTag]() {
        return "Blob";
      }
      static [Symbol.hasInstance](object) {
        return object && typeof object === "object" && typeof object.constructor === "function" && (typeof object.stream === "function" || typeof object.arrayBuffer === "function") && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
      }
    };
    Object.defineProperties(_Blob.prototype, {
      size: { enumerable: true },
      type: { enumerable: true },
      slice: { enumerable: true }
    });
    Blob2 = _Blob;
    fetch_blob_default = Blob2;
  }
});

// node_modules/fetch-blob/file.js
var _File, File2, file_default;
var init_file = __esm({
  "node_modules/fetch-blob/file.js"() {
    init_fetch_blob();
    _File = class File extends fetch_blob_default {
      #lastModified = 0;
      #name = "";
      /**
       * @param {*[]} fileBits
       * @param {string} fileName
       * @param {{lastModified?: number, type?: string}} options
       */
      // @ts-ignore
      constructor(fileBits, fileName, options = {}) {
        if (arguments.length < 2) {
          throw new TypeError(`Failed to construct 'File': 2 arguments required, but only ${arguments.length} present.`);
        }
        super(fileBits, options);
        if (options === null) options = {};
        const lastModified = options.lastModified === void 0 ? Date.now() : Number(options.lastModified);
        if (!Number.isNaN(lastModified)) {
          this.#lastModified = lastModified;
        }
        this.#name = String(fileName);
      }
      get name() {
        return this.#name;
      }
      get lastModified() {
        return this.#lastModified;
      }
      get [Symbol.toStringTag]() {
        return "File";
      }
      static [Symbol.hasInstance](object) {
        return !!object && object instanceof fetch_blob_default && /^(File)$/.test(object[Symbol.toStringTag]);
      }
    };
    File2 = _File;
    file_default = File2;
  }
});

// node_modules/formdata-polyfill/esm.min.js
function formDataToBlob(F3, B2 = fetch_blob_default) {
  var b2 = `${r()}${r()}`.replace(/\./g, "").slice(-28).padStart(32, "-"), c = [], p = `--${b2}\r
Content-Disposition: form-data; name="`;
  F3.forEach((v, n) => typeof v == "string" ? c.push(p + e(n) + `"\r
\r
${v.replace(/\r(?!\n)|(?<!\r)\n/g, "\r\n")}\r
`) : c.push(p + e(n) + `"; filename="${e(v.name, 1)}"\r
Content-Type: ${v.type || "application/octet-stream"}\r
\r
`, v, "\r\n"));
  c.push(`--${b2}--`);
  return new B2(c, { type: "multipart/form-data; boundary=" + b2 });
}
var t, i, h, r, m2, f, e, x2, FormData;
var init_esm_min = __esm({
  "node_modules/formdata-polyfill/esm.min.js"() {
    init_fetch_blob();
    init_file();
    ({ toStringTag: t, iterator: i, hasInstance: h } = Symbol);
    r = Math.random;
    m2 = "append,set,get,getAll,delete,keys,values,entries,forEach,constructor".split(",");
    f = (a, b2, c) => (a += "", /^(Blob|File)$/.test(b2 && b2[t]) ? [(c = c !== void 0 ? c + "" : b2[t] == "File" ? b2.name : "blob", a), b2.name !== c || b2[t] == "blob" ? new file_default([b2], c, b2) : b2] : [a, b2 + ""]);
    e = (c, f3) => (f3 ? c : c.replace(/\r?\n|\r/g, "\r\n")).replace(/\n/g, "%0A").replace(/\r/g, "%0D").replace(/"/g, "%22");
    x2 = (n, a, e2) => {
      if (a.length < e2) {
        throw new TypeError(`Failed to execute '${n}' on 'FormData': ${e2} arguments required, but only ${a.length} present.`);
      }
    };
    FormData = class FormData2 {
      #d = [];
      constructor(...a) {
        if (a.length) throw new TypeError(`Failed to construct 'FormData': parameter 1 is not of type 'HTMLFormElement'.`);
      }
      get [t]() {
        return "FormData";
      }
      [i]() {
        return this.entries();
      }
      static [h](o) {
        return o && typeof o === "object" && o[t] === "FormData" && !m2.some((m3) => typeof o[m3] != "function");
      }
      append(...a) {
        x2("append", arguments, 2);
        this.#d.push(f(...a));
      }
      delete(a) {
        x2("delete", arguments, 1);
        a += "";
        this.#d = this.#d.filter(([b2]) => b2 !== a);
      }
      get(a) {
        x2("get", arguments, 1);
        a += "";
        for (var b2 = this.#d, l = b2.length, c = 0; c < l; c++) if (b2[c][0] === a) return b2[c][1];
        return null;
      }
      getAll(a, b2) {
        x2("getAll", arguments, 1);
        b2 = [];
        a += "";
        this.#d.forEach((c) => c[0] === a && b2.push(c[1]));
        return b2;
      }
      has(a) {
        x2("has", arguments, 1);
        a += "";
        return this.#d.some((b2) => b2[0] === a);
      }
      forEach(a, b2) {
        x2("forEach", arguments, 1);
        for (var [c, d] of this) a.call(b2, d, c, this);
      }
      set(...a) {
        x2("set", arguments, 2);
        var b2 = [], c = true;
        a = f(...a);
        this.#d.forEach((d) => {
          d[0] === a[0] ? c && (c = !b2.push(a)) : b2.push(d);
        });
        c && b2.push(a);
        this.#d = b2;
      }
      *entries() {
        yield* this.#d;
      }
      *keys() {
        for (var [a] of this) yield a;
      }
      *values() {
        for (var [, a] of this) yield a;
      }
    };
  }
});

// node_modules/node-domexception/index.js
var require_node_domexception = __commonJS({
  "node_modules/node-domexception/index.js"(exports2, module2) {
    if (!globalThis.DOMException) {
      try {
        const { MessageChannel } = require("worker_threads"), port = new MessageChannel().port1, ab = new ArrayBuffer();
        port.postMessage(ab, [ab, ab]);
      } catch (err) {
        err.constructor.name === "DOMException" && (globalThis.DOMException = err.constructor);
      }
    }
    module2.exports = globalThis.DOMException;
  }
});

// node_modules/fetch-blob/from.js
var import_node_fs, import_node_domexception, stat;
var init_from = __esm({
  "node_modules/fetch-blob/from.js"() {
    import_node_fs = require("node:fs");
    import_node_domexception = __toESM(require_node_domexception(), 1);
    init_file();
    init_fetch_blob();
    ({ stat } = import_node_fs.promises);
  }
});

// node_modules/node-fetch/src/utils/multipart-parser.js
var multipart_parser_exports = {};
__export(multipart_parser_exports, {
  toFormData: () => toFormData
});
function _fileName(headerValue) {
  const m3 = headerValue.match(/\bfilename=("(.*?)"|([^()<>@,;:\\"/[\]?={}\s\t]+))($|;\s)/i);
  if (!m3) {
    return;
  }
  const match = m3[2] || m3[3] || "";
  let filename = match.slice(match.lastIndexOf("\\") + 1);
  filename = filename.replace(/%22/g, '"');
  filename = filename.replace(/&#(\d{4});/g, (m4, code) => {
    return String.fromCharCode(code);
  });
  return filename;
}
async function toFormData(Body2, ct2) {
  if (!/multipart/i.test(ct2)) {
    throw new TypeError("Failed to fetch");
  }
  const m3 = ct2.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!m3) {
    throw new TypeError("no or bad content-type header, no multipart boundary");
  }
  const parser = new MultipartParser(m3[1] || m3[2]);
  let headerField;
  let headerValue;
  let entryValue;
  let entryName;
  let contentType;
  let filename;
  const entryChunks = [];
  const formData = new FormData();
  const onPartData = (ui8a) => {
    entryValue += decoder.decode(ui8a, { stream: true });
  };
  const appendToFile = (ui8a) => {
    entryChunks.push(ui8a);
  };
  const appendFileToFormData = () => {
    const file = new file_default(entryChunks, filename, { type: contentType });
    formData.append(entryName, file);
  };
  const appendEntryToFormData = () => {
    formData.append(entryName, entryValue);
  };
  const decoder = new TextDecoder("utf-8");
  decoder.decode();
  parser.onPartBegin = function() {
    parser.onPartData = onPartData;
    parser.onPartEnd = appendEntryToFormData;
    headerField = "";
    headerValue = "";
    entryValue = "";
    entryName = "";
    contentType = "";
    filename = null;
    entryChunks.length = 0;
  };
  parser.onHeaderField = function(ui8a) {
    headerField += decoder.decode(ui8a, { stream: true });
  };
  parser.onHeaderValue = function(ui8a) {
    headerValue += decoder.decode(ui8a, { stream: true });
  };
  parser.onHeaderEnd = function() {
    headerValue += decoder.decode();
    headerField = headerField.toLowerCase();
    if (headerField === "content-disposition") {
      const m4 = headerValue.match(/\bname=("([^"]*)"|([^()<>@,;:\\"/[\]?={}\s\t]+))/i);
      if (m4) {
        entryName = m4[2] || m4[3] || "";
      }
      filename = _fileName(headerValue);
      if (filename) {
        parser.onPartData = appendToFile;
        parser.onPartEnd = appendFileToFormData;
      }
    } else if (headerField === "content-type") {
      contentType = headerValue;
    }
    headerValue = "";
    headerField = "";
  };
  for await (const chunk of Body2) {
    parser.write(chunk);
  }
  parser.end();
  return formData;
}
var s, S, f2, F2, LF, CR, SPACE, HYPHEN, COLON, A2, Z2, lower, noop, MultipartParser;
var init_multipart_parser = __esm({
  "node_modules/node-fetch/src/utils/multipart-parser.js"() {
    init_from();
    init_esm_min();
    s = 0;
    S = {
      START_BOUNDARY: s++,
      HEADER_FIELD_START: s++,
      HEADER_FIELD: s++,
      HEADER_VALUE_START: s++,
      HEADER_VALUE: s++,
      HEADER_VALUE_ALMOST_DONE: s++,
      HEADERS_ALMOST_DONE: s++,
      PART_DATA_START: s++,
      PART_DATA: s++,
      END: s++
    };
    f2 = 1;
    F2 = {
      PART_BOUNDARY: f2,
      LAST_BOUNDARY: f2 *= 2
    };
    LF = 10;
    CR = 13;
    SPACE = 32;
    HYPHEN = 45;
    COLON = 58;
    A2 = 97;
    Z2 = 122;
    lower = (c) => c | 32;
    noop = () => {
    };
    MultipartParser = class {
      /**
       * @param {string} boundary
       */
      constructor(boundary) {
        this.index = 0;
        this.flags = 0;
        this.onHeaderEnd = noop;
        this.onHeaderField = noop;
        this.onHeadersEnd = noop;
        this.onHeaderValue = noop;
        this.onPartBegin = noop;
        this.onPartData = noop;
        this.onPartEnd = noop;
        this.boundaryChars = {};
        boundary = "\r\n--" + boundary;
        const ui8a = new Uint8Array(boundary.length);
        for (let i2 = 0; i2 < boundary.length; i2++) {
          ui8a[i2] = boundary.charCodeAt(i2);
          this.boundaryChars[ui8a[i2]] = true;
        }
        this.boundary = ui8a;
        this.lookbehind = new Uint8Array(this.boundary.length + 8);
        this.state = S.START_BOUNDARY;
      }
      /**
       * @param {Uint8Array} data
       */
      write(data) {
        let i2 = 0;
        const length_ = data.length;
        let previousIndex = this.index;
        let { lookbehind, boundary, boundaryChars, index, state, flags } = this;
        const boundaryLength = this.boundary.length;
        const boundaryEnd = boundaryLength - 1;
        const bufferLength = data.length;
        let c;
        let cl2;
        const mark = (name) => {
          this[name + "Mark"] = i2;
        };
        const clear = (name) => {
          delete this[name + "Mark"];
        };
        const callback = (callbackSymbol, start, end, ui8a) => {
          if (start === void 0 || start !== end) {
            this[callbackSymbol](ui8a && ui8a.subarray(start, end));
          }
        };
        const dataCallback = (name, clear2) => {
          const markSymbol = name + "Mark";
          if (!(markSymbol in this)) {
            return;
          }
          if (clear2) {
            callback(name, this[markSymbol], i2, data);
            delete this[markSymbol];
          } else {
            callback(name, this[markSymbol], data.length, data);
            this[markSymbol] = 0;
          }
        };
        for (i2 = 0; i2 < length_; i2++) {
          c = data[i2];
          switch (state) {
            case S.START_BOUNDARY:
              if (index === boundary.length - 2) {
                if (c === HYPHEN) {
                  flags |= F2.LAST_BOUNDARY;
                } else if (c !== CR) {
                  return;
                }
                index++;
                break;
              } else if (index - 1 === boundary.length - 2) {
                if (flags & F2.LAST_BOUNDARY && c === HYPHEN) {
                  state = S.END;
                  flags = 0;
                } else if (!(flags & F2.LAST_BOUNDARY) && c === LF) {
                  index = 0;
                  callback("onPartBegin");
                  state = S.HEADER_FIELD_START;
                } else {
                  return;
                }
                break;
              }
              if (c !== boundary[index + 2]) {
                index = -2;
              }
              if (c === boundary[index + 2]) {
                index++;
              }
              break;
            case S.HEADER_FIELD_START:
              state = S.HEADER_FIELD;
              mark("onHeaderField");
              index = 0;
            // falls through
            case S.HEADER_FIELD:
              if (c === CR) {
                clear("onHeaderField");
                state = S.HEADERS_ALMOST_DONE;
                break;
              }
              index++;
              if (c === HYPHEN) {
                break;
              }
              if (c === COLON) {
                if (index === 1) {
                  return;
                }
                dataCallback("onHeaderField", true);
                state = S.HEADER_VALUE_START;
                break;
              }
              cl2 = lower(c);
              if (cl2 < A2 || cl2 > Z2) {
                return;
              }
              break;
            case S.HEADER_VALUE_START:
              if (c === SPACE) {
                break;
              }
              mark("onHeaderValue");
              state = S.HEADER_VALUE;
            // falls through
            case S.HEADER_VALUE:
              if (c === CR) {
                dataCallback("onHeaderValue", true);
                callback("onHeaderEnd");
                state = S.HEADER_VALUE_ALMOST_DONE;
              }
              break;
            case S.HEADER_VALUE_ALMOST_DONE:
              if (c !== LF) {
                return;
              }
              state = S.HEADER_FIELD_START;
              break;
            case S.HEADERS_ALMOST_DONE:
              if (c !== LF) {
                return;
              }
              callback("onHeadersEnd");
              state = S.PART_DATA_START;
              break;
            case S.PART_DATA_START:
              state = S.PART_DATA;
              mark("onPartData");
            // falls through
            case S.PART_DATA:
              previousIndex = index;
              if (index === 0) {
                i2 += boundaryEnd;
                while (i2 < bufferLength && !(data[i2] in boundaryChars)) {
                  i2 += boundaryLength;
                }
                i2 -= boundaryEnd;
                c = data[i2];
              }
              if (index < boundary.length) {
                if (boundary[index] === c) {
                  if (index === 0) {
                    dataCallback("onPartData", true);
                  }
                  index++;
                } else {
                  index = 0;
                }
              } else if (index === boundary.length) {
                index++;
                if (c === CR) {
                  flags |= F2.PART_BOUNDARY;
                } else if (c === HYPHEN) {
                  flags |= F2.LAST_BOUNDARY;
                } else {
                  index = 0;
                }
              } else if (index - 1 === boundary.length) {
                if (flags & F2.PART_BOUNDARY) {
                  index = 0;
                  if (c === LF) {
                    flags &= ~F2.PART_BOUNDARY;
                    callback("onPartEnd");
                    callback("onPartBegin");
                    state = S.HEADER_FIELD_START;
                    break;
                  }
                } else if (flags & F2.LAST_BOUNDARY) {
                  if (c === HYPHEN) {
                    callback("onPartEnd");
                    state = S.END;
                    flags = 0;
                  } else {
                    index = 0;
                  }
                } else {
                  index = 0;
                }
              }
              if (index > 0) {
                lookbehind[index - 1] = c;
              } else if (previousIndex > 0) {
                const _lookbehind = new Uint8Array(lookbehind.buffer, lookbehind.byteOffset, lookbehind.byteLength);
                callback("onPartData", 0, previousIndex, _lookbehind);
                previousIndex = 0;
                mark("onPartData");
                i2--;
              }
              break;
            case S.END:
              break;
            default:
              throw new Error(`Unexpected state entered: ${state}`);
          }
        }
        dataCallback("onHeaderField");
        dataCallback("onHeaderValue");
        dataCallback("onPartData");
        this.index = index;
        this.state = state;
        this.flags = flags;
      }
      end() {
        if (this.state === S.HEADER_FIELD_START && this.index === 0 || this.state === S.PART_DATA && this.index === this.boundary.length) {
          this.onPartEnd();
        } else if (this.state !== S.END) {
          throw new Error("MultipartParser.end(): stream ended unexpectedly");
        }
      }
    };
  }
});

// node_modules/.prisma/client/runtime/library.js
var require_library = __commonJS({
  "node_modules/.prisma/client/runtime/library.js"(exports, module) {
    "use strict";
    var eu = Object.create;
    var Nr = Object.defineProperty;
    var tu = Object.getOwnPropertyDescriptor;
    var ru = Object.getOwnPropertyNames;
    var nu = Object.getPrototypeOf;
    var iu = Object.prototype.hasOwnProperty;
    var Z = (e2, t2) => () => (t2 || e2((t2 = { exports: {} }).exports, t2), t2.exports);
    var Ut = (e2, t2) => {
      for (var r2 in t2) Nr(e2, r2, { get: t2[r2], enumerable: true });
    };
    var ho = (e2, t2, r2, n) => {
      if (t2 && typeof t2 == "object" || typeof t2 == "function") for (let i2 of ru(t2)) !iu.call(e2, i2) && i2 !== r2 && Nr(e2, i2, { get: () => t2[i2], enumerable: !(n = tu(t2, i2)) || n.enumerable });
      return e2;
    };
    var k = (e2, t2, r2) => (r2 = e2 != null ? eu(nu(e2)) : {}, ho(t2 || !e2 || !e2.__esModule ? Nr(r2, "default", { value: e2, enumerable: true }) : r2, e2));
    var ou = (e2) => ho(Nr({}, "__esModule", { value: true }), e2);
    var jo = Z((pf, Zn) => {
      "use strict";
      var v = Zn.exports;
      Zn.exports.default = v;
      var D = "\x1B[", Ht = "\x1B]", ft = "\x07", Jr = ";", qo = process.env.TERM_PROGRAM === "Apple_Terminal";
      v.cursorTo = (e2, t2) => {
        if (typeof e2 != "number") throw new TypeError("The `x` argument is required");
        return typeof t2 != "number" ? D + (e2 + 1) + "G" : D + (t2 + 1) + ";" + (e2 + 1) + "H";
      };
      v.cursorMove = (e2, t2) => {
        if (typeof e2 != "number") throw new TypeError("The `x` argument is required");
        let r2 = "";
        return e2 < 0 ? r2 += D + -e2 + "D" : e2 > 0 && (r2 += D + e2 + "C"), t2 < 0 ? r2 += D + -t2 + "A" : t2 > 0 && (r2 += D + t2 + "B"), r2;
      };
      v.cursorUp = (e2 = 1) => D + e2 + "A";
      v.cursorDown = (e2 = 1) => D + e2 + "B";
      v.cursorForward = (e2 = 1) => D + e2 + "C";
      v.cursorBackward = (e2 = 1) => D + e2 + "D";
      v.cursorLeft = D + "G";
      v.cursorSavePosition = qo ? "\x1B7" : D + "s";
      v.cursorRestorePosition = qo ? "\x1B8" : D + "u";
      v.cursorGetPosition = D + "6n";
      v.cursorNextLine = D + "E";
      v.cursorPrevLine = D + "F";
      v.cursorHide = D + "?25l";
      v.cursorShow = D + "?25h";
      v.eraseLines = (e2) => {
        let t2 = "";
        for (let r2 = 0; r2 < e2; r2++) t2 += v.eraseLine + (r2 < e2 - 1 ? v.cursorUp() : "");
        return e2 && (t2 += v.cursorLeft), t2;
      };
      v.eraseEndLine = D + "K";
      v.eraseStartLine = D + "1K";
      v.eraseLine = D + "2K";
      v.eraseDown = D + "J";
      v.eraseUp = D + "1J";
      v.eraseScreen = D + "2J";
      v.scrollUp = D + "S";
      v.scrollDown = D + "T";
      v.clearScreen = "\x1Bc";
      v.clearTerminal = process.platform === "win32" ? `${v.eraseScreen}${D}0f` : `${v.eraseScreen}${D}3J${D}H`;
      v.beep = ft;
      v.link = (e2, t2) => [Ht, "8", Jr, Jr, t2, ft, e2, Ht, "8", Jr, Jr, ft].join("");
      v.image = (e2, t2 = {}) => {
        let r2 = `${Ht}1337;File=inline=1`;
        return t2.width && (r2 += `;width=${t2.width}`), t2.height && (r2 += `;height=${t2.height}`), t2.preserveAspectRatio === false && (r2 += ";preserveAspectRatio=0"), r2 + ":" + e2.toString("base64") + ft;
      };
      v.iTerm = { setCwd: (e2 = process.cwd()) => `${Ht}50;CurrentDir=${e2}${ft}`, annotation: (e2, t2 = {}) => {
        let r2 = `${Ht}1337;`, n = typeof t2.x < "u", i2 = typeof t2.y < "u";
        if ((n || i2) && !(n && i2 && typeof t2.length < "u")) throw new Error("`x`, `y` and `length` must be defined when `x` or `y` is defined");
        return e2 = e2.replace(/\|/g, ""), r2 += t2.isHidden ? "AddHiddenAnnotation=" : "AddAnnotation=", t2.length > 0 ? r2 += (n ? [e2, t2.length, t2.x, t2.y] : [t2.length, e2]).join("|") : r2 += e2, r2 + ft;
      } };
    });
    var Xn = Z((df, Vo) => {
      "use strict";
      Vo.exports = (e2, t2 = process.argv) => {
        let r2 = e2.startsWith("-") ? "" : e2.length === 1 ? "-" : "--", n = t2.indexOf(r2 + e2), i2 = t2.indexOf("--");
        return n !== -1 && (i2 === -1 || n < i2);
      };
    });
    var Go = Z((mf, Uo) => {
      "use strict";
      var Gu = require("os"), Bo = require("tty"), de = Xn(), { env: Q } = process, Qe;
      de("no-color") || de("no-colors") || de("color=false") || de("color=never") ? Qe = 0 : (de("color") || de("colors") || de("color=true") || de("color=always")) && (Qe = 1);
      "FORCE_COLOR" in Q && (Q.FORCE_COLOR === "true" ? Qe = 1 : Q.FORCE_COLOR === "false" ? Qe = 0 : Qe = Q.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(Q.FORCE_COLOR, 10), 3));
      function ei(e2) {
        return e2 === 0 ? false : { level: e2, hasBasic: true, has256: e2 >= 2, has16m: e2 >= 3 };
      }
      function ti(e2, t2) {
        if (Qe === 0) return 0;
        if (de("color=16m") || de("color=full") || de("color=truecolor")) return 3;
        if (de("color=256")) return 2;
        if (e2 && !t2 && Qe === void 0) return 0;
        let r2 = Qe || 0;
        if (Q.TERM === "dumb") return r2;
        if (process.platform === "win32") {
          let n = Gu.release().split(".");
          return Number(n[0]) >= 10 && Number(n[2]) >= 10586 ? Number(n[2]) >= 14931 ? 3 : 2 : 1;
        }
        if ("CI" in Q) return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((n) => n in Q) || Q.CI_NAME === "codeship" ? 1 : r2;
        if ("TEAMCITY_VERSION" in Q) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(Q.TEAMCITY_VERSION) ? 1 : 0;
        if (Q.COLORTERM === "truecolor") return 3;
        if ("TERM_PROGRAM" in Q) {
          let n = parseInt((Q.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
          switch (Q.TERM_PROGRAM) {
            case "iTerm.app":
              return n >= 3 ? 3 : 2;
            case "Apple_Terminal":
              return 2;
          }
        }
        return /-256(color)?$/i.test(Q.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(Q.TERM) || "COLORTERM" in Q ? 1 : r2;
      }
      function Qu(e2) {
        let t2 = ti(e2, e2 && e2.isTTY);
        return ei(t2);
      }
      Uo.exports = { supportsColor: Qu, stdout: ei(ti(true, Bo.isatty(1))), stderr: ei(ti(true, Bo.isatty(2))) };
    });
    var Wo = Z((ff, Jo) => {
      "use strict";
      var Ju = Go(), gt = Xn();
      function Qo(e2) {
        if (/^\d{3,4}$/.test(e2)) {
          let r2 = /(\d{1,2})(\d{2})/.exec(e2);
          return { major: 0, minor: parseInt(r2[1], 10), patch: parseInt(r2[2], 10) };
        }
        let t2 = (e2 || "").split(".").map((r2) => parseInt(r2, 10));
        return { major: t2[0], minor: t2[1], patch: t2[2] };
      }
      function ri(e2) {
        let { env: t2 } = process;
        if ("FORCE_HYPERLINK" in t2) return !(t2.FORCE_HYPERLINK.length > 0 && parseInt(t2.FORCE_HYPERLINK, 10) === 0);
        if (gt("no-hyperlink") || gt("no-hyperlinks") || gt("hyperlink=false") || gt("hyperlink=never")) return false;
        if (gt("hyperlink=true") || gt("hyperlink=always") || "NETLIFY" in t2) return true;
        if (!Ju.supportsColor(e2) || e2 && !e2.isTTY || process.platform === "win32" || "CI" in t2 || "TEAMCITY_VERSION" in t2) return false;
        if ("TERM_PROGRAM" in t2) {
          let r2 = Qo(t2.TERM_PROGRAM_VERSION);
          switch (t2.TERM_PROGRAM) {
            case "iTerm.app":
              return r2.major === 3 ? r2.minor >= 1 : r2.major > 3;
            case "WezTerm":
              return r2.major >= 20200620;
            case "vscode":
              return r2.major > 1 || r2.major === 1 && r2.minor >= 72;
          }
        }
        if ("VTE_VERSION" in t2) {
          if (t2.VTE_VERSION === "0.50.0") return false;
          let r2 = Qo(t2.VTE_VERSION);
          return r2.major > 0 || r2.minor >= 50;
        }
        return false;
      }
      Jo.exports = { supportsHyperlink: ri, stdout: ri(process.stdout), stderr: ri(process.stderr) };
    });
    var Ko = Z((gf, Kt) => {
      "use strict";
      var Wu = jo(), ni = Wo(), Ho = (e2, t2, { target: r2 = "stdout", ...n } = {}) => ni[r2] ? Wu.link(e2, t2) : n.fallback === false ? e2 : typeof n.fallback == "function" ? n.fallback(e2, t2) : `${e2} (\u200B${t2}\u200B)`;
      Kt.exports = (e2, t2, r2 = {}) => Ho(e2, t2, r2);
      Kt.exports.stderr = (e2, t2, r2 = {}) => Ho(e2, t2, { target: "stderr", ...r2 });
      Kt.exports.isSupported = ni.stdout;
      Kt.exports.stderr.isSupported = ni.stderr;
    });
    var oi = Z((Rf, Hu) => {
      Hu.exports = { name: "@prisma/engines-version", version: "5.22.0-44.605197351a3c8bdd595af2d2a9bc3025bca48ea2", main: "index.js", types: "index.d.ts", license: "Apache-2.0", author: "Tim Suchanek <suchanek@prisma.io>", prisma: { enginesVersion: "605197351a3c8bdd595af2d2a9bc3025bca48ea2" }, repository: { type: "git", url: "https://github.com/prisma/engines-wrapper.git", directory: "packages/engines-version" }, devDependencies: { "@types/node": "18.19.34", typescript: "4.9.5" }, files: ["index.js", "index.d.ts"], scripts: { build: "tsc -d" } };
    });
    var si = Z((Wr) => {
      "use strict";
      Object.defineProperty(Wr, "__esModule", { value: true });
      Wr.enginesVersion = void 0;
      Wr.enginesVersion = oi().prisma.enginesVersion;
    });
    var Xo = Z((Gf, Yu) => {
      Yu.exports = { name: "dotenv", version: "16.0.3", description: "Loads environment variables from .env file", main: "lib/main.js", types: "lib/main.d.ts", exports: { ".": { require: "./lib/main.js", types: "./lib/main.d.ts", default: "./lib/main.js" }, "./config": "./config.js", "./config.js": "./config.js", "./lib/env-options": "./lib/env-options.js", "./lib/env-options.js": "./lib/env-options.js", "./lib/cli-options": "./lib/cli-options.js", "./lib/cli-options.js": "./lib/cli-options.js", "./package.json": "./package.json" }, scripts: { "dts-check": "tsc --project tests/types/tsconfig.json", lint: "standard", "lint-readme": "standard-markdown", pretest: "npm run lint && npm run dts-check", test: "tap tests/*.js --100 -Rspec", prerelease: "npm test", release: "standard-version" }, repository: { type: "git", url: "git://github.com/motdotla/dotenv.git" }, keywords: ["dotenv", "env", ".env", "environment", "variables", "config", "settings"], readmeFilename: "README.md", license: "BSD-2-Clause", devDependencies: { "@types/node": "^17.0.9", decache: "^4.6.1", dtslint: "^3.7.0", sinon: "^12.0.1", standard: "^16.0.4", "standard-markdown": "^7.1.0", "standard-version": "^9.3.2", tap: "^15.1.6", tar: "^6.1.11", typescript: "^4.5.4" }, engines: { node: ">=12" } };
    });
    var ts = Z((Qf, Kr) => {
      "use strict";
      var Zu = require("fs"), es = require("path"), Xu = require("os"), ec = Xo(), tc = ec.version, rc = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
      function nc(e2) {
        let t2 = {}, r2 = e2.toString();
        r2 = r2.replace(/\r\n?/mg, `
`);
        let n;
        for (; (n = rc.exec(r2)) != null; ) {
          let i2 = n[1], o = n[2] || "";
          o = o.trim();
          let s2 = o[0];
          o = o.replace(/^(['"`])([\s\S]*)\1$/mg, "$2"), s2 === '"' && (o = o.replace(/\\n/g, `
`), o = o.replace(/\\r/g, "\r")), t2[i2] = o;
        }
        return t2;
      }
      function ci(e2) {
        console.log(`[dotenv@${tc}][DEBUG] ${e2}`);
      }
      function ic(e2) {
        return e2[0] === "~" ? es.join(Xu.homedir(), e2.slice(1)) : e2;
      }
      function oc(e2) {
        let t2 = es.resolve(process.cwd(), ".env"), r2 = "utf8", n = !!(e2 && e2.debug), i2 = !!(e2 && e2.override);
        e2 && (e2.path != null && (t2 = ic(e2.path)), e2.encoding != null && (r2 = e2.encoding));
        try {
          let o = Hr.parse(Zu.readFileSync(t2, { encoding: r2 }));
          return Object.keys(o).forEach(function(s2) {
            Object.prototype.hasOwnProperty.call(process.env, s2) ? (i2 === true && (process.env[s2] = o[s2]), n && ci(i2 === true ? `"${s2}" is already defined in \`process.env\` and WAS overwritten` : `"${s2}" is already defined in \`process.env\` and was NOT overwritten`)) : process.env[s2] = o[s2];
          }), { parsed: o };
        } catch (o) {
          return n && ci(`Failed to load ${t2} ${o.message}`), { error: o };
        }
      }
      var Hr = { config: oc, parse: nc };
      Kr.exports.config = Hr.config;
      Kr.exports.parse = Hr.parse;
      Kr.exports = Hr;
    });
    var as = Z((Zf, ss) => {
      "use strict";
      ss.exports = (e2) => {
        let t2 = e2.match(/^[ \t]*(?=\S)/gm);
        return t2 ? t2.reduce((r2, n) => Math.min(r2, n.length), 1 / 0) : 0;
      };
    });
    var us = Z((Xf, ls) => {
      "use strict";
      var uc = as();
      ls.exports = (e2) => {
        let t2 = uc(e2);
        if (t2 === 0) return e2;
        let r2 = new RegExp(`^[ \\t]{${t2}}`, "gm");
        return e2.replace(r2, "");
      };
    });
    var fi = Z((og, cs) => {
      "use strict";
      cs.exports = (e2, t2 = 1, r2) => {
        if (r2 = { indent: " ", includeEmptyLines: false, ...r2 }, typeof e2 != "string") throw new TypeError(`Expected \`input\` to be a \`string\`, got \`${typeof e2}\``);
        if (typeof t2 != "number") throw new TypeError(`Expected \`count\` to be a \`number\`, got \`${typeof t2}\``);
        if (typeof r2.indent != "string") throw new TypeError(`Expected \`options.indent\` to be a \`string\`, got \`${typeof r2.indent}\``);
        if (t2 === 0) return e2;
        let n = r2.includeEmptyLines ? /^/gm : /^(?!\s*$)/gm;
        return e2.replace(n, r2.indent.repeat(t2));
      };
    });
    var fs = Z((lg, ms) => {
      "use strict";
      ms.exports = ({ onlyFirst: e2 = false } = {}) => {
        let t2 = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"].join("|");
        return new RegExp(t2, e2 ? void 0 : "g");
      };
    });
    var bi = Z((ug, gs) => {
      "use strict";
      var yc = fs();
      gs.exports = (e2) => typeof e2 == "string" ? e2.replace(yc(), "") : e2;
    });
    var hs = Z((dg, Zr) => {
      "use strict";
      Zr.exports = (e2 = {}) => {
        let t2;
        if (e2.repoUrl) t2 = e2.repoUrl;
        else if (e2.user && e2.repo) t2 = `https://github.com/${e2.user}/${e2.repo}`;
        else throw new Error("You need to specify either the `repoUrl` option or both the `user` and `repo` options");
        let r2 = new URL(`${t2}/issues/new`), n = ["body", "title", "labels", "template", "milestone", "assignee", "projects"];
        for (let i2 of n) {
          let o = e2[i2];
          if (o !== void 0) {
            if (i2 === "labels" || i2 === "projects") {
              if (!Array.isArray(o)) throw new TypeError(`The \`${i2}\` option should be an array`);
              o = o.join(",");
            }
            r2.searchParams.set(i2, o);
          }
        }
        return r2.toString();
      };
      Zr.exports.default = Zr.exports;
    });
    var Ai = Z((Th, $s) => {
      "use strict";
      $s.exports = /* @__PURE__ */ function() {
        function e2(t2, r2, n, i2, o) {
          return t2 < r2 || n < r2 ? t2 > n ? n + 1 : t2 + 1 : i2 === o ? r2 : r2 + 1;
        }
        return function(t2, r2) {
          if (t2 === r2) return 0;
          if (t2.length > r2.length) {
            var n = t2;
            t2 = r2, r2 = n;
          }
          for (var i2 = t2.length, o = r2.length; i2 > 0 && t2.charCodeAt(i2 - 1) === r2.charCodeAt(o - 1); ) i2--, o--;
          for (var s2 = 0; s2 < i2 && t2.charCodeAt(s2) === r2.charCodeAt(s2); ) s2++;
          if (i2 -= s2, o -= s2, i2 === 0 || o < 3) return o;
          var a = 0, l, u, c, p, d, f3, g, h2, O, T, S2, C, E = [];
          for (l = 0; l < i2; l++) E.push(l + 1), E.push(t2.charCodeAt(s2 + l));
          for (var me = E.length - 1; a < o - 3; ) for (O = r2.charCodeAt(s2 + (u = a)), T = r2.charCodeAt(s2 + (c = a + 1)), S2 = r2.charCodeAt(s2 + (p = a + 2)), C = r2.charCodeAt(s2 + (d = a + 3)), f3 = a += 4, l = 0; l < me; l += 2) g = E[l], h2 = E[l + 1], u = e2(g, u, c, O, h2), c = e2(u, c, p, T, h2), p = e2(c, p, d, S2, h2), f3 = e2(p, d, f3, C, h2), E[l] = f3, d = p, p = c, c = u, u = g;
          for (; a < o; ) for (O = r2.charCodeAt(s2 + (u = a)), f3 = ++a, l = 0; l < me; l += 2) g = E[l], E[l] = f3 = e2(g, u, f3, O, E[l + 1]), u = g;
          return f3;
        };
      }();
    });
    var Nm = {};
    Ut(Nm, { Debug: () => Gn, Decimal: () => xe, Extensions: () => jn, MetricsClient: () => Dt, NotFoundError: () => Le, PrismaClientInitializationError: () => R, PrismaClientKnownRequestError: () => V, PrismaClientRustPanicError: () => le, PrismaClientUnknownRequestError: () => B, PrismaClientValidationError: () => J, Public: () => Vn, Sql: () => oe, defineDmmfProperty: () => ua, deserializeJsonResponse: () => wt, dmmfToRuntimeDataModel: () => la, empty: () => ma, getPrismaClient: () => Yl, getRuntime: () => In, join: () => da, makeStrictEnum: () => Zl, makeTypedQueryFactory: () => ca, objectEnumValues: () => yn, raw: () => ji, serializeJsonQuery: () => vn, skip: () => Pn, sqltag: () => Vi, warnEnvConflicts: () => Xl, warnOnce: () => tr });
    module.exports = ou(Nm);
    var jn = {};
    Ut(jn, { defineExtension: () => yo, getExtensionContext: () => bo });
    function yo(e2) {
      return typeof e2 == "function" ? e2 : (t2) => t2.$extends(e2);
    }
    function bo(e2) {
      return e2;
    }
    var Vn = {};
    Ut(Vn, { validator: () => Eo });
    function Eo(...e2) {
      return (t2) => t2;
    }
    var Mr = {};
    Ut(Mr, { $: () => To, bgBlack: () => gu, bgBlue: () => Eu, bgCyan: () => xu, bgGreen: () => yu, bgMagenta: () => wu, bgRed: () => hu, bgWhite: () => Pu, bgYellow: () => bu, black: () => pu, blue: () => rt, bold: () => H, cyan: () => De, dim: () => Oe, gray: () => Gt, green: () => qe, grey: () => fu, hidden: () => uu, inverse: () => lu, italic: () => au, magenta: () => du, red: () => ce, reset: () => su, strikethrough: () => cu, underline: () => X, white: () => mu, yellow: () => ke });
    var Bn;
    var wo;
    var xo;
    var Po;
    var vo = true;
    typeof process < "u" && ({ FORCE_COLOR: Bn, NODE_DISABLE_COLORS: wo, NO_COLOR: xo, TERM: Po } = process.env || {}, vo = process.stdout && process.stdout.isTTY);
    var To = { enabled: !wo && xo == null && Po !== "dumb" && (Bn != null && Bn !== "0" || vo) };
    function M(e2, t2) {
      let r2 = new RegExp(`\\x1b\\[${t2}m`, "g"), n = `\x1B[${e2}m`, i2 = `\x1B[${t2}m`;
      return function(o) {
        return !To.enabled || o == null ? o : n + (~("" + o).indexOf(i2) ? o.replace(r2, i2 + n) : o) + i2;
      };
    }
    var su = M(0, 0);
    var H = M(1, 22);
    var Oe = M(2, 22);
    var au = M(3, 23);
    var X = M(4, 24);
    var lu = M(7, 27);
    var uu = M(8, 28);
    var cu = M(9, 29);
    var pu = M(30, 39);
    var ce = M(31, 39);
    var qe = M(32, 39);
    var ke = M(33, 39);
    var rt = M(34, 39);
    var du = M(35, 39);
    var De = M(36, 39);
    var mu = M(37, 39);
    var Gt = M(90, 39);
    var fu = M(90, 39);
    var gu = M(40, 49);
    var hu = M(41, 49);
    var yu = M(42, 49);
    var bu = M(43, 49);
    var Eu = M(44, 49);
    var wu = M(45, 49);
    var xu = M(46, 49);
    var Pu = M(47, 49);
    var vu = 100;
    var Ro = ["green", "yellow", "blue", "magenta", "cyan", "red"];
    var Qt = [];
    var Co = Date.now();
    var Tu = 0;
    var Un = typeof process < "u" ? process.env : {};
    globalThis.DEBUG ??= Un.DEBUG ?? "";
    globalThis.DEBUG_COLORS ??= Un.DEBUG_COLORS ? Un.DEBUG_COLORS === "true" : true;
    var Jt = { enable(e2) {
      typeof e2 == "string" && (globalThis.DEBUG = e2);
    }, disable() {
      let e2 = globalThis.DEBUG;
      return globalThis.DEBUG = "", e2;
    }, enabled(e2) {
      let t2 = globalThis.DEBUG.split(",").map((i2) => i2.replace(/[.+?^${}()|[\]\\]/g, "\\$&")), r2 = t2.some((i2) => i2 === "" || i2[0] === "-" ? false : e2.match(RegExp(i2.split("*").join(".*") + "$"))), n = t2.some((i2) => i2 === "" || i2[0] !== "-" ? false : e2.match(RegExp(i2.slice(1).split("*").join(".*") + "$")));
      return r2 && !n;
    }, log: (...e2) => {
      let [t2, r2, ...n] = e2;
      (console.warn ?? console.log)(`${t2} ${r2}`, ...n);
    }, formatters: {} };
    function Ru(e2) {
      let t2 = { color: Ro[Tu++ % Ro.length], enabled: Jt.enabled(e2), namespace: e2, log: Jt.log, extend: () => {
      } }, r2 = (...n) => {
        let { enabled: i2, namespace: o, color: s2, log: a } = t2;
        if (n.length !== 0 && Qt.push([o, ...n]), Qt.length > vu && Qt.shift(), Jt.enabled(o) || i2) {
          let l = n.map((c) => typeof c == "string" ? c : Cu(c)), u = `+${Date.now() - Co}ms`;
          Co = Date.now(), globalThis.DEBUG_COLORS ? a(Mr[s2](H(o)), ...l, Mr[s2](u)) : a(o, ...l, u);
        }
      };
      return new Proxy(r2, { get: (n, i2) => t2[i2], set: (n, i2, o) => t2[i2] = o });
    }
    var Gn = new Proxy(Ru, { get: (e2, t2) => Jt[t2], set: (e2, t2, r2) => Jt[t2] = r2 });
    function Cu(e2, t2 = 2) {
      let r2 = /* @__PURE__ */ new Set();
      return JSON.stringify(e2, (n, i2) => {
        if (typeof i2 == "object" && i2 !== null) {
          if (r2.has(i2)) return "[Circular *]";
          r2.add(i2);
        } else if (typeof i2 == "bigint") return i2.toString();
        return i2;
      }, t2);
    }
    function So(e2 = 7500) {
      let t2 = Qt.map(([r2, ...n]) => `${r2} ${n.map((i2) => typeof i2 == "string" ? i2 : JSON.stringify(i2)).join(" ")}`).join(`
`);
      return t2.length < e2 ? t2 : t2.slice(-e2);
    }
    function Ao() {
      Qt.length = 0;
    }
    var L = Gn;
    var Io = k(require("fs"));
    function Qn() {
      let e2 = process.env.PRISMA_QUERY_ENGINE_LIBRARY;
      if (!(e2 && Io.default.existsSync(e2)) && process.arch === "ia32") throw new Error('The default query engine type (Node-API, "library") is currently not supported for 32bit Node. Please set `engineType = "binary"` in the "generator" block of your "schema.prisma" file (or use the environment variables "PRISMA_CLIENT_ENGINE_TYPE=binary" and/or "PRISMA_CLI_QUERY_ENGINE_TYPE=binary".)');
    }
    var Jn = ["darwin", "darwin-arm64", "debian-openssl-1.0.x", "debian-openssl-1.1.x", "debian-openssl-3.0.x", "rhel-openssl-1.0.x", "rhel-openssl-1.1.x", "rhel-openssl-3.0.x", "linux-arm64-openssl-1.1.x", "linux-arm64-openssl-1.0.x", "linux-arm64-openssl-3.0.x", "linux-arm-openssl-1.1.x", "linux-arm-openssl-1.0.x", "linux-arm-openssl-3.0.x", "linux-musl", "linux-musl-openssl-3.0.x", "linux-musl-arm64-openssl-1.1.x", "linux-musl-arm64-openssl-3.0.x", "linux-nixos", "linux-static-x64", "linux-static-arm64", "windows", "freebsd11", "freebsd12", "freebsd13", "freebsd14", "freebsd15", "openbsd", "netbsd", "arm"];
    var $r = "libquery_engine";
    function qr(e2, t2) {
      let r2 = t2 === "url";
      return e2.includes("windows") ? r2 ? "query_engine.dll.node" : `query_engine-${e2}.dll.node` : e2.includes("darwin") ? r2 ? `${$r}.dylib.node` : `${$r}-${e2}.dylib.node` : r2 ? `${$r}.so.node` : `${$r}-${e2}.so.node`;
    }
    var _o = k(require("child_process"));
    var zn = k(require("fs/promises"));
    var Gr = k(require("os"));
    var _e = Symbol.for("@ts-pattern/matcher");
    var Su = Symbol.for("@ts-pattern/isVariadic");
    var Vr = "@ts-pattern/anonymous-select-key";
    var Wn = (e2) => !!(e2 && typeof e2 == "object");
    var jr = (e2) => e2 && !!e2[_e];
    var Ee = (e2, t2, r2) => {
      if (jr(e2)) {
        let n = e2[_e](), { matched: i2, selections: o } = n.match(t2);
        return i2 && o && Object.keys(o).forEach((s2) => r2(s2, o[s2])), i2;
      }
      if (Wn(e2)) {
        if (!Wn(t2)) return false;
        if (Array.isArray(e2)) {
          if (!Array.isArray(t2)) return false;
          let n = [], i2 = [], o = [];
          for (let s2 of e2.keys()) {
            let a = e2[s2];
            jr(a) && a[Su] ? o.push(a) : o.length ? i2.push(a) : n.push(a);
          }
          if (o.length) {
            if (o.length > 1) throw new Error("Pattern error: Using `...P.array(...)` several times in a single pattern is not allowed.");
            if (t2.length < n.length + i2.length) return false;
            let s2 = t2.slice(0, n.length), a = i2.length === 0 ? [] : t2.slice(-i2.length), l = t2.slice(n.length, i2.length === 0 ? 1 / 0 : -i2.length);
            return n.every((u, c) => Ee(u, s2[c], r2)) && i2.every((u, c) => Ee(u, a[c], r2)) && (o.length === 0 || Ee(o[0], l, r2));
          }
          return e2.length === t2.length && e2.every((s2, a) => Ee(s2, t2[a], r2));
        }
        return Object.keys(e2).every((n) => {
          let i2 = e2[n];
          return (n in t2 || jr(o = i2) && o[_e]().matcherType === "optional") && Ee(i2, t2[n], r2);
          var o;
        });
      }
      return Object.is(t2, e2);
    };
    var Ge = (e2) => {
      var t2, r2, n;
      return Wn(e2) ? jr(e2) ? (t2 = (r2 = (n = e2[_e]()).getSelectionKeys) == null ? void 0 : r2.call(n)) != null ? t2 : [] : Array.isArray(e2) ? Wt(e2, Ge) : Wt(Object.values(e2), Ge) : [];
    };
    var Wt = (e2, t2) => e2.reduce((r2, n) => r2.concat(t2(n)), []);
    function pe(e2) {
      return Object.assign(e2, { optional: () => Au(e2), and: (t2) => j(e2, t2), or: (t2) => Iu(e2, t2), select: (t2) => t2 === void 0 ? Oo(e2) : Oo(t2, e2) });
    }
    function Au(e2) {
      return pe({ [_e]: () => ({ match: (t2) => {
        let r2 = {}, n = (i2, o) => {
          r2[i2] = o;
        };
        return t2 === void 0 ? (Ge(e2).forEach((i2) => n(i2, void 0)), { matched: true, selections: r2 }) : { matched: Ee(e2, t2, n), selections: r2 };
      }, getSelectionKeys: () => Ge(e2), matcherType: "optional" }) });
    }
    function j(...e2) {
      return pe({ [_e]: () => ({ match: (t2) => {
        let r2 = {}, n = (i2, o) => {
          r2[i2] = o;
        };
        return { matched: e2.every((i2) => Ee(i2, t2, n)), selections: r2 };
      }, getSelectionKeys: () => Wt(e2, Ge), matcherType: "and" }) });
    }
    function Iu(...e2) {
      return pe({ [_e]: () => ({ match: (t2) => {
        let r2 = {}, n = (i2, o) => {
          r2[i2] = o;
        };
        return Wt(e2, Ge).forEach((i2) => n(i2, void 0)), { matched: e2.some((i2) => Ee(i2, t2, n)), selections: r2 };
      }, getSelectionKeys: () => Wt(e2, Ge), matcherType: "or" }) });
    }
    function I(e2) {
      return { [_e]: () => ({ match: (t2) => ({ matched: !!e2(t2) }) }) };
    }
    function Oo(...e2) {
      let t2 = typeof e2[0] == "string" ? e2[0] : void 0, r2 = e2.length === 2 ? e2[1] : typeof e2[0] == "string" ? void 0 : e2[0];
      return pe({ [_e]: () => ({ match: (n) => {
        let i2 = { [t2 ?? Vr]: n };
        return { matched: r2 === void 0 || Ee(r2, n, (o, s2) => {
          i2[o] = s2;
        }), selections: i2 };
      }, getSelectionKeys: () => [t2 ?? Vr].concat(r2 === void 0 ? [] : Ge(r2)) }) });
    }
    function ye(e2) {
      return typeof e2 == "number";
    }
    function je(e2) {
      return typeof e2 == "string";
    }
    function Ve(e2) {
      return typeof e2 == "bigint";
    }
    var Km = pe(I(function(e2) {
      return true;
    }));
    var Be = (e2) => Object.assign(pe(e2), { startsWith: (t2) => {
      return Be(j(e2, (r2 = t2, I((n) => je(n) && n.startsWith(r2)))));
      var r2;
    }, endsWith: (t2) => {
      return Be(j(e2, (r2 = t2, I((n) => je(n) && n.endsWith(r2)))));
      var r2;
    }, minLength: (t2) => Be(j(e2, ((r2) => I((n) => je(n) && n.length >= r2))(t2))), length: (t2) => Be(j(e2, ((r2) => I((n) => je(n) && n.length === r2))(t2))), maxLength: (t2) => Be(j(e2, ((r2) => I((n) => je(n) && n.length <= r2))(t2))), includes: (t2) => {
      return Be(j(e2, (r2 = t2, I((n) => je(n) && n.includes(r2)))));
      var r2;
    }, regex: (t2) => {
      return Be(j(e2, (r2 = t2, I((n) => je(n) && !!n.match(r2)))));
      var r2;
    } });
    var zm = Be(I(je));
    var be = (e2) => Object.assign(pe(e2), { between: (t2, r2) => be(j(e2, ((n, i2) => I((o) => ye(o) && n <= o && i2 >= o))(t2, r2))), lt: (t2) => be(j(e2, ((r2) => I((n) => ye(n) && n < r2))(t2))), gt: (t2) => be(j(e2, ((r2) => I((n) => ye(n) && n > r2))(t2))), lte: (t2) => be(j(e2, ((r2) => I((n) => ye(n) && n <= r2))(t2))), gte: (t2) => be(j(e2, ((r2) => I((n) => ye(n) && n >= r2))(t2))), int: () => be(j(e2, I((t2) => ye(t2) && Number.isInteger(t2)))), finite: () => be(j(e2, I((t2) => ye(t2) && Number.isFinite(t2)))), positive: () => be(j(e2, I((t2) => ye(t2) && t2 > 0))), negative: () => be(j(e2, I((t2) => ye(t2) && t2 < 0))) });
    var Ym = be(I(ye));
    var Ue = (e2) => Object.assign(pe(e2), { between: (t2, r2) => Ue(j(e2, ((n, i2) => I((o) => Ve(o) && n <= o && i2 >= o))(t2, r2))), lt: (t2) => Ue(j(e2, ((r2) => I((n) => Ve(n) && n < r2))(t2))), gt: (t2) => Ue(j(e2, ((r2) => I((n) => Ve(n) && n > r2))(t2))), lte: (t2) => Ue(j(e2, ((r2) => I((n) => Ve(n) && n <= r2))(t2))), gte: (t2) => Ue(j(e2, ((r2) => I((n) => Ve(n) && n >= r2))(t2))), positive: () => Ue(j(e2, I((t2) => Ve(t2) && t2 > 0))), negative: () => Ue(j(e2, I((t2) => Ve(t2) && t2 < 0))) });
    var Zm = Ue(I(Ve));
    var Xm = pe(I(function(e2) {
      return typeof e2 == "boolean";
    }));
    var ef = pe(I(function(e2) {
      return typeof e2 == "symbol";
    }));
    var tf = pe(I(function(e2) {
      return e2 == null;
    }));
    var rf = pe(I(function(e2) {
      return e2 != null;
    }));
    var Hn = { matched: false, value: void 0 };
    function mt(e2) {
      return new Kn(e2, Hn);
    }
    var Kn = class e2 {
      constructor(t2, r2) {
        this.input = void 0, this.state = void 0, this.input = t2, this.state = r2;
      }
      with(...t2) {
        if (this.state.matched) return this;
        let r2 = t2[t2.length - 1], n = [t2[0]], i2;
        t2.length === 3 && typeof t2[1] == "function" ? i2 = t2[1] : t2.length > 2 && n.push(...t2.slice(1, t2.length - 1));
        let o = false, s2 = {}, a = (u, c) => {
          o = true, s2[u] = c;
        }, l = !n.some((u) => Ee(u, this.input, a)) || i2 && !i2(this.input) ? Hn : { matched: true, value: r2(o ? Vr in s2 ? s2[Vr] : s2 : this.input, this.input) };
        return new e2(this.input, l);
      }
      when(t2, r2) {
        if (this.state.matched) return this;
        let n = !!t2(this.input);
        return new e2(this.input, n ? { matched: true, value: r2(this.input, this.input) } : Hn);
      }
      otherwise(t2) {
        return this.state.matched ? this.state.value : t2(this.input);
      }
      exhaustive() {
        if (this.state.matched) return this.state.value;
        let t2;
        try {
          t2 = JSON.stringify(this.input);
        } catch {
          t2 = this.input;
        }
        throw new Error(`Pattern matching error: no pattern matches value ${t2}`);
      }
      run() {
        return this.exhaustive();
      }
      returnType() {
        return this;
      }
    };
    var Fo = require("util");
    var Ou = { warn: ke("prisma:warn") };
    var ku = { warn: () => !process.env.PRISMA_DISABLE_WARNINGS };
    function Br(e2, ...t2) {
      ku.warn() && console.warn(`${Ou.warn} ${e2}`, ...t2);
    }
    var Du = (0, Fo.promisify)(_o.default.exec);
    var te = L("prisma:get-platform");
    var _u = ["1.0.x", "1.1.x", "3.0.x"];
    async function Lo() {
      let e2 = Gr.default.platform(), t2 = process.arch;
      if (e2 === "freebsd") {
        let s2 = await Qr("freebsd-version");
        if (s2 && s2.trim().length > 0) {
          let l = /^(\d+)\.?/.exec(s2);
          if (l) return { platform: "freebsd", targetDistro: `freebsd${l[1]}`, arch: t2 };
        }
      }
      if (e2 !== "linux") return { platform: e2, arch: t2 };
      let r2 = await Lu(), n = await Uu(), i2 = Mu({ arch: t2, archFromUname: n, familyDistro: r2.familyDistro }), { libssl: o } = await $u(i2);
      return { platform: "linux", libssl: o, arch: t2, archFromUname: n, ...r2 };
    }
    function Fu(e2) {
      let t2 = /^ID="?([^"\n]*)"?$/im, r2 = /^ID_LIKE="?([^"\n]*)"?$/im, n = t2.exec(e2), i2 = n && n[1] && n[1].toLowerCase() || "", o = r2.exec(e2), s2 = o && o[1] && o[1].toLowerCase() || "", a = mt({ id: i2, idLike: s2 }).with({ id: "alpine" }, ({ id: l }) => ({ targetDistro: "musl", familyDistro: l, originalDistro: l })).with({ id: "raspbian" }, ({ id: l }) => ({ targetDistro: "arm", familyDistro: "debian", originalDistro: l })).with({ id: "nixos" }, ({ id: l }) => ({ targetDistro: "nixos", originalDistro: l, familyDistro: "nixos" })).with({ id: "debian" }, { id: "ubuntu" }, ({ id: l }) => ({ targetDistro: "debian", familyDistro: "debian", originalDistro: l })).with({ id: "rhel" }, { id: "centos" }, { id: "fedora" }, ({ id: l }) => ({ targetDistro: "rhel", familyDistro: "rhel", originalDistro: l })).when(({ idLike: l }) => l.includes("debian") || l.includes("ubuntu"), ({ id: l }) => ({ targetDistro: "debian", familyDistro: "debian", originalDistro: l })).when(({ idLike: l }) => i2 === "arch" || l.includes("arch"), ({ id: l }) => ({ targetDistro: "debian", familyDistro: "arch", originalDistro: l })).when(({ idLike: l }) => l.includes("centos") || l.includes("fedora") || l.includes("rhel") || l.includes("suse"), ({ id: l }) => ({ targetDistro: "rhel", familyDistro: "rhel", originalDistro: l })).otherwise(({ id: l }) => ({ targetDistro: void 0, familyDistro: void 0, originalDistro: l }));
      return te(`Found distro info:
${JSON.stringify(a, null, 2)}`), a;
    }
    async function Lu() {
      let e2 = "/etc/os-release";
      try {
        let t2 = await zn.default.readFile(e2, { encoding: "utf-8" });
        return Fu(t2);
      } catch {
        return { targetDistro: void 0, familyDistro: void 0, originalDistro: void 0 };
      }
    }
    function Nu(e2) {
      let t2 = /^OpenSSL\s(\d+\.\d+)\.\d+/.exec(e2);
      if (t2) {
        let r2 = `${t2[1]}.x`;
        return No(r2);
      }
    }
    function ko(e2) {
      let t2 = /libssl\.so\.(\d)(\.\d)?/.exec(e2);
      if (t2) {
        let r2 = `${t2[1]}${t2[2] ?? ".0"}.x`;
        return No(r2);
      }
    }
    function No(e2) {
      let t2 = (() => {
        if ($o(e2)) return e2;
        let r2 = e2.split(".");
        return r2[1] = "0", r2.join(".");
      })();
      if (_u.includes(t2)) return t2;
    }
    function Mu(e2) {
      return mt(e2).with({ familyDistro: "musl" }, () => (te('Trying platform-specific paths for "alpine"'), ["/lib"])).with({ familyDistro: "debian" }, ({ archFromUname: t2 }) => (te('Trying platform-specific paths for "debian" (and "ubuntu")'), [`/usr/lib/${t2}-linux-gnu`, `/lib/${t2}-linux-gnu`])).with({ familyDistro: "rhel" }, () => (te('Trying platform-specific paths for "rhel"'), ["/lib64", "/usr/lib64"])).otherwise(({ familyDistro: t2, arch: r2, archFromUname: n }) => (te(`Don't know any platform-specific paths for "${t2}" on ${r2} (${n})`), []));
    }
    async function $u(e2) {
      let t2 = 'grep -v "libssl.so.0"', r2 = await Do(e2);
      if (r2) {
        te(`Found libssl.so file using platform-specific paths: ${r2}`);
        let o = ko(r2);
        if (te(`The parsed libssl version is: ${o}`), o) return { libssl: o, strategy: "libssl-specific-path" };
      }
      te('Falling back to "ldconfig" and other generic paths');
      let n = await Qr(`ldconfig -p | sed "s/.*=>s*//" | sed "s|.*/||" | grep libssl | sort | ${t2}`);
      if (n || (n = await Do(["/lib64", "/usr/lib64", "/lib"])), n) {
        te(`Found libssl.so file using "ldconfig" or other generic paths: ${n}`);
        let o = ko(n);
        if (te(`The parsed libssl version is: ${o}`), o) return { libssl: o, strategy: "ldconfig" };
      }
      let i2 = await Qr("openssl version -v");
      if (i2) {
        te(`Found openssl binary with version: ${i2}`);
        let o = Nu(i2);
        if (te(`The parsed openssl version is: ${o}`), o) return { libssl: o, strategy: "openssl-binary" };
      }
      return te("Couldn't find any version of libssl or OpenSSL in the system"), {};
    }
    async function Do(e2) {
      for (let t2 of e2) {
        let r2 = await qu(t2);
        if (r2) return r2;
      }
    }
    async function qu(e2) {
      try {
        return (await zn.default.readdir(e2)).find((r2) => r2.startsWith("libssl.so.") && !r2.startsWith("libssl.so.0"));
      } catch (t2) {
        if (t2.code === "ENOENT") return;
        throw t2;
      }
    }
    async function nt() {
      let { binaryTarget: e2 } = await Mo();
      return e2;
    }
    function ju(e2) {
      return e2.binaryTarget !== void 0;
    }
    async function Yn() {
      let { memoized: e2, ...t2 } = await Mo();
      return t2;
    }
    var Ur = {};
    async function Mo() {
      if (ju(Ur)) return Promise.resolve({ ...Ur, memoized: true });
      let e2 = await Lo(), t2 = Vu(e2);
      return Ur = { ...e2, binaryTarget: t2 }, { ...Ur, memoized: false };
    }
    function Vu(e2) {
      let { platform: t2, arch: r2, archFromUname: n, libssl: i2, targetDistro: o, familyDistro: s2, originalDistro: a } = e2;
      t2 === "linux" && !["x64", "arm64"].includes(r2) && Br(`Prisma only officially supports Linux on amd64 (x86_64) and arm64 (aarch64) system architectures (detected "${r2}" instead). If you are using your own custom Prisma engines, you can ignore this warning, as long as you've compiled the engines for your system architecture "${n}".`);
      let l = "1.1.x";
      if (t2 === "linux" && i2 === void 0) {
        let c = mt({ familyDistro: s2 }).with({ familyDistro: "debian" }, () => "Please manually install OpenSSL via `apt-get update -y && apt-get install -y openssl` and try installing Prisma again. If you're running Prisma on Docker, add this command to your Dockerfile, or switch to an image that already has OpenSSL installed.").otherwise(() => "Please manually install OpenSSL and try installing Prisma again.");
        Br(`Prisma failed to detect the libssl/openssl version to use, and may not work as expected. Defaulting to "openssl-${l}".
${c}`);
      }
      let u = "debian";
      if (t2 === "linux" && o === void 0 && te(`Distro is "${a}". Falling back to Prisma engines built for "${u}".`), t2 === "darwin" && r2 === "arm64") return "darwin-arm64";
      if (t2 === "darwin") return "darwin";
      if (t2 === "win32") return "windows";
      if (t2 === "freebsd") return o;
      if (t2 === "openbsd") return "openbsd";
      if (t2 === "netbsd") return "netbsd";
      if (t2 === "linux" && o === "nixos") return "linux-nixos";
      if (t2 === "linux" && r2 === "arm64") return `${o === "musl" ? "linux-musl-arm64" : "linux-arm64"}-openssl-${i2 || l}`;
      if (t2 === "linux" && r2 === "arm") return `linux-arm-openssl-${i2 || l}`;
      if (t2 === "linux" && o === "musl") {
        let c = "linux-musl";
        return !i2 || $o(i2) ? c : `${c}-openssl-${i2}`;
      }
      return t2 === "linux" && o && i2 ? `${o}-openssl-${i2}` : (t2 !== "linux" && Br(`Prisma detected unknown OS "${t2}" and may not work as expected. Defaulting to "linux".`), i2 ? `${u}-openssl-${i2}` : o ? `${o}-openssl-${l}` : `${u}-openssl-${l}`);
    }
    async function Bu(e2) {
      try {
        return await e2();
      } catch {
        return;
      }
    }
    function Qr(e2) {
      return Bu(async () => {
        let t2 = await Du(e2);
        return te(`Command "${e2}" successfully returned "${t2.stdout}"`), t2.stdout;
      });
    }
    async function Uu() {
      return typeof Gr.default.machine == "function" ? Gr.default.machine() : (await Qr("uname -m"))?.trim();
    }
    function $o(e2) {
      return e2.startsWith("1.");
    }
    var zo = k(Ko());
    function ii(e2) {
      return (0, zo.default)(e2, e2, { fallback: X });
    }
    var Ku = k(si());
    var $ = k(require("path"));
    var zu = k(si());
    var Lf = L("prisma:engines");
    function Yo() {
      return $.default.join(__dirname, "../");
    }
    var Nf = "libquery-engine";
    $.default.join(__dirname, "../query-engine-darwin");
    $.default.join(__dirname, "../query-engine-darwin-arm64");
    $.default.join(__dirname, "../query-engine-debian-openssl-1.0.x");
    $.default.join(__dirname, "../query-engine-debian-openssl-1.1.x");
    $.default.join(__dirname, "../query-engine-debian-openssl-3.0.x");
    $.default.join(__dirname, "../query-engine-linux-static-x64");
    $.default.join(__dirname, "../query-engine-linux-static-arm64");
    $.default.join(__dirname, "../query-engine-rhel-openssl-1.0.x");
    $.default.join(__dirname, "../query-engine-rhel-openssl-1.1.x");
    $.default.join(__dirname, "../query-engine-rhel-openssl-3.0.x");
    $.default.join(__dirname, "../libquery_engine-darwin.dylib.node");
    $.default.join(__dirname, "../libquery_engine-darwin-arm64.dylib.node");
    $.default.join(__dirname, "../libquery_engine-debian-openssl-1.0.x.so.node");
    $.default.join(__dirname, "../libquery_engine-debian-openssl-1.1.x.so.node");
    $.default.join(__dirname, "../libquery_engine-debian-openssl-3.0.x.so.node");
    $.default.join(__dirname, "../libquery_engine-linux-arm64-openssl-1.0.x.so.node");
    $.default.join(__dirname, "../libquery_engine-linux-arm64-openssl-1.1.x.so.node");
    $.default.join(__dirname, "../libquery_engine-linux-arm64-openssl-3.0.x.so.node");
    $.default.join(__dirname, "../libquery_engine-linux-musl.so.node");
    $.default.join(__dirname, "../libquery_engine-linux-musl-openssl-3.0.x.so.node");
    $.default.join(__dirname, "../libquery_engine-rhel-openssl-1.0.x.so.node");
    $.default.join(__dirname, "../libquery_engine-rhel-openssl-1.1.x.so.node");
    $.default.join(__dirname, "../libquery_engine-rhel-openssl-3.0.x.so.node");
    $.default.join(__dirname, "../query_engine-windows.dll.node");
    var ai = k(require("fs"));
    var Zo = L("chmodPlusX");
    function li(e2) {
      if (process.platform === "win32") return;
      let t2 = ai.default.statSync(e2), r2 = t2.mode | 64 | 8 | 1;
      if (t2.mode === r2) {
        Zo(`Execution permissions of ${e2} are fine`);
        return;
      }
      let n = r2.toString(8).slice(-3);
      Zo(`Have to call chmodPlusX on ${e2}`), ai.default.chmodSync(e2, n);
    }
    function ui(e2) {
      let t2 = e2.e, r2 = (a) => `Prisma cannot find the required \`${a}\` system library in your system`, n = t2.message.includes("cannot open shared object file"), i2 = `Please refer to the documentation about Prisma's system requirements: ${ii("https://pris.ly/d/system-requirements")}`, o = `Unable to require(\`${Oe(e2.id)}\`).`, s2 = mt({ message: t2.message, code: t2.code }).with({ code: "ENOENT" }, () => "File does not exist.").when(({ message: a }) => n && a.includes("libz"), () => `${r2("libz")}. Please install it and try again.`).when(({ message: a }) => n && a.includes("libgcc_s"), () => `${r2("libgcc_s")}. Please install it and try again.`).when(({ message: a }) => n && a.includes("libssl"), () => {
        let a = e2.platformInfo.libssl ? `openssl-${e2.platformInfo.libssl}` : "openssl";
        return `${r2("libssl")}. Please install ${a} and try again.`;
      }).when(({ message: a }) => a.includes("GLIBC"), () => `Prisma has detected an incompatible version of the \`glibc\` C standard library installed in your system. This probably means your system may be too old to run Prisma. ${i2}`).when(({ message: a }) => e2.platformInfo.platform === "linux" && a.includes("symbol not found"), () => `The Prisma engines are not compatible with your system ${e2.platformInfo.originalDistro} on (${e2.platformInfo.archFromUname}) which uses the \`${e2.platformInfo.binaryTarget}\` binaryTarget by default. ${i2}`).otherwise(() => `The Prisma engines do not seem to be compatible with your system. ${i2}`);
      return `${o}
${s2}

Details: ${t2.message}`;
    }
    var di = k(ts());
    var zr = k(require("fs"));
    var ht = k(require("path"));
    function rs(e2) {
      let t2 = e2.ignoreProcessEnv ? {} : process.env, r2 = (n) => n.match(/(.?\${(?:[a-zA-Z0-9_]+)?})/g)?.reduce(function(o, s2) {
        let a = /(.?)\${([a-zA-Z0-9_]+)?}/g.exec(s2);
        if (!a) return o;
        let l = a[1], u, c;
        if (l === "\\") c = a[0], u = c.replace("\\$", "$");
        else {
          let p = a[2];
          c = a[0].substring(l.length), u = Object.hasOwnProperty.call(t2, p) ? t2[p] : e2.parsed[p] || "", u = r2(u);
        }
        return o.replace(c, u);
      }, n) ?? n;
      for (let n in e2.parsed) {
        let i2 = Object.hasOwnProperty.call(t2, n) ? t2[n] : e2.parsed[n];
        e2.parsed[n] = r2(i2);
      }
      for (let n in e2.parsed) t2[n] = e2.parsed[n];
      return e2;
    }
    var pi = L("prisma:tryLoadEnv");
    function zt({ rootEnvPath: e2, schemaEnvPath: t2 }, r2 = { conflictCheck: "none" }) {
      let n = ns(e2);
      r2.conflictCheck !== "none" && sc(n, t2, r2.conflictCheck);
      let i2 = null;
      return is(n?.path, t2) || (i2 = ns(t2)), !n && !i2 && pi("No Environment variables loaded"), i2?.dotenvResult.error ? console.error(ce(H("Schema Env Error: ")) + i2.dotenvResult.error) : { message: [n?.message, i2?.message].filter(Boolean).join(`
`), parsed: { ...n?.dotenvResult?.parsed, ...i2?.dotenvResult?.parsed } };
    }
    function sc(e2, t2, r2) {
      let n = e2?.dotenvResult.parsed, i2 = !is(e2?.path, t2);
      if (n && t2 && i2 && zr.default.existsSync(t2)) {
        let o = di.default.parse(zr.default.readFileSync(t2)), s2 = [];
        for (let a in o) n[a] === o[a] && s2.push(a);
        if (s2.length > 0) {
          let a = ht.default.relative(process.cwd(), e2.path), l = ht.default.relative(process.cwd(), t2);
          if (r2 === "error") {
            let u = `There is a conflict between env var${s2.length > 1 ? "s" : ""} in ${X(a)} and ${X(l)}
Conflicting env vars:
${s2.map((c) => `  ${H(c)}`).join(`
`)}

We suggest to move the contents of ${X(l)} to ${X(a)} to consolidate your env vars.
`;
            throw new Error(u);
          } else if (r2 === "warn") {
            let u = `Conflict for env var${s2.length > 1 ? "s" : ""} ${s2.map((c) => H(c)).join(", ")} in ${X(a)} and ${X(l)}
Env vars from ${X(l)} overwrite the ones from ${X(a)}
      `;
            console.warn(`${ke("warn(prisma)")} ${u}`);
          }
        }
      }
    }
    function ns(e2) {
      if (ac(e2)) {
        pi(`Environment variables loaded from ${e2}`);
        let t2 = di.default.config({ path: e2, debug: process.env.DOTENV_CONFIG_DEBUG ? true : void 0 });
        return { dotenvResult: rs(t2), message: Oe(`Environment variables loaded from ${ht.default.relative(process.cwd(), e2)}`), path: e2 };
      } else pi(`Environment variables not found at ${e2}`);
      return null;
    }
    function is(e2, t2) {
      return e2 && t2 && ht.default.resolve(e2) === ht.default.resolve(t2);
    }
    function ac(e2) {
      return !!(e2 && zr.default.existsSync(e2));
    }
    var os = "library";
    function Yt(e2) {
      let t2 = lc();
      return t2 || (e2?.config.engineType === "library" ? "library" : e2?.config.engineType === "binary" ? "binary" : os);
    }
    function lc() {
      let e2 = process.env.PRISMA_CLIENT_ENGINE_TYPE;
      return e2 === "library" ? "library" : e2 === "binary" ? "binary" : void 0;
    }
    var Je;
    ((t2) => {
      let e2;
      ((E) => (E.findUnique = "findUnique", E.findUniqueOrThrow = "findUniqueOrThrow", E.findFirst = "findFirst", E.findFirstOrThrow = "findFirstOrThrow", E.findMany = "findMany", E.create = "create", E.createMany = "createMany", E.createManyAndReturn = "createManyAndReturn", E.update = "update", E.updateMany = "updateMany", E.upsert = "upsert", E.delete = "delete", E.deleteMany = "deleteMany", E.groupBy = "groupBy", E.count = "count", E.aggregate = "aggregate", E.findRaw = "findRaw", E.aggregateRaw = "aggregateRaw"))(e2 = t2.ModelAction ||= {});
    })(Je ||= {});
    var Zt = k(require("path"));
    function mi(e2) {
      return Zt.default.sep === Zt.default.posix.sep ? e2 : e2.split(Zt.default.sep).join(Zt.default.posix.sep);
    }
    var ps = k(fi());
    function hi(e2) {
      return String(new gi(e2));
    }
    var gi = class {
      constructor(t2) {
        this.config = t2;
      }
      toString() {
        let { config: t2 } = this, r2 = t2.provider.fromEnvVar ? `env("${t2.provider.fromEnvVar}")` : t2.provider.value, n = JSON.parse(JSON.stringify({ provider: r2, binaryTargets: cc(t2.binaryTargets) }));
        return `generator ${t2.name} {
${(0, ps.default)(pc(n), 2)}
}`;
      }
    };
    function cc(e2) {
      let t2;
      if (e2.length > 0) {
        let r2 = e2.find((n) => n.fromEnvVar !== null);
        r2 ? t2 = `env("${r2.fromEnvVar}")` : t2 = e2.map((n) => n.native ? "native" : n.value);
      } else t2 = void 0;
      return t2;
    }
    function pc(e2) {
      let t2 = Object.keys(e2).reduce((r2, n) => Math.max(r2, n.length), 0);
      return Object.entries(e2).map(([r2, n]) => `${r2.padEnd(t2)} = ${dc(n)}`).join(`
`);
    }
    function dc(e2) {
      return JSON.parse(JSON.stringify(e2, (t2, r2) => Array.isArray(r2) ? `[${r2.map((n) => JSON.stringify(n)).join(", ")}]` : JSON.stringify(r2)));
    }
    var er = {};
    Ut(er, { error: () => gc, info: () => fc, log: () => mc, query: () => hc, should: () => ds, tags: () => Xt, warn: () => yi });
    var Xt = { error: ce("prisma:error"), warn: ke("prisma:warn"), info: De("prisma:info"), query: rt("prisma:query") };
    var ds = { warn: () => !process.env.PRISMA_DISABLE_WARNINGS };
    function mc(...e2) {
      console.log(...e2);
    }
    function yi(e2, ...t2) {
      ds.warn() && console.warn(`${Xt.warn} ${e2}`, ...t2);
    }
    function fc(e2, ...t2) {
      console.info(`${Xt.info} ${e2}`, ...t2);
    }
    function gc(e2, ...t2) {
      console.error(`${Xt.error} ${e2}`, ...t2);
    }
    function hc(e2, ...t2) {
      console.log(`${Xt.query} ${e2}`, ...t2);
    }
    function Yr(e2, t2) {
      if (!e2) throw new Error(`${t2}. This should never happen. If you see this error, please, open an issue at https://pris.ly/prisma-prisma-bug-report`);
    }
    function Fe(e2, t2) {
      throw new Error(t2);
    }
    function Ei(e2, t2) {
      return Object.prototype.hasOwnProperty.call(e2, t2);
    }
    var wi = (e2, t2) => e2.reduce((r2, n) => (r2[t2(n)] = n, r2), {});
    function yt(e2, t2) {
      let r2 = {};
      for (let n of Object.keys(e2)) r2[n] = t2(e2[n], n);
      return r2;
    }
    function xi(e2, t2) {
      if (e2.length === 0) return;
      let r2 = e2[0];
      for (let n = 1; n < e2.length; n++) t2(r2, e2[n]) < 0 && (r2 = e2[n]);
      return r2;
    }
    function w(e2, t2) {
      Object.defineProperty(e2, "name", { value: t2, configurable: true });
    }
    var ys = /* @__PURE__ */ new Set();
    var tr = (e2, t2, ...r2) => {
      ys.has(e2) || (ys.add(e2), yi(t2, ...r2));
    };
    var V = class extends Error {
      constructor(t2, { code: r2, clientVersion: n, meta: i2, batchRequestIdx: o }) {
        super(t2), this.name = "PrismaClientKnownRequestError", this.code = r2, this.clientVersion = n, this.meta = i2, Object.defineProperty(this, "batchRequestIdx", { value: o, enumerable: false, writable: true });
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientKnownRequestError";
      }
    };
    w(V, "PrismaClientKnownRequestError");
    var Le = class extends V {
      constructor(t2, r2) {
        super(t2, { code: "P2025", clientVersion: r2 }), this.name = "NotFoundError";
      }
    };
    w(Le, "NotFoundError");
    var R = class e2 extends Error {
      constructor(t2, r2, n) {
        super(t2), this.name = "PrismaClientInitializationError", this.clientVersion = r2, this.errorCode = n, Error.captureStackTrace(e2);
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientInitializationError";
      }
    };
    w(R, "PrismaClientInitializationError");
    var le = class extends Error {
      constructor(t2, r2) {
        super(t2), this.name = "PrismaClientRustPanicError", this.clientVersion = r2;
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientRustPanicError";
      }
    };
    w(le, "PrismaClientRustPanicError");
    var B = class extends Error {
      constructor(t2, { clientVersion: r2, batchRequestIdx: n }) {
        super(t2), this.name = "PrismaClientUnknownRequestError", this.clientVersion = r2, Object.defineProperty(this, "batchRequestIdx", { value: n, writable: true, enumerable: false });
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientUnknownRequestError";
      }
    };
    w(B, "PrismaClientUnknownRequestError");
    var J = class extends Error {
      constructor(r2, { clientVersion: n }) {
        super(r2);
        this.name = "PrismaClientValidationError";
        this.clientVersion = n;
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientValidationError";
      }
    };
    w(J, "PrismaClientValidationError");
    var bt = 9e15;
    var ze = 1e9;
    var Pi = "0123456789abcdef";
    var tn = "2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058";
    var rn = "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789";
    var vi = { precision: 20, rounding: 4, modulo: 1, toExpNeg: -7, toExpPos: 21, minE: -bt, maxE: bt, crypto: false };
    var xs;
    var Ne;
    var x = true;
    var on = "[DecimalError] ";
    var Ke = on + "Invalid argument: ";
    var Ps = on + "Precision limit exceeded";
    var vs = on + "crypto unavailable";
    var Ts = "[object Decimal]";
    var ee = Math.floor;
    var G = Math.pow;
    var bc = /^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i;
    var Ec = /^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i;
    var wc = /^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i;
    var Rs = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;
    var ge = 1e7;
    var b = 7;
    var xc = 9007199254740991;
    var Pc = tn.length - 1;
    var Ti = rn.length - 1;
    var m = { toStringTag: Ts };
    m.absoluteValue = m.abs = function() {
      var e2 = new this.constructor(this);
      return e2.s < 0 && (e2.s = 1), y(e2);
    };
    m.ceil = function() {
      return y(new this.constructor(this), this.e + 1, 2);
    };
    m.clampedTo = m.clamp = function(e2, t2) {
      var r2, n = this, i2 = n.constructor;
      if (e2 = new i2(e2), t2 = new i2(t2), !e2.s || !t2.s) return new i2(NaN);
      if (e2.gt(t2)) throw Error(Ke + t2);
      return r2 = n.cmp(e2), r2 < 0 ? e2 : n.cmp(t2) > 0 ? t2 : new i2(n);
    };
    m.comparedTo = m.cmp = function(e2) {
      var t2, r2, n, i2, o = this, s2 = o.d, a = (e2 = new o.constructor(e2)).d, l = o.s, u = e2.s;
      if (!s2 || !a) return !l || !u ? NaN : l !== u ? l : s2 === a ? 0 : !s2 ^ l < 0 ? 1 : -1;
      if (!s2[0] || !a[0]) return s2[0] ? l : a[0] ? -u : 0;
      if (l !== u) return l;
      if (o.e !== e2.e) return o.e > e2.e ^ l < 0 ? 1 : -1;
      for (n = s2.length, i2 = a.length, t2 = 0, r2 = n < i2 ? n : i2; t2 < r2; ++t2) if (s2[t2] !== a[t2]) return s2[t2] > a[t2] ^ l < 0 ? 1 : -1;
      return n === i2 ? 0 : n > i2 ^ l < 0 ? 1 : -1;
    };
    m.cosine = m.cos = function() {
      var e2, t2, r2 = this, n = r2.constructor;
      return r2.d ? r2.d[0] ? (e2 = n.precision, t2 = n.rounding, n.precision = e2 + Math.max(r2.e, r2.sd()) + b, n.rounding = 1, r2 = vc(n, Os(n, r2)), n.precision = e2, n.rounding = t2, y(Ne == 2 || Ne == 3 ? r2.neg() : r2, e2, t2, true)) : new n(1) : new n(NaN);
    };
    m.cubeRoot = m.cbrt = function() {
      var e2, t2, r2, n, i2, o, s2, a, l, u, c = this, p = c.constructor;
      if (!c.isFinite() || c.isZero()) return new p(c);
      for (x = false, o = c.s * G(c.s * c, 1 / 3), !o || Math.abs(o) == 1 / 0 ? (r2 = K(c.d), e2 = c.e, (o = (e2 - r2.length + 1) % 3) && (r2 += o == 1 || o == -2 ? "0" : "00"), o = G(r2, 1 / 3), e2 = ee((e2 + 1) / 3) - (e2 % 3 == (e2 < 0 ? -1 : 2)), o == 1 / 0 ? r2 = "5e" + e2 : (r2 = o.toExponential(), r2 = r2.slice(0, r2.indexOf("e") + 1) + e2), n = new p(r2), n.s = c.s) : n = new p(o.toString()), s2 = (e2 = p.precision) + 3; ; ) if (a = n, l = a.times(a).times(a), u = l.plus(c), n = N(u.plus(c).times(a), u.plus(l), s2 + 2, 1), K(a.d).slice(0, s2) === (r2 = K(n.d)).slice(0, s2)) if (r2 = r2.slice(s2 - 3, s2 + 1), r2 == "9999" || !i2 && r2 == "4999") {
        if (!i2 && (y(a, e2 + 1, 0), a.times(a).times(a).eq(c))) {
          n = a;
          break;
        }
        s2 += 4, i2 = 1;
      } else {
        (!+r2 || !+r2.slice(1) && r2.charAt(0) == "5") && (y(n, e2 + 1, 1), t2 = !n.times(n).times(n).eq(c));
        break;
      }
      return x = true, y(n, e2, p.rounding, t2);
    };
    m.decimalPlaces = m.dp = function() {
      var e2, t2 = this.d, r2 = NaN;
      if (t2) {
        if (e2 = t2.length - 1, r2 = (e2 - ee(this.e / b)) * b, e2 = t2[e2], e2) for (; e2 % 10 == 0; e2 /= 10) r2--;
        r2 < 0 && (r2 = 0);
      }
      return r2;
    };
    m.dividedBy = m.div = function(e2) {
      return N(this, new this.constructor(e2));
    };
    m.dividedToIntegerBy = m.divToInt = function(e2) {
      var t2 = this, r2 = t2.constructor;
      return y(N(t2, new r2(e2), 0, 1, 1), r2.precision, r2.rounding);
    };
    m.equals = m.eq = function(e2) {
      return this.cmp(e2) === 0;
    };
    m.floor = function() {
      return y(new this.constructor(this), this.e + 1, 3);
    };
    m.greaterThan = m.gt = function(e2) {
      return this.cmp(e2) > 0;
    };
    m.greaterThanOrEqualTo = m.gte = function(e2) {
      var t2 = this.cmp(e2);
      return t2 == 1 || t2 === 0;
    };
    m.hyperbolicCosine = m.cosh = function() {
      var e2, t2, r2, n, i2, o = this, s2 = o.constructor, a = new s2(1);
      if (!o.isFinite()) return new s2(o.s ? 1 / 0 : NaN);
      if (o.isZero()) return a;
      r2 = s2.precision, n = s2.rounding, s2.precision = r2 + Math.max(o.e, o.sd()) + 4, s2.rounding = 1, i2 = o.d.length, i2 < 32 ? (e2 = Math.ceil(i2 / 3), t2 = (1 / an(4, e2)).toString()) : (e2 = 16, t2 = "2.3283064365386962890625e-10"), o = Et(s2, 1, o.times(t2), new s2(1), true);
      for (var l, u = e2, c = new s2(8); u--; ) l = o.times(o), o = a.minus(l.times(c.minus(l.times(c))));
      return y(o, s2.precision = r2, s2.rounding = n, true);
    };
    m.hyperbolicSine = m.sinh = function() {
      var e2, t2, r2, n, i2 = this, o = i2.constructor;
      if (!i2.isFinite() || i2.isZero()) return new o(i2);
      if (t2 = o.precision, r2 = o.rounding, o.precision = t2 + Math.max(i2.e, i2.sd()) + 4, o.rounding = 1, n = i2.d.length, n < 3) i2 = Et(o, 2, i2, i2, true);
      else {
        e2 = 1.4 * Math.sqrt(n), e2 = e2 > 16 ? 16 : e2 | 0, i2 = i2.times(1 / an(5, e2)), i2 = Et(o, 2, i2, i2, true);
        for (var s2, a = new o(5), l = new o(16), u = new o(20); e2--; ) s2 = i2.times(i2), i2 = i2.times(a.plus(s2.times(l.times(s2).plus(u))));
      }
      return o.precision = t2, o.rounding = r2, y(i2, t2, r2, true);
    };
    m.hyperbolicTangent = m.tanh = function() {
      var e2, t2, r2 = this, n = r2.constructor;
      return r2.isFinite() ? r2.isZero() ? new n(r2) : (e2 = n.precision, t2 = n.rounding, n.precision = e2 + 7, n.rounding = 1, N(r2.sinh(), r2.cosh(), n.precision = e2, n.rounding = t2)) : new n(r2.s);
    };
    m.inverseCosine = m.acos = function() {
      var e2, t2 = this, r2 = t2.constructor, n = t2.abs().cmp(1), i2 = r2.precision, o = r2.rounding;
      return n !== -1 ? n === 0 ? t2.isNeg() ? fe(r2, i2, o) : new r2(0) : new r2(NaN) : t2.isZero() ? fe(r2, i2 + 4, o).times(0.5) : (r2.precision = i2 + 6, r2.rounding = 1, t2 = t2.asin(), e2 = fe(r2, i2 + 4, o).times(0.5), r2.precision = i2, r2.rounding = o, e2.minus(t2));
    };
    m.inverseHyperbolicCosine = m.acosh = function() {
      var e2, t2, r2 = this, n = r2.constructor;
      return r2.lte(1) ? new n(r2.eq(1) ? 0 : NaN) : r2.isFinite() ? (e2 = n.precision, t2 = n.rounding, n.precision = e2 + Math.max(Math.abs(r2.e), r2.sd()) + 4, n.rounding = 1, x = false, r2 = r2.times(r2).minus(1).sqrt().plus(r2), x = true, n.precision = e2, n.rounding = t2, r2.ln()) : new n(r2);
    };
    m.inverseHyperbolicSine = m.asinh = function() {
      var e2, t2, r2 = this, n = r2.constructor;
      return !r2.isFinite() || r2.isZero() ? new n(r2) : (e2 = n.precision, t2 = n.rounding, n.precision = e2 + 2 * Math.max(Math.abs(r2.e), r2.sd()) + 6, n.rounding = 1, x = false, r2 = r2.times(r2).plus(1).sqrt().plus(r2), x = true, n.precision = e2, n.rounding = t2, r2.ln());
    };
    m.inverseHyperbolicTangent = m.atanh = function() {
      var e2, t2, r2, n, i2 = this, o = i2.constructor;
      return i2.isFinite() ? i2.e >= 0 ? new o(i2.abs().eq(1) ? i2.s / 0 : i2.isZero() ? i2 : NaN) : (e2 = o.precision, t2 = o.rounding, n = i2.sd(), Math.max(n, e2) < 2 * -i2.e - 1 ? y(new o(i2), e2, t2, true) : (o.precision = r2 = n - i2.e, i2 = N(i2.plus(1), new o(1).minus(i2), r2 + e2, 1), o.precision = e2 + 4, o.rounding = 1, i2 = i2.ln(), o.precision = e2, o.rounding = t2, i2.times(0.5))) : new o(NaN);
    };
    m.inverseSine = m.asin = function() {
      var e2, t2, r2, n, i2 = this, o = i2.constructor;
      return i2.isZero() ? new o(i2) : (t2 = i2.abs().cmp(1), r2 = o.precision, n = o.rounding, t2 !== -1 ? t2 === 0 ? (e2 = fe(o, r2 + 4, n).times(0.5), e2.s = i2.s, e2) : new o(NaN) : (o.precision = r2 + 6, o.rounding = 1, i2 = i2.div(new o(1).minus(i2.times(i2)).sqrt().plus(1)).atan(), o.precision = r2, o.rounding = n, i2.times(2)));
    };
    m.inverseTangent = m.atan = function() {
      var e2, t2, r2, n, i2, o, s2, a, l, u = this, c = u.constructor, p = c.precision, d = c.rounding;
      if (u.isFinite()) {
        if (u.isZero()) return new c(u);
        if (u.abs().eq(1) && p + 4 <= Ti) return s2 = fe(c, p + 4, d).times(0.25), s2.s = u.s, s2;
      } else {
        if (!u.s) return new c(NaN);
        if (p + 4 <= Ti) return s2 = fe(c, p + 4, d).times(0.5), s2.s = u.s, s2;
      }
      for (c.precision = a = p + 10, c.rounding = 1, r2 = Math.min(28, a / b + 2 | 0), e2 = r2; e2; --e2) u = u.div(u.times(u).plus(1).sqrt().plus(1));
      for (x = false, t2 = Math.ceil(a / b), n = 1, l = u.times(u), s2 = new c(u), i2 = u; e2 !== -1; ) if (i2 = i2.times(l), o = s2.minus(i2.div(n += 2)), i2 = i2.times(l), s2 = o.plus(i2.div(n += 2)), s2.d[t2] !== void 0) for (e2 = t2; s2.d[e2] === o.d[e2] && e2--; ) ;
      return r2 && (s2 = s2.times(2 << r2 - 1)), x = true, y(s2, c.precision = p, c.rounding = d, true);
    };
    m.isFinite = function() {
      return !!this.d;
    };
    m.isInteger = m.isInt = function() {
      return !!this.d && ee(this.e / b) > this.d.length - 2;
    };
    m.isNaN = function() {
      return !this.s;
    };
    m.isNegative = m.isNeg = function() {
      return this.s < 0;
    };
    m.isPositive = m.isPos = function() {
      return this.s > 0;
    };
    m.isZero = function() {
      return !!this.d && this.d[0] === 0;
    };
    m.lessThan = m.lt = function(e2) {
      return this.cmp(e2) < 0;
    };
    m.lessThanOrEqualTo = m.lte = function(e2) {
      return this.cmp(e2) < 1;
    };
    m.logarithm = m.log = function(e2) {
      var t2, r2, n, i2, o, s2, a, l, u = this, c = u.constructor, p = c.precision, d = c.rounding, f3 = 5;
      if (e2 == null) e2 = new c(10), t2 = true;
      else {
        if (e2 = new c(e2), r2 = e2.d, e2.s < 0 || !r2 || !r2[0] || e2.eq(1)) return new c(NaN);
        t2 = e2.eq(10);
      }
      if (r2 = u.d, u.s < 0 || !r2 || !r2[0] || u.eq(1)) return new c(r2 && !r2[0] ? -1 / 0 : u.s != 1 ? NaN : r2 ? 0 : 1 / 0);
      if (t2) if (r2.length > 1) o = true;
      else {
        for (i2 = r2[0]; i2 % 10 === 0; ) i2 /= 10;
        o = i2 !== 1;
      }
      if (x = false, a = p + f3, s2 = He(u, a), n = t2 ? nn(c, a + 10) : He(e2, a), l = N(s2, n, a, 1), rr(l.d, i2 = p, d)) do
        if (a += 10, s2 = He(u, a), n = t2 ? nn(c, a + 10) : He(e2, a), l = N(s2, n, a, 1), !o) {
          +K(l.d).slice(i2 + 1, i2 + 15) + 1 == 1e14 && (l = y(l, p + 1, 0));
          break;
        }
      while (rr(l.d, i2 += 10, d));
      return x = true, y(l, p, d);
    };
    m.minus = m.sub = function(e2) {
      var t2, r2, n, i2, o, s2, a, l, u, c, p, d, f3 = this, g = f3.constructor;
      if (e2 = new g(e2), !f3.d || !e2.d) return !f3.s || !e2.s ? e2 = new g(NaN) : f3.d ? e2.s = -e2.s : e2 = new g(e2.d || f3.s !== e2.s ? f3 : NaN), e2;
      if (f3.s != e2.s) return e2.s = -e2.s, f3.plus(e2);
      if (u = f3.d, d = e2.d, a = g.precision, l = g.rounding, !u[0] || !d[0]) {
        if (d[0]) e2.s = -e2.s;
        else if (u[0]) e2 = new g(f3);
        else return new g(l === 3 ? -0 : 0);
        return x ? y(e2, a, l) : e2;
      }
      if (r2 = ee(e2.e / b), c = ee(f3.e / b), u = u.slice(), o = c - r2, o) {
        for (p = o < 0, p ? (t2 = u, o = -o, s2 = d.length) : (t2 = d, r2 = c, s2 = u.length), n = Math.max(Math.ceil(a / b), s2) + 2, o > n && (o = n, t2.length = 1), t2.reverse(), n = o; n--; ) t2.push(0);
        t2.reverse();
      } else {
        for (n = u.length, s2 = d.length, p = n < s2, p && (s2 = n), n = 0; n < s2; n++) if (u[n] != d[n]) {
          p = u[n] < d[n];
          break;
        }
        o = 0;
      }
      for (p && (t2 = u, u = d, d = t2, e2.s = -e2.s), s2 = u.length, n = d.length - s2; n > 0; --n) u[s2++] = 0;
      for (n = d.length; n > o; ) {
        if (u[--n] < d[n]) {
          for (i2 = n; i2 && u[--i2] === 0; ) u[i2] = ge - 1;
          --u[i2], u[n] += ge;
        }
        u[n] -= d[n];
      }
      for (; u[--s2] === 0; ) u.pop();
      for (; u[0] === 0; u.shift()) --r2;
      return u[0] ? (e2.d = u, e2.e = sn(u, r2), x ? y(e2, a, l) : e2) : new g(l === 3 ? -0 : 0);
    };
    m.modulo = m.mod = function(e2) {
      var t2, r2 = this, n = r2.constructor;
      return e2 = new n(e2), !r2.d || !e2.s || e2.d && !e2.d[0] ? new n(NaN) : !e2.d || r2.d && !r2.d[0] ? y(new n(r2), n.precision, n.rounding) : (x = false, n.modulo == 9 ? (t2 = N(r2, e2.abs(), 0, 3, 1), t2.s *= e2.s) : t2 = N(r2, e2, 0, n.modulo, 1), t2 = t2.times(e2), x = true, r2.minus(t2));
    };
    m.naturalExponential = m.exp = function() {
      return Ri(this);
    };
    m.naturalLogarithm = m.ln = function() {
      return He(this);
    };
    m.negated = m.neg = function() {
      var e2 = new this.constructor(this);
      return e2.s = -e2.s, y(e2);
    };
    m.plus = m.add = function(e2) {
      var t2, r2, n, i2, o, s2, a, l, u, c, p = this, d = p.constructor;
      if (e2 = new d(e2), !p.d || !e2.d) return !p.s || !e2.s ? e2 = new d(NaN) : p.d || (e2 = new d(e2.d || p.s === e2.s ? p : NaN)), e2;
      if (p.s != e2.s) return e2.s = -e2.s, p.minus(e2);
      if (u = p.d, c = e2.d, a = d.precision, l = d.rounding, !u[0] || !c[0]) return c[0] || (e2 = new d(p)), x ? y(e2, a, l) : e2;
      if (o = ee(p.e / b), n = ee(e2.e / b), u = u.slice(), i2 = o - n, i2) {
        for (i2 < 0 ? (r2 = u, i2 = -i2, s2 = c.length) : (r2 = c, n = o, s2 = u.length), o = Math.ceil(a / b), s2 = o > s2 ? o + 1 : s2 + 1, i2 > s2 && (i2 = s2, r2.length = 1), r2.reverse(); i2--; ) r2.push(0);
        r2.reverse();
      }
      for (s2 = u.length, i2 = c.length, s2 - i2 < 0 && (i2 = s2, r2 = c, c = u, u = r2), t2 = 0; i2; ) t2 = (u[--i2] = u[i2] + c[i2] + t2) / ge | 0, u[i2] %= ge;
      for (t2 && (u.unshift(t2), ++n), s2 = u.length; u[--s2] == 0; ) u.pop();
      return e2.d = u, e2.e = sn(u, n), x ? y(e2, a, l) : e2;
    };
    m.precision = m.sd = function(e2) {
      var t2, r2 = this;
      if (e2 !== void 0 && e2 !== !!e2 && e2 !== 1 && e2 !== 0) throw Error(Ke + e2);
      return r2.d ? (t2 = Cs(r2.d), e2 && r2.e + 1 > t2 && (t2 = r2.e + 1)) : t2 = NaN, t2;
    };
    m.round = function() {
      var e2 = this, t2 = e2.constructor;
      return y(new t2(e2), e2.e + 1, t2.rounding);
    };
    m.sine = m.sin = function() {
      var e2, t2, r2 = this, n = r2.constructor;
      return r2.isFinite() ? r2.isZero() ? new n(r2) : (e2 = n.precision, t2 = n.rounding, n.precision = e2 + Math.max(r2.e, r2.sd()) + b, n.rounding = 1, r2 = Rc(n, Os(n, r2)), n.precision = e2, n.rounding = t2, y(Ne > 2 ? r2.neg() : r2, e2, t2, true)) : new n(NaN);
    };
    m.squareRoot = m.sqrt = function() {
      var e2, t2, r2, n, i2, o, s2 = this, a = s2.d, l = s2.e, u = s2.s, c = s2.constructor;
      if (u !== 1 || !a || !a[0]) return new c(!u || u < 0 && (!a || a[0]) ? NaN : a ? s2 : 1 / 0);
      for (x = false, u = Math.sqrt(+s2), u == 0 || u == 1 / 0 ? (t2 = K(a), (t2.length + l) % 2 == 0 && (t2 += "0"), u = Math.sqrt(t2), l = ee((l + 1) / 2) - (l < 0 || l % 2), u == 1 / 0 ? t2 = "5e" + l : (t2 = u.toExponential(), t2 = t2.slice(0, t2.indexOf("e") + 1) + l), n = new c(t2)) : n = new c(u.toString()), r2 = (l = c.precision) + 3; ; ) if (o = n, n = o.plus(N(s2, o, r2 + 2, 1)).times(0.5), K(o.d).slice(0, r2) === (t2 = K(n.d)).slice(0, r2)) if (t2 = t2.slice(r2 - 3, r2 + 1), t2 == "9999" || !i2 && t2 == "4999") {
        if (!i2 && (y(o, l + 1, 0), o.times(o).eq(s2))) {
          n = o;
          break;
        }
        r2 += 4, i2 = 1;
      } else {
        (!+t2 || !+t2.slice(1) && t2.charAt(0) == "5") && (y(n, l + 1, 1), e2 = !n.times(n).eq(s2));
        break;
      }
      return x = true, y(n, l, c.rounding, e2);
    };
    m.tangent = m.tan = function() {
      var e2, t2, r2 = this, n = r2.constructor;
      return r2.isFinite() ? r2.isZero() ? new n(r2) : (e2 = n.precision, t2 = n.rounding, n.precision = e2 + 10, n.rounding = 1, r2 = r2.sin(), r2.s = 1, r2 = N(r2, new n(1).minus(r2.times(r2)).sqrt(), e2 + 10, 0), n.precision = e2, n.rounding = t2, y(Ne == 2 || Ne == 4 ? r2.neg() : r2, e2, t2, true)) : new n(NaN);
    };
    m.times = m.mul = function(e2) {
      var t2, r2, n, i2, o, s2, a, l, u, c = this, p = c.constructor, d = c.d, f3 = (e2 = new p(e2)).d;
      if (e2.s *= c.s, !d || !d[0] || !f3 || !f3[0]) return new p(!e2.s || d && !d[0] && !f3 || f3 && !f3[0] && !d ? NaN : !d || !f3 ? e2.s / 0 : e2.s * 0);
      for (r2 = ee(c.e / b) + ee(e2.e / b), l = d.length, u = f3.length, l < u && (o = d, d = f3, f3 = o, s2 = l, l = u, u = s2), o = [], s2 = l + u, n = s2; n--; ) o.push(0);
      for (n = u; --n >= 0; ) {
        for (t2 = 0, i2 = l + n; i2 > n; ) a = o[i2] + f3[n] * d[i2 - n - 1] + t2, o[i2--] = a % ge | 0, t2 = a / ge | 0;
        o[i2] = (o[i2] + t2) % ge | 0;
      }
      for (; !o[--s2]; ) o.pop();
      return t2 ? ++r2 : o.shift(), e2.d = o, e2.e = sn(o, r2), x ? y(e2, p.precision, p.rounding) : e2;
    };
    m.toBinary = function(e2, t2) {
      return Si(this, 2, e2, t2);
    };
    m.toDecimalPlaces = m.toDP = function(e2, t2) {
      var r2 = this, n = r2.constructor;
      return r2 = new n(r2), e2 === void 0 ? r2 : (ie(e2, 0, ze), t2 === void 0 ? t2 = n.rounding : ie(t2, 0, 8), y(r2, e2 + r2.e + 1, t2));
    };
    m.toExponential = function(e2, t2) {
      var r2, n = this, i2 = n.constructor;
      return e2 === void 0 ? r2 = we(n, true) : (ie(e2, 0, ze), t2 === void 0 ? t2 = i2.rounding : ie(t2, 0, 8), n = y(new i2(n), e2 + 1, t2), r2 = we(n, true, e2 + 1)), n.isNeg() && !n.isZero() ? "-" + r2 : r2;
    };
    m.toFixed = function(e2, t2) {
      var r2, n, i2 = this, o = i2.constructor;
      return e2 === void 0 ? r2 = we(i2) : (ie(e2, 0, ze), t2 === void 0 ? t2 = o.rounding : ie(t2, 0, 8), n = y(new o(i2), e2 + i2.e + 1, t2), r2 = we(n, false, e2 + n.e + 1)), i2.isNeg() && !i2.isZero() ? "-" + r2 : r2;
    };
    m.toFraction = function(e2) {
      var t2, r2, n, i2, o, s2, a, l, u, c, p, d, f3 = this, g = f3.d, h2 = f3.constructor;
      if (!g) return new h2(f3);
      if (u = r2 = new h2(1), n = l = new h2(0), t2 = new h2(n), o = t2.e = Cs(g) - f3.e - 1, s2 = o % b, t2.d[0] = G(10, s2 < 0 ? b + s2 : s2), e2 == null) e2 = o > 0 ? t2 : u;
      else {
        if (a = new h2(e2), !a.isInt() || a.lt(u)) throw Error(Ke + a);
        e2 = a.gt(t2) ? o > 0 ? t2 : u : a;
      }
      for (x = false, a = new h2(K(g)), c = h2.precision, h2.precision = o = g.length * b * 2; p = N(a, t2, 0, 1, 1), i2 = r2.plus(p.times(n)), i2.cmp(e2) != 1; ) r2 = n, n = i2, i2 = u, u = l.plus(p.times(i2)), l = i2, i2 = t2, t2 = a.minus(p.times(i2)), a = i2;
      return i2 = N(e2.minus(r2), n, 0, 1, 1), l = l.plus(i2.times(u)), r2 = r2.plus(i2.times(n)), l.s = u.s = f3.s, d = N(u, n, o, 1).minus(f3).abs().cmp(N(l, r2, o, 1).minus(f3).abs()) < 1 ? [u, n] : [l, r2], h2.precision = c, x = true, d;
    };
    m.toHexadecimal = m.toHex = function(e2, t2) {
      return Si(this, 16, e2, t2);
    };
    m.toNearest = function(e2, t2) {
      var r2 = this, n = r2.constructor;
      if (r2 = new n(r2), e2 == null) {
        if (!r2.d) return r2;
        e2 = new n(1), t2 = n.rounding;
      } else {
        if (e2 = new n(e2), t2 === void 0 ? t2 = n.rounding : ie(t2, 0, 8), !r2.d) return e2.s ? r2 : e2;
        if (!e2.d) return e2.s && (e2.s = r2.s), e2;
      }
      return e2.d[0] ? (x = false, r2 = N(r2, e2, 0, t2, 1).times(e2), x = true, y(r2)) : (e2.s = r2.s, r2 = e2), r2;
    };
    m.toNumber = function() {
      return +this;
    };
    m.toOctal = function(e2, t2) {
      return Si(this, 8, e2, t2);
    };
    m.toPower = m.pow = function(e2) {
      var t2, r2, n, i2, o, s2, a = this, l = a.constructor, u = +(e2 = new l(e2));
      if (!a.d || !e2.d || !a.d[0] || !e2.d[0]) return new l(G(+a, u));
      if (a = new l(a), a.eq(1)) return a;
      if (n = l.precision, o = l.rounding, e2.eq(1)) return y(a, n, o);
      if (t2 = ee(e2.e / b), t2 >= e2.d.length - 1 && (r2 = u < 0 ? -u : u) <= xc) return i2 = Ss(l, a, r2, n), e2.s < 0 ? new l(1).div(i2) : y(i2, n, o);
      if (s2 = a.s, s2 < 0) {
        if (t2 < e2.d.length - 1) return new l(NaN);
        if (e2.d[t2] & 1 || (s2 = 1), a.e == 0 && a.d[0] == 1 && a.d.length == 1) return a.s = s2, a;
      }
      return r2 = G(+a, u), t2 = r2 == 0 || !isFinite(r2) ? ee(u * (Math.log("0." + K(a.d)) / Math.LN10 + a.e + 1)) : new l(r2 + "").e, t2 > l.maxE + 1 || t2 < l.minE - 1 ? new l(t2 > 0 ? s2 / 0 : 0) : (x = false, l.rounding = a.s = 1, r2 = Math.min(12, (t2 + "").length), i2 = Ri(e2.times(He(a, n + r2)), n), i2.d && (i2 = y(i2, n + 5, 1), rr(i2.d, n, o) && (t2 = n + 10, i2 = y(Ri(e2.times(He(a, t2 + r2)), t2), t2 + 5, 1), +K(i2.d).slice(n + 1, n + 15) + 1 == 1e14 && (i2 = y(i2, n + 1, 0)))), i2.s = s2, x = true, l.rounding = o, y(i2, n, o));
    };
    m.toPrecision = function(e2, t2) {
      var r2, n = this, i2 = n.constructor;
      return e2 === void 0 ? r2 = we(n, n.e <= i2.toExpNeg || n.e >= i2.toExpPos) : (ie(e2, 1, ze), t2 === void 0 ? t2 = i2.rounding : ie(t2, 0, 8), n = y(new i2(n), e2, t2), r2 = we(n, e2 <= n.e || n.e <= i2.toExpNeg, e2)), n.isNeg() && !n.isZero() ? "-" + r2 : r2;
    };
    m.toSignificantDigits = m.toSD = function(e2, t2) {
      var r2 = this, n = r2.constructor;
      return e2 === void 0 ? (e2 = n.precision, t2 = n.rounding) : (ie(e2, 1, ze), t2 === void 0 ? t2 = n.rounding : ie(t2, 0, 8)), y(new n(r2), e2, t2);
    };
    m.toString = function() {
      var e2 = this, t2 = e2.constructor, r2 = we(e2, e2.e <= t2.toExpNeg || e2.e >= t2.toExpPos);
      return e2.isNeg() && !e2.isZero() ? "-" + r2 : r2;
    };
    m.truncated = m.trunc = function() {
      return y(new this.constructor(this), this.e + 1, 1);
    };
    m.valueOf = m.toJSON = function() {
      var e2 = this, t2 = e2.constructor, r2 = we(e2, e2.e <= t2.toExpNeg || e2.e >= t2.toExpPos);
      return e2.isNeg() ? "-" + r2 : r2;
    };
    function K(e2) {
      var t2, r2, n, i2 = e2.length - 1, o = "", s2 = e2[0];
      if (i2 > 0) {
        for (o += s2, t2 = 1; t2 < i2; t2++) n = e2[t2] + "", r2 = b - n.length, r2 && (o += We(r2)), o += n;
        s2 = e2[t2], n = s2 + "", r2 = b - n.length, r2 && (o += We(r2));
      } else if (s2 === 0) return "0";
      for (; s2 % 10 === 0; ) s2 /= 10;
      return o + s2;
    }
    function ie(e2, t2, r2) {
      if (e2 !== ~~e2 || e2 < t2 || e2 > r2) throw Error(Ke + e2);
    }
    function rr(e2, t2, r2, n) {
      var i2, o, s2, a;
      for (o = e2[0]; o >= 10; o /= 10) --t2;
      return --t2 < 0 ? (t2 += b, i2 = 0) : (i2 = Math.ceil((t2 + 1) / b), t2 %= b), o = G(10, b - t2), a = e2[i2] % o | 0, n == null ? t2 < 3 ? (t2 == 0 ? a = a / 100 | 0 : t2 == 1 && (a = a / 10 | 0), s2 = r2 < 4 && a == 99999 || r2 > 3 && a == 49999 || a == 5e4 || a == 0) : s2 = (r2 < 4 && a + 1 == o || r2 > 3 && a + 1 == o / 2) && (e2[i2 + 1] / o / 100 | 0) == G(10, t2 - 2) - 1 || (a == o / 2 || a == 0) && (e2[i2 + 1] / o / 100 | 0) == 0 : t2 < 4 ? (t2 == 0 ? a = a / 1e3 | 0 : t2 == 1 ? a = a / 100 | 0 : t2 == 2 && (a = a / 10 | 0), s2 = (n || r2 < 4) && a == 9999 || !n && r2 > 3 && a == 4999) : s2 = ((n || r2 < 4) && a + 1 == o || !n && r2 > 3 && a + 1 == o / 2) && (e2[i2 + 1] / o / 1e3 | 0) == G(10, t2 - 3) - 1, s2;
    }
    function en(e2, t2, r2) {
      for (var n, i2 = [0], o, s2 = 0, a = e2.length; s2 < a; ) {
        for (o = i2.length; o--; ) i2[o] *= t2;
        for (i2[0] += Pi.indexOf(e2.charAt(s2++)), n = 0; n < i2.length; n++) i2[n] > r2 - 1 && (i2[n + 1] === void 0 && (i2[n + 1] = 0), i2[n + 1] += i2[n] / r2 | 0, i2[n] %= r2);
      }
      return i2.reverse();
    }
    function vc(e2, t2) {
      var r2, n, i2;
      if (t2.isZero()) return t2;
      n = t2.d.length, n < 32 ? (r2 = Math.ceil(n / 3), i2 = (1 / an(4, r2)).toString()) : (r2 = 16, i2 = "2.3283064365386962890625e-10"), e2.precision += r2, t2 = Et(e2, 1, t2.times(i2), new e2(1));
      for (var o = r2; o--; ) {
        var s2 = t2.times(t2);
        t2 = s2.times(s2).minus(s2).times(8).plus(1);
      }
      return e2.precision -= r2, t2;
    }
    var N = /* @__PURE__ */ function() {
      function e2(n, i2, o) {
        var s2, a = 0, l = n.length;
        for (n = n.slice(); l--; ) s2 = n[l] * i2 + a, n[l] = s2 % o | 0, a = s2 / o | 0;
        return a && n.unshift(a), n;
      }
      function t2(n, i2, o, s2) {
        var a, l;
        if (o != s2) l = o > s2 ? 1 : -1;
        else for (a = l = 0; a < o; a++) if (n[a] != i2[a]) {
          l = n[a] > i2[a] ? 1 : -1;
          break;
        }
        return l;
      }
      function r2(n, i2, o, s2) {
        for (var a = 0; o--; ) n[o] -= a, a = n[o] < i2[o] ? 1 : 0, n[o] = a * s2 + n[o] - i2[o];
        for (; !n[0] && n.length > 1; ) n.shift();
      }
      return function(n, i2, o, s2, a, l) {
        var u, c, p, d, f3, g, h2, O, T, S2, C, E, me, ae, Bt, U, ne, Ie, z, dt, Lr = n.constructor, qn = n.s == i2.s ? 1 : -1, Y = n.d, _ = i2.d;
        if (!Y || !Y[0] || !_ || !_[0]) return new Lr(!n.s || !i2.s || (Y ? _ && Y[0] == _[0] : !_) ? NaN : Y && Y[0] == 0 || !_ ? qn * 0 : qn / 0);
        for (l ? (f3 = 1, c = n.e - i2.e) : (l = ge, f3 = b, c = ee(n.e / f3) - ee(i2.e / f3)), z = _.length, ne = Y.length, T = new Lr(qn), S2 = T.d = [], p = 0; _[p] == (Y[p] || 0); p++) ;
        if (_[p] > (Y[p] || 0) && c--, o == null ? (ae = o = Lr.precision, s2 = Lr.rounding) : a ? ae = o + (n.e - i2.e) + 1 : ae = o, ae < 0) S2.push(1), g = true;
        else {
          if (ae = ae / f3 + 2 | 0, p = 0, z == 1) {
            for (d = 0, _ = _[0], ae++; (p < ne || d) && ae--; p++) Bt = d * l + (Y[p] || 0), S2[p] = Bt / _ | 0, d = Bt % _ | 0;
            g = d || p < ne;
          } else {
            for (d = l / (_[0] + 1) | 0, d > 1 && (_ = e2(_, d, l), Y = e2(Y, d, l), z = _.length, ne = Y.length), U = z, C = Y.slice(0, z), E = C.length; E < z; ) C[E++] = 0;
            dt = _.slice(), dt.unshift(0), Ie = _[0], _[1] >= l / 2 && ++Ie;
            do
              d = 0, u = t2(_, C, z, E), u < 0 ? (me = C[0], z != E && (me = me * l + (C[1] || 0)), d = me / Ie | 0, d > 1 ? (d >= l && (d = l - 1), h2 = e2(_, d, l), O = h2.length, E = C.length, u = t2(h2, C, O, E), u == 1 && (d--, r2(h2, z < O ? dt : _, O, l))) : (d == 0 && (u = d = 1), h2 = _.slice()), O = h2.length, O < E && h2.unshift(0), r2(C, h2, E, l), u == -1 && (E = C.length, u = t2(_, C, z, E), u < 1 && (d++, r2(C, z < E ? dt : _, E, l))), E = C.length) : u === 0 && (d++, C = [0]), S2[p++] = d, u && C[0] ? C[E++] = Y[U] || 0 : (C = [Y[U]], E = 1);
            while ((U++ < ne || C[0] !== void 0) && ae--);
            g = C[0] !== void 0;
          }
          S2[0] || S2.shift();
        }
        if (f3 == 1) T.e = c, xs = g;
        else {
          for (p = 1, d = S2[0]; d >= 10; d /= 10) p++;
          T.e = p + c * f3 - 1, y(T, a ? o + T.e + 1 : o, s2, g);
        }
        return T;
      };
    }();
    function y(e2, t2, r2, n) {
      var i2, o, s2, a, l, u, c, p, d, f3 = e2.constructor;
      e: if (t2 != null) {
        if (p = e2.d, !p) return e2;
        for (i2 = 1, a = p[0]; a >= 10; a /= 10) i2++;
        if (o = t2 - i2, o < 0) o += b, s2 = t2, c = p[d = 0], l = c / G(10, i2 - s2 - 1) % 10 | 0;
        else if (d = Math.ceil((o + 1) / b), a = p.length, d >= a) if (n) {
          for (; a++ <= d; ) p.push(0);
          c = l = 0, i2 = 1, o %= b, s2 = o - b + 1;
        } else break e;
        else {
          for (c = a = p[d], i2 = 1; a >= 10; a /= 10) i2++;
          o %= b, s2 = o - b + i2, l = s2 < 0 ? 0 : c / G(10, i2 - s2 - 1) % 10 | 0;
        }
        if (n = n || t2 < 0 || p[d + 1] !== void 0 || (s2 < 0 ? c : c % G(10, i2 - s2 - 1)), u = r2 < 4 ? (l || n) && (r2 == 0 || r2 == (e2.s < 0 ? 3 : 2)) : l > 5 || l == 5 && (r2 == 4 || n || r2 == 6 && (o > 0 ? s2 > 0 ? c / G(10, i2 - s2) : 0 : p[d - 1]) % 10 & 1 || r2 == (e2.s < 0 ? 8 : 7)), t2 < 1 || !p[0]) return p.length = 0, u ? (t2 -= e2.e + 1, p[0] = G(10, (b - t2 % b) % b), e2.e = -t2 || 0) : p[0] = e2.e = 0, e2;
        if (o == 0 ? (p.length = d, a = 1, d--) : (p.length = d + 1, a = G(10, b - o), p[d] = s2 > 0 ? (c / G(10, i2 - s2) % G(10, s2) | 0) * a : 0), u) for (; ; ) if (d == 0) {
          for (o = 1, s2 = p[0]; s2 >= 10; s2 /= 10) o++;
          for (s2 = p[0] += a, a = 1; s2 >= 10; s2 /= 10) a++;
          o != a && (e2.e++, p[0] == ge && (p[0] = 1));
          break;
        } else {
          if (p[d] += a, p[d] != ge) break;
          p[d--] = 0, a = 1;
        }
        for (o = p.length; p[--o] === 0; ) p.pop();
      }
      return x && (e2.e > f3.maxE ? (e2.d = null, e2.e = NaN) : e2.e < f3.minE && (e2.e = 0, e2.d = [0])), e2;
    }
    function we(e2, t2, r2) {
      if (!e2.isFinite()) return Is(e2);
      var n, i2 = e2.e, o = K(e2.d), s2 = o.length;
      return t2 ? (r2 && (n = r2 - s2) > 0 ? o = o.charAt(0) + "." + o.slice(1) + We(n) : s2 > 1 && (o = o.charAt(0) + "." + o.slice(1)), o = o + (e2.e < 0 ? "e" : "e+") + e2.e) : i2 < 0 ? (o = "0." + We(-i2 - 1) + o, r2 && (n = r2 - s2) > 0 && (o += We(n))) : i2 >= s2 ? (o += We(i2 + 1 - s2), r2 && (n = r2 - i2 - 1) > 0 && (o = o + "." + We(n))) : ((n = i2 + 1) < s2 && (o = o.slice(0, n) + "." + o.slice(n)), r2 && (n = r2 - s2) > 0 && (i2 + 1 === s2 && (o += "."), o += We(n))), o;
    }
    function sn(e2, t2) {
      var r2 = e2[0];
      for (t2 *= b; r2 >= 10; r2 /= 10) t2++;
      return t2;
    }
    function nn(e2, t2, r2) {
      if (t2 > Pc) throw x = true, r2 && (e2.precision = r2), Error(Ps);
      return y(new e2(tn), t2, 1, true);
    }
    function fe(e2, t2, r2) {
      if (t2 > Ti) throw Error(Ps);
      return y(new e2(rn), t2, r2, true);
    }
    function Cs(e2) {
      var t2 = e2.length - 1, r2 = t2 * b + 1;
      if (t2 = e2[t2], t2) {
        for (; t2 % 10 == 0; t2 /= 10) r2--;
        for (t2 = e2[0]; t2 >= 10; t2 /= 10) r2++;
      }
      return r2;
    }
    function We(e2) {
      for (var t2 = ""; e2--; ) t2 += "0";
      return t2;
    }
    function Ss(e2, t2, r2, n) {
      var i2, o = new e2(1), s2 = Math.ceil(n / b + 4);
      for (x = false; ; ) {
        if (r2 % 2 && (o = o.times(t2), Es(o.d, s2) && (i2 = true)), r2 = ee(r2 / 2), r2 === 0) {
          r2 = o.d.length - 1, i2 && o.d[r2] === 0 && ++o.d[r2];
          break;
        }
        t2 = t2.times(t2), Es(t2.d, s2);
      }
      return x = true, o;
    }
    function bs(e2) {
      return e2.d[e2.d.length - 1] & 1;
    }
    function As(e2, t2, r2) {
      for (var n, i2 = new e2(t2[0]), o = 0; ++o < t2.length; ) if (n = new e2(t2[o]), n.s) i2[r2](n) && (i2 = n);
      else {
        i2 = n;
        break;
      }
      return i2;
    }
    function Ri(e2, t2) {
      var r2, n, i2, o, s2, a, l, u = 0, c = 0, p = 0, d = e2.constructor, f3 = d.rounding, g = d.precision;
      if (!e2.d || !e2.d[0] || e2.e > 17) return new d(e2.d ? e2.d[0] ? e2.s < 0 ? 0 : 1 / 0 : 1 : e2.s ? e2.s < 0 ? 0 : e2 : NaN);
      for (t2 == null ? (x = false, l = g) : l = t2, a = new d(0.03125); e2.e > -2; ) e2 = e2.times(a), p += 5;
      for (n = Math.log(G(2, p)) / Math.LN10 * 2 + 5 | 0, l += n, r2 = o = s2 = new d(1), d.precision = l; ; ) {
        if (o = y(o.times(e2), l, 1), r2 = r2.times(++c), a = s2.plus(N(o, r2, l, 1)), K(a.d).slice(0, l) === K(s2.d).slice(0, l)) {
          for (i2 = p; i2--; ) s2 = y(s2.times(s2), l, 1);
          if (t2 == null) if (u < 3 && rr(s2.d, l - n, f3, u)) d.precision = l += 10, r2 = o = a = new d(1), c = 0, u++;
          else return y(s2, d.precision = g, f3, x = true);
          else return d.precision = g, s2;
        }
        s2 = a;
      }
    }
    function He(e2, t2) {
      var r2, n, i2, o, s2, a, l, u, c, p, d, f3 = 1, g = 10, h2 = e2, O = h2.d, T = h2.constructor, S2 = T.rounding, C = T.precision;
      if (h2.s < 0 || !O || !O[0] || !h2.e && O[0] == 1 && O.length == 1) return new T(O && !O[0] ? -1 / 0 : h2.s != 1 ? NaN : O ? 0 : h2);
      if (t2 == null ? (x = false, c = C) : c = t2, T.precision = c += g, r2 = K(O), n = r2.charAt(0), Math.abs(o = h2.e) < 15e14) {
        for (; n < 7 && n != 1 || n == 1 && r2.charAt(1) > 3; ) h2 = h2.times(e2), r2 = K(h2.d), n = r2.charAt(0), f3++;
        o = h2.e, n > 1 ? (h2 = new T("0." + r2), o++) : h2 = new T(n + "." + r2.slice(1));
      } else return u = nn(T, c + 2, C).times(o + ""), h2 = He(new T(n + "." + r2.slice(1)), c - g).plus(u), T.precision = C, t2 == null ? y(h2, C, S2, x = true) : h2;
      for (p = h2, l = s2 = h2 = N(h2.minus(1), h2.plus(1), c, 1), d = y(h2.times(h2), c, 1), i2 = 3; ; ) {
        if (s2 = y(s2.times(d), c, 1), u = l.plus(N(s2, new T(i2), c, 1)), K(u.d).slice(0, c) === K(l.d).slice(0, c)) if (l = l.times(2), o !== 0 && (l = l.plus(nn(T, c + 2, C).times(o + ""))), l = N(l, new T(f3), c, 1), t2 == null) if (rr(l.d, c - g, S2, a)) T.precision = c += g, u = s2 = h2 = N(p.minus(1), p.plus(1), c, 1), d = y(h2.times(h2), c, 1), i2 = a = 1;
        else return y(l, T.precision = C, S2, x = true);
        else return T.precision = C, l;
        l = u, i2 += 2;
      }
    }
    function Is(e2) {
      return String(e2.s * e2.s / 0);
    }
    function Ci(e2, t2) {
      var r2, n, i2;
      for ((r2 = t2.indexOf(".")) > -1 && (t2 = t2.replace(".", "")), (n = t2.search(/e/i)) > 0 ? (r2 < 0 && (r2 = n), r2 += +t2.slice(n + 1), t2 = t2.substring(0, n)) : r2 < 0 && (r2 = t2.length), n = 0; t2.charCodeAt(n) === 48; n++) ;
      for (i2 = t2.length; t2.charCodeAt(i2 - 1) === 48; --i2) ;
      if (t2 = t2.slice(n, i2), t2) {
        if (i2 -= n, e2.e = r2 = r2 - n - 1, e2.d = [], n = (r2 + 1) % b, r2 < 0 && (n += b), n < i2) {
          for (n && e2.d.push(+t2.slice(0, n)), i2 -= b; n < i2; ) e2.d.push(+t2.slice(n, n += b));
          t2 = t2.slice(n), n = b - t2.length;
        } else n -= i2;
        for (; n--; ) t2 += "0";
        e2.d.push(+t2), x && (e2.e > e2.constructor.maxE ? (e2.d = null, e2.e = NaN) : e2.e < e2.constructor.minE && (e2.e = 0, e2.d = [0]));
      } else e2.e = 0, e2.d = [0];
      return e2;
    }
    function Tc(e2, t2) {
      var r2, n, i2, o, s2, a, l, u, c;
      if (t2.indexOf("_") > -1) {
        if (t2 = t2.replace(/(\d)_(?=\d)/g, "$1"), Rs.test(t2)) return Ci(e2, t2);
      } else if (t2 === "Infinity" || t2 === "NaN") return +t2 || (e2.s = NaN), e2.e = NaN, e2.d = null, e2;
      if (Ec.test(t2)) r2 = 16, t2 = t2.toLowerCase();
      else if (bc.test(t2)) r2 = 2;
      else if (wc.test(t2)) r2 = 8;
      else throw Error(Ke + t2);
      for (o = t2.search(/p/i), o > 0 ? (l = +t2.slice(o + 1), t2 = t2.substring(2, o)) : t2 = t2.slice(2), o = t2.indexOf("."), s2 = o >= 0, n = e2.constructor, s2 && (t2 = t2.replace(".", ""), a = t2.length, o = a - o, i2 = Ss(n, new n(r2), o, o * 2)), u = en(t2, r2, ge), c = u.length - 1, o = c; u[o] === 0; --o) u.pop();
      return o < 0 ? new n(e2.s * 0) : (e2.e = sn(u, c), e2.d = u, x = false, s2 && (e2 = N(e2, i2, a * 4)), l && (e2 = e2.times(Math.abs(l) < 54 ? G(2, l) : it.pow(2, l))), x = true, e2);
    }
    function Rc(e2, t2) {
      var r2, n = t2.d.length;
      if (n < 3) return t2.isZero() ? t2 : Et(e2, 2, t2, t2);
      r2 = 1.4 * Math.sqrt(n), r2 = r2 > 16 ? 16 : r2 | 0, t2 = t2.times(1 / an(5, r2)), t2 = Et(e2, 2, t2, t2);
      for (var i2, o = new e2(5), s2 = new e2(16), a = new e2(20); r2--; ) i2 = t2.times(t2), t2 = t2.times(o.plus(i2.times(s2.times(i2).minus(a))));
      return t2;
    }
    function Et(e2, t2, r2, n, i2) {
      var o, s2, a, l, u = 1, c = e2.precision, p = Math.ceil(c / b);
      for (x = false, l = r2.times(r2), a = new e2(n); ; ) {
        if (s2 = N(a.times(l), new e2(t2++ * t2++), c, 1), a = i2 ? n.plus(s2) : n.minus(s2), n = N(s2.times(l), new e2(t2++ * t2++), c, 1), s2 = a.plus(n), s2.d[p] !== void 0) {
          for (o = p; s2.d[o] === a.d[o] && o--; ) ;
          if (o == -1) break;
        }
        o = a, a = n, n = s2, s2 = o, u++;
      }
      return x = true, s2.d.length = p + 1, s2;
    }
    function an(e2, t2) {
      for (var r2 = e2; --t2; ) r2 *= e2;
      return r2;
    }
    function Os(e2, t2) {
      var r2, n = t2.s < 0, i2 = fe(e2, e2.precision, 1), o = i2.times(0.5);
      if (t2 = t2.abs(), t2.lte(o)) return Ne = n ? 4 : 1, t2;
      if (r2 = t2.divToInt(i2), r2.isZero()) Ne = n ? 3 : 2;
      else {
        if (t2 = t2.minus(r2.times(i2)), t2.lte(o)) return Ne = bs(r2) ? n ? 2 : 3 : n ? 4 : 1, t2;
        Ne = bs(r2) ? n ? 1 : 4 : n ? 3 : 2;
      }
      return t2.minus(i2).abs();
    }
    function Si(e2, t2, r2, n) {
      var i2, o, s2, a, l, u, c, p, d, f3 = e2.constructor, g = r2 !== void 0;
      if (g ? (ie(r2, 1, ze), n === void 0 ? n = f3.rounding : ie(n, 0, 8)) : (r2 = f3.precision, n = f3.rounding), !e2.isFinite()) c = Is(e2);
      else {
        for (c = we(e2), s2 = c.indexOf("."), g ? (i2 = 2, t2 == 16 ? r2 = r2 * 4 - 3 : t2 == 8 && (r2 = r2 * 3 - 2)) : i2 = t2, s2 >= 0 && (c = c.replace(".", ""), d = new f3(1), d.e = c.length - s2, d.d = en(we(d), 10, i2), d.e = d.d.length), p = en(c, 10, i2), o = l = p.length; p[--l] == 0; ) p.pop();
        if (!p[0]) c = g ? "0p+0" : "0";
        else {
          if (s2 < 0 ? o-- : (e2 = new f3(e2), e2.d = p, e2.e = o, e2 = N(e2, d, r2, n, 0, i2), p = e2.d, o = e2.e, u = xs), s2 = p[r2], a = i2 / 2, u = u || p[r2 + 1] !== void 0, u = n < 4 ? (s2 !== void 0 || u) && (n === 0 || n === (e2.s < 0 ? 3 : 2)) : s2 > a || s2 === a && (n === 4 || u || n === 6 && p[r2 - 1] & 1 || n === (e2.s < 0 ? 8 : 7)), p.length = r2, u) for (; ++p[--r2] > i2 - 1; ) p[r2] = 0, r2 || (++o, p.unshift(1));
          for (l = p.length; !p[l - 1]; --l) ;
          for (s2 = 0, c = ""; s2 < l; s2++) c += Pi.charAt(p[s2]);
          if (g) {
            if (l > 1) if (t2 == 16 || t2 == 8) {
              for (s2 = t2 == 16 ? 4 : 3, --l; l % s2; l++) c += "0";
              for (p = en(c, i2, t2), l = p.length; !p[l - 1]; --l) ;
              for (s2 = 1, c = "1."; s2 < l; s2++) c += Pi.charAt(p[s2]);
            } else c = c.charAt(0) + "." + c.slice(1);
            c = c + (o < 0 ? "p" : "p+") + o;
          } else if (o < 0) {
            for (; ++o; ) c = "0" + c;
            c = "0." + c;
          } else if (++o > l) for (o -= l; o--; ) c += "0";
          else o < l && (c = c.slice(0, o) + "." + c.slice(o));
        }
        c = (t2 == 16 ? "0x" : t2 == 2 ? "0b" : t2 == 8 ? "0o" : "") + c;
      }
      return e2.s < 0 ? "-" + c : c;
    }
    function Es(e2, t2) {
      if (e2.length > t2) return e2.length = t2, true;
    }
    function Cc(e2) {
      return new this(e2).abs();
    }
    function Sc(e2) {
      return new this(e2).acos();
    }
    function Ac(e2) {
      return new this(e2).acosh();
    }
    function Ic(e2, t2) {
      return new this(e2).plus(t2);
    }
    function Oc(e2) {
      return new this(e2).asin();
    }
    function kc(e2) {
      return new this(e2).asinh();
    }
    function Dc(e2) {
      return new this(e2).atan();
    }
    function _c(e2) {
      return new this(e2).atanh();
    }
    function Fc(e2, t2) {
      e2 = new this(e2), t2 = new this(t2);
      var r2, n = this.precision, i2 = this.rounding, o = n + 4;
      return !e2.s || !t2.s ? r2 = new this(NaN) : !e2.d && !t2.d ? (r2 = fe(this, o, 1).times(t2.s > 0 ? 0.25 : 0.75), r2.s = e2.s) : !t2.d || e2.isZero() ? (r2 = t2.s < 0 ? fe(this, n, i2) : new this(0), r2.s = e2.s) : !e2.d || t2.isZero() ? (r2 = fe(this, o, 1).times(0.5), r2.s = e2.s) : t2.s < 0 ? (this.precision = o, this.rounding = 1, r2 = this.atan(N(e2, t2, o, 1)), t2 = fe(this, o, 1), this.precision = n, this.rounding = i2, r2 = e2.s < 0 ? r2.minus(t2) : r2.plus(t2)) : r2 = this.atan(N(e2, t2, o, 1)), r2;
    }
    function Lc(e2) {
      return new this(e2).cbrt();
    }
    function Nc(e2) {
      return y(e2 = new this(e2), e2.e + 1, 2);
    }
    function Mc(e2, t2, r2) {
      return new this(e2).clamp(t2, r2);
    }
    function $c(e2) {
      if (!e2 || typeof e2 != "object") throw Error(on + "Object expected");
      var t2, r2, n, i2 = e2.defaults === true, o = ["precision", 1, ze, "rounding", 0, 8, "toExpNeg", -bt, 0, "toExpPos", 0, bt, "maxE", 0, bt, "minE", -bt, 0, "modulo", 0, 9];
      for (t2 = 0; t2 < o.length; t2 += 3) if (r2 = o[t2], i2 && (this[r2] = vi[r2]), (n = e2[r2]) !== void 0) if (ee(n) === n && n >= o[t2 + 1] && n <= o[t2 + 2]) this[r2] = n;
      else throw Error(Ke + r2 + ": " + n);
      if (r2 = "crypto", i2 && (this[r2] = vi[r2]), (n = e2[r2]) !== void 0) if (n === true || n === false || n === 0 || n === 1) if (n) if (typeof crypto < "u" && crypto && (crypto.getRandomValues || crypto.randomBytes)) this[r2] = true;
      else throw Error(vs);
      else this[r2] = false;
      else throw Error(Ke + r2 + ": " + n);
      return this;
    }
    function qc(e2) {
      return new this(e2).cos();
    }
    function jc(e2) {
      return new this(e2).cosh();
    }
    function ks(e2) {
      var t2, r2, n;
      function i2(o) {
        var s2, a, l, u = this;
        if (!(u instanceof i2)) return new i2(o);
        if (u.constructor = i2, ws(o)) {
          u.s = o.s, x ? !o.d || o.e > i2.maxE ? (u.e = NaN, u.d = null) : o.e < i2.minE ? (u.e = 0, u.d = [0]) : (u.e = o.e, u.d = o.d.slice()) : (u.e = o.e, u.d = o.d ? o.d.slice() : o.d);
          return;
        }
        if (l = typeof o, l === "number") {
          if (o === 0) {
            u.s = 1 / o < 0 ? -1 : 1, u.e = 0, u.d = [0];
            return;
          }
          if (o < 0 ? (o = -o, u.s = -1) : u.s = 1, o === ~~o && o < 1e7) {
            for (s2 = 0, a = o; a >= 10; a /= 10) s2++;
            x ? s2 > i2.maxE ? (u.e = NaN, u.d = null) : s2 < i2.minE ? (u.e = 0, u.d = [0]) : (u.e = s2, u.d = [o]) : (u.e = s2, u.d = [o]);
            return;
          } else if (o * 0 !== 0) {
            o || (u.s = NaN), u.e = NaN, u.d = null;
            return;
          }
          return Ci(u, o.toString());
        } else if (l !== "string") throw Error(Ke + o);
        return (a = o.charCodeAt(0)) === 45 ? (o = o.slice(1), u.s = -1) : (a === 43 && (o = o.slice(1)), u.s = 1), Rs.test(o) ? Ci(u, o) : Tc(u, o);
      }
      if (i2.prototype = m, i2.ROUND_UP = 0, i2.ROUND_DOWN = 1, i2.ROUND_CEIL = 2, i2.ROUND_FLOOR = 3, i2.ROUND_HALF_UP = 4, i2.ROUND_HALF_DOWN = 5, i2.ROUND_HALF_EVEN = 6, i2.ROUND_HALF_CEIL = 7, i2.ROUND_HALF_FLOOR = 8, i2.EUCLID = 9, i2.config = i2.set = $c, i2.clone = ks, i2.isDecimal = ws, i2.abs = Cc, i2.acos = Sc, i2.acosh = Ac, i2.add = Ic, i2.asin = Oc, i2.asinh = kc, i2.atan = Dc, i2.atanh = _c, i2.atan2 = Fc, i2.cbrt = Lc, i2.ceil = Nc, i2.clamp = Mc, i2.cos = qc, i2.cosh = jc, i2.div = Vc, i2.exp = Bc, i2.floor = Uc, i2.hypot = Gc, i2.ln = Qc, i2.log = Jc, i2.log10 = Hc, i2.log2 = Wc, i2.max = Kc, i2.min = zc, i2.mod = Yc, i2.mul = Zc, i2.pow = Xc, i2.random = ep, i2.round = tp, i2.sign = rp, i2.sin = np, i2.sinh = ip, i2.sqrt = op, i2.sub = sp, i2.sum = ap, i2.tan = lp, i2.tanh = up, i2.trunc = cp, e2 === void 0 && (e2 = {}), e2 && e2.defaults !== true) for (n = ["precision", "rounding", "toExpNeg", "toExpPos", "maxE", "minE", "modulo", "crypto"], t2 = 0; t2 < n.length; ) e2.hasOwnProperty(r2 = n[t2++]) || (e2[r2] = this[r2]);
      return i2.config(e2), i2;
    }
    function Vc(e2, t2) {
      return new this(e2).div(t2);
    }
    function Bc(e2) {
      return new this(e2).exp();
    }
    function Uc(e2) {
      return y(e2 = new this(e2), e2.e + 1, 3);
    }
    function Gc() {
      var e2, t2, r2 = new this(0);
      for (x = false, e2 = 0; e2 < arguments.length; ) if (t2 = new this(arguments[e2++]), t2.d) r2.d && (r2 = r2.plus(t2.times(t2)));
      else {
        if (t2.s) return x = true, new this(1 / 0);
        r2 = t2;
      }
      return x = true, r2.sqrt();
    }
    function ws(e2) {
      return e2 instanceof it || e2 && e2.toStringTag === Ts || false;
    }
    function Qc(e2) {
      return new this(e2).ln();
    }
    function Jc(e2, t2) {
      return new this(e2).log(t2);
    }
    function Wc(e2) {
      return new this(e2).log(2);
    }
    function Hc(e2) {
      return new this(e2).log(10);
    }
    function Kc() {
      return As(this, arguments, "lt");
    }
    function zc() {
      return As(this, arguments, "gt");
    }
    function Yc(e2, t2) {
      return new this(e2).mod(t2);
    }
    function Zc(e2, t2) {
      return new this(e2).mul(t2);
    }
    function Xc(e2, t2) {
      return new this(e2).pow(t2);
    }
    function ep(e2) {
      var t2, r2, n, i2, o = 0, s2 = new this(1), a = [];
      if (e2 === void 0 ? e2 = this.precision : ie(e2, 1, ze), n = Math.ceil(e2 / b), this.crypto) if (crypto.getRandomValues) for (t2 = crypto.getRandomValues(new Uint32Array(n)); o < n; ) i2 = t2[o], i2 >= 429e7 ? t2[o] = crypto.getRandomValues(new Uint32Array(1))[0] : a[o++] = i2 % 1e7;
      else if (crypto.randomBytes) {
        for (t2 = crypto.randomBytes(n *= 4); o < n; ) i2 = t2[o] + (t2[o + 1] << 8) + (t2[o + 2] << 16) + ((t2[o + 3] & 127) << 24), i2 >= 214e7 ? crypto.randomBytes(4).copy(t2, o) : (a.push(i2 % 1e7), o += 4);
        o = n / 4;
      } else throw Error(vs);
      else for (; o < n; ) a[o++] = Math.random() * 1e7 | 0;
      for (n = a[--o], e2 %= b, n && e2 && (i2 = G(10, b - e2), a[o] = (n / i2 | 0) * i2); a[o] === 0; o--) a.pop();
      if (o < 0) r2 = 0, a = [0];
      else {
        for (r2 = -1; a[0] === 0; r2 -= b) a.shift();
        for (n = 1, i2 = a[0]; i2 >= 10; i2 /= 10) n++;
        n < b && (r2 -= b - n);
      }
      return s2.e = r2, s2.d = a, s2;
    }
    function tp(e2) {
      return y(e2 = new this(e2), e2.e + 1, this.rounding);
    }
    function rp(e2) {
      return e2 = new this(e2), e2.d ? e2.d[0] ? e2.s : 0 * e2.s : e2.s || NaN;
    }
    function np(e2) {
      return new this(e2).sin();
    }
    function ip(e2) {
      return new this(e2).sinh();
    }
    function op(e2) {
      return new this(e2).sqrt();
    }
    function sp(e2, t2) {
      return new this(e2).sub(t2);
    }
    function ap() {
      var e2 = 0, t2 = arguments, r2 = new this(t2[e2]);
      for (x = false; r2.s && ++e2 < t2.length; ) r2 = r2.plus(t2[e2]);
      return x = true, y(r2, this.precision, this.rounding);
    }
    function lp(e2) {
      return new this(e2).tan();
    }
    function up(e2) {
      return new this(e2).tanh();
    }
    function cp(e2) {
      return y(e2 = new this(e2), e2.e + 1, 1);
    }
    m[Symbol.for("nodejs.util.inspect.custom")] = m.toString;
    m[Symbol.toStringTag] = "Decimal";
    var it = m.constructor = ks(vi);
    tn = new it(tn);
    rn = new it(rn);
    var xe = it;
    function wt(e2) {
      return e2 === null ? e2 : Array.isArray(e2) ? e2.map(wt) : typeof e2 == "object" ? pp(e2) ? dp(e2) : yt(e2, wt) : e2;
    }
    function pp(e2) {
      return e2 !== null && typeof e2 == "object" && typeof e2.$type == "string";
    }
    function dp({ $type: e2, value: t2 }) {
      switch (e2) {
        case "BigInt":
          return BigInt(t2);
        case "Bytes":
          return Buffer.from(t2, "base64");
        case "DateTime":
          return new Date(t2);
        case "Decimal":
          return new xe(t2);
        case "Json":
          return JSON.parse(t2);
        default:
          Fe(t2, "Unknown tagged value");
      }
    }
    function xt(e2) {
      return e2.substring(0, 1).toLowerCase() + e2.substring(1);
    }
    function Pt(e2) {
      return e2 instanceof Date || Object.prototype.toString.call(e2) === "[object Date]";
    }
    function ln(e2) {
      return e2.toString() !== "Invalid Date";
    }
    function vt(e2) {
      return it.isDecimal(e2) ? true : e2 !== null && typeof e2 == "object" && typeof e2.s == "number" && typeof e2.e == "number" && typeof e2.toFixed == "function" && Array.isArray(e2.d);
    }
    var Ms = k(fi());
    var Ns = k(require("fs"));
    var Ds = { keyword: De, entity: De, value: (e2) => H(rt(e2)), punctuation: rt, directive: De, function: De, variable: (e2) => H(rt(e2)), string: (e2) => H(qe(e2)), boolean: ke, number: De, comment: Gt };
    var mp = (e2) => e2;
    var un = {};
    var fp = 0;
    var P = { manual: un.Prism && un.Prism.manual, disableWorkerMessageHandler: un.Prism && un.Prism.disableWorkerMessageHandler, util: { encode: function(e2) {
      if (e2 instanceof he) {
        let t2 = e2;
        return new he(t2.type, P.util.encode(t2.content), t2.alias);
      } else return Array.isArray(e2) ? e2.map(P.util.encode) : e2.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ");
    }, type: function(e2) {
      return Object.prototype.toString.call(e2).slice(8, -1);
    }, objId: function(e2) {
      return e2.__id || Object.defineProperty(e2, "__id", { value: ++fp }), e2.__id;
    }, clone: function e2(t2, r2) {
      let n, i2, o = P.util.type(t2);
      switch (r2 = r2 || {}, o) {
        case "Object":
          if (i2 = P.util.objId(t2), r2[i2]) return r2[i2];
          n = {}, r2[i2] = n;
          for (let s2 in t2) t2.hasOwnProperty(s2) && (n[s2] = e2(t2[s2], r2));
          return n;
        case "Array":
          return i2 = P.util.objId(t2), r2[i2] ? r2[i2] : (n = [], r2[i2] = n, t2.forEach(function(s2, a) {
            n[a] = e2(s2, r2);
          }), n);
        default:
          return t2;
      }
    } }, languages: { extend: function(e2, t2) {
      let r2 = P.util.clone(P.languages[e2]);
      for (let n in t2) r2[n] = t2[n];
      return r2;
    }, insertBefore: function(e2, t2, r2, n) {
      n = n || P.languages;
      let i2 = n[e2], o = {};
      for (let a in i2) if (i2.hasOwnProperty(a)) {
        if (a == t2) for (let l in r2) r2.hasOwnProperty(l) && (o[l] = r2[l]);
        r2.hasOwnProperty(a) || (o[a] = i2[a]);
      }
      let s2 = n[e2];
      return n[e2] = o, P.languages.DFS(P.languages, function(a, l) {
        l === s2 && a != e2 && (this[a] = o);
      }), o;
    }, DFS: function e2(t2, r2, n, i2) {
      i2 = i2 || {};
      let o = P.util.objId;
      for (let s2 in t2) if (t2.hasOwnProperty(s2)) {
        r2.call(t2, s2, t2[s2], n || s2);
        let a = t2[s2], l = P.util.type(a);
        l === "Object" && !i2[o(a)] ? (i2[o(a)] = true, e2(a, r2, null, i2)) : l === "Array" && !i2[o(a)] && (i2[o(a)] = true, e2(a, r2, s2, i2));
      }
    } }, plugins: {}, highlight: function(e2, t2, r2) {
      let n = { code: e2, grammar: t2, language: r2 };
      return P.hooks.run("before-tokenize", n), n.tokens = P.tokenize(n.code, n.grammar), P.hooks.run("after-tokenize", n), he.stringify(P.util.encode(n.tokens), n.language);
    }, matchGrammar: function(e2, t2, r2, n, i2, o, s2) {
      for (let h2 in r2) {
        if (!r2.hasOwnProperty(h2) || !r2[h2]) continue;
        if (h2 == s2) return;
        let O = r2[h2];
        O = P.util.type(O) === "Array" ? O : [O];
        for (let T = 0; T < O.length; ++T) {
          let S2 = O[T], C = S2.inside, E = !!S2.lookbehind, me = !!S2.greedy, ae = 0, Bt = S2.alias;
          if (me && !S2.pattern.global) {
            let U = S2.pattern.toString().match(/[imuy]*$/)[0];
            S2.pattern = RegExp(S2.pattern.source, U + "g");
          }
          S2 = S2.pattern || S2;
          for (let U = n, ne = i2; U < t2.length; ne += t2[U].length, ++U) {
            let Ie = t2[U];
            if (t2.length > e2.length) return;
            if (Ie instanceof he) continue;
            if (me && U != t2.length - 1) {
              S2.lastIndex = ne;
              var p = S2.exec(e2);
              if (!p) break;
              var c = p.index + (E ? p[1].length : 0), d = p.index + p[0].length, a = U, l = ne;
              for (let _ = t2.length; a < _ && (l < d || !t2[a].type && !t2[a - 1].greedy); ++a) l += t2[a].length, c >= l && (++U, ne = l);
              if (t2[U] instanceof he) continue;
              u = a - U, Ie = e2.slice(ne, l), p.index -= ne;
            } else {
              S2.lastIndex = 0;
              var p = S2.exec(Ie), u = 1;
            }
            if (!p) {
              if (o) break;
              continue;
            }
            E && (ae = p[1] ? p[1].length : 0);
            var c = p.index + ae, p = p[0].slice(ae), d = c + p.length, f3 = Ie.slice(0, c), g = Ie.slice(d);
            let z = [U, u];
            f3 && (++U, ne += f3.length, z.push(f3));
            let dt = new he(h2, C ? P.tokenize(p, C) : p, Bt, p, me);
            if (z.push(dt), g && z.push(g), Array.prototype.splice.apply(t2, z), u != 1 && P.matchGrammar(e2, t2, r2, U, ne, true, h2), o) break;
          }
        }
      }
    }, tokenize: function(e2, t2) {
      let r2 = [e2], n = t2.rest;
      if (n) {
        for (let i2 in n) t2[i2] = n[i2];
        delete t2.rest;
      }
      return P.matchGrammar(e2, r2, t2, 0, 0, false), r2;
    }, hooks: { all: {}, add: function(e2, t2) {
      let r2 = P.hooks.all;
      r2[e2] = r2[e2] || [], r2[e2].push(t2);
    }, run: function(e2, t2) {
      let r2 = P.hooks.all[e2];
      if (!(!r2 || !r2.length)) for (var n = 0, i2; i2 = r2[n++]; ) i2(t2);
    } }, Token: he };
    P.languages.clike = { comment: [{ pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/, lookbehind: true }, { pattern: /(^|[^\\:])\/\/.*/, lookbehind: true, greedy: true }], string: { pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/, greedy: true }, "class-name": { pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i, lookbehind: true, inside: { punctuation: /[.\\]/ } }, keyword: /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/, boolean: /\b(?:true|false)\b/, function: /\w+(?=\()/, number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i, operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/, punctuation: /[{}[\];(),.:]/ };
    P.languages.javascript = P.languages.extend("clike", { "class-name": [P.languages.clike["class-name"], { pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/, lookbehind: true }], keyword: [{ pattern: /((?:^|})\s*)(?:catch|finally)\b/, lookbehind: true }, { pattern: /(^|[^.])\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/, lookbehind: true }], number: /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/, function: /[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/, operator: /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/ });
    P.languages.javascript["class-name"][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/;
    P.languages.insertBefore("javascript", "keyword", { regex: { pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyus]{0,6}(?=\s*($|[\r\n,.;})\]]))/, lookbehind: true, greedy: true }, "function-variable": { pattern: /[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/, alias: "function" }, parameter: [{ pattern: /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/, lookbehind: true, inside: P.languages.javascript }, { pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i, inside: P.languages.javascript }, { pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/, lookbehind: true, inside: P.languages.javascript }, { pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/, lookbehind: true, inside: P.languages.javascript }], constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/ });
    P.languages.markup && P.languages.markup.tag.addInlined("script", "javascript");
    P.languages.js = P.languages.javascript;
    P.languages.typescript = P.languages.extend("javascript", { keyword: /\b(?:abstract|as|async|await|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|is|keyof|let|module|namespace|new|null|of|package|private|protected|public|readonly|return|require|set|static|super|switch|this|throw|try|type|typeof|var|void|while|with|yield)\b/, builtin: /\b(?:string|Function|any|number|boolean|Array|symbol|console|Promise|unknown|never)\b/ });
    P.languages.ts = P.languages.typescript;
    function he(e2, t2, r2, n, i2) {
      this.type = e2, this.content = t2, this.alias = r2, this.length = (n || "").length | 0, this.greedy = !!i2;
    }
    he.stringify = function(e2, t2) {
      return typeof e2 == "string" ? e2 : Array.isArray(e2) ? e2.map(function(r2) {
        return he.stringify(r2, t2);
      }).join("") : gp(e2.type)(e2.content);
    };
    function gp(e2) {
      return Ds[e2] || mp;
    }
    function _s(e2) {
      return hp(e2, P.languages.javascript);
    }
    function hp(e2, t2) {
      return P.tokenize(e2, t2).map((n) => he.stringify(n)).join("");
    }
    var Fs = k(us());
    function Ls(e2) {
      return (0, Fs.default)(e2);
    }
    var cn = class e2 {
      static read(t2) {
        let r2;
        try {
          r2 = Ns.default.readFileSync(t2, "utf-8");
        } catch {
          return null;
        }
        return e2.fromContent(r2);
      }
      static fromContent(t2) {
        let r2 = t2.split(/\r?\n/);
        return new e2(1, r2);
      }
      constructor(t2, r2) {
        this.firstLineNumber = t2, this.lines = r2;
      }
      get lastLineNumber() {
        return this.firstLineNumber + this.lines.length - 1;
      }
      mapLineAt(t2, r2) {
        if (t2 < this.firstLineNumber || t2 > this.lines.length + this.firstLineNumber) return this;
        let n = t2 - this.firstLineNumber, i2 = [...this.lines];
        return i2[n] = r2(i2[n]), new e2(this.firstLineNumber, i2);
      }
      mapLines(t2) {
        return new e2(this.firstLineNumber, this.lines.map((r2, n) => t2(r2, this.firstLineNumber + n)));
      }
      lineAt(t2) {
        return this.lines[t2 - this.firstLineNumber];
      }
      prependSymbolAt(t2, r2) {
        return this.mapLines((n, i2) => i2 === t2 ? `${r2} ${n}` : `  ${n}`);
      }
      slice(t2, r2) {
        let n = this.lines.slice(t2 - 1, r2).join(`
`);
        return new e2(t2, Ls(n).split(`
`));
      }
      highlight() {
        let t2 = _s(this.toString());
        return new e2(this.firstLineNumber, t2.split(`
`));
      }
      toString() {
        return this.lines.join(`
`);
      }
    };
    var yp = { red: ce, gray: Gt, dim: Oe, bold: H, underline: X, highlightSource: (e2) => e2.highlight() };
    var bp = { red: (e2) => e2, gray: (e2) => e2, dim: (e2) => e2, bold: (e2) => e2, underline: (e2) => e2, highlightSource: (e2) => e2 };
    function Ep({ message: e2, originalMethod: t2, isPanic: r2, callArguments: n }) {
      return { functionName: `prisma.${t2}()`, message: e2, isPanic: r2 ?? false, callArguments: n };
    }
    function wp({ callsite: e2, message: t2, originalMethod: r2, isPanic: n, callArguments: i2 }, o) {
      let s2 = Ep({ message: t2, originalMethod: r2, isPanic: n, callArguments: i2 });
      if (!e2 || typeof window < "u" || process.env.NODE_ENV === "production") return s2;
      let a = e2.getLocation();
      if (!a || !a.lineNumber || !a.columnNumber) return s2;
      let l = Math.max(1, a.lineNumber - 3), u = cn.read(a.fileName)?.slice(l, a.lineNumber), c = u?.lineAt(a.lineNumber);
      if (u && c) {
        let p = Pp(c), d = xp(c);
        if (!d) return s2;
        s2.functionName = `${d.code})`, s2.location = a, n || (u = u.mapLineAt(a.lineNumber, (g) => g.slice(0, d.openingBraceIndex))), u = o.highlightSource(u);
        let f3 = String(u.lastLineNumber).length;
        if (s2.contextLines = u.mapLines((g, h2) => o.gray(String(h2).padStart(f3)) + " " + g).mapLines((g) => o.dim(g)).prependSymbolAt(a.lineNumber, o.bold(o.red("\u2192"))), i2) {
          let g = p + f3 + 1;
          g += 2, s2.callArguments = (0, Ms.default)(i2, g).slice(g);
        }
      }
      return s2;
    }
    function xp(e2) {
      let t2 = Object.keys(Je.ModelAction).join("|"), n = new RegExp(String.raw`\.(${t2})\(`).exec(e2);
      if (n) {
        let i2 = n.index + n[0].length, o = e2.lastIndexOf(" ", n.index) + 1;
        return { code: e2.slice(o, i2), openingBraceIndex: i2 };
      }
      return null;
    }
    function Pp(e2) {
      let t2 = 0;
      for (let r2 = 0; r2 < e2.length; r2++) {
        if (e2.charAt(r2) !== " ") return t2;
        t2++;
      }
      return t2;
    }
    function vp({ functionName: e2, location: t2, message: r2, isPanic: n, contextLines: i2, callArguments: o }, s2) {
      let a = [""], l = t2 ? " in" : ":";
      if (n ? (a.push(s2.red(`Oops, an unknown error occurred! This is ${s2.bold("on us")}, you did nothing wrong.`)), a.push(s2.red(`It occurred in the ${s2.bold(`\`${e2}\``)} invocation${l}`))) : a.push(s2.red(`Invalid ${s2.bold(`\`${e2}\``)} invocation${l}`)), t2 && a.push(s2.underline(Tp(t2))), i2) {
        a.push("");
        let u = [i2.toString()];
        o && (u.push(o), u.push(s2.dim(")"))), a.push(u.join("")), o && a.push("");
      } else a.push(""), o && a.push(o), a.push("");
      return a.push(r2), a.join(`
`);
    }
    function Tp(e2) {
      let t2 = [e2.fileName];
      return e2.lineNumber && t2.push(String(e2.lineNumber)), e2.columnNumber && t2.push(String(e2.columnNumber)), t2.join(":");
    }
    function Tt(e2) {
      let t2 = e2.showColors ? yp : bp, r2;
      return r2 = wp(e2, t2), vp(r2, t2);
    }
    var Gs = k(Ai());
    function Vs(e2, t2, r2) {
      let n = Bs(e2), i2 = Rp(n), o = Sp(i2);
      o ? pn(o, t2, r2) : t2.addErrorMessage(() => "Unknown error");
    }
    function Bs(e2) {
      return e2.errors.flatMap((t2) => t2.kind === "Union" ? Bs(t2) : [t2]);
    }
    function Rp(e2) {
      let t2 = /* @__PURE__ */ new Map(), r2 = [];
      for (let n of e2) {
        if (n.kind !== "InvalidArgumentType") {
          r2.push(n);
          continue;
        }
        let i2 = `${n.selectionPath.join(".")}:${n.argumentPath.join(".")}`, o = t2.get(i2);
        o ? t2.set(i2, { ...n, argument: { ...n.argument, typeNames: Cp(o.argument.typeNames, n.argument.typeNames) } }) : t2.set(i2, n);
      }
      return r2.push(...t2.values()), r2;
    }
    function Cp(e2, t2) {
      return [...new Set(e2.concat(t2))];
    }
    function Sp(e2) {
      return xi(e2, (t2, r2) => {
        let n = qs(t2), i2 = qs(r2);
        return n !== i2 ? n - i2 : js(t2) - js(r2);
      });
    }
    function qs(e2) {
      let t2 = 0;
      return Array.isArray(e2.selectionPath) && (t2 += e2.selectionPath.length), Array.isArray(e2.argumentPath) && (t2 += e2.argumentPath.length), t2;
    }
    function js(e2) {
      switch (e2.kind) {
        case "InvalidArgumentValue":
        case "ValueTooLarge":
          return 20;
        case "InvalidArgumentType":
          return 10;
        case "RequiredArgumentMissing":
          return -10;
        default:
          return 0;
      }
    }
    var ue = class {
      constructor(t2, r2) {
        this.name = t2;
        this.value = r2;
        this.isRequired = false;
      }
      makeRequired() {
        return this.isRequired = true, this;
      }
      write(t2) {
        let { colors: { green: r2 } } = t2.context;
        t2.addMarginSymbol(r2(this.isRequired ? "+" : "?")), t2.write(r2(this.name)), this.isRequired || t2.write(r2("?")), t2.write(r2(": ")), typeof this.value == "string" ? t2.write(r2(this.value)) : t2.write(this.value);
      }
    };
    var Rt = class {
      constructor(t2 = 0, r2) {
        this.context = r2;
        this.lines = [];
        this.currentLine = "";
        this.currentIndent = 0;
        this.currentIndent = t2;
      }
      write(t2) {
        return typeof t2 == "string" ? this.currentLine += t2 : t2.write(this), this;
      }
      writeJoined(t2, r2, n = (i2, o) => o.write(i2)) {
        let i2 = r2.length - 1;
        for (let o = 0; o < r2.length; o++) n(r2[o], this), o !== i2 && this.write(t2);
        return this;
      }
      writeLine(t2) {
        return this.write(t2).newLine();
      }
      newLine() {
        this.lines.push(this.indentedCurrentLine()), this.currentLine = "", this.marginSymbol = void 0;
        let t2 = this.afterNextNewLineCallback;
        return this.afterNextNewLineCallback = void 0, t2?.(), this;
      }
      withIndent(t2) {
        return this.indent(), t2(this), this.unindent(), this;
      }
      afterNextNewline(t2) {
        return this.afterNextNewLineCallback = t2, this;
      }
      indent() {
        return this.currentIndent++, this;
      }
      unindent() {
        return this.currentIndent > 0 && this.currentIndent--, this;
      }
      addMarginSymbol(t2) {
        return this.marginSymbol = t2, this;
      }
      toString() {
        return this.lines.concat(this.indentedCurrentLine()).join(`
`);
      }
      getCurrentLineLength() {
        return this.currentLine.length;
      }
      indentedCurrentLine() {
        let t2 = this.currentLine.padStart(this.currentLine.length + 2 * this.currentIndent);
        return this.marginSymbol ? this.marginSymbol + t2.slice(1) : t2;
      }
    };
    var dn = class {
      constructor(t2) {
        this.value = t2;
      }
      write(t2) {
        t2.write(this.value);
      }
      markAsError() {
        this.value.markAsError();
      }
    };
    var mn = (e2) => e2;
    var fn = { bold: mn, red: mn, green: mn, dim: mn, enabled: false };
    var Us = { bold: H, red: ce, green: qe, dim: Oe, enabled: true };
    var Ct = { write(e2) {
      e2.writeLine(",");
    } };
    var Pe = class {
      constructor(t2) {
        this.contents = t2;
        this.isUnderlined = false;
        this.color = (t3) => t3;
      }
      underline() {
        return this.isUnderlined = true, this;
      }
      setColor(t2) {
        return this.color = t2, this;
      }
      write(t2) {
        let r2 = t2.getCurrentLineLength();
        t2.write(this.color(this.contents)), this.isUnderlined && t2.afterNextNewline(() => {
          t2.write(" ".repeat(r2)).writeLine(this.color("~".repeat(this.contents.length)));
        });
      }
    };
    var Ye = class {
      constructor() {
        this.hasError = false;
      }
      markAsError() {
        return this.hasError = true, this;
      }
    };
    var St = class extends Ye {
      constructor() {
        super(...arguments);
        this.items = [];
      }
      addItem(r2) {
        return this.items.push(new dn(r2)), this;
      }
      getField(r2) {
        return this.items[r2];
      }
      getPrintWidth() {
        return this.items.length === 0 ? 2 : Math.max(...this.items.map((n) => n.value.getPrintWidth())) + 2;
      }
      write(r2) {
        if (this.items.length === 0) {
          this.writeEmpty(r2);
          return;
        }
        this.writeWithItems(r2);
      }
      writeEmpty(r2) {
        let n = new Pe("[]");
        this.hasError && n.setColor(r2.context.colors.red).underline(), r2.write(n);
      }
      writeWithItems(r2) {
        let { colors: n } = r2.context;
        r2.writeLine("[").withIndent(() => r2.writeJoined(Ct, this.items).newLine()).write("]"), this.hasError && r2.afterNextNewline(() => {
          r2.writeLine(n.red("~".repeat(this.getPrintWidth())));
        });
      }
      asObject() {
      }
    };
    var At = class e2 extends Ye {
      constructor() {
        super(...arguments);
        this.fields = {};
        this.suggestions = [];
      }
      addField(r2) {
        this.fields[r2.name] = r2;
      }
      addSuggestion(r2) {
        this.suggestions.push(r2);
      }
      getField(r2) {
        return this.fields[r2];
      }
      getDeepField(r2) {
        let [n, ...i2] = r2, o = this.getField(n);
        if (!o) return;
        let s2 = o;
        for (let a of i2) {
          let l;
          if (s2.value instanceof e2 ? l = s2.value.getField(a) : s2.value instanceof St && (l = s2.value.getField(Number(a))), !l) return;
          s2 = l;
        }
        return s2;
      }
      getDeepFieldValue(r2) {
        return r2.length === 0 ? this : this.getDeepField(r2)?.value;
      }
      hasField(r2) {
        return !!this.getField(r2);
      }
      removeAllFields() {
        this.fields = {};
      }
      removeField(r2) {
        delete this.fields[r2];
      }
      getFields() {
        return this.fields;
      }
      isEmpty() {
        return Object.keys(this.fields).length === 0;
      }
      getFieldValue(r2) {
        return this.getField(r2)?.value;
      }
      getDeepSubSelectionValue(r2) {
        let n = this;
        for (let i2 of r2) {
          if (!(n instanceof e2)) return;
          let o = n.getSubSelectionValue(i2);
          if (!o) return;
          n = o;
        }
        return n;
      }
      getDeepSelectionParent(r2) {
        let n = this.getSelectionParent();
        if (!n) return;
        let i2 = n;
        for (let o of r2) {
          let s2 = i2.value.getFieldValue(o);
          if (!s2 || !(s2 instanceof e2)) return;
          let a = s2.getSelectionParent();
          if (!a) return;
          i2 = a;
        }
        return i2;
      }
      getSelectionParent() {
        let r2 = this.getField("select")?.value.asObject();
        if (r2) return { kind: "select", value: r2 };
        let n = this.getField("include")?.value.asObject();
        if (n) return { kind: "include", value: n };
      }
      getSubSelectionValue(r2) {
        return this.getSelectionParent()?.value.fields[r2].value;
      }
      getPrintWidth() {
        let r2 = Object.values(this.fields);
        return r2.length == 0 ? 2 : Math.max(...r2.map((i2) => i2.getPrintWidth())) + 2;
      }
      write(r2) {
        let n = Object.values(this.fields);
        if (n.length === 0 && this.suggestions.length === 0) {
          this.writeEmpty(r2);
          return;
        }
        this.writeWithContents(r2, n);
      }
      asObject() {
        return this;
      }
      writeEmpty(r2) {
        let n = new Pe("{}");
        this.hasError && n.setColor(r2.context.colors.red).underline(), r2.write(n);
      }
      writeWithContents(r2, n) {
        r2.writeLine("{").withIndent(() => {
          r2.writeJoined(Ct, [...n, ...this.suggestions]).newLine();
        }), r2.write("}"), this.hasError && r2.afterNextNewline(() => {
          r2.writeLine(r2.context.colors.red("~".repeat(this.getPrintWidth())));
        });
      }
    };
    var W = class extends Ye {
      constructor(r2) {
        super();
        this.text = r2;
      }
      getPrintWidth() {
        return this.text.length;
      }
      write(r2) {
        let n = new Pe(this.text);
        this.hasError && n.underline().setColor(r2.context.colors.red), r2.write(n);
      }
      asObject() {
      }
    };
    var nr = class {
      constructor() {
        this.fields = [];
      }
      addField(t2, r2) {
        return this.fields.push({ write(n) {
          let { green: i2, dim: o } = n.context.colors;
          n.write(i2(o(`${t2}: ${r2}`))).addMarginSymbol(i2(o("+")));
        } }), this;
      }
      write(t2) {
        let { colors: { green: r2 } } = t2.context;
        t2.writeLine(r2("{")).withIndent(() => {
          t2.writeJoined(Ct, this.fields).newLine();
        }).write(r2("}")).addMarginSymbol(r2("+"));
      }
    };
    function pn(e2, t2, r2) {
      switch (e2.kind) {
        case "MutuallyExclusiveFields":
          Ip(e2, t2);
          break;
        case "IncludeOnScalar":
          Op(e2, t2);
          break;
        case "EmptySelection":
          kp(e2, t2, r2);
          break;
        case "UnknownSelectionField":
          Lp(e2, t2);
          break;
        case "InvalidSelectionValue":
          Np(e2, t2);
          break;
        case "UnknownArgument":
          Mp(e2, t2);
          break;
        case "UnknownInputField":
          $p(e2, t2);
          break;
        case "RequiredArgumentMissing":
          qp(e2, t2);
          break;
        case "InvalidArgumentType":
          jp(e2, t2);
          break;
        case "InvalidArgumentValue":
          Vp(e2, t2);
          break;
        case "ValueTooLarge":
          Bp(e2, t2);
          break;
        case "SomeFieldsMissing":
          Up(e2, t2);
          break;
        case "TooManyFieldsGiven":
          Gp(e2, t2);
          break;
        case "Union":
          Vs(e2, t2, r2);
          break;
        default:
          throw new Error("not implemented: " + e2.kind);
      }
    }
    function Ip(e2, t2) {
      let r2 = t2.arguments.getDeepSubSelectionValue(e2.selectionPath)?.asObject();
      r2 && (r2.getField(e2.firstField)?.markAsError(), r2.getField(e2.secondField)?.markAsError()), t2.addErrorMessage((n) => `Please ${n.bold("either")} use ${n.green(`\`${e2.firstField}\``)} or ${n.green(`\`${e2.secondField}\``)}, but ${n.red("not both")} at the same time.`);
    }
    function Op(e2, t2) {
      let [r2, n] = ir(e2.selectionPath), i2 = e2.outputType, o = t2.arguments.getDeepSelectionParent(r2)?.value;
      if (o && (o.getField(n)?.markAsError(), i2)) for (let s2 of i2.fields) s2.isRelation && o.addSuggestion(new ue(s2.name, "true"));
      t2.addErrorMessage((s2) => {
        let a = `Invalid scalar field ${s2.red(`\`${n}\``)} for ${s2.bold("include")} statement`;
        return i2 ? a += ` on model ${s2.bold(i2.name)}. ${or(s2)}` : a += ".", a += `
Note that ${s2.bold("include")} statements only accept relation fields.`, a;
      });
    }
    function kp(e2, t2, r2) {
      let n = t2.arguments.getDeepSubSelectionValue(e2.selectionPath)?.asObject();
      if (n) {
        let i2 = n.getField("omit")?.value.asObject();
        if (i2) {
          Dp(e2, t2, i2);
          return;
        }
        if (n.hasField("select")) {
          _p(e2, t2);
          return;
        }
      }
      if (r2?.[xt(e2.outputType.name)]) {
        Fp(e2, t2);
        return;
      }
      t2.addErrorMessage(() => `Unknown field at "${e2.selectionPath.join(".")} selection"`);
    }
    function Dp(e2, t2, r2) {
      r2.removeAllFields();
      for (let n of e2.outputType.fields) r2.addSuggestion(new ue(n.name, "false"));
      t2.addErrorMessage((n) => `The ${n.red("omit")} statement includes every field of the model ${n.bold(e2.outputType.name)}. At least one field must be included in the result`);
    }
    function _p(e2, t2) {
      let r2 = e2.outputType, n = t2.arguments.getDeepSelectionParent(e2.selectionPath)?.value, i2 = n?.isEmpty() ?? false;
      n && (n.removeAllFields(), Ws(n, r2)), t2.addErrorMessage((o) => i2 ? `The ${o.red("`select`")} statement for type ${o.bold(r2.name)} must not be empty. ${or(o)}` : `The ${o.red("`select`")} statement for type ${o.bold(r2.name)} needs ${o.bold("at least one truthy value")}.`);
    }
    function Fp(e2, t2) {
      let r2 = new nr();
      for (let i2 of e2.outputType.fields) i2.isRelation || r2.addField(i2.name, "false");
      let n = new ue("omit", r2).makeRequired();
      if (e2.selectionPath.length === 0) t2.arguments.addSuggestion(n);
      else {
        let [i2, o] = ir(e2.selectionPath), a = t2.arguments.getDeepSelectionParent(i2)?.value.asObject()?.getField(o);
        if (a) {
          let l = a?.value.asObject() ?? new At();
          l.addSuggestion(n), a.value = l;
        }
      }
      t2.addErrorMessage((i2) => `The global ${i2.red("omit")} configuration excludes every field of the model ${i2.bold(e2.outputType.name)}. At least one field must be included in the result`);
    }
    function Lp(e2, t2) {
      let r2 = Hs(e2.selectionPath, t2);
      if (r2.parentKind !== "unknown") {
        r2.field.markAsError();
        let n = r2.parent;
        switch (r2.parentKind) {
          case "select":
            Ws(n, e2.outputType);
            break;
          case "include":
            Qp(n, e2.outputType);
            break;
          case "omit":
            Jp(n, e2.outputType);
            break;
        }
      }
      t2.addErrorMessage((n) => {
        let i2 = [`Unknown field ${n.red(`\`${r2.fieldName}\``)}`];
        return r2.parentKind !== "unknown" && i2.push(`for ${n.bold(r2.parentKind)} statement`), i2.push(`on model ${n.bold(`\`${e2.outputType.name}\``)}.`), i2.push(or(n)), i2.join(" ");
      });
    }
    function Np(e2, t2) {
      let r2 = Hs(e2.selectionPath, t2);
      r2.parentKind !== "unknown" && r2.field.value.markAsError(), t2.addErrorMessage((n) => `Invalid value for selection field \`${n.red(r2.fieldName)}\`: ${e2.underlyingError}`);
    }
    function Mp(e2, t2) {
      let r2 = e2.argumentPath[0], n = t2.arguments.getDeepSubSelectionValue(e2.selectionPath)?.asObject();
      n && (n.getField(r2)?.markAsError(), Wp(n, e2.arguments)), t2.addErrorMessage((i2) => Qs(i2, r2, e2.arguments.map((o) => o.name)));
    }
    function $p(e2, t2) {
      let [r2, n] = ir(e2.argumentPath), i2 = t2.arguments.getDeepSubSelectionValue(e2.selectionPath)?.asObject();
      if (i2) {
        i2.getDeepField(e2.argumentPath)?.markAsError();
        let o = i2.getDeepFieldValue(r2)?.asObject();
        o && Ks(o, e2.inputType);
      }
      t2.addErrorMessage((o) => Qs(o, n, e2.inputType.fields.map((s2) => s2.name)));
    }
    function Qs(e2, t2, r2) {
      let n = [`Unknown argument \`${e2.red(t2)}\`.`], i2 = Kp(t2, r2);
      return i2 && n.push(`Did you mean \`${e2.green(i2)}\`?`), r2.length > 0 && n.push(or(e2)), n.join(" ");
    }
    function qp(e2, t2) {
      let r2;
      t2.addErrorMessage((l) => r2?.value instanceof W && r2.value.text === "null" ? `Argument \`${l.green(o)}\` must not be ${l.red("null")}.` : `Argument \`${l.green(o)}\` is missing.`);
      let n = t2.arguments.getDeepSubSelectionValue(e2.selectionPath)?.asObject();
      if (!n) return;
      let [i2, o] = ir(e2.argumentPath), s2 = new nr(), a = n.getDeepFieldValue(i2)?.asObject();
      if (a) if (r2 = a.getField(o), r2 && a.removeField(o), e2.inputTypes.length === 1 && e2.inputTypes[0].kind === "object") {
        for (let l of e2.inputTypes[0].fields) s2.addField(l.name, l.typeNames.join(" | "));
        a.addSuggestion(new ue(o, s2).makeRequired());
      } else {
        let l = e2.inputTypes.map(Js).join(" | ");
        a.addSuggestion(new ue(o, l).makeRequired());
      }
    }
    function Js(e2) {
      return e2.kind === "list" ? `${Js(e2.elementType)}[]` : e2.name;
    }
    function jp(e2, t2) {
      let r2 = e2.argument.name, n = t2.arguments.getDeepSubSelectionValue(e2.selectionPath)?.asObject();
      n && n.getDeepFieldValue(e2.argumentPath)?.markAsError(), t2.addErrorMessage((i2) => {
        let o = gn("or", e2.argument.typeNames.map((s2) => i2.green(s2)));
        return `Argument \`${i2.bold(r2)}\`: Invalid value provided. Expected ${o}, provided ${i2.red(e2.inferredType)}.`;
      });
    }
    function Vp(e2, t2) {
      let r2 = e2.argument.name, n = t2.arguments.getDeepSubSelectionValue(e2.selectionPath)?.asObject();
      n && n.getDeepFieldValue(e2.argumentPath)?.markAsError(), t2.addErrorMessage((i2) => {
        let o = [`Invalid value for argument \`${i2.bold(r2)}\``];
        if (e2.underlyingError && o.push(`: ${e2.underlyingError}`), o.push("."), e2.argument.typeNames.length > 0) {
          let s2 = gn("or", e2.argument.typeNames.map((a) => i2.green(a)));
          o.push(` Expected ${s2}.`);
        }
        return o.join("");
      });
    }
    function Bp(e2, t2) {
      let r2 = e2.argument.name, n = t2.arguments.getDeepSubSelectionValue(e2.selectionPath)?.asObject(), i2;
      if (n) {
        let s2 = n.getDeepField(e2.argumentPath)?.value;
        s2?.markAsError(), s2 instanceof W && (i2 = s2.text);
      }
      t2.addErrorMessage((o) => {
        let s2 = ["Unable to fit value"];
        return i2 && s2.push(o.red(i2)), s2.push(`into a 64-bit signed integer for field \`${o.bold(r2)}\``), s2.join(" ");
      });
    }
    function Up(e2, t2) {
      let r2 = e2.argumentPath[e2.argumentPath.length - 1], n = t2.arguments.getDeepSubSelectionValue(e2.selectionPath)?.asObject();
      if (n) {
        let i2 = n.getDeepFieldValue(e2.argumentPath)?.asObject();
        i2 && Ks(i2, e2.inputType);
      }
      t2.addErrorMessage((i2) => {
        let o = [`Argument \`${i2.bold(r2)}\` of type ${i2.bold(e2.inputType.name)} needs`];
        return e2.constraints.minFieldCount === 1 ? e2.constraints.requiredFields ? o.push(`${i2.green("at least one of")} ${gn("or", e2.constraints.requiredFields.map((s2) => `\`${i2.bold(s2)}\``))} arguments.`) : o.push(`${i2.green("at least one")} argument.`) : o.push(`${i2.green(`at least ${e2.constraints.minFieldCount}`)} arguments.`), o.push(or(i2)), o.join(" ");
      });
    }
    function Gp(e2, t2) {
      let r2 = e2.argumentPath[e2.argumentPath.length - 1], n = t2.arguments.getDeepSubSelectionValue(e2.selectionPath)?.asObject(), i2 = [];
      if (n) {
        let o = n.getDeepFieldValue(e2.argumentPath)?.asObject();
        o && (o.markAsError(), i2 = Object.keys(o.getFields()));
      }
      t2.addErrorMessage((o) => {
        let s2 = [`Argument \`${o.bold(r2)}\` of type ${o.bold(e2.inputType.name)} needs`];
        return e2.constraints.minFieldCount === 1 && e2.constraints.maxFieldCount == 1 ? s2.push(`${o.green("exactly one")} argument,`) : e2.constraints.maxFieldCount == 1 ? s2.push(`${o.green("at most one")} argument,`) : s2.push(`${o.green(`at most ${e2.constraints.maxFieldCount}`)} arguments,`), s2.push(`but you provided ${gn("and", i2.map((a) => o.red(a)))}. Please choose`), e2.constraints.maxFieldCount === 1 ? s2.push("one.") : s2.push(`${e2.constraints.maxFieldCount}.`), s2.join(" ");
      });
    }
    function Ws(e2, t2) {
      for (let r2 of t2.fields) e2.hasField(r2.name) || e2.addSuggestion(new ue(r2.name, "true"));
    }
    function Qp(e2, t2) {
      for (let r2 of t2.fields) r2.isRelation && !e2.hasField(r2.name) && e2.addSuggestion(new ue(r2.name, "true"));
    }
    function Jp(e2, t2) {
      for (let r2 of t2.fields) !e2.hasField(r2.name) && !r2.isRelation && e2.addSuggestion(new ue(r2.name, "true"));
    }
    function Wp(e2, t2) {
      for (let r2 of t2) e2.hasField(r2.name) || e2.addSuggestion(new ue(r2.name, r2.typeNames.join(" | ")));
    }
    function Hs(e2, t2) {
      let [r2, n] = ir(e2), i2 = t2.arguments.getDeepSubSelectionValue(r2)?.asObject();
      if (!i2) return { parentKind: "unknown", fieldName: n };
      let o = i2.getFieldValue("select")?.asObject(), s2 = i2.getFieldValue("include")?.asObject(), a = i2.getFieldValue("omit")?.asObject(), l = o?.getField(n);
      return o && l ? { parentKind: "select", parent: o, field: l, fieldName: n } : (l = s2?.getField(n), s2 && l ? { parentKind: "include", field: l, parent: s2, fieldName: n } : (l = a?.getField(n), a && l ? { parentKind: "omit", field: l, parent: a, fieldName: n } : { parentKind: "unknown", fieldName: n }));
    }
    function Ks(e2, t2) {
      if (t2.kind === "object") for (let r2 of t2.fields) e2.hasField(r2.name) || e2.addSuggestion(new ue(r2.name, r2.typeNames.join(" | ")));
    }
    function ir(e2) {
      let t2 = [...e2], r2 = t2.pop();
      if (!r2) throw new Error("unexpected empty path");
      return [t2, r2];
    }
    function or({ green: e2, enabled: t2 }) {
      return "Available options are " + (t2 ? `listed in ${e2("green")}` : "marked with ?") + ".";
    }
    function gn(e2, t2) {
      if (t2.length === 1) return t2[0];
      let r2 = [...t2], n = r2.pop();
      return `${r2.join(", ")} ${e2} ${n}`;
    }
    var Hp = 3;
    function Kp(e2, t2) {
      let r2 = 1 / 0, n;
      for (let i2 of t2) {
        let o = (0, Gs.default)(e2, i2);
        o > Hp || o < r2 && (r2 = o, n = i2);
      }
      return n;
    }
    function zs(e2) {
      return e2.substring(0, 1).toLowerCase() + e2.substring(1);
    }
    var sr = class {
      constructor(t2, r2, n, i2, o) {
        this.modelName = t2, this.name = r2, this.typeName = n, this.isList = i2, this.isEnum = o;
      }
      _toGraphQLInputType() {
        let t2 = this.isList ? "List" : "", r2 = this.isEnum ? "Enum" : "";
        return `${t2}${r2}${this.typeName}FieldRefInput<${this.modelName}>`;
      }
    };
    function It(e2) {
      return e2 instanceof sr;
    }
    var hn = Symbol();
    var Ii = /* @__PURE__ */ new WeakMap();
    var Me = class {
      constructor(t2) {
        t2 === hn ? Ii.set(this, `Prisma.${this._getName()}`) : Ii.set(this, `new Prisma.${this._getNamespace()}.${this._getName()}()`);
      }
      _getName() {
        return this.constructor.name;
      }
      toString() {
        return Ii.get(this);
      }
    };
    var ar = class extends Me {
      _getNamespace() {
        return "NullTypes";
      }
    };
    var lr = class extends ar {
    };
    Oi(lr, "DbNull");
    var ur = class extends ar {
    };
    Oi(ur, "JsonNull");
    var cr = class extends ar {
    };
    Oi(cr, "AnyNull");
    var yn = { classes: { DbNull: lr, JsonNull: ur, AnyNull: cr }, instances: { DbNull: new lr(hn), JsonNull: new ur(hn), AnyNull: new cr(hn) } };
    function Oi(e2, t2) {
      Object.defineProperty(e2, "name", { value: t2, configurable: true });
    }
    var Ys = ": ";
    var bn = class {
      constructor(t2, r2) {
        this.name = t2;
        this.value = r2;
        this.hasError = false;
      }
      markAsError() {
        this.hasError = true;
      }
      getPrintWidth() {
        return this.name.length + this.value.getPrintWidth() + Ys.length;
      }
      write(t2) {
        let r2 = new Pe(this.name);
        this.hasError && r2.underline().setColor(t2.context.colors.red), t2.write(r2).write(Ys).write(this.value);
      }
    };
    var ki = class {
      constructor(t2) {
        this.errorMessages = [];
        this.arguments = t2;
      }
      write(t2) {
        t2.write(this.arguments);
      }
      addErrorMessage(t2) {
        this.errorMessages.push(t2);
      }
      renderAllMessages(t2) {
        return this.errorMessages.map((r2) => r2(t2)).join(`
`);
      }
    };
    function Ot(e2) {
      return new ki(Zs(e2));
    }
    function Zs(e2) {
      let t2 = new At();
      for (let [r2, n] of Object.entries(e2)) {
        let i2 = new bn(r2, Xs(n));
        t2.addField(i2);
      }
      return t2;
    }
    function Xs(e2) {
      if (typeof e2 == "string") return new W(JSON.stringify(e2));
      if (typeof e2 == "number" || typeof e2 == "boolean") return new W(String(e2));
      if (typeof e2 == "bigint") return new W(`${e2}n`);
      if (e2 === null) return new W("null");
      if (e2 === void 0) return new W("undefined");
      if (vt(e2)) return new W(`new Prisma.Decimal("${e2.toFixed()}")`);
      if (e2 instanceof Uint8Array) return Buffer.isBuffer(e2) ? new W(`Buffer.alloc(${e2.byteLength})`) : new W(`new Uint8Array(${e2.byteLength})`);
      if (e2 instanceof Date) {
        let t2 = ln(e2) ? e2.toISOString() : "Invalid Date";
        return new W(`new Date("${t2}")`);
      }
      return e2 instanceof Me ? new W(`Prisma.${e2._getName()}`) : It(e2) ? new W(`prisma.${zs(e2.modelName)}.$fields.${e2.name}`) : Array.isArray(e2) ? zp(e2) : typeof e2 == "object" ? Zs(e2) : new W(Object.prototype.toString.call(e2));
    }
    function zp(e2) {
      let t2 = new St();
      for (let r2 of e2) t2.addItem(Xs(r2));
      return t2;
    }
    function En(e2, t2) {
      let r2 = t2 === "pretty" ? Us : fn, n = e2.renderAllMessages(r2), i2 = new Rt(0, { colors: r2 }).write(e2).toString();
      return { message: n, args: i2 };
    }
    function wn({ args: e2, errors: t2, errorFormat: r2, callsite: n, originalMethod: i2, clientVersion: o, globalOmit: s2 }) {
      let a = Ot(e2);
      for (let p of t2) pn(p, a, s2);
      let { message: l, args: u } = En(a, r2), c = Tt({ message: l, callsite: n, originalMethod: i2, showColors: r2 === "pretty", callArguments: u });
      throw new J(c, { clientVersion: o });
    }
    var ve = class {
      constructor() {
        this._map = /* @__PURE__ */ new Map();
      }
      get(t2) {
        return this._map.get(t2)?.value;
      }
      set(t2, r2) {
        this._map.set(t2, { value: r2 });
      }
      getOrCreate(t2, r2) {
        let n = this._map.get(t2);
        if (n) return n.value;
        let i2 = r2();
        return this.set(t2, i2), i2;
      }
    };
    function pr(e2) {
      let t2;
      return { get() {
        return t2 || (t2 = { value: e2() }), t2.value;
      } };
    }
    function Te(e2) {
      return e2.replace(/^./, (t2) => t2.toLowerCase());
    }
    function ta(e2, t2, r2) {
      let n = Te(r2);
      return !t2.result || !(t2.result.$allModels || t2.result[n]) ? e2 : Yp({ ...e2, ...ea(t2.name, e2, t2.result.$allModels), ...ea(t2.name, e2, t2.result[n]) });
    }
    function Yp(e2) {
      let t2 = new ve(), r2 = (n, i2) => t2.getOrCreate(n, () => i2.has(n) ? [n] : (i2.add(n), e2[n] ? e2[n].needs.flatMap((o) => r2(o, i2)) : [n]));
      return yt(e2, (n) => ({ ...n, needs: r2(n.name, /* @__PURE__ */ new Set()) }));
    }
    function ea(e2, t2, r2) {
      return r2 ? yt(r2, ({ needs: n, compute: i2 }, o) => ({ name: o, needs: n ? Object.keys(n).filter((s2) => n[s2]) : [], compute: Zp(t2, o, i2) })) : {};
    }
    function Zp(e2, t2, r2) {
      let n = e2?.[t2]?.compute;
      return n ? (i2) => r2({ ...i2, [t2]: n(i2) }) : r2;
    }
    function ra(e2, t2) {
      if (!t2) return e2;
      let r2 = { ...e2 };
      for (let n of Object.values(t2)) if (e2[n.name]) for (let i2 of n.needs) r2[i2] = true;
      return r2;
    }
    function na(e2, t2) {
      if (!t2) return e2;
      let r2 = { ...e2 };
      for (let n of Object.values(t2)) if (!e2[n.name]) for (let i2 of n.needs) delete r2[i2];
      return r2;
    }
    var xn = class {
      constructor(t2, r2) {
        this.extension = t2;
        this.previous = r2;
        this.computedFieldsCache = new ve();
        this.modelExtensionsCache = new ve();
        this.queryCallbacksCache = new ve();
        this.clientExtensions = pr(() => this.extension.client ? { ...this.previous?.getAllClientExtensions(), ...this.extension.client } : this.previous?.getAllClientExtensions());
        this.batchCallbacks = pr(() => {
          let t3 = this.previous?.getAllBatchQueryCallbacks() ?? [], r3 = this.extension.query?.$__internalBatch;
          return r3 ? t3.concat(r3) : t3;
        });
      }
      getAllComputedFields(t2) {
        return this.computedFieldsCache.getOrCreate(t2, () => ta(this.previous?.getAllComputedFields(t2), this.extension, t2));
      }
      getAllClientExtensions() {
        return this.clientExtensions.get();
      }
      getAllModelExtensions(t2) {
        return this.modelExtensionsCache.getOrCreate(t2, () => {
          let r2 = Te(t2);
          return !this.extension.model || !(this.extension.model[r2] || this.extension.model.$allModels) ? this.previous?.getAllModelExtensions(t2) : { ...this.previous?.getAllModelExtensions(t2), ...this.extension.model.$allModels, ...this.extension.model[r2] };
        });
      }
      getAllQueryCallbacks(t2, r2) {
        return this.queryCallbacksCache.getOrCreate(`${t2}:${r2}`, () => {
          let n = this.previous?.getAllQueryCallbacks(t2, r2) ?? [], i2 = [], o = this.extension.query;
          return !o || !(o[t2] || o.$allModels || o[r2] || o.$allOperations) ? n : (o[t2] !== void 0 && (o[t2][r2] !== void 0 && i2.push(o[t2][r2]), o[t2].$allOperations !== void 0 && i2.push(o[t2].$allOperations)), t2 !== "$none" && o.$allModels !== void 0 && (o.$allModels[r2] !== void 0 && i2.push(o.$allModels[r2]), o.$allModels.$allOperations !== void 0 && i2.push(o.$allModels.$allOperations)), o[r2] !== void 0 && i2.push(o[r2]), o.$allOperations !== void 0 && i2.push(o.$allOperations), n.concat(i2));
        });
      }
      getAllBatchQueryCallbacks() {
        return this.batchCallbacks.get();
      }
    };
    var kt = class e2 {
      constructor(t2) {
        this.head = t2;
      }
      static empty() {
        return new e2();
      }
      static single(t2) {
        return new e2(new xn(t2));
      }
      isEmpty() {
        return this.head === void 0;
      }
      append(t2) {
        return new e2(new xn(t2, this.head));
      }
      getAllComputedFields(t2) {
        return this.head?.getAllComputedFields(t2);
      }
      getAllClientExtensions() {
        return this.head?.getAllClientExtensions();
      }
      getAllModelExtensions(t2) {
        return this.head?.getAllModelExtensions(t2);
      }
      getAllQueryCallbacks(t2, r2) {
        return this.head?.getAllQueryCallbacks(t2, r2) ?? [];
      }
      getAllBatchQueryCallbacks() {
        return this.head?.getAllBatchQueryCallbacks() ?? [];
      }
    };
    var ia = Symbol();
    var dr = class {
      constructor(t2) {
        if (t2 !== ia) throw new Error("Skip instance can not be constructed directly");
      }
      ifUndefined(t2) {
        return t2 === void 0 ? Pn : t2;
      }
    };
    var Pn = new dr(ia);
    function Re(e2) {
      return e2 instanceof dr;
    }
    var Xp = { findUnique: "findUnique", findUniqueOrThrow: "findUniqueOrThrow", findFirst: "findFirst", findFirstOrThrow: "findFirstOrThrow", findMany: "findMany", count: "aggregate", create: "createOne", createMany: "createMany", createManyAndReturn: "createManyAndReturn", update: "updateOne", updateMany: "updateMany", upsert: "upsertOne", delete: "deleteOne", deleteMany: "deleteMany", executeRaw: "executeRaw", queryRaw: "queryRaw", aggregate: "aggregate", groupBy: "groupBy", runCommandRaw: "runCommandRaw", findRaw: "findRaw", aggregateRaw: "aggregateRaw" };
    var oa = "explicitly `undefined` values are not allowed";
    function vn({ modelName: e2, action: t2, args: r2, runtimeDataModel: n, extensions: i2 = kt.empty(), callsite: o, clientMethod: s2, errorFormat: a, clientVersion: l, previewFeatures: u, globalOmit: c }) {
      let p = new Di({ runtimeDataModel: n, modelName: e2, action: t2, rootArgs: r2, callsite: o, extensions: i2, selectionPath: [], argumentPath: [], originalMethod: s2, errorFormat: a, clientVersion: l, previewFeatures: u, globalOmit: c });
      return { modelName: e2, action: Xp[t2], query: mr(r2, p) };
    }
    function mr({ select: e2, include: t2, ...r2 } = {}, n) {
      let i2;
      return n.isPreviewFeatureOn("omitApi") && (i2 = r2.omit, delete r2.omit), { arguments: aa(r2, n), selection: ed(e2, t2, i2, n) };
    }
    function ed(e2, t2, r2, n) {
      return e2 ? (t2 ? n.throwValidationError({ kind: "MutuallyExclusiveFields", firstField: "include", secondField: "select", selectionPath: n.getSelectionPath() }) : r2 && n.isPreviewFeatureOn("omitApi") && n.throwValidationError({ kind: "MutuallyExclusiveFields", firstField: "omit", secondField: "select", selectionPath: n.getSelectionPath() }), id(e2, n)) : td(n, t2, r2);
    }
    function td(e2, t2, r2) {
      let n = {};
      return e2.modelOrType && !e2.isRawAction() && (n.$composites = true, n.$scalars = true), t2 && rd(n, t2, e2), e2.isPreviewFeatureOn("omitApi") && nd(n, r2, e2), n;
    }
    function rd(e2, t2, r2) {
      for (let [n, i2] of Object.entries(t2)) {
        if (Re(i2)) continue;
        let o = r2.nestSelection(n);
        if (_i(i2, o), i2 === false || i2 === void 0) {
          e2[n] = false;
          continue;
        }
        let s2 = r2.findField(n);
        if (s2 && s2.kind !== "object" && r2.throwValidationError({ kind: "IncludeOnScalar", selectionPath: r2.getSelectionPath().concat(n), outputType: r2.getOutputTypeDescription() }), s2) {
          e2[n] = mr(i2 === true ? {} : i2, o);
          continue;
        }
        if (i2 === true) {
          e2[n] = true;
          continue;
        }
        e2[n] = mr(i2, o);
      }
    }
    function nd(e2, t2, r2) {
      let n = r2.getComputedFields(), i2 = { ...r2.getGlobalOmit(), ...t2 }, o = na(i2, n);
      for (let [s2, a] of Object.entries(o)) {
        if (Re(a)) continue;
        _i(a, r2.nestSelection(s2));
        let l = r2.findField(s2);
        n?.[s2] && !l || (e2[s2] = !a);
      }
    }
    function id(e2, t2) {
      let r2 = {}, n = t2.getComputedFields(), i2 = ra(e2, n);
      for (let [o, s2] of Object.entries(i2)) {
        if (Re(s2)) continue;
        let a = t2.nestSelection(o);
        _i(s2, a);
        let l = t2.findField(o);
        if (!(n?.[o] && !l)) {
          if (s2 === false || s2 === void 0 || Re(s2)) {
            r2[o] = false;
            continue;
          }
          if (s2 === true) {
            l?.kind === "object" ? r2[o] = mr({}, a) : r2[o] = true;
            continue;
          }
          r2[o] = mr(s2, a);
        }
      }
      return r2;
    }
    function sa(e2, t2) {
      if (e2 === null) return null;
      if (typeof e2 == "string" || typeof e2 == "number" || typeof e2 == "boolean") return e2;
      if (typeof e2 == "bigint") return { $type: "BigInt", value: String(e2) };
      if (Pt(e2)) {
        if (ln(e2)) return { $type: "DateTime", value: e2.toISOString() };
        t2.throwValidationError({ kind: "InvalidArgumentValue", selectionPath: t2.getSelectionPath(), argumentPath: t2.getArgumentPath(), argument: { name: t2.getArgumentName(), typeNames: ["Date"] }, underlyingError: "Provided Date object is invalid" });
      }
      if (It(e2)) return { $type: "FieldRef", value: { _ref: e2.name, _container: e2.modelName } };
      if (Array.isArray(e2)) return od(e2, t2);
      if (ArrayBuffer.isView(e2)) return { $type: "Bytes", value: Buffer.from(e2).toString("base64") };
      if (sd(e2)) return e2.values;
      if (vt(e2)) return { $type: "Decimal", value: e2.toFixed() };
      if (e2 instanceof Me) {
        if (e2 !== yn.instances[e2._getName()]) throw new Error("Invalid ObjectEnumValue");
        return { $type: "Enum", value: e2._getName() };
      }
      if (ad(e2)) return e2.toJSON();
      if (typeof e2 == "object") return aa(e2, t2);
      t2.throwValidationError({ kind: "InvalidArgumentValue", selectionPath: t2.getSelectionPath(), argumentPath: t2.getArgumentPath(), argument: { name: t2.getArgumentName(), typeNames: [] }, underlyingError: `We could not serialize ${Object.prototype.toString.call(e2)} value. Serialize the object to JSON or implement a ".toJSON()" method on it` });
    }
    function aa(e2, t2) {
      if (e2.$type) return { $type: "Raw", value: e2 };
      let r2 = {};
      for (let n in e2) {
        let i2 = e2[n], o = t2.nestArgument(n);
        Re(i2) || (i2 !== void 0 ? r2[n] = sa(i2, o) : t2.isPreviewFeatureOn("strictUndefinedChecks") && t2.throwValidationError({ kind: "InvalidArgumentValue", argumentPath: o.getArgumentPath(), selectionPath: t2.getSelectionPath(), argument: { name: t2.getArgumentName(), typeNames: [] }, underlyingError: oa }));
      }
      return r2;
    }
    function od(e2, t2) {
      let r2 = [];
      for (let n = 0; n < e2.length; n++) {
        let i2 = t2.nestArgument(String(n)), o = e2[n];
        if (o === void 0 || Re(o)) {
          let s2 = o === void 0 ? "undefined" : "Prisma.skip";
          t2.throwValidationError({ kind: "InvalidArgumentValue", selectionPath: i2.getSelectionPath(), argumentPath: i2.getArgumentPath(), argument: { name: `${t2.getArgumentName()}[${n}]`, typeNames: [] }, underlyingError: `Can not use \`${s2}\` value within array. Use \`null\` or filter out \`${s2}\` values` });
        }
        r2.push(sa(o, i2));
      }
      return r2;
    }
    function sd(e2) {
      return typeof e2 == "object" && e2 !== null && e2.__prismaRawParameters__ === true;
    }
    function ad(e2) {
      return typeof e2 == "object" && e2 !== null && typeof e2.toJSON == "function";
    }
    function _i(e2, t2) {
      e2 === void 0 && t2.isPreviewFeatureOn("strictUndefinedChecks") && t2.throwValidationError({ kind: "InvalidSelectionValue", selectionPath: t2.getSelectionPath(), underlyingError: oa });
    }
    var Di = class e2 {
      constructor(t2) {
        this.params = t2;
        this.params.modelName && (this.modelOrType = this.params.runtimeDataModel.models[this.params.modelName] ?? this.params.runtimeDataModel.types[this.params.modelName]);
      }
      throwValidationError(t2) {
        wn({ errors: [t2], originalMethod: this.params.originalMethod, args: this.params.rootArgs ?? {}, callsite: this.params.callsite, errorFormat: this.params.errorFormat, clientVersion: this.params.clientVersion, globalOmit: this.params.globalOmit });
      }
      getSelectionPath() {
        return this.params.selectionPath;
      }
      getArgumentPath() {
        return this.params.argumentPath;
      }
      getArgumentName() {
        return this.params.argumentPath[this.params.argumentPath.length - 1];
      }
      getOutputTypeDescription() {
        if (!(!this.params.modelName || !this.modelOrType)) return { name: this.params.modelName, fields: this.modelOrType.fields.map((t2) => ({ name: t2.name, typeName: "boolean", isRelation: t2.kind === "object" })) };
      }
      isRawAction() {
        return ["executeRaw", "queryRaw", "runCommandRaw", "findRaw", "aggregateRaw"].includes(this.params.action);
      }
      isPreviewFeatureOn(t2) {
        return this.params.previewFeatures.includes(t2);
      }
      getComputedFields() {
        if (this.params.modelName) return this.params.extensions.getAllComputedFields(this.params.modelName);
      }
      findField(t2) {
        return this.modelOrType?.fields.find((r2) => r2.name === t2);
      }
      nestSelection(t2) {
        let r2 = this.findField(t2), n = r2?.kind === "object" ? r2.type : void 0;
        return new e2({ ...this.params, modelName: n, selectionPath: this.params.selectionPath.concat(t2) });
      }
      getGlobalOmit() {
        return this.params.modelName && this.shouldApplyGlobalOmit() ? this.params.globalOmit?.[xt(this.params.modelName)] ?? {} : {};
      }
      shouldApplyGlobalOmit() {
        switch (this.params.action) {
          case "findFirst":
          case "findFirstOrThrow":
          case "findUniqueOrThrow":
          case "findMany":
          case "upsert":
          case "findUnique":
          case "createManyAndReturn":
          case "create":
          case "update":
          case "delete":
            return true;
          case "executeRaw":
          case "aggregateRaw":
          case "runCommandRaw":
          case "findRaw":
          case "createMany":
          case "deleteMany":
          case "groupBy":
          case "updateMany":
          case "count":
          case "aggregate":
          case "queryRaw":
            return false;
          default:
            Fe(this.params.action, "Unknown action");
        }
      }
      nestArgument(t2) {
        return new e2({ ...this.params, argumentPath: this.params.argumentPath.concat(t2) });
      }
    };
    var Dt = class {
      constructor(t2) {
        this._engine = t2;
      }
      prometheus(t2) {
        return this._engine.metrics({ format: "prometheus", ...t2 });
      }
      json(t2) {
        return this._engine.metrics({ format: "json", ...t2 });
      }
    };
    function la(e2) {
      return { models: Fi(e2.models), enums: Fi(e2.enums), types: Fi(e2.types) };
    }
    function Fi(e2) {
      let t2 = {};
      for (let { name: r2, ...n } of e2) t2[r2] = n;
      return t2;
    }
    function ua(e2, t2) {
      let r2 = pr(() => ld(t2));
      Object.defineProperty(e2, "dmmf", { get: () => r2.get() });
    }
    function ld(e2) {
      return { datamodel: { models: Li(e2.models), enums: Li(e2.enums), types: Li(e2.types) } };
    }
    function Li(e2) {
      return Object.entries(e2).map(([t2, r2]) => ({ name: t2, ...r2 }));
    }
    var Ni = /* @__PURE__ */ new WeakMap();
    var Tn = "$$PrismaTypedSql";
    var Mi = class {
      constructor(t2, r2) {
        Ni.set(this, { sql: t2, values: r2 }), Object.defineProperty(this, Tn, { value: Tn });
      }
      get sql() {
        return Ni.get(this).sql;
      }
      get values() {
        return Ni.get(this).values;
      }
    };
    function ca(e2) {
      return (...t2) => new Mi(e2, t2);
    }
    function pa(e2) {
      return e2 != null && e2[Tn] === Tn;
    }
    function fr(e2) {
      return { ok: false, error: e2, map() {
        return fr(e2);
      }, flatMap() {
        return fr(e2);
      } };
    }
    var $i = class {
      constructor() {
        this.registeredErrors = [];
      }
      consumeError(t2) {
        return this.registeredErrors[t2];
      }
      registerNewError(t2) {
        let r2 = 0;
        for (; this.registeredErrors[r2] !== void 0; ) r2++;
        return this.registeredErrors[r2] = { error: t2 }, r2;
      }
    };
    var qi = (e2) => {
      let t2 = new $i(), r2 = Ce(t2, e2.transactionContext.bind(e2)), n = { adapterName: e2.adapterName, errorRegistry: t2, queryRaw: Ce(t2, e2.queryRaw.bind(e2)), executeRaw: Ce(t2, e2.executeRaw.bind(e2)), provider: e2.provider, transactionContext: async (...i2) => (await r2(...i2)).map((s2) => ud(t2, s2)) };
      return e2.getConnectionInfo && (n.getConnectionInfo = pd(t2, e2.getConnectionInfo.bind(e2))), n;
    };
    var ud = (e2, t2) => {
      let r2 = Ce(e2, t2.startTransaction.bind(t2));
      return { adapterName: t2.adapterName, provider: t2.provider, queryRaw: Ce(e2, t2.queryRaw.bind(t2)), executeRaw: Ce(e2, t2.executeRaw.bind(t2)), startTransaction: async (...n) => (await r2(...n)).map((o) => cd(e2, o)) };
    };
    var cd = (e2, t2) => ({ adapterName: t2.adapterName, provider: t2.provider, options: t2.options, queryRaw: Ce(e2, t2.queryRaw.bind(t2)), executeRaw: Ce(e2, t2.executeRaw.bind(t2)), commit: Ce(e2, t2.commit.bind(t2)), rollback: Ce(e2, t2.rollback.bind(t2)) });
    function Ce(e2, t2) {
      return async (...r2) => {
        try {
          return await t2(...r2);
        } catch (n) {
          let i2 = e2.registerNewError(n);
          return fr({ kind: "GenericJs", id: i2 });
        }
      };
    }
    function pd(e2, t2) {
      return (...r2) => {
        try {
          return t2(...r2);
        } catch (n) {
          let i2 = e2.registerNewError(n);
          return fr({ kind: "GenericJs", id: i2 });
        }
      };
    }
    var Wl = k(oi());
    var Hl = require("async_hooks");
    var Kl = require("events");
    var zl = k(require("fs"));
    var Fr = k(require("path"));
    var oe = class e2 {
      constructor(t2, r2) {
        if (t2.length - 1 !== r2.length) throw t2.length === 0 ? new TypeError("Expected at least 1 string") : new TypeError(`Expected ${t2.length} strings to have ${t2.length - 1} values`);
        let n = r2.reduce((s2, a) => s2 + (a instanceof e2 ? a.values.length : 1), 0);
        this.values = new Array(n), this.strings = new Array(n + 1), this.strings[0] = t2[0];
        let i2 = 0, o = 0;
        for (; i2 < r2.length; ) {
          let s2 = r2[i2++], a = t2[i2];
          if (s2 instanceof e2) {
            this.strings[o] += s2.strings[0];
            let l = 0;
            for (; l < s2.values.length; ) this.values[o++] = s2.values[l++], this.strings[o] = s2.strings[l];
            this.strings[o] += a;
          } else this.values[o++] = s2, this.strings[o] = a;
        }
      }
      get sql() {
        let t2 = this.strings.length, r2 = 1, n = this.strings[0];
        for (; r2 < t2; ) n += `?${this.strings[r2++]}`;
        return n;
      }
      get statement() {
        let t2 = this.strings.length, r2 = 1, n = this.strings[0];
        for (; r2 < t2; ) n += `:${r2}${this.strings[r2++]}`;
        return n;
      }
      get text() {
        let t2 = this.strings.length, r2 = 1, n = this.strings[0];
        for (; r2 < t2; ) n += `$${r2}${this.strings[r2++]}`;
        return n;
      }
      inspect() {
        return { sql: this.sql, statement: this.statement, text: this.text, values: this.values };
      }
    };
    function da(e2, t2 = ",", r2 = "", n = "") {
      if (e2.length === 0) throw new TypeError("Expected `join([])` to be called with an array of multiple elements, but got an empty array");
      return new oe([r2, ...Array(e2.length - 1).fill(t2), n], e2);
    }
    function ji(e2) {
      return new oe([e2], []);
    }
    var ma = ji("");
    function Vi(e2, ...t2) {
      return new oe(e2, t2);
    }
    function gr(e2) {
      return { getKeys() {
        return Object.keys(e2);
      }, getPropertyValue(t2) {
        return e2[t2];
      } };
    }
    function re(e2, t2) {
      return { getKeys() {
        return [e2];
      }, getPropertyValue() {
        return t2();
      } };
    }
    function ot(e2) {
      let t2 = new ve();
      return { getKeys() {
        return e2.getKeys();
      }, getPropertyValue(r2) {
        return t2.getOrCreate(r2, () => e2.getPropertyValue(r2));
      }, getPropertyDescriptor(r2) {
        return e2.getPropertyDescriptor?.(r2);
      } };
    }
    var Rn = { enumerable: true, configurable: true, writable: true };
    function Cn(e2) {
      let t2 = new Set(e2);
      return { getOwnPropertyDescriptor: () => Rn, has: (r2, n) => t2.has(n), set: (r2, n, i2) => t2.add(n) && Reflect.set(r2, n, i2), ownKeys: () => [...t2] };
    }
    var fa = Symbol.for("nodejs.util.inspect.custom");
    function Se(e2, t2) {
      let r2 = dd(t2), n = /* @__PURE__ */ new Set(), i2 = new Proxy(e2, { get(o, s2) {
        if (n.has(s2)) return o[s2];
        let a = r2.get(s2);
        return a ? a.getPropertyValue(s2) : o[s2];
      }, has(o, s2) {
        if (n.has(s2)) return true;
        let a = r2.get(s2);
        return a ? a.has?.(s2) ?? true : Reflect.has(o, s2);
      }, ownKeys(o) {
        let s2 = ga(Reflect.ownKeys(o), r2), a = ga(Array.from(r2.keys()), r2);
        return [.../* @__PURE__ */ new Set([...s2, ...a, ...n])];
      }, set(o, s2, a) {
        return r2.get(s2)?.getPropertyDescriptor?.(s2)?.writable === false ? false : (n.add(s2), Reflect.set(o, s2, a));
      }, getOwnPropertyDescriptor(o, s2) {
        let a = Reflect.getOwnPropertyDescriptor(o, s2);
        if (a && !a.configurable) return a;
        let l = r2.get(s2);
        return l ? l.getPropertyDescriptor ? { ...Rn, ...l?.getPropertyDescriptor(s2) } : Rn : a;
      }, defineProperty(o, s2, a) {
        return n.add(s2), Reflect.defineProperty(o, s2, a);
      } });
      return i2[fa] = function() {
        let o = { ...this };
        return delete o[fa], o;
      }, i2;
    }
    function dd(e2) {
      let t2 = /* @__PURE__ */ new Map();
      for (let r2 of e2) {
        let n = r2.getKeys();
        for (let i2 of n) t2.set(i2, r2);
      }
      return t2;
    }
    function ga(e2, t2) {
      return e2.filter((r2) => t2.get(r2)?.has?.(r2) ?? true);
    }
    function _t(e2) {
      return { getKeys() {
        return e2;
      }, has() {
        return false;
      }, getPropertyValue() {
      } };
    }
    function Ft(e2, t2) {
      return { batch: e2, transaction: t2?.kind === "batch" ? { isolationLevel: t2.options.isolationLevel } : void 0 };
    }
    function ha(e2) {
      if (e2 === void 0) return "";
      let t2 = Ot(e2);
      return new Rt(0, { colors: fn }).write(t2).toString();
    }
    var md = "P2037";
    function st({ error: e2, user_facing_error: t2 }, r2, n) {
      return t2.error_code ? new V(fd(t2, n), { code: t2.error_code, clientVersion: r2, meta: t2.meta, batchRequestIdx: t2.batch_request_idx }) : new B(e2, { clientVersion: r2, batchRequestIdx: t2.batch_request_idx });
    }
    function fd(e2, t2) {
      let r2 = e2.message;
      return (t2 === "postgresql" || t2 === "postgres" || t2 === "mysql") && e2.error_code === md && (r2 += `
Prisma Accelerate has built-in connection pooling to prevent such errors: https://pris.ly/client/error-accelerate`), r2;
    }
    var hr = "<unknown>";
    function ya(e2) {
      var t2 = e2.split(`
`);
      return t2.reduce(function(r2, n) {
        var i2 = yd(n) || Ed(n) || Pd(n) || Cd(n) || Td(n);
        return i2 && r2.push(i2), r2;
      }, []);
    }
    var gd = /^\s*at (.*?) ?\(((?:file|https?|blob|chrome-extension|native|eval|webpack|<anonymous>|\/|[a-z]:\\|\\\\).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;
    var hd = /\((\S*)(?::(\d+))(?::(\d+))\)/;
    function yd(e2) {
      var t2 = gd.exec(e2);
      if (!t2) return null;
      var r2 = t2[2] && t2[2].indexOf("native") === 0, n = t2[2] && t2[2].indexOf("eval") === 0, i2 = hd.exec(t2[2]);
      return n && i2 != null && (t2[2] = i2[1], t2[3] = i2[2], t2[4] = i2[3]), { file: r2 ? null : t2[2], methodName: t2[1] || hr, arguments: r2 ? [t2[2]] : [], lineNumber: t2[3] ? +t2[3] : null, column: t2[4] ? +t2[4] : null };
    }
    var bd = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i;
    function Ed(e2) {
      var t2 = bd.exec(e2);
      return t2 ? { file: t2[2], methodName: t2[1] || hr, arguments: [], lineNumber: +t2[3], column: t2[4] ? +t2[4] : null } : null;
    }
    var wd = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|resource|\[native).*?|[^@]*bundle)(?::(\d+))?(?::(\d+))?\s*$/i;
    var xd = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;
    function Pd(e2) {
      var t2 = wd.exec(e2);
      if (!t2) return null;
      var r2 = t2[3] && t2[3].indexOf(" > eval") > -1, n = xd.exec(t2[3]);
      return r2 && n != null && (t2[3] = n[1], t2[4] = n[2], t2[5] = null), { file: t2[3], methodName: t2[1] || hr, arguments: t2[2] ? t2[2].split(",") : [], lineNumber: t2[4] ? +t2[4] : null, column: t2[5] ? +t2[5] : null };
    }
    var vd = /^\s*(?:([^@]*)(?:\((.*?)\))?@)?(\S.*?):(\d+)(?::(\d+))?\s*$/i;
    function Td(e2) {
      var t2 = vd.exec(e2);
      return t2 ? { file: t2[3], methodName: t2[1] || hr, arguments: [], lineNumber: +t2[4], column: t2[5] ? +t2[5] : null } : null;
    }
    var Rd = /^\s*at (?:((?:\[object object\])?[^\\/]+(?: \[as \S+\])?) )?\(?(.*?):(\d+)(?::(\d+))?\)?\s*$/i;
    function Cd(e2) {
      var t2 = Rd.exec(e2);
      return t2 ? { file: t2[2], methodName: t2[1] || hr, arguments: [], lineNumber: +t2[3], column: t2[4] ? +t2[4] : null } : null;
    }
    var Bi = class {
      getLocation() {
        return null;
      }
    };
    var Ui = class {
      constructor() {
        this._error = new Error();
      }
      getLocation() {
        let t2 = this._error.stack;
        if (!t2) return null;
        let n = ya(t2).find((i2) => {
          if (!i2.file) return false;
          let o = mi(i2.file);
          return o !== "<anonymous>" && !o.includes("@prisma") && !o.includes("/packages/client/src/runtime/") && !o.endsWith("/runtime/binary.js") && !o.endsWith("/runtime/library.js") && !o.endsWith("/runtime/edge.js") && !o.endsWith("/runtime/edge-esm.js") && !o.startsWith("internal/") && !i2.methodName.includes("new ") && !i2.methodName.includes("getCallSite") && !i2.methodName.includes("Proxy.") && i2.methodName.split(".").length < 4;
        });
        return !n || !n.file ? null : { fileName: n.file, lineNumber: n.lineNumber, columnNumber: n.column };
      }
    };
    function Ze(e2) {
      return e2 === "minimal" ? typeof $EnabledCallSite == "function" && e2 !== "minimal" ? new $EnabledCallSite() : new Bi() : new Ui();
    }
    var ba = { _avg: true, _count: true, _sum: true, _min: true, _max: true };
    function Lt(e2 = {}) {
      let t2 = Ad(e2);
      return Object.entries(t2).reduce((n, [i2, o]) => (ba[i2] !== void 0 ? n.select[i2] = { select: o } : n[i2] = o, n), { select: {} });
    }
    function Ad(e2 = {}) {
      return typeof e2._count == "boolean" ? { ...e2, _count: { _all: e2._count } } : e2;
    }
    function Sn(e2 = {}) {
      return (t2) => (typeof e2._count == "boolean" && (t2._count = t2._count._all), t2);
    }
    function Ea(e2, t2) {
      let r2 = Sn(e2);
      return t2({ action: "aggregate", unpacker: r2, argsMapper: Lt })(e2);
    }
    function Id(e2 = {}) {
      let { select: t2, ...r2 } = e2;
      return typeof t2 == "object" ? Lt({ ...r2, _count: t2 }) : Lt({ ...r2, _count: { _all: true } });
    }
    function Od(e2 = {}) {
      return typeof e2.select == "object" ? (t2) => Sn(e2)(t2)._count : (t2) => Sn(e2)(t2)._count._all;
    }
    function wa(e2, t2) {
      return t2({ action: "count", unpacker: Od(e2), argsMapper: Id })(e2);
    }
    function kd(e2 = {}) {
      let t2 = Lt(e2);
      if (Array.isArray(t2.by)) for (let r2 of t2.by) typeof r2 == "string" && (t2.select[r2] = true);
      else typeof t2.by == "string" && (t2.select[t2.by] = true);
      return t2;
    }
    function Dd(e2 = {}) {
      return (t2) => (typeof e2?._count == "boolean" && t2.forEach((r2) => {
        r2._count = r2._count._all;
      }), t2);
    }
    function xa(e2, t2) {
      return t2({ action: "groupBy", unpacker: Dd(e2), argsMapper: kd })(e2);
    }
    function Pa(e2, t2, r2) {
      if (t2 === "aggregate") return (n) => Ea(n, r2);
      if (t2 === "count") return (n) => wa(n, r2);
      if (t2 === "groupBy") return (n) => xa(n, r2);
    }
    function va(e2, t2) {
      let r2 = t2.fields.filter((i2) => !i2.relationName), n = wi(r2, (i2) => i2.name);
      return new Proxy({}, { get(i2, o) {
        if (o in i2 || typeof o == "symbol") return i2[o];
        let s2 = n[o];
        if (s2) return new sr(e2, o, s2.type, s2.isList, s2.kind === "enum");
      }, ...Cn(Object.keys(n)) });
    }
    var Ta = (e2) => Array.isArray(e2) ? e2 : e2.split(".");
    var Gi = (e2, t2) => Ta(t2).reduce((r2, n) => r2 && r2[n], e2);
    var Ra = (e2, t2, r2) => Ta(t2).reduceRight((n, i2, o, s2) => Object.assign({}, Gi(e2, s2.slice(0, o)), { [i2]: n }), r2);
    function _d(e2, t2) {
      return e2 === void 0 || t2 === void 0 ? [] : [...t2, "select", e2];
    }
    function Fd(e2, t2, r2) {
      return t2 === void 0 ? e2 ?? {} : Ra(t2, r2, e2 || true);
    }
    function Qi(e2, t2, r2, n, i2, o) {
      let a = e2._runtimeDataModel.models[t2].fields.reduce((l, u) => ({ ...l, [u.name]: u }), {});
      return (l) => {
        let u = Ze(e2._errorFormat), c = _d(n, i2), p = Fd(l, o, c), d = r2({ dataPath: c, callsite: u })(p), f3 = Ld(e2, t2);
        return new Proxy(d, { get(g, h2) {
          if (!f3.includes(h2)) return g[h2];
          let T = [a[h2].type, r2, h2], S2 = [c, p];
          return Qi(e2, ...T, ...S2);
        }, ...Cn([...f3, ...Object.getOwnPropertyNames(d)]) });
      };
    }
    function Ld(e2, t2) {
      return e2._runtimeDataModel.models[t2].fields.filter((r2) => r2.kind === "object").map((r2) => r2.name);
    }
    function Ca(e2, t2, r2, n) {
      return e2 === Je.ModelAction.findFirstOrThrow || e2 === Je.ModelAction.findUniqueOrThrow ? Nd(t2, r2, n) : n;
    }
    function Nd(e2, t2, r2) {
      return async (n) => {
        if ("rejectOnNotFound" in n.args) {
          let o = Tt({ originalMethod: n.clientMethod, callsite: n.callsite, message: "'rejectOnNotFound' option is not supported" });
          throw new J(o, { clientVersion: t2 });
        }
        return await r2(n).catch((o) => {
          throw o instanceof V && o.code === "P2025" ? new Le(`No ${e2} found`, t2) : o;
        });
      };
    }
    var Md = ["findUnique", "findUniqueOrThrow", "findFirst", "findFirstOrThrow", "create", "update", "upsert", "delete"];
    var $d = ["aggregate", "count", "groupBy"];
    function Ji(e2, t2) {
      let r2 = e2._extensions.getAllModelExtensions(t2) ?? {}, n = [qd(e2, t2), Vd(e2, t2), gr(r2), re("name", () => t2), re("$name", () => t2), re("$parent", () => e2._appliedParent)];
      return Se({}, n);
    }
    function qd(e2, t2) {
      let r2 = Te(t2), n = Object.keys(Je.ModelAction).concat("count");
      return { getKeys() {
        return n;
      }, getPropertyValue(i2) {
        let o = i2, s2 = (l) => e2._request(l);
        s2 = Ca(o, t2, e2._clientVersion, s2);
        let a = (l) => (u) => {
          let c = Ze(e2._errorFormat);
          return e2._createPrismaPromise((p) => {
            let d = { args: u, dataPath: [], action: o, model: t2, clientMethod: `${r2}.${i2}`, jsModelName: r2, transaction: p, callsite: c };
            return s2({ ...d, ...l });
          });
        };
        return Md.includes(o) ? Qi(e2, t2, a) : jd(i2) ? Pa(e2, i2, a) : a({});
      } };
    }
    function jd(e2) {
      return $d.includes(e2);
    }
    function Vd(e2, t2) {
      return ot(re("fields", () => {
        let r2 = e2._runtimeDataModel.models[t2];
        return va(t2, r2);
      }));
    }
    function Sa(e2) {
      return e2.replace(/^./, (t2) => t2.toUpperCase());
    }
    var Wi = Symbol();
    function yr(e2) {
      let t2 = [Bd(e2), re(Wi, () => e2), re("$parent", () => e2._appliedParent)], r2 = e2._extensions.getAllClientExtensions();
      return r2 && t2.push(gr(r2)), Se(e2, t2);
    }
    function Bd(e2) {
      let t2 = Object.keys(e2._runtimeDataModel.models), r2 = t2.map(Te), n = [...new Set(t2.concat(r2))];
      return ot({ getKeys() {
        return n;
      }, getPropertyValue(i2) {
        let o = Sa(i2);
        if (e2._runtimeDataModel.models[o] !== void 0) return Ji(e2, o);
        if (e2._runtimeDataModel.models[i2] !== void 0) return Ji(e2, i2);
      }, getPropertyDescriptor(i2) {
        if (!r2.includes(i2)) return { enumerable: false };
      } });
    }
    function Aa(e2) {
      return e2[Wi] ? e2[Wi] : e2;
    }
    function Ia(e2) {
      if (typeof e2 == "function") return e2(this);
      if (e2.client?.__AccelerateEngine) {
        let r2 = e2.client.__AccelerateEngine;
        this._originalClient._engine = new r2(this._originalClient._accelerateEngineConfig);
      }
      let t2 = Object.create(this._originalClient, { _extensions: { value: this._extensions.append(e2) }, _appliedParent: { value: this, configurable: true }, $use: { value: void 0 }, $on: { value: void 0 } });
      return yr(t2);
    }
    function Oa({ result: e2, modelName: t2, select: r2, omit: n, extensions: i2 }) {
      let o = i2.getAllComputedFields(t2);
      if (!o) return e2;
      let s2 = [], a = [];
      for (let l of Object.values(o)) {
        if (n) {
          if (n[l.name]) continue;
          let u = l.needs.filter((c) => n[c]);
          u.length > 0 && a.push(_t(u));
        } else if (r2) {
          if (!r2[l.name]) continue;
          let u = l.needs.filter((c) => !r2[c]);
          u.length > 0 && a.push(_t(u));
        }
        Ud(e2, l.needs) && s2.push(Gd(l, Se(e2, s2)));
      }
      return s2.length > 0 || a.length > 0 ? Se(e2, [...s2, ...a]) : e2;
    }
    function Ud(e2, t2) {
      return t2.every((r2) => Ei(e2, r2));
    }
    function Gd(e2, t2) {
      return ot(re(e2.name, () => e2.compute(t2)));
    }
    function An({ visitor: e2, result: t2, args: r2, runtimeDataModel: n, modelName: i2 }) {
      if (Array.isArray(t2)) {
        for (let s2 = 0; s2 < t2.length; s2++) t2[s2] = An({ result: t2[s2], args: r2, modelName: i2, runtimeDataModel: n, visitor: e2 });
        return t2;
      }
      let o = e2(t2, i2, r2) ?? t2;
      return r2.include && ka({ includeOrSelect: r2.include, result: o, parentModelName: i2, runtimeDataModel: n, visitor: e2 }), r2.select && ka({ includeOrSelect: r2.select, result: o, parentModelName: i2, runtimeDataModel: n, visitor: e2 }), o;
    }
    function ka({ includeOrSelect: e2, result: t2, parentModelName: r2, runtimeDataModel: n, visitor: i2 }) {
      for (let [o, s2] of Object.entries(e2)) {
        if (!s2 || t2[o] == null || Re(s2)) continue;
        let l = n.models[r2].fields.find((c) => c.name === o);
        if (!l || l.kind !== "object" || !l.relationName) continue;
        let u = typeof s2 == "object" ? s2 : {};
        t2[o] = An({ visitor: i2, result: t2[o], args: u, modelName: l.type, runtimeDataModel: n });
      }
    }
    function Da({ result: e2, modelName: t2, args: r2, extensions: n, runtimeDataModel: i2, globalOmit: o }) {
      return n.isEmpty() || e2 == null || typeof e2 != "object" || !i2.models[t2] ? e2 : An({ result: e2, args: r2 ?? {}, modelName: t2, runtimeDataModel: i2, visitor: (a, l, u) => {
        let c = Te(l);
        return Oa({ result: a, modelName: c, select: u.select, omit: u.select ? void 0 : { ...o?.[c], ...u.omit }, extensions: n });
      } });
    }
    function _a(e2) {
      if (e2 instanceof oe) return Qd(e2);
      if (Array.isArray(e2)) {
        let r2 = [e2[0]];
        for (let n = 1; n < e2.length; n++) r2[n] = br(e2[n]);
        return r2;
      }
      let t2 = {};
      for (let r2 in e2) t2[r2] = br(e2[r2]);
      return t2;
    }
    function Qd(e2) {
      return new oe(e2.strings, e2.values);
    }
    function br(e2) {
      if (typeof e2 != "object" || e2 == null || e2 instanceof Me || It(e2)) return e2;
      if (vt(e2)) return new xe(e2.toFixed());
      if (Pt(e2)) return /* @__PURE__ */ new Date(+e2);
      if (ArrayBuffer.isView(e2)) return e2.slice(0);
      if (Array.isArray(e2)) {
        let t2 = e2.length, r2;
        for (r2 = Array(t2); t2--; ) r2[t2] = br(e2[t2]);
        return r2;
      }
      if (typeof e2 == "object") {
        let t2 = {};
        for (let r2 in e2) r2 === "__proto__" ? Object.defineProperty(t2, r2, { value: br(e2[r2]), configurable: true, enumerable: true, writable: true }) : t2[r2] = br(e2[r2]);
        return t2;
      }
      Fe(e2, "Unknown value");
    }
    function La(e2, t2, r2, n = 0) {
      return e2._createPrismaPromise((i2) => {
        let o = t2.customDataProxyFetch;
        return "transaction" in t2 && i2 !== void 0 && (t2.transaction?.kind === "batch" && t2.transaction.lock.then(), t2.transaction = i2), n === r2.length ? e2._executeRequest(t2) : r2[n]({ model: t2.model, operation: t2.model ? t2.action : t2.clientMethod, args: _a(t2.args ?? {}), __internalParams: t2, query: (s2, a = t2) => {
          let l = a.customDataProxyFetch;
          return a.customDataProxyFetch = qa(o, l), a.args = s2, La(e2, a, r2, n + 1);
        } });
      });
    }
    function Na(e2, t2) {
      let { jsModelName: r2, action: n, clientMethod: i2 } = t2, o = r2 ? n : i2;
      if (e2._extensions.isEmpty()) return e2._executeRequest(t2);
      let s2 = e2._extensions.getAllQueryCallbacks(r2 ?? "$none", o);
      return La(e2, t2, s2);
    }
    function Ma(e2) {
      return (t2) => {
        let r2 = { requests: t2 }, n = t2[0].extensions.getAllBatchQueryCallbacks();
        return n.length ? $a(r2, n, 0, e2) : e2(r2);
      };
    }
    function $a(e2, t2, r2, n) {
      if (r2 === t2.length) return n(e2);
      let i2 = e2.customDataProxyFetch, o = e2.requests[0].transaction;
      return t2[r2]({ args: { queries: e2.requests.map((s2) => ({ model: s2.modelName, operation: s2.action, args: s2.args })), transaction: o ? { isolationLevel: o.kind === "batch" ? o.isolationLevel : void 0 } : void 0 }, __internalParams: e2, query(s2, a = e2) {
        let l = a.customDataProxyFetch;
        return a.customDataProxyFetch = qa(i2, l), $a(a, t2, r2 + 1, n);
      } });
    }
    var Fa = (e2) => e2;
    function qa(e2 = Fa, t2 = Fa) {
      return (r2) => e2(t2(r2));
    }
    var ja = L("prisma:client");
    var Va = { Vercel: "vercel", "Netlify CI": "netlify" };
    function Ba({ postinstall: e2, ciName: t2, clientVersion: r2 }) {
      if (ja("checkPlatformCaching:postinstall", e2), ja("checkPlatformCaching:ciName", t2), e2 === true && t2 && t2 in Va) {
        let n = `Prisma has detected that this project was built on ${t2}, which caches dependencies. This leads to an outdated Prisma Client because Prisma's auto-generation isn't triggered. To fix this, make sure to run the \`prisma generate\` command during the build process.

Learn how: https://pris.ly/d/${Va[t2]}-build`;
        throw console.error(n), new R(n, r2);
      }
    }
    function Ua(e2, t2) {
      return e2 ? e2.datasources ? e2.datasources : e2.datasourceUrl ? { [t2[0]]: { url: e2.datasourceUrl } } : {} : {};
    }
    var Jd = "Cloudflare-Workers";
    var Wd = "node";
    function Ga() {
      return typeof Netlify == "object" ? "netlify" : typeof EdgeRuntime == "string" ? "edge-light" : globalThis.navigator?.userAgent === Jd ? "workerd" : globalThis.Deno ? "deno" : globalThis.__lagon__ ? "lagon" : globalThis.process?.release?.name === Wd ? "node" : globalThis.Bun ? "bun" : globalThis.fastly ? "fastly" : "unknown";
    }
    var Hd = { node: "Node.js", workerd: "Cloudflare Workers", deno: "Deno and Deno Deploy", netlify: "Netlify Edge Functions", "edge-light": "Edge Runtime (Vercel Edge Functions, Vercel Edge Middleware, Next.js (Pages Router) Edge API Routes, Next.js (App Router) Edge Route Handlers or Next.js Middleware)" };
    function In() {
      let e2 = Ga();
      return { id: e2, prettyName: Hd[e2] || e2, isEdge: ["workerd", "deno", "netlify", "edge-light"].includes(e2) };
    }
    var Ka = k(require("fs"));
    var Er = k(require("path"));
    function On(e2) {
      let { runtimeBinaryTarget: t2 } = e2;
      return `Add "${t2}" to \`binaryTargets\` in the "schema.prisma" file and run \`prisma generate\` after saving it:

${Kd(e2)}`;
    }
    function Kd(e2) {
      let { generator: t2, generatorBinaryTargets: r2, runtimeBinaryTarget: n } = e2, i2 = { fromEnvVar: null, value: n }, o = [...r2, i2];
      return hi({ ...t2, binaryTargets: o });
    }
    function Xe(e2) {
      let { runtimeBinaryTarget: t2 } = e2;
      return `Prisma Client could not locate the Query Engine for runtime "${t2}".`;
    }
    function et(e2) {
      let { searchedLocations: t2 } = e2;
      return `The following locations have been searched:
${[...new Set(t2)].map((i2) => `  ${i2}`).join(`
`)}`;
    }
    function Qa(e2) {
      let { runtimeBinaryTarget: t2 } = e2;
      return `${Xe(e2)}

This happened because \`binaryTargets\` have been pinned, but the actual deployment also required "${t2}".
${On(e2)}

${et(e2)}`;
    }
    function kn(e2) {
      return `We would appreciate if you could take the time to share some information with us.
Please help us by answering a few questions: https://pris.ly/${e2}`;
    }
    function Dn(e2) {
      let { errorStack: t2 } = e2;
      return t2?.match(/\/\.next|\/next@|\/next\//) ? `

We detected that you are using Next.js, learn how to fix this: https://pris.ly/d/engine-not-found-nextjs.` : "";
    }
    function Ja(e2) {
      let { queryEngineName: t2 } = e2;
      return `${Xe(e2)}${Dn(e2)}

This is likely caused by a bundler that has not copied "${t2}" next to the resulting bundle.
Ensure that "${t2}" has been copied next to the bundle or in "${e2.expectedLocation}".

${kn("engine-not-found-bundler-investigation")}

${et(e2)}`;
    }
    function Wa(e2) {
      let { runtimeBinaryTarget: t2, generatorBinaryTargets: r2 } = e2, n = r2.find((i2) => i2.native);
      return `${Xe(e2)}

This happened because Prisma Client was generated for "${n?.value ?? "unknown"}", but the actual deployment required "${t2}".
${On(e2)}

${et(e2)}`;
    }
    function Ha(e2) {
      let { queryEngineName: t2 } = e2;
      return `${Xe(e2)}${Dn(e2)}

This is likely caused by tooling that has not copied "${t2}" to the deployment folder.
Ensure that you ran \`prisma generate\` and that "${t2}" has been copied to "${e2.expectedLocation}".

${kn("engine-not-found-tooling-investigation")}

${et(e2)}`;
    }
    var zd = L("prisma:client:engines:resolveEnginePath");
    var Yd = () => new RegExp("runtime[\\\\/]library\\.m?js$");
    async function za(e2, t2) {
      let r2 = { binary: process.env.PRISMA_QUERY_ENGINE_BINARY, library: process.env.PRISMA_QUERY_ENGINE_LIBRARY }[e2] ?? t2.prismaPath;
      if (r2 !== void 0) return r2;
      let { enginePath: n, searchedLocations: i2 } = await Zd(e2, t2);
      if (zd("enginePath", n), n !== void 0 && e2 === "binary" && li(n), n !== void 0) return t2.prismaPath = n;
      let o = await nt(), s2 = t2.generator?.binaryTargets ?? [], a = s2.some((d) => d.native), l = !s2.some((d) => d.value === o), u = __filename.match(Yd()) === null, c = { searchedLocations: i2, generatorBinaryTargets: s2, generator: t2.generator, runtimeBinaryTarget: o, queryEngineName: Ya(e2, o), expectedLocation: Er.default.relative(process.cwd(), t2.dirname), errorStack: new Error().stack }, p;
      throw a && l ? p = Wa(c) : l ? p = Qa(c) : u ? p = Ja(c) : p = Ha(c), new R(p, t2.clientVersion);
    }
    async function Zd(engineType, config) {
      let binaryTarget = await nt(), searchedLocations = [], dirname = eval("__dirname"), searchLocations = [config.dirname, Er.default.resolve(dirname, ".."), config.generator?.output?.value ?? dirname, Er.default.resolve(dirname, "../../../.prisma/client"), "/tmp/prisma-engines", config.cwd];
      __filename.includes("resolveEnginePath") && searchLocations.push(Yo());
      for (let e2 of searchLocations) {
        let t2 = Ya(engineType, binaryTarget), r2 = Er.default.join(e2, t2);
        if (searchedLocations.push(e2), Ka.default.existsSync(r2)) return { enginePath: r2, searchedLocations };
      }
      return { enginePath: void 0, searchedLocations };
    }
    function Ya(e2, t2) {
      return e2 === "library" ? qr(t2, "fs") : `query-engine-${t2}${t2 === "windows" ? ".exe" : ""}`;
    }
    var Hi = k(bi());
    function Za(e2) {
      return e2 ? e2.replace(/".*"/g, '"X"').replace(/[\s:\[]([+-]?([0-9]*[.])?[0-9]+)/g, (t2) => `${t2[0]}5`) : "";
    }
    function Xa(e2) {
      return e2.split(`
`).map((t2) => t2.replace(/^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)\s*/, "").replace(/\+\d+\s*ms$/, "")).join(`
`);
    }
    var el = k(hs());
    function tl({ title: e2, user: t2 = "prisma", repo: r2 = "prisma", template: n = "bug_report.yml", body: i2 }) {
      return (0, el.default)({ user: t2, repo: r2, template: n, title: e2, body: i2 });
    }
    function rl({ version: e2, binaryTarget: t2, title: r2, description: n, engineVersion: i2, database: o, query: s2 }) {
      let a = So(6e3 - (s2?.length ?? 0)), l = Xa((0, Hi.default)(a)), u = n ? `# Description
\`\`\`
${n}
\`\`\`` : "", c = (0, Hi.default)(`Hi Prisma Team! My Prisma Client just crashed. This is the report:
## Versions

| Name            | Version            |
|-----------------|--------------------|
| Node            | ${process.version?.padEnd(19)}| 
| OS              | ${t2?.padEnd(19)}|
| Prisma Client   | ${e2?.padEnd(19)}|
| Query Engine    | ${i2?.padEnd(19)}|
| Database        | ${o?.padEnd(19)}|

${u}

## Logs
\`\`\`
${l}
\`\`\`

## Client Snippet
\`\`\`ts
// PLEASE FILL YOUR CODE SNIPPET HERE
\`\`\`

## Schema
\`\`\`prisma
// PLEASE ADD YOUR SCHEMA HERE IF POSSIBLE
\`\`\`

## Prisma Engine Query
\`\`\`
${s2 ? Za(s2) : ""}
\`\`\`
`), p = tl({ title: r2, body: c });
      return `${r2}

This is a non-recoverable error which probably happens when the Prisma Query Engine has a panic.

${X(p)}

If you want the Prisma team to look into it, please open the link above \u{1F64F}
To increase the chance of success, please post your schema and a snippet of
how you used Prisma Client in the issue. 
`;
    }
    function Nt({ inlineDatasources: e2, overrideDatasources: t2, env: r2, clientVersion: n }) {
      let i2, o = Object.keys(e2)[0], s2 = e2[o]?.url, a = t2[o]?.url;
      if (o === void 0 ? i2 = void 0 : a ? i2 = a : s2?.value ? i2 = s2.value : s2?.fromEnvVar && (i2 = r2[s2.fromEnvVar]), s2?.fromEnvVar !== void 0 && i2 === void 0) throw new R(`error: Environment variable not found: ${s2.fromEnvVar}.`, n);
      if (i2 === void 0) throw new R("error: Missing URL environment variable, value, or override.", n);
      return i2;
    }
    var _n = class extends Error {
      constructor(t2, r2) {
        super(t2), this.clientVersion = r2.clientVersion, this.cause = r2.cause;
      }
      get [Symbol.toStringTag]() {
        return this.name;
      }
    };
    var se = class extends _n {
      constructor(t2, r2) {
        super(t2, r2), this.isRetryable = r2.isRetryable ?? true;
      }
    };
    function A(e2, t2) {
      return { ...e2, isRetryable: t2 };
    }
    var Mt = class extends se {
      constructor(r2) {
        super("This request must be retried", A(r2, true));
        this.name = "ForcedRetryError";
        this.code = "P5001";
      }
    };
    w(Mt, "ForcedRetryError");
    var at = class extends se {
      constructor(r2, n) {
        super(r2, A(n, false));
        this.name = "InvalidDatasourceError";
        this.code = "P6001";
      }
    };
    w(at, "InvalidDatasourceError");
    var lt = class extends se {
      constructor(r2, n) {
        super(r2, A(n, false));
        this.name = "NotImplementedYetError";
        this.code = "P5004";
      }
    };
    w(lt, "NotImplementedYetError");
    var q = class extends se {
      constructor(t2, r2) {
        super(t2, r2), this.response = r2.response;
        let n = this.response.headers.get("prisma-request-id");
        if (n) {
          let i2 = `(The request id was: ${n})`;
          this.message = this.message + " " + i2;
        }
      }
    };
    var ut = class extends q {
      constructor(r2) {
        super("Schema needs to be uploaded", A(r2, true));
        this.name = "SchemaMissingError";
        this.code = "P5005";
      }
    };
    w(ut, "SchemaMissingError");
    var Ki = "This request could not be understood by the server";
    var wr = class extends q {
      constructor(r2, n, i2) {
        super(n || Ki, A(r2, false));
        this.name = "BadRequestError";
        this.code = "P5000";
        i2 && (this.code = i2);
      }
    };
    w(wr, "BadRequestError");
    var xr = class extends q {
      constructor(r2, n) {
        super("Engine not started: healthcheck timeout", A(r2, true));
        this.name = "HealthcheckTimeoutError";
        this.code = "P5013";
        this.logs = n;
      }
    };
    w(xr, "HealthcheckTimeoutError");
    var Pr = class extends q {
      constructor(r2, n, i2) {
        super(n, A(r2, true));
        this.name = "EngineStartupError";
        this.code = "P5014";
        this.logs = i2;
      }
    };
    w(Pr, "EngineStartupError");
    var vr = class extends q {
      constructor(r2) {
        super("Engine version is not supported", A(r2, false));
        this.name = "EngineVersionNotSupportedError";
        this.code = "P5012";
      }
    };
    w(vr, "EngineVersionNotSupportedError");
    var zi = "Request timed out";
    var Tr = class extends q {
      constructor(r2, n = zi) {
        super(n, A(r2, false));
        this.name = "GatewayTimeoutError";
        this.code = "P5009";
      }
    };
    w(Tr, "GatewayTimeoutError");
    var Xd = "Interactive transaction error";
    var Rr = class extends q {
      constructor(r2, n = Xd) {
        super(n, A(r2, false));
        this.name = "InteractiveTransactionError";
        this.code = "P5015";
      }
    };
    w(Rr, "InteractiveTransactionError");
    var em = "Request parameters are invalid";
    var Cr = class extends q {
      constructor(r2, n = em) {
        super(n, A(r2, false));
        this.name = "InvalidRequestError";
        this.code = "P5011";
      }
    };
    w(Cr, "InvalidRequestError");
    var Yi = "Requested resource does not exist";
    var Sr = class extends q {
      constructor(r2, n = Yi) {
        super(n, A(r2, false));
        this.name = "NotFoundError";
        this.code = "P5003";
      }
    };
    w(Sr, "NotFoundError");
    var Zi = "Unknown server error";
    var $t = class extends q {
      constructor(r2, n, i2) {
        super(n || Zi, A(r2, true));
        this.name = "ServerError";
        this.code = "P5006";
        this.logs = i2;
      }
    };
    w($t, "ServerError");
    var Xi = "Unauthorized, check your connection string";
    var Ar = class extends q {
      constructor(r2, n = Xi) {
        super(n, A(r2, false));
        this.name = "UnauthorizedError";
        this.code = "P5007";
      }
    };
    w(Ar, "UnauthorizedError");
    var eo = "Usage exceeded, retry again later";
    var Ir = class extends q {
      constructor(r2, n = eo) {
        super(n, A(r2, true));
        this.name = "UsageExceededError";
        this.code = "P5008";
      }
    };
    w(Ir, "UsageExceededError");
    async function tm(e2) {
      let t2;
      try {
        t2 = await e2.text();
      } catch {
        return { type: "EmptyError" };
      }
      try {
        let r2 = JSON.parse(t2);
        if (typeof r2 == "string") switch (r2) {
          case "InternalDataProxyError":
            return { type: "DataProxyError", body: r2 };
          default:
            return { type: "UnknownTextError", body: r2 };
        }
        if (typeof r2 == "object" && r2 !== null) {
          if ("is_panic" in r2 && "message" in r2 && "error_code" in r2) return { type: "QueryEngineError", body: r2 };
          if ("EngineNotStarted" in r2 || "InteractiveTransactionMisrouted" in r2 || "InvalidRequestError" in r2) {
            let n = Object.values(r2)[0].reason;
            return typeof n == "string" && !["SchemaMissing", "EngineVersionNotSupported"].includes(n) ? { type: "UnknownJsonError", body: r2 } : { type: "DataProxyError", body: r2 };
          }
        }
        return { type: "UnknownJsonError", body: r2 };
      } catch {
        return t2 === "" ? { type: "EmptyError" } : { type: "UnknownTextError", body: t2 };
      }
    }
    async function Or(e2, t2) {
      if (e2.ok) return;
      let r2 = { clientVersion: t2, response: e2 }, n = await tm(e2);
      if (n.type === "QueryEngineError") throw new V(n.body.message, { code: n.body.error_code, clientVersion: t2 });
      if (n.type === "DataProxyError") {
        if (n.body === "InternalDataProxyError") throw new $t(r2, "Internal Data Proxy error");
        if ("EngineNotStarted" in n.body) {
          if (n.body.EngineNotStarted.reason === "SchemaMissing") return new ut(r2);
          if (n.body.EngineNotStarted.reason === "EngineVersionNotSupported") throw new vr(r2);
          if ("EngineStartupError" in n.body.EngineNotStarted.reason) {
            let { msg: i2, logs: o } = n.body.EngineNotStarted.reason.EngineStartupError;
            throw new Pr(r2, i2, o);
          }
          if ("KnownEngineStartupError" in n.body.EngineNotStarted.reason) {
            let { msg: i2, error_code: o } = n.body.EngineNotStarted.reason.KnownEngineStartupError;
            throw new R(i2, t2, o);
          }
          if ("HealthcheckTimeout" in n.body.EngineNotStarted.reason) {
            let { logs: i2 } = n.body.EngineNotStarted.reason.HealthcheckTimeout;
            throw new xr(r2, i2);
          }
        }
        if ("InteractiveTransactionMisrouted" in n.body) {
          let i2 = { IDParseError: "Could not parse interactive transaction ID", NoQueryEngineFoundError: "Could not find Query Engine for the specified host and transaction ID", TransactionStartError: "Could not start interactive transaction" };
          throw new Rr(r2, i2[n.body.InteractiveTransactionMisrouted.reason]);
        }
        if ("InvalidRequestError" in n.body) throw new Cr(r2, n.body.InvalidRequestError.reason);
      }
      if (e2.status === 401 || e2.status === 403) throw new Ar(r2, qt(Xi, n));
      if (e2.status === 404) return new Sr(r2, qt(Yi, n));
      if (e2.status === 429) throw new Ir(r2, qt(eo, n));
      if (e2.status === 504) throw new Tr(r2, qt(zi, n));
      if (e2.status >= 500) throw new $t(r2, qt(Zi, n));
      if (e2.status >= 400) throw new wr(r2, qt(Ki, n));
    }
    function qt(e2, t2) {
      return t2.type === "EmptyError" ? e2 : `${e2}: ${JSON.stringify(t2)}`;
    }
    function nl(e2) {
      let t2 = Math.pow(2, e2) * 50, r2 = Math.ceil(Math.random() * t2) - Math.ceil(t2 / 2), n = t2 + r2;
      return new Promise((i2) => setTimeout(() => i2(n), n));
    }
    var $e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    function il(e2) {
      let t2 = new TextEncoder().encode(e2), r2 = "", n = t2.byteLength, i2 = n % 3, o = n - i2, s2, a, l, u, c;
      for (let p = 0; p < o; p = p + 3) c = t2[p] << 16 | t2[p + 1] << 8 | t2[p + 2], s2 = (c & 16515072) >> 18, a = (c & 258048) >> 12, l = (c & 4032) >> 6, u = c & 63, r2 += $e[s2] + $e[a] + $e[l] + $e[u];
      return i2 == 1 ? (c = t2[o], s2 = (c & 252) >> 2, a = (c & 3) << 4, r2 += $e[s2] + $e[a] + "==") : i2 == 2 && (c = t2[o] << 8 | t2[o + 1], s2 = (c & 64512) >> 10, a = (c & 1008) >> 4, l = (c & 15) << 2, r2 += $e[s2] + $e[a] + $e[l] + "="), r2;
    }
    function ol(e2) {
      if (!!e2.generator?.previewFeatures.some((r2) => r2.toLowerCase().includes("metrics"))) throw new R("The `metrics` preview feature is not yet available with Accelerate.\nPlease remove `metrics` from the `previewFeatures` in your schema.\n\nMore information about Accelerate: https://pris.ly/d/accelerate", e2.clientVersion);
    }
    function rm(e2) {
      return e2[0] * 1e3 + e2[1] / 1e6;
    }
    function sl(e2) {
      return new Date(rm(e2));
    }
    var al = { "@prisma/debug": "workspace:*", "@prisma/engines-version": "5.22.0-44.605197351a3c8bdd595af2d2a9bc3025bca48ea2", "@prisma/fetch-engine": "workspace:*", "@prisma/get-platform": "workspace:*" };
    var kr = class extends se {
      constructor(r2, n) {
        super(`Cannot fetch data from service:
${r2}`, A(n, true));
        this.name = "RequestError";
        this.code = "P5010";
      }
    };
    w(kr, "RequestError");
    async function ct(e2, t2, r2 = (n) => n) {
      let n = t2.clientVersion;
      try {
        return typeof fetch == "function" ? await r2(fetch)(e2, t2) : await r2(to)(e2, t2);
      } catch (i2) {
        let o = i2.message ?? "Unknown error";
        throw new kr(o, { clientVersion: n });
      }
    }
    function im(e2) {
      return { ...e2.headers, "Content-Type": "application/json" };
    }
    function om(e2) {
      return { method: e2.method, headers: im(e2) };
    }
    function sm(e2, t2) {
      return { text: () => Promise.resolve(Buffer.concat(e2).toString()), json: () => Promise.resolve().then(() => JSON.parse(Buffer.concat(e2).toString())), ok: t2.statusCode >= 200 && t2.statusCode <= 299, status: t2.statusCode, url: t2.url, headers: new ro(t2.headers) };
    }
    async function to(e2, t2 = {}) {
      let r2 = am("https"), n = om(t2), i2 = [], { origin: o } = new URL(e2);
      return new Promise((s2, a) => {
        let l = r2.request(e2, n, (u) => {
          let { statusCode: c, headers: { location: p } } = u;
          c >= 301 && c <= 399 && p && (p.startsWith("http") === false ? s2(to(`${o}${p}`, t2)) : s2(to(p, t2))), u.on("data", (d) => i2.push(d)), u.on("end", () => s2(sm(i2, u))), u.on("error", a);
        });
        l.on("error", a), l.end(t2.body ?? "");
      });
    }
    var am = typeof require < "u" ? require : () => {
    };
    var ro = class {
      constructor(t2 = {}) {
        this.headers = /* @__PURE__ */ new Map();
        for (let [r2, n] of Object.entries(t2)) if (typeof n == "string") this.headers.set(r2, n);
        else if (Array.isArray(n)) for (let i2 of n) this.headers.set(r2, i2);
      }
      append(t2, r2) {
        this.headers.set(t2, r2);
      }
      delete(t2) {
        this.headers.delete(t2);
      }
      get(t2) {
        return this.headers.get(t2) ?? null;
      }
      has(t2) {
        return this.headers.has(t2);
      }
      set(t2, r2) {
        this.headers.set(t2, r2);
      }
      forEach(t2, r2) {
        for (let [n, i2] of this.headers) t2.call(r2, i2, n, this);
      }
    };
    var lm = /^[1-9][0-9]*\.[0-9]+\.[0-9]+$/;
    var ll = L("prisma:client:dataproxyEngine");
    async function um(e2, t2) {
      let r2 = al["@prisma/engines-version"], n = t2.clientVersion ?? "unknown";
      if (process.env.PRISMA_CLIENT_DATA_PROXY_CLIENT_VERSION) return process.env.PRISMA_CLIENT_DATA_PROXY_CLIENT_VERSION;
      if (e2.includes("accelerate") && n !== "0.0.0" && n !== "in-memory") return n;
      let [i2, o] = n?.split("-") ?? [];
      if (o === void 0 && lm.test(i2)) return i2;
      if (o !== void 0 || n === "0.0.0" || n === "in-memory") {
        if (e2.startsWith("localhost") || e2.startsWith("127.0.0.1")) return "0.0.0";
        let [s2] = r2.split("-") ?? [], [a, l, u] = s2.split("."), c = cm(`<=${a}.${l}.${u}`), p = await ct(c, { clientVersion: n });
        if (!p.ok) throw new Error(`Failed to fetch stable Prisma version, unpkg.com status ${p.status} ${p.statusText}, response body: ${await p.text() || "<empty body>"}`);
        let d = await p.text();
        ll("length of body fetched from unpkg.com", d.length);
        let f3;
        try {
          f3 = JSON.parse(d);
        } catch (g) {
          throw console.error("JSON.parse error: body fetched from unpkg.com: ", d), g;
        }
        return f3.version;
      }
      throw new lt("Only `major.minor.patch` versions are supported by Accelerate.", { clientVersion: n });
    }
    async function ul(e2, t2) {
      let r2 = await um(e2, t2);
      return ll("version", r2), r2;
    }
    function cm(e2) {
      return encodeURI(`https://unpkg.com/prisma@${e2}/package.json`);
    }
    var cl = 3;
    var no = L("prisma:client:dataproxyEngine");
    var io = class {
      constructor({ apiKey: t2, tracingHelper: r2, logLevel: n, logQueries: i2, engineHash: o }) {
        this.apiKey = t2, this.tracingHelper = r2, this.logLevel = n, this.logQueries = i2, this.engineHash = o;
      }
      build({ traceparent: t2, interactiveTransaction: r2 } = {}) {
        let n = { Authorization: `Bearer ${this.apiKey}`, "Prisma-Engine-Hash": this.engineHash };
        this.tracingHelper.isEnabled() && (n.traceparent = t2 ?? this.tracingHelper.getTraceParent()), r2 && (n["X-transaction-id"] = r2.id);
        let i2 = this.buildCaptureSettings();
        return i2.length > 0 && (n["X-capture-telemetry"] = i2.join(", ")), n;
      }
      buildCaptureSettings() {
        let t2 = [];
        return this.tracingHelper.isEnabled() && t2.push("tracing"), this.logLevel && t2.push(this.logLevel), this.logQueries && t2.push("query"), t2;
      }
    };
    var Dr = class {
      constructor(t2) {
        this.name = "DataProxyEngine";
        ol(t2), this.config = t2, this.env = { ...t2.env, ...typeof process < "u" ? process.env : {} }, this.inlineSchema = il(t2.inlineSchema), this.inlineDatasources = t2.inlineDatasources, this.inlineSchemaHash = t2.inlineSchemaHash, this.clientVersion = t2.clientVersion, this.engineHash = t2.engineVersion, this.logEmitter = t2.logEmitter, this.tracingHelper = t2.tracingHelper;
      }
      apiKey() {
        return this.headerBuilder.apiKey;
      }
      version() {
        return this.engineHash;
      }
      async start() {
        this.startPromise !== void 0 && await this.startPromise, this.startPromise = (async () => {
          let [t2, r2] = this.extractHostAndApiKey();
          this.host = t2, this.headerBuilder = new io({ apiKey: r2, tracingHelper: this.tracingHelper, logLevel: this.config.logLevel, logQueries: this.config.logQueries, engineHash: this.engineHash }), this.remoteClientVersion = await ul(t2, this.config), no("host", this.host);
        })(), await this.startPromise;
      }
      async stop() {
      }
      propagateResponseExtensions(t2) {
        t2?.logs?.length && t2.logs.forEach((r2) => {
          switch (r2.level) {
            case "debug":
            case "error":
            case "trace":
            case "warn":
            case "info":
              break;
            case "query": {
              let n = typeof r2.attributes.query == "string" ? r2.attributes.query : "";
              if (!this.tracingHelper.isEnabled()) {
                let [i2] = n.split("/* traceparent");
                n = i2;
              }
              this.logEmitter.emit("query", { query: n, timestamp: sl(r2.timestamp), duration: Number(r2.attributes.duration_ms), params: r2.attributes.params, target: r2.attributes.target });
            }
          }
        }), t2?.traces?.length && this.tracingHelper.createEngineSpan({ span: true, spans: t2.traces });
      }
      onBeforeExit() {
        throw new Error('"beforeExit" hook is not applicable to the remote query engine');
      }
      async url(t2) {
        return await this.start(), `https://${this.host}/${this.remoteClientVersion}/${this.inlineSchemaHash}/${t2}`;
      }
      async uploadSchema() {
        let t2 = { name: "schemaUpload", internal: true };
        return this.tracingHelper.runInChildSpan(t2, async () => {
          let r2 = await ct(await this.url("schema"), { method: "PUT", headers: this.headerBuilder.build(), body: this.inlineSchema, clientVersion: this.clientVersion });
          r2.ok || no("schema response status", r2.status);
          let n = await Or(r2, this.clientVersion);
          if (n) throw this.logEmitter.emit("warn", { message: `Error while uploading schema: ${n.message}`, timestamp: /* @__PURE__ */ new Date(), target: "" }), n;
          this.logEmitter.emit("info", { message: `Schema (re)uploaded (hash: ${this.inlineSchemaHash})`, timestamp: /* @__PURE__ */ new Date(), target: "" });
        });
      }
      request(t2, { traceparent: r2, interactiveTransaction: n, customDataProxyFetch: i2 }) {
        return this.requestInternal({ body: t2, traceparent: r2, interactiveTransaction: n, customDataProxyFetch: i2 });
      }
      async requestBatch(t2, { traceparent: r2, transaction: n, customDataProxyFetch: i2 }) {
        let o = n?.kind === "itx" ? n.options : void 0, s2 = Ft(t2, n), { batchResult: a, elapsed: l } = await this.requestInternal({ body: s2, customDataProxyFetch: i2, interactiveTransaction: o, traceparent: r2 });
        return a.map((u) => "errors" in u && u.errors.length > 0 ? st(u.errors[0], this.clientVersion, this.config.activeProvider) : { data: u, elapsed: l });
      }
      requestInternal({ body: t2, traceparent: r2, customDataProxyFetch: n, interactiveTransaction: i2 }) {
        return this.withRetry({ actionGerund: "querying", callback: async ({ logHttpCall: o }) => {
          let s2 = i2 ? `${i2.payload.endpoint}/graphql` : await this.url("graphql");
          o(s2);
          let a = await ct(s2, { method: "POST", headers: this.headerBuilder.build({ traceparent: r2, interactiveTransaction: i2 }), body: JSON.stringify(t2), clientVersion: this.clientVersion }, n);
          a.ok || no("graphql response status", a.status), await this.handleError(await Or(a, this.clientVersion));
          let l = await a.json(), u = l.extensions;
          if (u && this.propagateResponseExtensions(u), l.errors) throw l.errors.length === 1 ? st(l.errors[0], this.config.clientVersion, this.config.activeProvider) : new B(l.errors, { clientVersion: this.config.clientVersion });
          return l;
        } });
      }
      async transaction(t2, r2, n) {
        let i2 = { start: "starting", commit: "committing", rollback: "rolling back" };
        return this.withRetry({ actionGerund: `${i2[t2]} transaction`, callback: async ({ logHttpCall: o }) => {
          if (t2 === "start") {
            let s2 = JSON.stringify({ max_wait: n.maxWait, timeout: n.timeout, isolation_level: n.isolationLevel }), a = await this.url("transaction/start");
            o(a);
            let l = await ct(a, { method: "POST", headers: this.headerBuilder.build({ traceparent: r2.traceparent }), body: s2, clientVersion: this.clientVersion });
            await this.handleError(await Or(l, this.clientVersion));
            let u = await l.json(), c = u.extensions;
            c && this.propagateResponseExtensions(c);
            let p = u.id, d = u["data-proxy"].endpoint;
            return { id: p, payload: { endpoint: d } };
          } else {
            let s2 = `${n.payload.endpoint}/${t2}`;
            o(s2);
            let a = await ct(s2, { method: "POST", headers: this.headerBuilder.build({ traceparent: r2.traceparent }), clientVersion: this.clientVersion });
            await this.handleError(await Or(a, this.clientVersion));
            let u = (await a.json()).extensions;
            u && this.propagateResponseExtensions(u);
            return;
          }
        } });
      }
      extractHostAndApiKey() {
        let t2 = { clientVersion: this.clientVersion }, r2 = Object.keys(this.inlineDatasources)[0], n = Nt({ inlineDatasources: this.inlineDatasources, overrideDatasources: this.config.overrideDatasources, clientVersion: this.clientVersion, env: this.env }), i2;
        try {
          i2 = new URL(n);
        } catch {
          throw new at(`Error validating datasource \`${r2}\`: the URL must start with the protocol \`prisma://\``, t2);
        }
        let { protocol: o, host: s2, searchParams: a } = i2;
        if (o !== "prisma:" && o !== "prisma+postgres:") throw new at(`Error validating datasource \`${r2}\`: the URL must start with the protocol \`prisma://\``, t2);
        let l = a.get("api_key");
        if (l === null || l.length < 1) throw new at(`Error validating datasource \`${r2}\`: the URL must contain a valid API key`, t2);
        return [s2, l];
      }
      metrics() {
        throw new lt("Metrics are not yet supported for Accelerate", { clientVersion: this.clientVersion });
      }
      async withRetry(t2) {
        for (let r2 = 0; ; r2++) {
          let n = (i2) => {
            this.logEmitter.emit("info", { message: `Calling ${i2} (n=${r2})`, timestamp: /* @__PURE__ */ new Date(), target: "" });
          };
          try {
            return await t2.callback({ logHttpCall: n });
          } catch (i2) {
            if (!(i2 instanceof se) || !i2.isRetryable) throw i2;
            if (r2 >= cl) throw i2 instanceof Mt ? i2.cause : i2;
            this.logEmitter.emit("warn", { message: `Attempt ${r2 + 1}/${cl} failed for ${t2.actionGerund}: ${i2.message ?? "(unknown)"}`, timestamp: /* @__PURE__ */ new Date(), target: "" });
            let o = await nl(r2);
            this.logEmitter.emit("warn", { message: `Retrying after ${o}ms`, timestamp: /* @__PURE__ */ new Date(), target: "" });
          }
        }
      }
      async handleError(t2) {
        if (t2 instanceof ut) throw await this.uploadSchema(), new Mt({ clientVersion: this.clientVersion, cause: t2 });
        if (t2) throw t2;
      }
      applyPendingMigrations() {
        throw new Error("Method not implemented.");
      }
    };
    function pl(e2) {
      if (e2?.kind === "itx") return e2.options.id;
    }
    var so = k(require("os"));
    var dl = k(require("path"));
    var oo = Symbol("PrismaLibraryEngineCache");
    function pm() {
      let e2 = globalThis;
      return e2[oo] === void 0 && (e2[oo] = {}), e2[oo];
    }
    function dm(e2) {
      let t2 = pm();
      if (t2[e2] !== void 0) return t2[e2];
      let r2 = dl.default.toNamespacedPath(e2), n = { exports: {} }, i2 = 0;
      return process.platform !== "win32" && (i2 = so.default.constants.dlopen.RTLD_LAZY | so.default.constants.dlopen.RTLD_DEEPBIND), process.dlopen(n, r2, i2), t2[e2] = n.exports, n.exports;
    }
    var ml = { async loadLibrary(e2) {
      let t2 = await Yn(), r2 = await za("library", e2);
      try {
        return e2.tracingHelper.runInChildSpan({ name: "loadLibrary", internal: true }, () => dm(r2));
      } catch (n) {
        let i2 = ui({ e: n, platformInfo: t2, id: r2 });
        throw new R(i2, e2.clientVersion);
      }
    } };
    var ao;
    var fl = { async loadLibrary(e2) {
      let { clientVersion: t2, adapter: r2, engineWasm: n } = e2;
      if (r2 === void 0) throw new R(`The \`adapter\` option for \`PrismaClient\` is required in this context (${In().prettyName})`, t2);
      if (n === void 0) throw new R("WASM engine was unexpectedly `undefined`", t2);
      ao === void 0 && (ao = (async () => {
        let o = n.getRuntime(), s2 = await n.getQueryEngineWasmModule();
        if (s2 == null) throw new R("The loaded wasm module was unexpectedly `undefined` or `null` once loaded", t2);
        let a = { "./query_engine_bg.js": o }, l = new WebAssembly.Instance(s2, a);
        return o.__wbg_set_wasm(l.exports), o.QueryEngine;
      })());
      let i2 = await ao;
      return { debugPanic() {
        return Promise.reject("{}");
      }, dmmf() {
        return Promise.resolve("{}");
      }, version() {
        return { commit: "unknown", version: "unknown" };
      }, QueryEngine: i2 };
    } };
    var mm = "P2036";
    var Ae = L("prisma:client:libraryEngine");
    function fm(e2) {
      return e2.item_type === "query" && "query" in e2;
    }
    function gm(e2) {
      return "level" in e2 ? e2.level === "error" && e2.message === "PANIC" : false;
    }
    var gl = [...Jn, "native"];
    var _r = class {
      constructor(t2, r2) {
        this.name = "LibraryEngine";
        this.libraryLoader = r2 ?? ml, t2.engineWasm !== void 0 && (this.libraryLoader = r2 ?? fl), this.config = t2, this.libraryStarted = false, this.logQueries = t2.logQueries ?? false, this.logLevel = t2.logLevel ?? "error", this.logEmitter = t2.logEmitter, this.datamodel = t2.inlineSchema, t2.enableDebugLogs && (this.logLevel = "debug");
        let n = Object.keys(t2.overrideDatasources)[0], i2 = t2.overrideDatasources[n]?.url;
        n !== void 0 && i2 !== void 0 && (this.datasourceOverrides = { [n]: i2 }), this.libraryInstantiationPromise = this.instantiateLibrary();
      }
      async applyPendingMigrations() {
        throw new Error("Cannot call this method from this type of engine instance");
      }
      async transaction(t2, r2, n) {
        await this.start();
        let i2 = JSON.stringify(r2), o;
        if (t2 === "start") {
          let a = JSON.stringify({ max_wait: n.maxWait, timeout: n.timeout, isolation_level: n.isolationLevel });
          o = await this.engine?.startTransaction(a, i2);
        } else t2 === "commit" ? o = await this.engine?.commitTransaction(n.id, i2) : t2 === "rollback" && (o = await this.engine?.rollbackTransaction(n.id, i2));
        let s2 = this.parseEngineResponse(o);
        if (hm(s2)) {
          let a = this.getExternalAdapterError(s2);
          throw a ? a.error : new V(s2.message, { code: s2.error_code, clientVersion: this.config.clientVersion, meta: s2.meta });
        }
        return s2;
      }
      async instantiateLibrary() {
        if (Ae("internalSetup"), this.libraryInstantiationPromise) return this.libraryInstantiationPromise;
        Qn(), this.binaryTarget = await this.getCurrentBinaryTarget(), await this.loadEngine(), this.version();
      }
      async getCurrentBinaryTarget() {
        {
          if (this.binaryTarget) return this.binaryTarget;
          let t2 = await nt();
          if (!gl.includes(t2)) throw new R(`Unknown ${ce("PRISMA_QUERY_ENGINE_LIBRARY")} ${ce(H(t2))}. Possible binaryTargets: ${qe(gl.join(", "))} or a path to the query engine library.
You may have to run ${qe("prisma generate")} for your changes to take effect.`, this.config.clientVersion);
          return t2;
        }
      }
      parseEngineResponse(t2) {
        if (!t2) throw new B("Response from the Engine was empty", { clientVersion: this.config.clientVersion });
        try {
          return JSON.parse(t2);
        } catch {
          throw new B("Unable to JSON.parse response from engine", { clientVersion: this.config.clientVersion });
        }
      }
      async loadEngine() {
        if (!this.engine) {
          this.QueryEngineConstructor || (this.library = await this.libraryLoader.loadLibrary(this.config), this.QueryEngineConstructor = this.library.QueryEngine);
          try {
            let t2 = new WeakRef(this), { adapter: r2 } = this.config;
            r2 && Ae("Using driver adapter: %O", r2), this.engine = new this.QueryEngineConstructor({ datamodel: this.datamodel, env: process.env, logQueries: this.config.logQueries ?? false, ignoreEnvVarErrors: true, datasourceOverrides: this.datasourceOverrides ?? {}, logLevel: this.logLevel, configDir: this.config.cwd, engineProtocol: "json" }, (n) => {
              t2.deref()?.logger(n);
            }, r2);
          } catch (t2) {
            let r2 = t2, n = this.parseInitError(r2.message);
            throw typeof n == "string" ? r2 : new R(n.message, this.config.clientVersion, n.error_code);
          }
        }
      }
      logger(t2) {
        let r2 = this.parseEngineResponse(t2);
        if (r2) {
          if ("span" in r2) {
            this.config.tracingHelper.createEngineSpan(r2);
            return;
          }
          r2.level = r2?.level.toLowerCase() ?? "unknown", fm(r2) ? this.logEmitter.emit("query", { timestamp: /* @__PURE__ */ new Date(), query: r2.query, params: r2.params, duration: Number(r2.duration_ms), target: r2.module_path }) : gm(r2) ? this.loggerRustPanic = new le(lo(this, `${r2.message}: ${r2.reason} in ${r2.file}:${r2.line}:${r2.column}`), this.config.clientVersion) : this.logEmitter.emit(r2.level, { timestamp: /* @__PURE__ */ new Date(), message: r2.message, target: r2.module_path });
        }
      }
      parseInitError(t2) {
        try {
          return JSON.parse(t2);
        } catch {
        }
        return t2;
      }
      parseRequestError(t2) {
        try {
          return JSON.parse(t2);
        } catch {
        }
        return t2;
      }
      onBeforeExit() {
        throw new Error('"beforeExit" hook is not applicable to the library engine since Prisma 5.0.0, it is only relevant and implemented for the binary engine. Please add your event listener to the `process` object directly instead.');
      }
      async start() {
        if (await this.libraryInstantiationPromise, await this.libraryStoppingPromise, this.libraryStartingPromise) return Ae(`library already starting, this.libraryStarted: ${this.libraryStarted}`), this.libraryStartingPromise;
        if (this.libraryStarted) return;
        let t2 = async () => {
          Ae("library starting");
          try {
            let r2 = { traceparent: this.config.tracingHelper.getTraceParent() };
            await this.engine?.connect(JSON.stringify(r2)), this.libraryStarted = true, Ae("library started");
          } catch (r2) {
            let n = this.parseInitError(r2.message);
            throw typeof n == "string" ? r2 : new R(n.message, this.config.clientVersion, n.error_code);
          } finally {
            this.libraryStartingPromise = void 0;
          }
        };
        return this.libraryStartingPromise = this.config.tracingHelper.runInChildSpan("connect", t2), this.libraryStartingPromise;
      }
      async stop() {
        if (await this.libraryStartingPromise, await this.executingQueryPromise, this.libraryStoppingPromise) return Ae("library is already stopping"), this.libraryStoppingPromise;
        if (!this.libraryStarted) return;
        let t2 = async () => {
          await new Promise((n) => setTimeout(n, 5)), Ae("library stopping");
          let r2 = { traceparent: this.config.tracingHelper.getTraceParent() };
          await this.engine?.disconnect(JSON.stringify(r2)), this.libraryStarted = false, this.libraryStoppingPromise = void 0, Ae("library stopped");
        };
        return this.libraryStoppingPromise = this.config.tracingHelper.runInChildSpan("disconnect", t2), this.libraryStoppingPromise;
      }
      version() {
        return this.versionInfo = this.library?.version(), this.versionInfo?.version ?? "unknown";
      }
      debugPanic(t2) {
        return this.library?.debugPanic(t2);
      }
      async request(t2, { traceparent: r2, interactiveTransaction: n }) {
        Ae(`sending request, this.libraryStarted: ${this.libraryStarted}`);
        let i2 = JSON.stringify({ traceparent: r2 }), o = JSON.stringify(t2);
        try {
          await this.start(), this.executingQueryPromise = this.engine?.query(o, i2, n?.id), this.lastQuery = o;
          let s2 = this.parseEngineResponse(await this.executingQueryPromise);
          if (s2.errors) throw s2.errors.length === 1 ? this.buildQueryError(s2.errors[0]) : new B(JSON.stringify(s2.errors), { clientVersion: this.config.clientVersion });
          if (this.loggerRustPanic) throw this.loggerRustPanic;
          return { data: s2, elapsed: 0 };
        } catch (s2) {
          if (s2 instanceof R) throw s2;
          if (s2.code === "GenericFailure" && s2.message?.startsWith("PANIC:")) throw new le(lo(this, s2.message), this.config.clientVersion);
          let a = this.parseRequestError(s2.message);
          throw typeof a == "string" ? s2 : new B(`${a.message}
${a.backtrace}`, { clientVersion: this.config.clientVersion });
        }
      }
      async requestBatch(t2, { transaction: r2, traceparent: n }) {
        Ae("requestBatch");
        let i2 = Ft(t2, r2);
        await this.start(), this.lastQuery = JSON.stringify(i2), this.executingQueryPromise = this.engine.query(this.lastQuery, JSON.stringify({ traceparent: n }), pl(r2));
        let o = await this.executingQueryPromise, s2 = this.parseEngineResponse(o);
        if (s2.errors) throw s2.errors.length === 1 ? this.buildQueryError(s2.errors[0]) : new B(JSON.stringify(s2.errors), { clientVersion: this.config.clientVersion });
        let { batchResult: a, errors: l } = s2;
        if (Array.isArray(a)) return a.map((u) => u.errors && u.errors.length > 0 ? this.loggerRustPanic ?? this.buildQueryError(u.errors[0]) : { data: u, elapsed: 0 });
        throw l && l.length === 1 ? new Error(l[0].error) : new Error(JSON.stringify(s2));
      }
      buildQueryError(t2) {
        if (t2.user_facing_error.is_panic) return new le(lo(this, t2.user_facing_error.message), this.config.clientVersion);
        let r2 = this.getExternalAdapterError(t2.user_facing_error);
        return r2 ? r2.error : st(t2, this.config.clientVersion, this.config.activeProvider);
      }
      getExternalAdapterError(t2) {
        if (t2.error_code === mm && this.config.adapter) {
          let r2 = t2.meta?.id;
          Yr(typeof r2 == "number", "Malformed external JS error received from the engine");
          let n = this.config.adapter.errorRegistry.consumeError(r2);
          return Yr(n, "External error with reported id was not registered"), n;
        }
      }
      async metrics(t2) {
        await this.start();
        let r2 = await this.engine.metrics(JSON.stringify(t2));
        return t2.format === "prometheus" ? r2 : this.parseEngineResponse(r2);
      }
    };
    function hm(e2) {
      return typeof e2 == "object" && e2 !== null && e2.error_code !== void 0;
    }
    function lo(e2, t2) {
      return rl({ binaryTarget: e2.binaryTarget, title: t2, version: e2.config.clientVersion, engineVersion: e2.versionInfo?.commit, database: e2.config.activeProvider, query: e2.lastQuery });
    }
    function hl({ copyEngine: e2 = true }, t2) {
      let r2;
      try {
        r2 = Nt({ inlineDatasources: t2.inlineDatasources, overrideDatasources: t2.overrideDatasources, env: { ...t2.env, ...process.env }, clientVersion: t2.clientVersion });
      } catch {
      }
      let n = !!(r2?.startsWith("prisma://") || r2?.startsWith("prisma+postgres://"));
      e2 && n && tr("recommend--no-engine", "In production, we recommend using `prisma generate --no-engine` (See: `prisma generate --help`)");
      let i2 = Yt(t2.generator), o = n || !e2, s2 = !!t2.adapter, a = i2 === "library", l = i2 === "binary";
      if (o && s2 || s2 && false) {
        let u;
        throw e2 ? r2?.startsWith("prisma://") ? u = ["Prisma Client was configured to use the `adapter` option but the URL was a `prisma://` URL.", "Please either use the `prisma://` URL or remove the `adapter` from the Prisma Client constructor."] : u = ["Prisma Client was configured to use both the `adapter` and Accelerate, please chose one."] : u = ["Prisma Client was configured to use the `adapter` option but `prisma generate` was run with `--no-engine`.", "Please run `prisma generate` without `--no-engine` to be able to use Prisma Client with the adapter."], new J(u.join(`
`), { clientVersion: t2.clientVersion });
      }
      if (o) return new Dr(t2);
      if (a) return new _r(t2);
      throw new J("Invalid client engine type, please use `library` or `binary`", { clientVersion: t2.clientVersion });
    }
    function Fn({ generator: e2 }) {
      return e2?.previewFeatures ?? [];
    }
    var yl = (e2) => ({ command: e2 });
    var bl = (e2) => e2.strings.reduce((t2, r2, n) => `${t2}@P${n}${r2}`);
    function jt(e2) {
      try {
        return El(e2, "fast");
      } catch {
        return El(e2, "slow");
      }
    }
    function El(e2, t2) {
      return JSON.stringify(e2.map((r2) => xl(r2, t2)));
    }
    function xl(e2, t2) {
      return Array.isArray(e2) ? e2.map((r2) => xl(r2, t2)) : typeof e2 == "bigint" ? { prisma__type: "bigint", prisma__value: e2.toString() } : Pt(e2) ? { prisma__type: "date", prisma__value: e2.toJSON() } : xe.isDecimal(e2) ? { prisma__type: "decimal", prisma__value: e2.toJSON() } : Buffer.isBuffer(e2) ? { prisma__type: "bytes", prisma__value: e2.toString("base64") } : ym(e2) || ArrayBuffer.isView(e2) ? { prisma__type: "bytes", prisma__value: Buffer.from(e2).toString("base64") } : typeof e2 == "object" && t2 === "slow" ? Pl(e2) : e2;
    }
    function ym(e2) {
      return e2 instanceof ArrayBuffer || e2 instanceof SharedArrayBuffer ? true : typeof e2 == "object" && e2 !== null ? e2[Symbol.toStringTag] === "ArrayBuffer" || e2[Symbol.toStringTag] === "SharedArrayBuffer" : false;
    }
    function Pl(e2) {
      if (typeof e2 != "object" || e2 === null) return e2;
      if (typeof e2.toJSON == "function") return e2.toJSON();
      if (Array.isArray(e2)) return e2.map(wl);
      let t2 = {};
      for (let r2 of Object.keys(e2)) t2[r2] = wl(e2[r2]);
      return t2;
    }
    function wl(e2) {
      return typeof e2 == "bigint" ? e2.toString() : Pl(e2);
    }
    var bm = ["$connect", "$disconnect", "$on", "$transaction", "$use", "$extends"];
    var vl = bm;
    var Em = /^(\s*alter\s)/i;
    var Tl = L("prisma:client");
    function uo(e2, t2, r2, n) {
      if (!(e2 !== "postgresql" && e2 !== "cockroachdb") && r2.length > 0 && Em.exec(t2)) throw new Error(`Running ALTER using ${n} is not supported
Using the example below you can still execute your query with Prisma, but please note that it is vulnerable to SQL injection attacks and requires you to take care of input sanitization.

Example:
  await prisma.$executeRawUnsafe(\`ALTER USER prisma WITH PASSWORD '\${password}'\`)

More Information: https://pris.ly/d/execute-raw
`);
    }
    var co = ({ clientMethod: e2, activeProvider: t2 }) => (r2) => {
      let n = "", i2;
      if (pa(r2)) n = r2.sql, i2 = { values: jt(r2.values), __prismaRawParameters__: true };
      else if (Array.isArray(r2)) {
        let [o, ...s2] = r2;
        n = o, i2 = { values: jt(s2 || []), __prismaRawParameters__: true };
      } else switch (t2) {
        case "sqlite":
        case "mysql": {
          n = r2.sql, i2 = { values: jt(r2.values), __prismaRawParameters__: true };
          break;
        }
        case "cockroachdb":
        case "postgresql":
        case "postgres": {
          n = r2.text, i2 = { values: jt(r2.values), __prismaRawParameters__: true };
          break;
        }
        case "sqlserver": {
          n = bl(r2), i2 = { values: jt(r2.values), __prismaRawParameters__: true };
          break;
        }
        default:
          throw new Error(`The ${t2} provider does not support ${e2}`);
      }
      return i2?.values ? Tl(`prisma.${e2}(${n}, ${i2.values})`) : Tl(`prisma.${e2}(${n})`), { query: n, parameters: i2 };
    };
    var Rl = { requestArgsToMiddlewareArgs(e2) {
      return [e2.strings, ...e2.values];
    }, middlewareArgsToRequestArgs(e2) {
      let [t2, ...r2] = e2;
      return new oe(t2, r2);
    } };
    var Cl = { requestArgsToMiddlewareArgs(e2) {
      return [e2];
    }, middlewareArgsToRequestArgs(e2) {
      return e2[0];
    } };
    function po(e2) {
      return function(r2) {
        let n, i2 = (o = e2) => {
          try {
            return o === void 0 || o?.kind === "itx" ? n ??= Sl(r2(o)) : Sl(r2(o));
          } catch (s2) {
            return Promise.reject(s2);
          }
        };
        return { then(o, s2) {
          return i2().then(o, s2);
        }, catch(o) {
          return i2().catch(o);
        }, finally(o) {
          return i2().finally(o);
        }, requestTransaction(o) {
          let s2 = i2(o);
          return s2.requestTransaction ? s2.requestTransaction(o) : s2;
        }, [Symbol.toStringTag]: "PrismaPromise" };
      };
    }
    function Sl(e2) {
      return typeof e2.then == "function" ? e2 : Promise.resolve(e2);
    }
    var Al = { isEnabled() {
      return false;
    }, getTraceParent() {
      return "00-10-10-00";
    }, async createEngineSpan() {
    }, getActiveContext() {
    }, runInChildSpan(e2, t2) {
      return t2();
    } };
    var mo = class {
      isEnabled() {
        return this.getGlobalTracingHelper().isEnabled();
      }
      getTraceParent(t2) {
        return this.getGlobalTracingHelper().getTraceParent(t2);
      }
      createEngineSpan(t2) {
        return this.getGlobalTracingHelper().createEngineSpan(t2);
      }
      getActiveContext() {
        return this.getGlobalTracingHelper().getActiveContext();
      }
      runInChildSpan(t2, r2) {
        return this.getGlobalTracingHelper().runInChildSpan(t2, r2);
      }
      getGlobalTracingHelper() {
        return globalThis.PRISMA_INSTRUMENTATION?.helper ?? Al;
      }
    };
    function Il(e2) {
      return e2.includes("tracing") ? new mo() : Al;
    }
    function Ol(e2, t2 = () => {
    }) {
      let r2, n = new Promise((i2) => r2 = i2);
      return { then(i2) {
        return --e2 === 0 && r2(t2()), i2?.(n);
      } };
    }
    function kl(e2) {
      return typeof e2 == "string" ? e2 : e2.reduce((t2, r2) => {
        let n = typeof r2 == "string" ? r2 : r2.level;
        return n === "query" ? t2 : t2 && (r2 === "info" || t2 === "info") ? "info" : n;
      }, void 0);
    }
    var Ln = class {
      constructor() {
        this._middlewares = [];
      }
      use(t2) {
        this._middlewares.push(t2);
      }
      get(t2) {
        return this._middlewares[t2];
      }
      has(t2) {
        return !!this._middlewares[t2];
      }
      length() {
        return this._middlewares.length;
      }
    };
    var Fl = k(bi());
    function Nn(e2) {
      return typeof e2.batchRequestIdx == "number";
    }
    function Dl(e2) {
      if (e2.action !== "findUnique" && e2.action !== "findUniqueOrThrow") return;
      let t2 = [];
      return e2.modelName && t2.push(e2.modelName), e2.query.arguments && t2.push(fo(e2.query.arguments)), t2.push(fo(e2.query.selection)), t2.join("");
    }
    function fo(e2) {
      return `(${Object.keys(e2).sort().map((r2) => {
        let n = e2[r2];
        return typeof n == "object" && n !== null ? `(${r2} ${fo(n)})` : r2;
      }).join(" ")})`;
    }
    var wm = { aggregate: false, aggregateRaw: false, createMany: true, createManyAndReturn: true, createOne: true, deleteMany: true, deleteOne: true, executeRaw: true, findFirst: false, findFirstOrThrow: false, findMany: false, findRaw: false, findUnique: false, findUniqueOrThrow: false, groupBy: false, queryRaw: false, runCommandRaw: true, updateMany: true, updateOne: true, upsertOne: true };
    function go(e2) {
      return wm[e2];
    }
    var Mn = class {
      constructor(t2) {
        this.options = t2;
        this.tickActive = false;
        this.batches = {};
      }
      request(t2) {
        let r2 = this.options.batchBy(t2);
        return r2 ? (this.batches[r2] || (this.batches[r2] = [], this.tickActive || (this.tickActive = true, process.nextTick(() => {
          this.dispatchBatches(), this.tickActive = false;
        }))), new Promise((n, i2) => {
          this.batches[r2].push({ request: t2, resolve: n, reject: i2 });
        })) : this.options.singleLoader(t2);
      }
      dispatchBatches() {
        for (let t2 in this.batches) {
          let r2 = this.batches[t2];
          delete this.batches[t2], r2.length === 1 ? this.options.singleLoader(r2[0].request).then((n) => {
            n instanceof Error ? r2[0].reject(n) : r2[0].resolve(n);
          }).catch((n) => {
            r2[0].reject(n);
          }) : (r2.sort((n, i2) => this.options.batchOrder(n.request, i2.request)), this.options.batchLoader(r2.map((n) => n.request)).then((n) => {
            if (n instanceof Error) for (let i2 = 0; i2 < r2.length; i2++) r2[i2].reject(n);
            else for (let i2 = 0; i2 < r2.length; i2++) {
              let o = n[i2];
              o instanceof Error ? r2[i2].reject(o) : r2[i2].resolve(o);
            }
          }).catch((n) => {
            for (let i2 = 0; i2 < r2.length; i2++) r2[i2].reject(n);
          }));
        }
      }
      get [Symbol.toStringTag]() {
        return "DataLoader";
      }
    };
    function pt(e2, t2) {
      if (t2 === null) return t2;
      switch (e2) {
        case "bigint":
          return BigInt(t2);
        case "bytes":
          return Buffer.from(t2, "base64");
        case "decimal":
          return new xe(t2);
        case "datetime":
        case "date":
          return new Date(t2);
        case "time":
          return /* @__PURE__ */ new Date(`1970-01-01T${t2}Z`);
        case "bigint-array":
          return t2.map((r2) => pt("bigint", r2));
        case "bytes-array":
          return t2.map((r2) => pt("bytes", r2));
        case "decimal-array":
          return t2.map((r2) => pt("decimal", r2));
        case "datetime-array":
          return t2.map((r2) => pt("datetime", r2));
        case "date-array":
          return t2.map((r2) => pt("date", r2));
        case "time-array":
          return t2.map((r2) => pt("time", r2));
        default:
          return t2;
      }
    }
    function _l(e2) {
      let t2 = [], r2 = xm(e2);
      for (let n = 0; n < e2.rows.length; n++) {
        let i2 = e2.rows[n], o = { ...r2 };
        for (let s2 = 0; s2 < i2.length; s2++) o[e2.columns[s2]] = pt(e2.types[s2], i2[s2]);
        t2.push(o);
      }
      return t2;
    }
    function xm(e2) {
      let t2 = {};
      for (let r2 = 0; r2 < e2.columns.length; r2++) t2[e2.columns[r2]] = null;
      return t2;
    }
    var Pm = L("prisma:client:request_handler");
    var $n = class {
      constructor(t2, r2) {
        this.logEmitter = r2, this.client = t2, this.dataloader = new Mn({ batchLoader: Ma(async ({ requests: n, customDataProxyFetch: i2 }) => {
          let { transaction: o, otelParentCtx: s2 } = n[0], a = n.map((p) => p.protocolQuery), l = this.client._tracingHelper.getTraceParent(s2), u = n.some((p) => go(p.protocolQuery.action));
          return (await this.client._engine.requestBatch(a, { traceparent: l, transaction: vm(o), containsWrite: u, customDataProxyFetch: i2 })).map((p, d) => {
            if (p instanceof Error) return p;
            try {
              return this.mapQueryEngineResult(n[d], p);
            } catch (f3) {
              return f3;
            }
          });
        }), singleLoader: async (n) => {
          let i2 = n.transaction?.kind === "itx" ? Ll(n.transaction) : void 0, o = await this.client._engine.request(n.protocolQuery, { traceparent: this.client._tracingHelper.getTraceParent(), interactiveTransaction: i2, isWrite: go(n.protocolQuery.action), customDataProxyFetch: n.customDataProxyFetch });
          return this.mapQueryEngineResult(n, o);
        }, batchBy: (n) => n.transaction?.id ? `transaction-${n.transaction.id}` : Dl(n.protocolQuery), batchOrder(n, i2) {
          return n.transaction?.kind === "batch" && i2.transaction?.kind === "batch" ? n.transaction.index - i2.transaction.index : 0;
        } });
      }
      async request(t2) {
        try {
          return await this.dataloader.request(t2);
        } catch (r2) {
          let { clientMethod: n, callsite: i2, transaction: o, args: s2, modelName: a } = t2;
          this.handleAndLogRequestError({ error: r2, clientMethod: n, callsite: i2, transaction: o, args: s2, modelName: a, globalOmit: t2.globalOmit });
        }
      }
      mapQueryEngineResult({ dataPath: t2, unpacker: r2 }, n) {
        let i2 = n?.data, o = n?.elapsed, s2 = this.unpack(i2, t2, r2);
        return process.env.PRISMA_CLIENT_GET_TIME ? { data: s2, elapsed: o } : s2;
      }
      handleAndLogRequestError(t2) {
        try {
          this.handleRequestError(t2);
        } catch (r2) {
          throw this.logEmitter && this.logEmitter.emit("error", { message: r2.message, target: t2.clientMethod, timestamp: /* @__PURE__ */ new Date() }), r2;
        }
      }
      handleRequestError({ error: t2, clientMethod: r2, callsite: n, transaction: i2, args: o, modelName: s2, globalOmit: a }) {
        if (Pm(t2), Tm(t2, i2) || t2 instanceof Le) throw t2;
        if (t2 instanceof V && Rm(t2)) {
          let u = Nl(t2.meta);
          wn({ args: o, errors: [u], callsite: n, errorFormat: this.client._errorFormat, originalMethod: r2, clientVersion: this.client._clientVersion, globalOmit: a });
        }
        let l = t2.message;
        if (n && (l = Tt({ callsite: n, originalMethod: r2, isPanic: t2.isPanic, showColors: this.client._errorFormat === "pretty", message: l })), l = this.sanitizeMessage(l), t2.code) {
          let u = s2 ? { modelName: s2, ...t2.meta } : t2.meta;
          throw new V(l, { code: t2.code, clientVersion: this.client._clientVersion, meta: u, batchRequestIdx: t2.batchRequestIdx });
        } else {
          if (t2.isPanic) throw new le(l, this.client._clientVersion);
          if (t2 instanceof B) throw new B(l, { clientVersion: this.client._clientVersion, batchRequestIdx: t2.batchRequestIdx });
          if (t2 instanceof R) throw new R(l, this.client._clientVersion);
          if (t2 instanceof le) throw new le(l, this.client._clientVersion);
        }
        throw t2.clientVersion = this.client._clientVersion, t2;
      }
      sanitizeMessage(t2) {
        return this.client._errorFormat && this.client._errorFormat !== "pretty" ? (0, Fl.default)(t2) : t2;
      }
      unpack(t2, r2, n) {
        if (!t2 || (t2.data && (t2 = t2.data), !t2)) return t2;
        let i2 = Object.keys(t2)[0], o = Object.values(t2)[0], s2 = r2.filter((u) => u !== "select" && u !== "include"), a = Gi(o, s2), l = i2 === "queryRaw" ? _l(a) : wt(a);
        return n ? n(l) : l;
      }
      get [Symbol.toStringTag]() {
        return "RequestHandler";
      }
    };
    function vm(e2) {
      if (e2) {
        if (e2.kind === "batch") return { kind: "batch", options: { isolationLevel: e2.isolationLevel } };
        if (e2.kind === "itx") return { kind: "itx", options: Ll(e2) };
        Fe(e2, "Unknown transaction kind");
      }
    }
    function Ll(e2) {
      return { id: e2.id, payload: e2.payload };
    }
    function Tm(e2, t2) {
      return Nn(e2) && t2?.kind === "batch" && e2.batchRequestIdx !== t2.index;
    }
    function Rm(e2) {
      return e2.code === "P2009" || e2.code === "P2012";
    }
    function Nl(e2) {
      if (e2.kind === "Union") return { kind: "Union", errors: e2.errors.map(Nl) };
      if (Array.isArray(e2.selectionPath)) {
        let [, ...t2] = e2.selectionPath;
        return { ...e2, selectionPath: t2 };
      }
      return e2;
    }
    var Ml = "5.22.0";
    var $l = Ml;
    var Ul = k(Ai());
    var F = class extends Error {
      constructor(t2) {
        super(t2 + `
Read more at https://pris.ly/d/client-constructor`), this.name = "PrismaClientConstructorValidationError";
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientConstructorValidationError";
      }
    };
    w(F, "PrismaClientConstructorValidationError");
    var ql = ["datasources", "datasourceUrl", "errorFormat", "adapter", "log", "transactionOptions", "omit", "__internal"];
    var jl = ["pretty", "colorless", "minimal"];
    var Vl = ["info", "query", "warn", "error"];
    var Sm = { datasources: (e2, { datasourceNames: t2 }) => {
      if (e2) {
        if (typeof e2 != "object" || Array.isArray(e2)) throw new F(`Invalid value ${JSON.stringify(e2)} for "datasources" provided to PrismaClient constructor`);
        for (let [r2, n] of Object.entries(e2)) {
          if (!t2.includes(r2)) {
            let i2 = Vt(r2, t2) || ` Available datasources: ${t2.join(", ")}`;
            throw new F(`Unknown datasource ${r2} provided to PrismaClient constructor.${i2}`);
          }
          if (typeof n != "object" || Array.isArray(n)) throw new F(`Invalid value ${JSON.stringify(e2)} for datasource "${r2}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);
          if (n && typeof n == "object") for (let [i2, o] of Object.entries(n)) {
            if (i2 !== "url") throw new F(`Invalid value ${JSON.stringify(e2)} for datasource "${r2}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);
            if (typeof o != "string") throw new F(`Invalid value ${JSON.stringify(o)} for datasource "${r2}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);
          }
        }
      }
    }, adapter: (e2, t2) => {
      if (e2 === null) return;
      if (e2 === void 0) throw new F('"adapter" property must not be undefined, use null to conditionally disable driver adapters.');
      if (!Fn(t2).includes("driverAdapters")) throw new F('"adapter" property can only be provided to PrismaClient constructor when "driverAdapters" preview feature is enabled.');
      if (Yt() === "binary") throw new F('Cannot use a driver adapter with the "binary" Query Engine. Please use the "library" Query Engine.');
    }, datasourceUrl: (e2) => {
      if (typeof e2 < "u" && typeof e2 != "string") throw new F(`Invalid value ${JSON.stringify(e2)} for "datasourceUrl" provided to PrismaClient constructor.
Expected string or undefined.`);
    }, errorFormat: (e2) => {
      if (e2) {
        if (typeof e2 != "string") throw new F(`Invalid value ${JSON.stringify(e2)} for "errorFormat" provided to PrismaClient constructor.`);
        if (!jl.includes(e2)) {
          let t2 = Vt(e2, jl);
          throw new F(`Invalid errorFormat ${e2} provided to PrismaClient constructor.${t2}`);
        }
      }
    }, log: (e2) => {
      if (!e2) return;
      if (!Array.isArray(e2)) throw new F(`Invalid value ${JSON.stringify(e2)} for "log" provided to PrismaClient constructor.`);
      function t2(r2) {
        if (typeof r2 == "string" && !Vl.includes(r2)) {
          let n = Vt(r2, Vl);
          throw new F(`Invalid log level "${r2}" provided to PrismaClient constructor.${n}`);
        }
      }
      for (let r2 of e2) {
        t2(r2);
        let n = { level: t2, emit: (i2) => {
          let o = ["stdout", "event"];
          if (!o.includes(i2)) {
            let s2 = Vt(i2, o);
            throw new F(`Invalid value ${JSON.stringify(i2)} for "emit" in logLevel provided to PrismaClient constructor.${s2}`);
          }
        } };
        if (r2 && typeof r2 == "object") for (let [i2, o] of Object.entries(r2)) if (n[i2]) n[i2](o);
        else throw new F(`Invalid property ${i2} for "log" provided to PrismaClient constructor`);
      }
    }, transactionOptions: (e2) => {
      if (!e2) return;
      let t2 = e2.maxWait;
      if (t2 != null && t2 <= 0) throw new F(`Invalid value ${t2} for maxWait in "transactionOptions" provided to PrismaClient constructor. maxWait needs to be greater than 0`);
      let r2 = e2.timeout;
      if (r2 != null && r2 <= 0) throw new F(`Invalid value ${r2} for timeout in "transactionOptions" provided to PrismaClient constructor. timeout needs to be greater than 0`);
    }, omit: (e2, t2) => {
      if (typeof e2 != "object") throw new F('"omit" option is expected to be an object.');
      if (e2 === null) throw new F('"omit" option can not be `null`');
      let r2 = [];
      for (let [n, i2] of Object.entries(e2)) {
        let o = Im(n, t2.runtimeDataModel);
        if (!o) {
          r2.push({ kind: "UnknownModel", modelKey: n });
          continue;
        }
        for (let [s2, a] of Object.entries(i2)) {
          let l = o.fields.find((u) => u.name === s2);
          if (!l) {
            r2.push({ kind: "UnknownField", modelKey: n, fieldName: s2 });
            continue;
          }
          if (l.relationName) {
            r2.push({ kind: "RelationInOmit", modelKey: n, fieldName: s2 });
            continue;
          }
          typeof a != "boolean" && r2.push({ kind: "InvalidFieldValue", modelKey: n, fieldName: s2 });
        }
      }
      if (r2.length > 0) throw new F(Om(e2, r2));
    }, __internal: (e2) => {
      if (!e2) return;
      let t2 = ["debug", "engine", "configOverride"];
      if (typeof e2 != "object") throw new F(`Invalid value ${JSON.stringify(e2)} for "__internal" to PrismaClient constructor`);
      for (let [r2] of Object.entries(e2)) if (!t2.includes(r2)) {
        let n = Vt(r2, t2);
        throw new F(`Invalid property ${JSON.stringify(r2)} for "__internal" provided to PrismaClient constructor.${n}`);
      }
    } };
    function Gl(e2, t2) {
      for (let [r2, n] of Object.entries(e2)) {
        if (!ql.includes(r2)) {
          let i2 = Vt(r2, ql);
          throw new F(`Unknown property ${r2} provided to PrismaClient constructor.${i2}`);
        }
        Sm[r2](n, t2);
      }
      if (e2.datasourceUrl && e2.datasources) throw new F('Can not use "datasourceUrl" and "datasources" options at the same time. Pick one of them');
    }
    function Vt(e2, t2) {
      if (t2.length === 0 || typeof e2 != "string") return "";
      let r2 = Am(e2, t2);
      return r2 ? ` Did you mean "${r2}"?` : "";
    }
    function Am(e2, t2) {
      if (t2.length === 0) return null;
      let r2 = t2.map((i2) => ({ value: i2, distance: (0, Ul.default)(e2, i2) }));
      r2.sort((i2, o) => i2.distance < o.distance ? -1 : 1);
      let n = r2[0];
      return n.distance < 3 ? n.value : null;
    }
    function Im(e2, t2) {
      return Bl(t2.models, e2) ?? Bl(t2.types, e2);
    }
    function Bl(e2, t2) {
      let r2 = Object.keys(e2).find((n) => xt(n) === t2);
      if (r2) return e2[r2];
    }
    function Om(e2, t2) {
      let r2 = Ot(e2);
      for (let o of t2) switch (o.kind) {
        case "UnknownModel":
          r2.arguments.getField(o.modelKey)?.markAsError(), r2.addErrorMessage(() => `Unknown model name: ${o.modelKey}.`);
          break;
        case "UnknownField":
          r2.arguments.getDeepField([o.modelKey, o.fieldName])?.markAsError(), r2.addErrorMessage(() => `Model "${o.modelKey}" does not have a field named "${o.fieldName}".`);
          break;
        case "RelationInOmit":
          r2.arguments.getDeepField([o.modelKey, o.fieldName])?.markAsError(), r2.addErrorMessage(() => 'Relations are already excluded by default and can not be specified in "omit".');
          break;
        case "InvalidFieldValue":
          r2.arguments.getDeepFieldValue([o.modelKey, o.fieldName])?.markAsError(), r2.addErrorMessage(() => "Omit field option value must be a boolean.");
          break;
      }
      let { message: n, args: i2 } = En(r2, "colorless");
      return `Error validating "omit" option:

${i2}

${n}`;
    }
    function Ql(e2) {
      return e2.length === 0 ? Promise.resolve([]) : new Promise((t2, r2) => {
        let n = new Array(e2.length), i2 = null, o = false, s2 = 0, a = () => {
          o || (s2++, s2 === e2.length && (o = true, i2 ? r2(i2) : t2(n)));
        }, l = (u) => {
          o || (o = true, r2(u));
        };
        for (let u = 0; u < e2.length; u++) e2[u].then((c) => {
          n[u] = c, a();
        }, (c) => {
          if (!Nn(c)) {
            l(c);
            return;
          }
          c.batchRequestIdx === u ? l(c) : (i2 || (i2 = c), a());
        });
      });
    }
    var tt = L("prisma:client");
    typeof globalThis == "object" && (globalThis.NODE_CLIENT = true);
    var km = { requestArgsToMiddlewareArgs: (e2) => e2, middlewareArgsToRequestArgs: (e2) => e2 };
    var Dm = Symbol.for("prisma.client.transaction.id");
    var _m = { id: 0, nextId() {
      return ++this.id;
    } };
    function Yl(e2) {
      class t2 {
        constructor(n) {
          this._originalClient = this;
          this._middlewares = new Ln();
          this._createPrismaPromise = po();
          this.$extends = Ia;
          e2 = n?.__internal?.configOverride?.(e2) ?? e2, Ba(e2), n && Gl(n, e2);
          let i2 = new Kl.EventEmitter().on("error", () => {
          });
          this._extensions = kt.empty(), this._previewFeatures = Fn(e2), this._clientVersion = e2.clientVersion ?? $l, this._activeProvider = e2.activeProvider, this._globalOmit = n?.omit, this._tracingHelper = Il(this._previewFeatures);
          let o = { rootEnvPath: e2.relativeEnvPaths.rootEnvPath && Fr.default.resolve(e2.dirname, e2.relativeEnvPaths.rootEnvPath), schemaEnvPath: e2.relativeEnvPaths.schemaEnvPath && Fr.default.resolve(e2.dirname, e2.relativeEnvPaths.schemaEnvPath) }, s2;
          if (n?.adapter) {
            s2 = qi(n.adapter);
            let l = e2.activeProvider === "postgresql" ? "postgres" : e2.activeProvider;
            if (s2.provider !== l) throw new R(`The Driver Adapter \`${s2.adapterName}\`, based on \`${s2.provider}\`, is not compatible with the provider \`${l}\` specified in the Prisma schema.`, this._clientVersion);
            if (n.datasources || n.datasourceUrl !== void 0) throw new R("Custom datasource configuration is not compatible with Prisma Driver Adapters. Please define the database connection string directly in the Driver Adapter configuration.", this._clientVersion);
          }
          let a = !s2 && zt(o, { conflictCheck: "none" }) || e2.injectableEdgeEnv?.();
          try {
            let l = n ?? {}, u = l.__internal ?? {}, c = u.debug === true;
            c && L.enable("prisma:client");
            let p = Fr.default.resolve(e2.dirname, e2.relativePath);
            zl.default.existsSync(p) || (p = e2.dirname), tt("dirname", e2.dirname), tt("relativePath", e2.relativePath), tt("cwd", p);
            let d = u.engine || {};
            if (l.errorFormat ? this._errorFormat = l.errorFormat : process.env.NODE_ENV === "production" ? this._errorFormat = "minimal" : process.env.NO_COLOR ? this._errorFormat = "colorless" : this._errorFormat = "colorless", this._runtimeDataModel = e2.runtimeDataModel, this._engineConfig = { cwd: p, dirname: e2.dirname, enableDebugLogs: c, allowTriggerPanic: d.allowTriggerPanic, datamodelPath: Fr.default.join(e2.dirname, e2.filename ?? "schema.prisma"), prismaPath: d.binaryPath ?? void 0, engineEndpoint: d.endpoint, generator: e2.generator, showColors: this._errorFormat === "pretty", logLevel: l.log && kl(l.log), logQueries: l.log && !!(typeof l.log == "string" ? l.log === "query" : l.log.find((f3) => typeof f3 == "string" ? f3 === "query" : f3.level === "query")), env: a?.parsed ?? {}, flags: [], engineWasm: e2.engineWasm, clientVersion: e2.clientVersion, engineVersion: e2.engineVersion, previewFeatures: this._previewFeatures, activeProvider: e2.activeProvider, inlineSchema: e2.inlineSchema, overrideDatasources: Ua(l, e2.datasourceNames), inlineDatasources: e2.inlineDatasources, inlineSchemaHash: e2.inlineSchemaHash, tracingHelper: this._tracingHelper, transactionOptions: { maxWait: l.transactionOptions?.maxWait ?? 2e3, timeout: l.transactionOptions?.timeout ?? 5e3, isolationLevel: l.transactionOptions?.isolationLevel }, logEmitter: i2, isBundled: e2.isBundled, adapter: s2 }, this._accelerateEngineConfig = { ...this._engineConfig, accelerateUtils: { resolveDatasourceUrl: Nt, getBatchRequestPayload: Ft, prismaGraphQLToJSError: st, PrismaClientUnknownRequestError: B, PrismaClientInitializationError: R, PrismaClientKnownRequestError: V, debug: L("prisma:client:accelerateEngine"), engineVersion: Wl.version, clientVersion: e2.clientVersion } }, tt("clientVersion", e2.clientVersion), this._engine = hl(e2, this._engineConfig), this._requestHandler = new $n(this, i2), l.log) for (let f3 of l.log) {
              let g = typeof f3 == "string" ? f3 : f3.emit === "stdout" ? f3.level : null;
              g && this.$on(g, (h2) => {
                er.log(`${er.tags[g] ?? ""}`, h2.message || h2.query);
              });
            }
            this._metrics = new Dt(this._engine);
          } catch (l) {
            throw l.clientVersion = this._clientVersion, l;
          }
          return this._appliedParent = yr(this);
        }
        get [Symbol.toStringTag]() {
          return "PrismaClient";
        }
        $use(n) {
          this._middlewares.use(n);
        }
        $on(n, i2) {
          n === "beforeExit" ? this._engine.onBeforeExit(i2) : n && this._engineConfig.logEmitter.on(n, i2);
        }
        $connect() {
          try {
            return this._engine.start();
          } catch (n) {
            throw n.clientVersion = this._clientVersion, n;
          }
        }
        async $disconnect() {
          try {
            await this._engine.stop();
          } catch (n) {
            throw n.clientVersion = this._clientVersion, n;
          } finally {
            Ao();
          }
        }
        $executeRawInternal(n, i2, o, s2) {
          let a = this._activeProvider;
          return this._request({ action: "executeRaw", args: o, transaction: n, clientMethod: i2, argsMapper: co({ clientMethod: i2, activeProvider: a }), callsite: Ze(this._errorFormat), dataPath: [], middlewareArgsMapper: s2 });
        }
        $executeRaw(n, ...i2) {
          return this._createPrismaPromise((o) => {
            if (n.raw !== void 0 || n.sql !== void 0) {
              let [s2, a] = Jl(n, i2);
              return uo(this._activeProvider, s2.text, s2.values, Array.isArray(n) ? "prisma.$executeRaw`<SQL>`" : "prisma.$executeRaw(sql`<SQL>`)"), this.$executeRawInternal(o, "$executeRaw", s2, a);
            }
            throw new J("`$executeRaw` is a tag function, please use it like the following:\n```\nconst result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`\n```\n\nOr read our docs at https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#executeraw\n", { clientVersion: this._clientVersion });
          });
        }
        $executeRawUnsafe(n, ...i2) {
          return this._createPrismaPromise((o) => (uo(this._activeProvider, n, i2, "prisma.$executeRawUnsafe(<SQL>, [...values])"), this.$executeRawInternal(o, "$executeRawUnsafe", [n, ...i2])));
        }
        $runCommandRaw(n) {
          if (e2.activeProvider !== "mongodb") throw new J(`The ${e2.activeProvider} provider does not support $runCommandRaw. Use the mongodb provider.`, { clientVersion: this._clientVersion });
          return this._createPrismaPromise((i2) => this._request({ args: n, clientMethod: "$runCommandRaw", dataPath: [], action: "runCommandRaw", argsMapper: yl, callsite: Ze(this._errorFormat), transaction: i2 }));
        }
        async $queryRawInternal(n, i2, o, s2) {
          let a = this._activeProvider;
          return this._request({ action: "queryRaw", args: o, transaction: n, clientMethod: i2, argsMapper: co({ clientMethod: i2, activeProvider: a }), callsite: Ze(this._errorFormat), dataPath: [], middlewareArgsMapper: s2 });
        }
        $queryRaw(n, ...i2) {
          return this._createPrismaPromise((o) => {
            if (n.raw !== void 0 || n.sql !== void 0) return this.$queryRawInternal(o, "$queryRaw", ...Jl(n, i2));
            throw new J("`$queryRaw` is a tag function, please use it like the following:\n```\nconst result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`\n```\n\nOr read our docs at https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#queryraw\n", { clientVersion: this._clientVersion });
          });
        }
        $queryRawTyped(n) {
          return this._createPrismaPromise((i2) => {
            if (!this._hasPreviewFlag("typedSql")) throw new J("`typedSql` preview feature must be enabled in order to access $queryRawTyped API", { clientVersion: this._clientVersion });
            return this.$queryRawInternal(i2, "$queryRawTyped", n);
          });
        }
        $queryRawUnsafe(n, ...i2) {
          return this._createPrismaPromise((o) => this.$queryRawInternal(o, "$queryRawUnsafe", [n, ...i2]));
        }
        _transactionWithArray({ promises: n, options: i2 }) {
          let o = _m.nextId(), s2 = Ol(n.length), a = n.map((l, u) => {
            if (l?.[Symbol.toStringTag] !== "PrismaPromise") throw new Error("All elements of the array need to be Prisma Client promises. Hint: Please make sure you are not awaiting the Prisma client calls you intended to pass in the $transaction function.");
            let c = i2?.isolationLevel ?? this._engineConfig.transactionOptions.isolationLevel, p = { kind: "batch", id: o, index: u, isolationLevel: c, lock: s2 };
            return l.requestTransaction?.(p) ?? l;
          });
          return Ql(a);
        }
        async _transactionWithCallback({ callback: n, options: i2 }) {
          let o = { traceparent: this._tracingHelper.getTraceParent() }, s2 = { maxWait: i2?.maxWait ?? this._engineConfig.transactionOptions.maxWait, timeout: i2?.timeout ?? this._engineConfig.transactionOptions.timeout, isolationLevel: i2?.isolationLevel ?? this._engineConfig.transactionOptions.isolationLevel }, a = await this._engine.transaction("start", o, s2), l;
          try {
            let u = { kind: "itx", ...a };
            l = await n(this._createItxClient(u)), await this._engine.transaction("commit", o, a);
          } catch (u) {
            throw await this._engine.transaction("rollback", o, a).catch(() => {
            }), u;
          }
          return l;
        }
        _createItxClient(n) {
          return yr(Se(Aa(this), [re("_appliedParent", () => this._appliedParent._createItxClient(n)), re("_createPrismaPromise", () => po(n)), re(Dm, () => n.id), _t(vl)]));
        }
        $transaction(n, i2) {
          let o;
          typeof n == "function" ? this._engineConfig.adapter?.adapterName === "@prisma/adapter-d1" ? o = () => {
            throw new Error("Cloudflare D1 does not support interactive transactions. We recommend you to refactor your queries with that limitation in mind, and use batch transactions with `prisma.$transactions([])` where applicable.");
          } : o = () => this._transactionWithCallback({ callback: n, options: i2 }) : o = () => this._transactionWithArray({ promises: n, options: i2 });
          let s2 = { name: "transaction", attributes: { method: "$transaction" } };
          return this._tracingHelper.runInChildSpan(s2, o);
        }
        _request(n) {
          n.otelParentCtx = this._tracingHelper.getActiveContext();
          let i2 = n.middlewareArgsMapper ?? km, o = { args: i2.requestArgsToMiddlewareArgs(n.args), dataPath: n.dataPath, runInTransaction: !!n.transaction, action: n.action, model: n.model }, s2 = { middleware: { name: "middleware", middleware: true, attributes: { method: "$use" }, active: false }, operation: { name: "operation", attributes: { method: o.action, model: o.model, name: o.model ? `${o.model}.${o.action}` : o.action } } }, a = -1, l = async (u) => {
            let c = this._middlewares.get(++a);
            if (c) return this._tracingHelper.runInChildSpan(s2.middleware, (O) => c(u, (T) => (O?.end(), l(T))));
            let { runInTransaction: p, args: d, ...f3 } = u, g = { ...n, ...f3 };
            d && (g.args = i2.middlewareArgsToRequestArgs(d)), n.transaction !== void 0 && p === false && delete g.transaction;
            let h2 = await Na(this, g);
            return g.model ? Da({ result: h2, modelName: g.model, args: g.args, extensions: this._extensions, runtimeDataModel: this._runtimeDataModel, globalOmit: this._globalOmit }) : h2;
          };
          return this._tracingHelper.runInChildSpan(s2.operation, () => new Hl.AsyncResource("prisma-client-request").runInAsyncScope(() => l(o)));
        }
        async _executeRequest({ args: n, clientMethod: i2, dataPath: o, callsite: s2, action: a, model: l, argsMapper: u, transaction: c, unpacker: p, otelParentCtx: d, customDataProxyFetch: f3 }) {
          try {
            n = u ? u(n) : n;
            let g = { name: "serialize" }, h2 = this._tracingHelper.runInChildSpan(g, () => vn({ modelName: l, runtimeDataModel: this._runtimeDataModel, action: a, args: n, clientMethod: i2, callsite: s2, extensions: this._extensions, errorFormat: this._errorFormat, clientVersion: this._clientVersion, previewFeatures: this._previewFeatures, globalOmit: this._globalOmit }));
            return L.enabled("prisma:client") && (tt("Prisma Client call:"), tt(`prisma.${i2}(${ha(n)})`), tt("Generated request:"), tt(JSON.stringify(h2, null, 2) + `
`)), c?.kind === "batch" && await c.lock, this._requestHandler.request({ protocolQuery: h2, modelName: l, action: a, clientMethod: i2, dataPath: o, callsite: s2, args: n, extensions: this._extensions, transaction: c, unpacker: p, otelParentCtx: d, otelChildCtx: this._tracingHelper.getActiveContext(), globalOmit: this._globalOmit, customDataProxyFetch: f3 });
          } catch (g) {
            throw g.clientVersion = this._clientVersion, g;
          }
        }
        get $metrics() {
          if (!this._hasPreviewFlag("metrics")) throw new J("`metrics` preview feature must be enabled in order to access metrics API", { clientVersion: this._clientVersion });
          return this._metrics;
        }
        _hasPreviewFlag(n) {
          return !!this._engineConfig.previewFeatures?.includes(n);
        }
        $applyPendingMigrations() {
          return this._engine.applyPendingMigrations();
        }
      }
      return t2;
    }
    function Jl(e2, t2) {
      return Fm(e2) ? [new oe(e2, t2), Rl] : [e2, Cl];
    }
    function Fm(e2) {
      return Array.isArray(e2) && Array.isArray(e2.raw);
    }
    var Lm = /* @__PURE__ */ new Set(["toJSON", "$$typeof", "asymmetricMatch", Symbol.iterator, Symbol.toStringTag, Symbol.isConcatSpreadable, Symbol.toPrimitive]);
    function Zl(e2) {
      return new Proxy(e2, { get(t2, r2) {
        if (r2 in t2) return t2[r2];
        if (!Lm.has(r2)) throw new TypeError(`Invalid enum value: ${String(r2)}`);
      } });
    }
    function Xl(e2) {
      zt(e2, { conflictCheck: "warn" });
    }
  }
});

// node_modules/.prisma/client/index.js
var require_client = __commonJS({
  "node_modules/.prisma/client/index.js"(exports2) {
    Object.defineProperty(exports2, "__esModule", { value: true });
    var {
      PrismaClientKnownRequestError: PrismaClientKnownRequestError2,
      PrismaClientUnknownRequestError: PrismaClientUnknownRequestError2,
      PrismaClientRustPanicError: PrismaClientRustPanicError2,
      PrismaClientInitializationError: PrismaClientInitializationError2,
      PrismaClientValidationError: PrismaClientValidationError2,
      NotFoundError: NotFoundError2,
      getPrismaClient: getPrismaClient2,
      sqltag: sqltag2,
      empty: empty2,
      join: join2,
      raw: raw2,
      skip: skip2,
      Decimal: Decimal2,
      Debug: Debug2,
      objectEnumValues: objectEnumValues2,
      makeStrictEnum: makeStrictEnum2,
      Extensions: Extensions2,
      warnOnce: warnOnce2,
      defineDmmfProperty: defineDmmfProperty2,
      Public: Public2,
      getRuntime: getRuntime2
    } = require_library();
    var Prisma = {};
    exports2.Prisma = Prisma;
    exports2.$Enums = {};
    Prisma.prismaVersion = {
      client: "5.22.0",
      engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
    };
    Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError2;
    Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError2;
    Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError2;
    Prisma.PrismaClientInitializationError = PrismaClientInitializationError2;
    Prisma.PrismaClientValidationError = PrismaClientValidationError2;
    Prisma.NotFoundError = NotFoundError2;
    Prisma.Decimal = Decimal2;
    Prisma.sql = sqltag2;
    Prisma.empty = empty2;
    Prisma.join = join2;
    Prisma.raw = raw2;
    Prisma.validator = Public2.validator;
    Prisma.getExtensionContext = Extensions2.getExtensionContext;
    Prisma.defineExtension = Extensions2.defineExtension;
    Prisma.DbNull = objectEnumValues2.instances.DbNull;
    Prisma.JsonNull = objectEnumValues2.instances.JsonNull;
    Prisma.AnyNull = objectEnumValues2.instances.AnyNull;
    Prisma.NullTypes = {
      DbNull: objectEnumValues2.classes.DbNull,
      JsonNull: objectEnumValues2.classes.JsonNull,
      AnyNull: objectEnumValues2.classes.AnyNull
    };
    var path = require("path");
    exports2.Prisma.TransactionIsolationLevel = makeStrictEnum2({
      Serializable: "Serializable"
    });
    exports2.Prisma.CategoryScalarFieldEnum = {
      id: "id",
      parentId: "parentId",
      level: "level",
      name: "name",
      sourceName: "sourceName"
    };
    exports2.Prisma.ProductScalarFieldEnum = {
      id: "id",
      categoryId: "categoryId",
      name: "name",
      description: "description",
      price: "price",
      sourceName: "sourceName"
    };
    exports2.Prisma.ProductVariantScalarFieldEnum = {
      id: "id",
      productId: "productId",
      name: "name",
      sourceName: "sourceName",
      value: "value",
      price: "price"
    };
    exports2.Prisma.SortOrder = {
      asc: "asc",
      desc: "desc"
    };
    exports2.Prisma.NullsOrder = {
      first: "first",
      last: "last"
    };
    exports2.Prisma.ModelName = {
      Category: "Category",
      Product: "Product",
      ProductVariant: "ProductVariant"
    };
    var config2 = {
      "generator": {
        "name": "client",
        "provider": {
          "fromEnvVar": null,
          "value": "prisma-client-js"
        },
        "output": {
          "value": "/Users/v_adamets/projects/other_prj/online-store/node_modules/.prisma/client",
          "fromEnvVar": null
        },
        "config": {
          "engineType": "library"
        },
        "binaryTargets": [
          {
            "fromEnvVar": null,
            "value": "darwin-arm64",
            "native": true
          }
        ],
        "previewFeatures": [],
        "sourceFilePath": "/Users/v_adamets/projects/other_prj/online-store/prisma/schema.prisma",
        "isCustomOutput": true
      },
      "relativeEnvPaths": {
        "rootEnvPath": null,
        "schemaEnvPath": "../../../.env"
      },
      "relativePath": "../../../prisma",
      "clientVersion": "5.22.0",
      "engineVersion": "605197351a3c8bdd595af2d2a9bc3025bca48ea2",
      "datasourceNames": [
        "db"
      ],
      "activeProvider": "sqlite",
      "postinstall": false,
      "inlineDatasources": {
        "db": {
          "url": {
            "fromEnvVar": "DATABASE_URL",
            "value": null
          }
        }
      },
      "inlineSchema": '// prisma/schema.prisma\ngenerator client {\n  provider = "prisma-client-js"\n  output   = "../node_modules/.prisma/client"\n}\n\ndatasource db {\n  provider = "sqlite"\n  url      = env("DATABASE_URL")\n}\n\nmodel Category {\n  id         String  @id\n  parentId   String?\n  level      Int\n  name       String\n  sourceName String\n\n  parent        Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])\n  subCategories Category[] @relation("CategoryHierarchy")\n  products      Product[]\n}\n\nmodel Product {\n  id          String  @id\n  categoryId  String?\n  name        String\n  description String?\n  price       Float?\n  sourceName  String\n\n  category       Category?        @relation(fields: [categoryId], references: [id])\n  ProductVariant ProductVariant[]\n}\n\nmodel ProductVariant {\n  id         String @id\n  productId  String\n  name       String\n  sourceName String\n  value      String\n  price      Float\n\n  product Product @relation(fields: [productId], references: [id])\n}\n',
      "inlineSchemaHash": "ecf0745f740aadadf532a83521bdd2271207d719a4ae6b14b11d1af8ffba5132",
      "copyEngine": true
    };
    var fs3 = require("fs");
    config2.dirname = __dirname;
    if (!fs3.existsSync(path.join(__dirname, "schema.prisma"))) {
      const alternativePaths = [
        "node_modules/.prisma/client",
        ".prisma/client"
      ];
      const alternativePath = alternativePaths.find((altPath) => {
        return fs3.existsSync(path.join(process.cwd(), altPath, "schema.prisma"));
      }) ?? alternativePaths[0];
      config2.dirname = path.join(process.cwd(), alternativePath);
      config2.isBundled = true;
    }
    config2.runtimeDataModel = JSON.parse('{"models":{"Category":{"dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"parentId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"level","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"sourceName","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"parent","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Category","relationName":"CategoryHierarchy","relationFromFields":["parentId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"subCategories","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Category","relationName":"CategoryHierarchy","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"products","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Product","relationName":"CategoryToProduct","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Product":{"dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"categoryId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"price","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Float","isGenerated":false,"isUpdatedAt":false},{"name":"sourceName","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"category","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Category","relationName":"CategoryToProduct","relationFromFields":["categoryId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"ProductVariant","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"ProductVariant","relationName":"ProductToProductVariant","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"ProductVariant":{"dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"productId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"sourceName","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"value","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"price","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Float","isGenerated":false,"isUpdatedAt":false},{"name":"product","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Product","relationName":"ProductToProductVariant","relationFromFields":["productId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false}},"enums":{},"types":{}}');
    defineDmmfProperty2(exports2.Prisma, config2.runtimeDataModel);
    config2.engineWasm = void 0;
    var { warnEnvConflicts: warnEnvConflicts2 } = require_library();
    warnEnvConflicts2({
      rootEnvPath: config2.relativeEnvPaths.rootEnvPath && path.resolve(config2.dirname, config2.relativeEnvPaths.rootEnvPath),
      schemaEnvPath: config2.relativeEnvPaths.schemaEnvPath && path.resolve(config2.dirname, config2.relativeEnvPaths.schemaEnvPath)
    });
    var PrismaClient2 = getPrismaClient2(config2);
    exports2.PrismaClient = PrismaClient2;
    Object.assign(exports2, Prisma);
    path.join(__dirname, "libquery_engine-darwin-arm64.dylib.node");
    path.join(process.cwd(), "node_modules/.prisma/client/libquery_engine-darwin-arm64.dylib.node");
    path.join(__dirname, "schema.prisma");
    path.join(process.cwd(), "node_modules/.prisma/client/schema.prisma");
  }
});

// node_modules/.prisma/client/default.js
var require_default = __commonJS({
  "node_modules/.prisma/client/default.js"(exports2, module2) {
    module2.exports = { ...require_client() };
  }
});

// node_modules/@prisma/client/default.js
var require_default2 = __commonJS({
  "node_modules/@prisma/client/default.js"(exports2, module2) {
    module2.exports = {
      ...require_default()
    };
  }
});

// node_modules/xml2js/lib/defaults.js
var require_defaults = __commonJS({
  "node_modules/xml2js/lib/defaults.js"(exports2) {
    (function() {
      exports2.defaults = {
        "0.1": {
          explicitCharkey: false,
          trim: true,
          normalize: true,
          normalizeTags: false,
          attrkey: "@",
          charkey: "#",
          explicitArray: false,
          ignoreAttrs: false,
          mergeAttrs: false,
          explicitRoot: false,
          validator: null,
          xmlns: false,
          explicitChildren: false,
          childkey: "@@",
          charsAsChildren: false,
          includeWhiteChars: false,
          async: false,
          strict: true,
          attrNameProcessors: null,
          attrValueProcessors: null,
          tagNameProcessors: null,
          valueProcessors: null,
          emptyTag: ""
        },
        "0.2": {
          explicitCharkey: false,
          trim: false,
          normalize: false,
          normalizeTags: false,
          attrkey: "$",
          charkey: "_",
          explicitArray: true,
          ignoreAttrs: false,
          mergeAttrs: false,
          explicitRoot: true,
          validator: null,
          xmlns: false,
          explicitChildren: false,
          preserveChildrenOrder: false,
          childkey: "$$",
          charsAsChildren: false,
          includeWhiteChars: false,
          async: false,
          strict: true,
          attrNameProcessors: null,
          attrValueProcessors: null,
          tagNameProcessors: null,
          valueProcessors: null,
          rootName: "root",
          xmldec: {
            "version": "1.0",
            "encoding": "UTF-8",
            "standalone": true
          },
          doctype: null,
          renderOpts: {
            "pretty": true,
            "indent": "  ",
            "newline": "\n"
          },
          headless: false,
          chunkSize: 1e4,
          emptyTag: "",
          cdata: false
        }
      };
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/Utility.js
var require_Utility = __commonJS({
  "node_modules/xmlbuilder/lib/Utility.js"(exports2, module2) {
    (function() {
      var assign, getValue, isArray, isEmpty, isFunction, isObject, isPlainObject, slice = [].slice, hasProp = {}.hasOwnProperty;
      assign = function() {
        var i2, key, len, source, sources, target;
        target = arguments[0], sources = 2 <= arguments.length ? slice.call(arguments, 1) : [];
        if (isFunction(Object.assign)) {
          Object.assign.apply(null, arguments);
        } else {
          for (i2 = 0, len = sources.length; i2 < len; i2++) {
            source = sources[i2];
            if (source != null) {
              for (key in source) {
                if (!hasProp.call(source, key)) continue;
                target[key] = source[key];
              }
            }
          }
        }
        return target;
      };
      isFunction = function(val) {
        return !!val && Object.prototype.toString.call(val) === "[object Function]";
      };
      isObject = function(val) {
        var ref;
        return !!val && ((ref = typeof val) === "function" || ref === "object");
      };
      isArray = function(val) {
        if (isFunction(Array.isArray)) {
          return Array.isArray(val);
        } else {
          return Object.prototype.toString.call(val) === "[object Array]";
        }
      };
      isEmpty = function(val) {
        var key;
        if (isArray(val)) {
          return !val.length;
        } else {
          for (key in val) {
            if (!hasProp.call(val, key)) continue;
            return false;
          }
          return true;
        }
      };
      isPlainObject = function(val) {
        var ctor, proto;
        return isObject(val) && (proto = Object.getPrototypeOf(val)) && (ctor = proto.constructor) && typeof ctor === "function" && ctor instanceof ctor && Function.prototype.toString.call(ctor) === Function.prototype.toString.call(Object);
      };
      getValue = function(obj) {
        if (isFunction(obj.valueOf)) {
          return obj.valueOf();
        } else {
          return obj;
        }
      };
      module2.exports.assign = assign;
      module2.exports.isFunction = isFunction;
      module2.exports.isObject = isObject;
      module2.exports.isArray = isArray;
      module2.exports.isEmpty = isEmpty;
      module2.exports.isPlainObject = isPlainObject;
      module2.exports.getValue = getValue;
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDOMImplementation.js
var require_XMLDOMImplementation = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDOMImplementation.js"(exports2, module2) {
    (function() {
      var XMLDOMImplementation;
      module2.exports = XMLDOMImplementation = function() {
        function XMLDOMImplementation2() {
        }
        XMLDOMImplementation2.prototype.hasFeature = function(feature, version) {
          return true;
        };
        XMLDOMImplementation2.prototype.createDocumentType = function(qualifiedName, publicId, systemId) {
          throw new Error("This DOM method is not implemented.");
        };
        XMLDOMImplementation2.prototype.createDocument = function(namespaceURI, qualifiedName, doctype) {
          throw new Error("This DOM method is not implemented.");
        };
        XMLDOMImplementation2.prototype.createHTMLDocument = function(title) {
          throw new Error("This DOM method is not implemented.");
        };
        XMLDOMImplementation2.prototype.getFeature = function(feature, version) {
          throw new Error("This DOM method is not implemented.");
        };
        return XMLDOMImplementation2;
      }();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDOMErrorHandler.js
var require_XMLDOMErrorHandler = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDOMErrorHandler.js"(exports2, module2) {
    (function() {
      var XMLDOMErrorHandler;
      module2.exports = XMLDOMErrorHandler = function() {
        function XMLDOMErrorHandler2() {
        }
        XMLDOMErrorHandler2.prototype.handleError = function(error) {
          throw new Error(error);
        };
        return XMLDOMErrorHandler2;
      }();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDOMStringList.js
var require_XMLDOMStringList = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDOMStringList.js"(exports2, module2) {
    (function() {
      var XMLDOMStringList;
      module2.exports = XMLDOMStringList = function() {
        function XMLDOMStringList2(arr) {
          this.arr = arr || [];
        }
        Object.defineProperty(XMLDOMStringList2.prototype, "length", {
          get: function() {
            return this.arr.length;
          }
        });
        XMLDOMStringList2.prototype.item = function(index) {
          return this.arr[index] || null;
        };
        XMLDOMStringList2.prototype.contains = function(str) {
          return this.arr.indexOf(str) !== -1;
        };
        return XMLDOMStringList2;
      }();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDOMConfiguration.js
var require_XMLDOMConfiguration = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDOMConfiguration.js"(exports2, module2) {
    (function() {
      var XMLDOMConfiguration, XMLDOMErrorHandler, XMLDOMStringList;
      XMLDOMErrorHandler = require_XMLDOMErrorHandler();
      XMLDOMStringList = require_XMLDOMStringList();
      module2.exports = XMLDOMConfiguration = function() {
        function XMLDOMConfiguration2() {
          var clonedSelf;
          this.defaultParams = {
            "canonical-form": false,
            "cdata-sections": false,
            "comments": false,
            "datatype-normalization": false,
            "element-content-whitespace": true,
            "entities": true,
            "error-handler": new XMLDOMErrorHandler(),
            "infoset": true,
            "validate-if-schema": false,
            "namespaces": true,
            "namespace-declarations": true,
            "normalize-characters": false,
            "schema-location": "",
            "schema-type": "",
            "split-cdata-sections": true,
            "validate": false,
            "well-formed": true
          };
          this.params = clonedSelf = Object.create(this.defaultParams);
        }
        Object.defineProperty(XMLDOMConfiguration2.prototype, "parameterNames", {
          get: function() {
            return new XMLDOMStringList(Object.keys(this.defaultParams));
          }
        });
        XMLDOMConfiguration2.prototype.getParameter = function(name) {
          if (this.params.hasOwnProperty(name)) {
            return this.params[name];
          } else {
            return null;
          }
        };
        XMLDOMConfiguration2.prototype.canSetParameter = function(name, value) {
          return true;
        };
        XMLDOMConfiguration2.prototype.setParameter = function(name, value) {
          if (value != null) {
            return this.params[name] = value;
          } else {
            return delete this.params[name];
          }
        };
        return XMLDOMConfiguration2;
      }();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/NodeType.js
var require_NodeType = __commonJS({
  "node_modules/xmlbuilder/lib/NodeType.js"(exports2, module2) {
    (function() {
      module2.exports = {
        Element: 1,
        Attribute: 2,
        Text: 3,
        CData: 4,
        EntityReference: 5,
        EntityDeclaration: 6,
        ProcessingInstruction: 7,
        Comment: 8,
        Document: 9,
        DocType: 10,
        DocumentFragment: 11,
        NotationDeclaration: 12,
        Declaration: 201,
        Raw: 202,
        AttributeDeclaration: 203,
        ElementDeclaration: 204,
        Dummy: 205
      };
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLAttribute.js
var require_XMLAttribute = __commonJS({
  "node_modules/xmlbuilder/lib/XMLAttribute.js"(exports2, module2) {
    (function() {
      var NodeType, XMLAttribute, XMLNode;
      NodeType = require_NodeType();
      XMLNode = require_XMLNode();
      module2.exports = XMLAttribute = function() {
        function XMLAttribute2(parent, name, value) {
          this.parent = parent;
          if (this.parent) {
            this.options = this.parent.options;
            this.stringify = this.parent.stringify;
          }
          if (name == null) {
            throw new Error("Missing attribute name. " + this.debugInfo(name));
          }
          this.name = this.stringify.name(name);
          this.value = this.stringify.attValue(value);
          this.type = NodeType.Attribute;
          this.isId = false;
          this.schemaTypeInfo = null;
        }
        Object.defineProperty(XMLAttribute2.prototype, "nodeType", {
          get: function() {
            return this.type;
          }
        });
        Object.defineProperty(XMLAttribute2.prototype, "ownerElement", {
          get: function() {
            return this.parent;
          }
        });
        Object.defineProperty(XMLAttribute2.prototype, "textContent", {
          get: function() {
            return this.value;
          },
          set: function(value) {
            return this.value = value || "";
          }
        });
        Object.defineProperty(XMLAttribute2.prototype, "namespaceURI", {
          get: function() {
            return "";
          }
        });
        Object.defineProperty(XMLAttribute2.prototype, "prefix", {
          get: function() {
            return "";
          }
        });
        Object.defineProperty(XMLAttribute2.prototype, "localName", {
          get: function() {
            return this.name;
          }
        });
        Object.defineProperty(XMLAttribute2.prototype, "specified", {
          get: function() {
            return true;
          }
        });
        XMLAttribute2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLAttribute2.prototype.toString = function(options) {
          return this.options.writer.attribute(this, this.options.writer.filterOptions(options));
        };
        XMLAttribute2.prototype.debugInfo = function(name) {
          name = name || this.name;
          if (name == null) {
            return "parent: <" + this.parent.name + ">";
          } else {
            return "attribute: {" + name + "}, parent: <" + this.parent.name + ">";
          }
        };
        XMLAttribute2.prototype.isEqualNode = function(node) {
          if (node.namespaceURI !== this.namespaceURI) {
            return false;
          }
          if (node.prefix !== this.prefix) {
            return false;
          }
          if (node.localName !== this.localName) {
            return false;
          }
          if (node.value !== this.value) {
            return false;
          }
          return true;
        };
        return XMLAttribute2;
      }();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLNamedNodeMap.js
var require_XMLNamedNodeMap = __commonJS({
  "node_modules/xmlbuilder/lib/XMLNamedNodeMap.js"(exports2, module2) {
    (function() {
      var XMLNamedNodeMap;
      module2.exports = XMLNamedNodeMap = function() {
        function XMLNamedNodeMap2(nodes) {
          this.nodes = nodes;
        }
        Object.defineProperty(XMLNamedNodeMap2.prototype, "length", {
          get: function() {
            return Object.keys(this.nodes).length || 0;
          }
        });
        XMLNamedNodeMap2.prototype.clone = function() {
          return this.nodes = null;
        };
        XMLNamedNodeMap2.prototype.getNamedItem = function(name) {
          return this.nodes[name];
        };
        XMLNamedNodeMap2.prototype.setNamedItem = function(node) {
          var oldNode;
          oldNode = this.nodes[node.nodeName];
          this.nodes[node.nodeName] = node;
          return oldNode || null;
        };
        XMLNamedNodeMap2.prototype.removeNamedItem = function(name) {
          var oldNode;
          oldNode = this.nodes[name];
          delete this.nodes[name];
          return oldNode || null;
        };
        XMLNamedNodeMap2.prototype.item = function(index) {
          return this.nodes[Object.keys(this.nodes)[index]] || null;
        };
        XMLNamedNodeMap2.prototype.getNamedItemNS = function(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented.");
        };
        XMLNamedNodeMap2.prototype.setNamedItemNS = function(node) {
          throw new Error("This DOM method is not implemented.");
        };
        XMLNamedNodeMap2.prototype.removeNamedItemNS = function(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented.");
        };
        return XMLNamedNodeMap2;
      }();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLElement.js
var require_XMLElement = __commonJS({
  "node_modules/xmlbuilder/lib/XMLElement.js"(exports2, module2) {
    (function() {
      var NodeType, XMLAttribute, XMLElement, XMLNamedNodeMap, XMLNode, getValue, isFunction, isObject, ref, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      ref = require_Utility(), isObject = ref.isObject, isFunction = ref.isFunction, getValue = ref.getValue;
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      XMLAttribute = require_XMLAttribute();
      XMLNamedNodeMap = require_XMLNamedNodeMap();
      module2.exports = XMLElement = function(superClass) {
        extend(XMLElement2, superClass);
        function XMLElement2(parent, name, attributes) {
          var child, j2, len, ref1;
          XMLElement2.__super__.constructor.call(this, parent);
          if (name == null) {
            throw new Error("Missing element name. " + this.debugInfo());
          }
          this.name = this.stringify.name(name);
          this.type = NodeType.Element;
          this.attribs = {};
          this.schemaTypeInfo = null;
          if (attributes != null) {
            this.attribute(attributes);
          }
          if (parent.type === NodeType.Document) {
            this.isRoot = true;
            this.documentObject = parent;
            parent.rootObject = this;
            if (parent.children) {
              ref1 = parent.children;
              for (j2 = 0, len = ref1.length; j2 < len; j2++) {
                child = ref1[j2];
                if (child.type === NodeType.DocType) {
                  child.name = this.name;
                  break;
                }
              }
            }
          }
        }
        Object.defineProperty(XMLElement2.prototype, "tagName", {
          get: function() {
            return this.name;
          }
        });
        Object.defineProperty(XMLElement2.prototype, "namespaceURI", {
          get: function() {
            return "";
          }
        });
        Object.defineProperty(XMLElement2.prototype, "prefix", {
          get: function() {
            return "";
          }
        });
        Object.defineProperty(XMLElement2.prototype, "localName", {
          get: function() {
            return this.name;
          }
        });
        Object.defineProperty(XMLElement2.prototype, "id", {
          get: function() {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
        });
        Object.defineProperty(XMLElement2.prototype, "className", {
          get: function() {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
        });
        Object.defineProperty(XMLElement2.prototype, "classList", {
          get: function() {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
        });
        Object.defineProperty(XMLElement2.prototype, "attributes", {
          get: function() {
            if (!this.attributeMap || !this.attributeMap.nodes) {
              this.attributeMap = new XMLNamedNodeMap(this.attribs);
            }
            return this.attributeMap;
          }
        });
        XMLElement2.prototype.clone = function() {
          var att, attName, clonedSelf, ref1;
          clonedSelf = Object.create(this);
          if (clonedSelf.isRoot) {
            clonedSelf.documentObject = null;
          }
          clonedSelf.attribs = {};
          ref1 = this.attribs;
          for (attName in ref1) {
            if (!hasProp.call(ref1, attName)) continue;
            att = ref1[attName];
            clonedSelf.attribs[attName] = att.clone();
          }
          clonedSelf.children = [];
          this.children.forEach(function(child) {
            var clonedChild;
            clonedChild = child.clone();
            clonedChild.parent = clonedSelf;
            return clonedSelf.children.push(clonedChild);
          });
          return clonedSelf;
        };
        XMLElement2.prototype.attribute = function(name, value) {
          var attName, attValue;
          if (name != null) {
            name = getValue(name);
          }
          if (isObject(name)) {
            for (attName in name) {
              if (!hasProp.call(name, attName)) continue;
              attValue = name[attName];
              this.attribute(attName, attValue);
            }
          } else {
            if (isFunction(value)) {
              value = value.apply();
            }
            if (this.options.keepNullAttributes && value == null) {
              this.attribs[name] = new XMLAttribute(this, name, "");
            } else if (value != null) {
              this.attribs[name] = new XMLAttribute(this, name, value);
            }
          }
          return this;
        };
        XMLElement2.prototype.removeAttribute = function(name) {
          var attName, j2, len;
          if (name == null) {
            throw new Error("Missing attribute name. " + this.debugInfo());
          }
          name = getValue(name);
          if (Array.isArray(name)) {
            for (j2 = 0, len = name.length; j2 < len; j2++) {
              attName = name[j2];
              delete this.attribs[attName];
            }
          } else {
            delete this.attribs[name];
          }
          return this;
        };
        XMLElement2.prototype.toString = function(options) {
          return this.options.writer.element(this, this.options.writer.filterOptions(options));
        };
        XMLElement2.prototype.att = function(name, value) {
          return this.attribute(name, value);
        };
        XMLElement2.prototype.a = function(name, value) {
          return this.attribute(name, value);
        };
        XMLElement2.prototype.getAttribute = function(name) {
          if (this.attribs.hasOwnProperty(name)) {
            return this.attribs[name].value;
          } else {
            return null;
          }
        };
        XMLElement2.prototype.setAttribute = function(name, value) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.getAttributeNode = function(name) {
          if (this.attribs.hasOwnProperty(name)) {
            return this.attribs[name];
          } else {
            return null;
          }
        };
        XMLElement2.prototype.setAttributeNode = function(newAttr) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.removeAttributeNode = function(oldAttr) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.getElementsByTagName = function(name) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.getAttributeNS = function(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.setAttributeNS = function(namespaceURI, qualifiedName, value) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.removeAttributeNS = function(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.getAttributeNodeNS = function(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.setAttributeNodeNS = function(newAttr) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.getElementsByTagNameNS = function(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.hasAttribute = function(name) {
          return this.attribs.hasOwnProperty(name);
        };
        XMLElement2.prototype.hasAttributeNS = function(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.setIdAttribute = function(name, isId) {
          if (this.attribs.hasOwnProperty(name)) {
            return this.attribs[name].isId;
          } else {
            return isId;
          }
        };
        XMLElement2.prototype.setIdAttributeNS = function(namespaceURI, localName, isId) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.setIdAttributeNode = function(idAttr, isId) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.getElementsByTagName = function(tagname) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.getElementsByTagNameNS = function(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.getElementsByClassName = function(classNames) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.isEqualNode = function(node) {
          var i2, j2, ref1;
          if (!XMLElement2.__super__.isEqualNode.apply(this, arguments).isEqualNode(node)) {
            return false;
          }
          if (node.namespaceURI !== this.namespaceURI) {
            return false;
          }
          if (node.prefix !== this.prefix) {
            return false;
          }
          if (node.localName !== this.localName) {
            return false;
          }
          if (node.attribs.length !== this.attribs.length) {
            return false;
          }
          for (i2 = j2 = 0, ref1 = this.attribs.length - 1; 0 <= ref1 ? j2 <= ref1 : j2 >= ref1; i2 = 0 <= ref1 ? ++j2 : --j2) {
            if (!this.attribs[i2].isEqualNode(node.attribs[i2])) {
              return false;
            }
          }
          return true;
        };
        return XMLElement2;
      }(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLCharacterData.js
var require_XMLCharacterData = __commonJS({
  "node_modules/xmlbuilder/lib/XMLCharacterData.js"(exports2, module2) {
    (function() {
      var XMLCharacterData, XMLNode, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      XMLNode = require_XMLNode();
      module2.exports = XMLCharacterData = function(superClass) {
        extend(XMLCharacterData2, superClass);
        function XMLCharacterData2(parent) {
          XMLCharacterData2.__super__.constructor.call(this, parent);
          this.value = "";
        }
        Object.defineProperty(XMLCharacterData2.prototype, "data", {
          get: function() {
            return this.value;
          },
          set: function(value) {
            return this.value = value || "";
          }
        });
        Object.defineProperty(XMLCharacterData2.prototype, "length", {
          get: function() {
            return this.value.length;
          }
        });
        Object.defineProperty(XMLCharacterData2.prototype, "textContent", {
          get: function() {
            return this.value;
          },
          set: function(value) {
            return this.value = value || "";
          }
        });
        XMLCharacterData2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLCharacterData2.prototype.substringData = function(offset, count) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLCharacterData2.prototype.appendData = function(arg) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLCharacterData2.prototype.insertData = function(offset, arg) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLCharacterData2.prototype.deleteData = function(offset, count) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLCharacterData2.prototype.replaceData = function(offset, count, arg) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLCharacterData2.prototype.isEqualNode = function(node) {
          if (!XMLCharacterData2.__super__.isEqualNode.apply(this, arguments).isEqualNode(node)) {
            return false;
          }
          if (node.data !== this.data) {
            return false;
          }
          return true;
        };
        return XMLCharacterData2;
      }(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLCData.js
var require_XMLCData = __commonJS({
  "node_modules/xmlbuilder/lib/XMLCData.js"(exports2, module2) {
    (function() {
      var NodeType, XMLCData, XMLCharacterData, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      NodeType = require_NodeType();
      XMLCharacterData = require_XMLCharacterData();
      module2.exports = XMLCData = function(superClass) {
        extend(XMLCData2, superClass);
        function XMLCData2(parent, text) {
          XMLCData2.__super__.constructor.call(this, parent);
          if (text == null) {
            throw new Error("Missing CDATA text. " + this.debugInfo());
          }
          this.name = "#cdata-section";
          this.type = NodeType.CData;
          this.value = this.stringify.cdata(text);
        }
        XMLCData2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLCData2.prototype.toString = function(options) {
          return this.options.writer.cdata(this, this.options.writer.filterOptions(options));
        };
        return XMLCData2;
      }(XMLCharacterData);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLComment.js
var require_XMLComment = __commonJS({
  "node_modules/xmlbuilder/lib/XMLComment.js"(exports2, module2) {
    (function() {
      var NodeType, XMLCharacterData, XMLComment, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      NodeType = require_NodeType();
      XMLCharacterData = require_XMLCharacterData();
      module2.exports = XMLComment = function(superClass) {
        extend(XMLComment2, superClass);
        function XMLComment2(parent, text) {
          XMLComment2.__super__.constructor.call(this, parent);
          if (text == null) {
            throw new Error("Missing comment text. " + this.debugInfo());
          }
          this.name = "#comment";
          this.type = NodeType.Comment;
          this.value = this.stringify.comment(text);
        }
        XMLComment2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLComment2.prototype.toString = function(options) {
          return this.options.writer.comment(this, this.options.writer.filterOptions(options));
        };
        return XMLComment2;
      }(XMLCharacterData);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDeclaration.js
var require_XMLDeclaration = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDeclaration.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDeclaration, XMLNode, isObject, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      isObject = require_Utility().isObject;
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      module2.exports = XMLDeclaration = function(superClass) {
        extend(XMLDeclaration2, superClass);
        function XMLDeclaration2(parent, version, encoding, standalone) {
          var ref;
          XMLDeclaration2.__super__.constructor.call(this, parent);
          if (isObject(version)) {
            ref = version, version = ref.version, encoding = ref.encoding, standalone = ref.standalone;
          }
          if (!version) {
            version = "1.0";
          }
          this.type = NodeType.Declaration;
          this.version = this.stringify.xmlVersion(version);
          if (encoding != null) {
            this.encoding = this.stringify.xmlEncoding(encoding);
          }
          if (standalone != null) {
            this.standalone = this.stringify.xmlStandalone(standalone);
          }
        }
        XMLDeclaration2.prototype.toString = function(options) {
          return this.options.writer.declaration(this, this.options.writer.filterOptions(options));
        };
        return XMLDeclaration2;
      }(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDTDAttList.js
var require_XMLDTDAttList = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDTDAttList.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDTDAttList, XMLNode, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      module2.exports = XMLDTDAttList = function(superClass) {
        extend(XMLDTDAttList2, superClass);
        function XMLDTDAttList2(parent, elementName, attributeName, attributeType, defaultValueType, defaultValue) {
          XMLDTDAttList2.__super__.constructor.call(this, parent);
          if (elementName == null) {
            throw new Error("Missing DTD element name. " + this.debugInfo());
          }
          if (attributeName == null) {
            throw new Error("Missing DTD attribute name. " + this.debugInfo(elementName));
          }
          if (!attributeType) {
            throw new Error("Missing DTD attribute type. " + this.debugInfo(elementName));
          }
          if (!defaultValueType) {
            throw new Error("Missing DTD attribute default. " + this.debugInfo(elementName));
          }
          if (defaultValueType.indexOf("#") !== 0) {
            defaultValueType = "#" + defaultValueType;
          }
          if (!defaultValueType.match(/^(#REQUIRED|#IMPLIED|#FIXED|#DEFAULT)$/)) {
            throw new Error("Invalid default value type; expected: #REQUIRED, #IMPLIED, #FIXED or #DEFAULT. " + this.debugInfo(elementName));
          }
          if (defaultValue && !defaultValueType.match(/^(#FIXED|#DEFAULT)$/)) {
            throw new Error("Default value only applies to #FIXED or #DEFAULT. " + this.debugInfo(elementName));
          }
          this.elementName = this.stringify.name(elementName);
          this.type = NodeType.AttributeDeclaration;
          this.attributeName = this.stringify.name(attributeName);
          this.attributeType = this.stringify.dtdAttType(attributeType);
          if (defaultValue) {
            this.defaultValue = this.stringify.dtdAttDefault(defaultValue);
          }
          this.defaultValueType = defaultValueType;
        }
        XMLDTDAttList2.prototype.toString = function(options) {
          return this.options.writer.dtdAttList(this, this.options.writer.filterOptions(options));
        };
        return XMLDTDAttList2;
      }(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDTDEntity.js
var require_XMLDTDEntity = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDTDEntity.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDTDEntity, XMLNode, isObject, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      isObject = require_Utility().isObject;
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      module2.exports = XMLDTDEntity = function(superClass) {
        extend(XMLDTDEntity2, superClass);
        function XMLDTDEntity2(parent, pe2, name, value) {
          XMLDTDEntity2.__super__.constructor.call(this, parent);
          if (name == null) {
            throw new Error("Missing DTD entity name. " + this.debugInfo(name));
          }
          if (value == null) {
            throw new Error("Missing DTD entity value. " + this.debugInfo(name));
          }
          this.pe = !!pe2;
          this.name = this.stringify.name(name);
          this.type = NodeType.EntityDeclaration;
          if (!isObject(value)) {
            this.value = this.stringify.dtdEntityValue(value);
            this.internal = true;
          } else {
            if (!value.pubID && !value.sysID) {
              throw new Error("Public and/or system identifiers are required for an external entity. " + this.debugInfo(name));
            }
            if (value.pubID && !value.sysID) {
              throw new Error("System identifier is required for a public external entity. " + this.debugInfo(name));
            }
            this.internal = false;
            if (value.pubID != null) {
              this.pubID = this.stringify.dtdPubID(value.pubID);
            }
            if (value.sysID != null) {
              this.sysID = this.stringify.dtdSysID(value.sysID);
            }
            if (value.nData != null) {
              this.nData = this.stringify.dtdNData(value.nData);
            }
            if (this.pe && this.nData) {
              throw new Error("Notation declaration is not allowed in a parameter entity. " + this.debugInfo(name));
            }
          }
        }
        Object.defineProperty(XMLDTDEntity2.prototype, "publicId", {
          get: function() {
            return this.pubID;
          }
        });
        Object.defineProperty(XMLDTDEntity2.prototype, "systemId", {
          get: function() {
            return this.sysID;
          }
        });
        Object.defineProperty(XMLDTDEntity2.prototype, "notationName", {
          get: function() {
            return this.nData || null;
          }
        });
        Object.defineProperty(XMLDTDEntity2.prototype, "inputEncoding", {
          get: function() {
            return null;
          }
        });
        Object.defineProperty(XMLDTDEntity2.prototype, "xmlEncoding", {
          get: function() {
            return null;
          }
        });
        Object.defineProperty(XMLDTDEntity2.prototype, "xmlVersion", {
          get: function() {
            return null;
          }
        });
        XMLDTDEntity2.prototype.toString = function(options) {
          return this.options.writer.dtdEntity(this, this.options.writer.filterOptions(options));
        };
        return XMLDTDEntity2;
      }(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDTDElement.js
var require_XMLDTDElement = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDTDElement.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDTDElement, XMLNode, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      module2.exports = XMLDTDElement = function(superClass) {
        extend(XMLDTDElement2, superClass);
        function XMLDTDElement2(parent, name, value) {
          XMLDTDElement2.__super__.constructor.call(this, parent);
          if (name == null) {
            throw new Error("Missing DTD element name. " + this.debugInfo());
          }
          if (!value) {
            value = "(#PCDATA)";
          }
          if (Array.isArray(value)) {
            value = "(" + value.join(",") + ")";
          }
          this.name = this.stringify.name(name);
          this.type = NodeType.ElementDeclaration;
          this.value = this.stringify.dtdElementValue(value);
        }
        XMLDTDElement2.prototype.toString = function(options) {
          return this.options.writer.dtdElement(this, this.options.writer.filterOptions(options));
        };
        return XMLDTDElement2;
      }(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDTDNotation.js
var require_XMLDTDNotation = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDTDNotation.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDTDNotation, XMLNode, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      module2.exports = XMLDTDNotation = function(superClass) {
        extend(XMLDTDNotation2, superClass);
        function XMLDTDNotation2(parent, name, value) {
          XMLDTDNotation2.__super__.constructor.call(this, parent);
          if (name == null) {
            throw new Error("Missing DTD notation name. " + this.debugInfo(name));
          }
          if (!value.pubID && !value.sysID) {
            throw new Error("Public or system identifiers are required for an external entity. " + this.debugInfo(name));
          }
          this.name = this.stringify.name(name);
          this.type = NodeType.NotationDeclaration;
          if (value.pubID != null) {
            this.pubID = this.stringify.dtdPubID(value.pubID);
          }
          if (value.sysID != null) {
            this.sysID = this.stringify.dtdSysID(value.sysID);
          }
        }
        Object.defineProperty(XMLDTDNotation2.prototype, "publicId", {
          get: function() {
            return this.pubID;
          }
        });
        Object.defineProperty(XMLDTDNotation2.prototype, "systemId", {
          get: function() {
            return this.sysID;
          }
        });
        XMLDTDNotation2.prototype.toString = function(options) {
          return this.options.writer.dtdNotation(this, this.options.writer.filterOptions(options));
        };
        return XMLDTDNotation2;
      }(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDocType.js
var require_XMLDocType = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDocType.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDocType, XMLNamedNodeMap, XMLNode, isObject, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      isObject = require_Utility().isObject;
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      XMLDTDAttList = require_XMLDTDAttList();
      XMLDTDEntity = require_XMLDTDEntity();
      XMLDTDElement = require_XMLDTDElement();
      XMLDTDNotation = require_XMLDTDNotation();
      XMLNamedNodeMap = require_XMLNamedNodeMap();
      module2.exports = XMLDocType = function(superClass) {
        extend(XMLDocType2, superClass);
        function XMLDocType2(parent, pubID, sysID) {
          var child, i2, len, ref, ref1, ref2;
          XMLDocType2.__super__.constructor.call(this, parent);
          this.type = NodeType.DocType;
          if (parent.children) {
            ref = parent.children;
            for (i2 = 0, len = ref.length; i2 < len; i2++) {
              child = ref[i2];
              if (child.type === NodeType.Element) {
                this.name = child.name;
                break;
              }
            }
          }
          this.documentObject = parent;
          if (isObject(pubID)) {
            ref1 = pubID, pubID = ref1.pubID, sysID = ref1.sysID;
          }
          if (sysID == null) {
            ref2 = [pubID, sysID], sysID = ref2[0], pubID = ref2[1];
          }
          if (pubID != null) {
            this.pubID = this.stringify.dtdPubID(pubID);
          }
          if (sysID != null) {
            this.sysID = this.stringify.dtdSysID(sysID);
          }
        }
        Object.defineProperty(XMLDocType2.prototype, "entities", {
          get: function() {
            var child, i2, len, nodes, ref;
            nodes = {};
            ref = this.children;
            for (i2 = 0, len = ref.length; i2 < len; i2++) {
              child = ref[i2];
              if (child.type === NodeType.EntityDeclaration && !child.pe) {
                nodes[child.name] = child;
              }
            }
            return new XMLNamedNodeMap(nodes);
          }
        });
        Object.defineProperty(XMLDocType2.prototype, "notations", {
          get: function() {
            var child, i2, len, nodes, ref;
            nodes = {};
            ref = this.children;
            for (i2 = 0, len = ref.length; i2 < len; i2++) {
              child = ref[i2];
              if (child.type === NodeType.NotationDeclaration) {
                nodes[child.name] = child;
              }
            }
            return new XMLNamedNodeMap(nodes);
          }
        });
        Object.defineProperty(XMLDocType2.prototype, "publicId", {
          get: function() {
            return this.pubID;
          }
        });
        Object.defineProperty(XMLDocType2.prototype, "systemId", {
          get: function() {
            return this.sysID;
          }
        });
        Object.defineProperty(XMLDocType2.prototype, "internalSubset", {
          get: function() {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
        });
        XMLDocType2.prototype.element = function(name, value) {
          var child;
          child = new XMLDTDElement(this, name, value);
          this.children.push(child);
          return this;
        };
        XMLDocType2.prototype.attList = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
          var child;
          child = new XMLDTDAttList(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
          this.children.push(child);
          return this;
        };
        XMLDocType2.prototype.entity = function(name, value) {
          var child;
          child = new XMLDTDEntity(this, false, name, value);
          this.children.push(child);
          return this;
        };
        XMLDocType2.prototype.pEntity = function(name, value) {
          var child;
          child = new XMLDTDEntity(this, true, name, value);
          this.children.push(child);
          return this;
        };
        XMLDocType2.prototype.notation = function(name, value) {
          var child;
          child = new XMLDTDNotation(this, name, value);
          this.children.push(child);
          return this;
        };
        XMLDocType2.prototype.toString = function(options) {
          return this.options.writer.docType(this, this.options.writer.filterOptions(options));
        };
        XMLDocType2.prototype.ele = function(name, value) {
          return this.element(name, value);
        };
        XMLDocType2.prototype.att = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
          return this.attList(elementName, attributeName, attributeType, defaultValueType, defaultValue);
        };
        XMLDocType2.prototype.ent = function(name, value) {
          return this.entity(name, value);
        };
        XMLDocType2.prototype.pent = function(name, value) {
          return this.pEntity(name, value);
        };
        XMLDocType2.prototype.not = function(name, value) {
          return this.notation(name, value);
        };
        XMLDocType2.prototype.up = function() {
          return this.root() || this.documentObject;
        };
        XMLDocType2.prototype.isEqualNode = function(node) {
          if (!XMLDocType2.__super__.isEqualNode.apply(this, arguments).isEqualNode(node)) {
            return false;
          }
          if (node.name !== this.name) {
            return false;
          }
          if (node.publicId !== this.publicId) {
            return false;
          }
          if (node.systemId !== this.systemId) {
            return false;
          }
          return true;
        };
        return XMLDocType2;
      }(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLRaw.js
var require_XMLRaw = __commonJS({
  "node_modules/xmlbuilder/lib/XMLRaw.js"(exports2, module2) {
    (function() {
      var NodeType, XMLNode, XMLRaw, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      NodeType = require_NodeType();
      XMLNode = require_XMLNode();
      module2.exports = XMLRaw = function(superClass) {
        extend(XMLRaw2, superClass);
        function XMLRaw2(parent, text) {
          XMLRaw2.__super__.constructor.call(this, parent);
          if (text == null) {
            throw new Error("Missing raw text. " + this.debugInfo());
          }
          this.type = NodeType.Raw;
          this.value = this.stringify.raw(text);
        }
        XMLRaw2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLRaw2.prototype.toString = function(options) {
          return this.options.writer.raw(this, this.options.writer.filterOptions(options));
        };
        return XMLRaw2;
      }(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLText.js
var require_XMLText = __commonJS({
  "node_modules/xmlbuilder/lib/XMLText.js"(exports2, module2) {
    (function() {
      var NodeType, XMLCharacterData, XMLText, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      NodeType = require_NodeType();
      XMLCharacterData = require_XMLCharacterData();
      module2.exports = XMLText = function(superClass) {
        extend(XMLText2, superClass);
        function XMLText2(parent, text) {
          XMLText2.__super__.constructor.call(this, parent);
          if (text == null) {
            throw new Error("Missing element text. " + this.debugInfo());
          }
          this.name = "#text";
          this.type = NodeType.Text;
          this.value = this.stringify.text(text);
        }
        Object.defineProperty(XMLText2.prototype, "isElementContentWhitespace", {
          get: function() {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
        });
        Object.defineProperty(XMLText2.prototype, "wholeText", {
          get: function() {
            var next, prev, str;
            str = "";
            prev = this.previousSibling;
            while (prev) {
              str = prev.data + str;
              prev = prev.previousSibling;
            }
            str += this.data;
            next = this.nextSibling;
            while (next) {
              str = str + next.data;
              next = next.nextSibling;
            }
            return str;
          }
        });
        XMLText2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLText2.prototype.toString = function(options) {
          return this.options.writer.text(this, this.options.writer.filterOptions(options));
        };
        XMLText2.prototype.splitText = function(offset) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLText2.prototype.replaceWholeText = function(content) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        return XMLText2;
      }(XMLCharacterData);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLProcessingInstruction.js
var require_XMLProcessingInstruction = __commonJS({
  "node_modules/xmlbuilder/lib/XMLProcessingInstruction.js"(exports2, module2) {
    (function() {
      var NodeType, XMLCharacterData, XMLProcessingInstruction, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      NodeType = require_NodeType();
      XMLCharacterData = require_XMLCharacterData();
      module2.exports = XMLProcessingInstruction = function(superClass) {
        extend(XMLProcessingInstruction2, superClass);
        function XMLProcessingInstruction2(parent, target, value) {
          XMLProcessingInstruction2.__super__.constructor.call(this, parent);
          if (target == null) {
            throw new Error("Missing instruction target. " + this.debugInfo());
          }
          this.type = NodeType.ProcessingInstruction;
          this.target = this.stringify.insTarget(target);
          this.name = this.target;
          if (value) {
            this.value = this.stringify.insValue(value);
          }
        }
        XMLProcessingInstruction2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLProcessingInstruction2.prototype.toString = function(options) {
          return this.options.writer.processingInstruction(this, this.options.writer.filterOptions(options));
        };
        XMLProcessingInstruction2.prototype.isEqualNode = function(node) {
          if (!XMLProcessingInstruction2.__super__.isEqualNode.apply(this, arguments).isEqualNode(node)) {
            return false;
          }
          if (node.target !== this.target) {
            return false;
          }
          return true;
        };
        return XMLProcessingInstruction2;
      }(XMLCharacterData);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDummy.js
var require_XMLDummy = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDummy.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDummy, XMLNode, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      module2.exports = XMLDummy = function(superClass) {
        extend(XMLDummy2, superClass);
        function XMLDummy2(parent) {
          XMLDummy2.__super__.constructor.call(this, parent);
          this.type = NodeType.Dummy;
        }
        XMLDummy2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLDummy2.prototype.toString = function(options) {
          return "";
        };
        return XMLDummy2;
      }(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLNodeList.js
var require_XMLNodeList = __commonJS({
  "node_modules/xmlbuilder/lib/XMLNodeList.js"(exports2, module2) {
    (function() {
      var XMLNodeList;
      module2.exports = XMLNodeList = function() {
        function XMLNodeList2(nodes) {
          this.nodes = nodes;
        }
        Object.defineProperty(XMLNodeList2.prototype, "length", {
          get: function() {
            return this.nodes.length || 0;
          }
        });
        XMLNodeList2.prototype.clone = function() {
          return this.nodes = null;
        };
        XMLNodeList2.prototype.item = function(index) {
          return this.nodes[index] || null;
        };
        return XMLNodeList2;
      }();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/DocumentPosition.js
var require_DocumentPosition = __commonJS({
  "node_modules/xmlbuilder/lib/DocumentPosition.js"(exports2, module2) {
    (function() {
      module2.exports = {
        Disconnected: 1,
        Preceding: 2,
        Following: 4,
        Contains: 8,
        ContainedBy: 16,
        ImplementationSpecific: 32
      };
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLNode.js
var require_XMLNode = __commonJS({
  "node_modules/xmlbuilder/lib/XMLNode.js"(exports2, module2) {
    (function() {
      var DocumentPosition, NodeType, XMLCData, XMLComment, XMLDeclaration, XMLDocType, XMLDummy, XMLElement, XMLNamedNodeMap, XMLNode, XMLNodeList, XMLProcessingInstruction, XMLRaw, XMLText, getValue, isEmpty, isFunction, isObject, ref1, hasProp = {}.hasOwnProperty;
      ref1 = require_Utility(), isObject = ref1.isObject, isFunction = ref1.isFunction, isEmpty = ref1.isEmpty, getValue = ref1.getValue;
      XMLElement = null;
      XMLCData = null;
      XMLComment = null;
      XMLDeclaration = null;
      XMLDocType = null;
      XMLRaw = null;
      XMLText = null;
      XMLProcessingInstruction = null;
      XMLDummy = null;
      NodeType = null;
      XMLNodeList = null;
      XMLNamedNodeMap = null;
      DocumentPosition = null;
      module2.exports = XMLNode = function() {
        function XMLNode2(parent1) {
          this.parent = parent1;
          if (this.parent) {
            this.options = this.parent.options;
            this.stringify = this.parent.stringify;
          }
          this.value = null;
          this.children = [];
          this.baseURI = null;
          if (!XMLElement) {
            XMLElement = require_XMLElement();
            XMLCData = require_XMLCData();
            XMLComment = require_XMLComment();
            XMLDeclaration = require_XMLDeclaration();
            XMLDocType = require_XMLDocType();
            XMLRaw = require_XMLRaw();
            XMLText = require_XMLText();
            XMLProcessingInstruction = require_XMLProcessingInstruction();
            XMLDummy = require_XMLDummy();
            NodeType = require_NodeType();
            XMLNodeList = require_XMLNodeList();
            XMLNamedNodeMap = require_XMLNamedNodeMap();
            DocumentPosition = require_DocumentPosition();
          }
        }
        Object.defineProperty(XMLNode2.prototype, "nodeName", {
          get: function() {
            return this.name;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "nodeType", {
          get: function() {
            return this.type;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "nodeValue", {
          get: function() {
            return this.value;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "parentNode", {
          get: function() {
            return this.parent;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "childNodes", {
          get: function() {
            if (!this.childNodeList || !this.childNodeList.nodes) {
              this.childNodeList = new XMLNodeList(this.children);
            }
            return this.childNodeList;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "firstChild", {
          get: function() {
            return this.children[0] || null;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "lastChild", {
          get: function() {
            return this.children[this.children.length - 1] || null;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "previousSibling", {
          get: function() {
            var i2;
            i2 = this.parent.children.indexOf(this);
            return this.parent.children[i2 - 1] || null;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "nextSibling", {
          get: function() {
            var i2;
            i2 = this.parent.children.indexOf(this);
            return this.parent.children[i2 + 1] || null;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "ownerDocument", {
          get: function() {
            return this.document() || null;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "textContent", {
          get: function() {
            var child, j2, len, ref2, str;
            if (this.nodeType === NodeType.Element || this.nodeType === NodeType.DocumentFragment) {
              str = "";
              ref2 = this.children;
              for (j2 = 0, len = ref2.length; j2 < len; j2++) {
                child = ref2[j2];
                if (child.textContent) {
                  str += child.textContent;
                }
              }
              return str;
            } else {
              return null;
            }
          },
          set: function(value) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
        });
        XMLNode2.prototype.setParent = function(parent) {
          var child, j2, len, ref2, results;
          this.parent = parent;
          if (parent) {
            this.options = parent.options;
            this.stringify = parent.stringify;
          }
          ref2 = this.children;
          results = [];
          for (j2 = 0, len = ref2.length; j2 < len; j2++) {
            child = ref2[j2];
            results.push(child.setParent(this));
          }
          return results;
        };
        XMLNode2.prototype.element = function(name, attributes, text) {
          var childNode, item, j2, k2, key, lastChild, len, len1, ref2, ref3, val;
          lastChild = null;
          if (attributes === null && text == null) {
            ref2 = [{}, null], attributes = ref2[0], text = ref2[1];
          }
          if (attributes == null) {
            attributes = {};
          }
          attributes = getValue(attributes);
          if (!isObject(attributes)) {
            ref3 = [attributes, text], text = ref3[0], attributes = ref3[1];
          }
          if (name != null) {
            name = getValue(name);
          }
          if (Array.isArray(name)) {
            for (j2 = 0, len = name.length; j2 < len; j2++) {
              item = name[j2];
              lastChild = this.element(item);
            }
          } else if (isFunction(name)) {
            lastChild = this.element(name.apply());
          } else if (isObject(name)) {
            for (key in name) {
              if (!hasProp.call(name, key)) continue;
              val = name[key];
              if (isFunction(val)) {
                val = val.apply();
              }
              if (!this.options.ignoreDecorators && this.stringify.convertAttKey && key.indexOf(this.stringify.convertAttKey) === 0) {
                lastChild = this.attribute(key.substr(this.stringify.convertAttKey.length), val);
              } else if (!this.options.separateArrayItems && Array.isArray(val) && isEmpty(val)) {
                lastChild = this.dummy();
              } else if (isObject(val) && isEmpty(val)) {
                lastChild = this.element(key);
              } else if (!this.options.keepNullNodes && val == null) {
                lastChild = this.dummy();
              } else if (!this.options.separateArrayItems && Array.isArray(val)) {
                for (k2 = 0, len1 = val.length; k2 < len1; k2++) {
                  item = val[k2];
                  childNode = {};
                  childNode[key] = item;
                  lastChild = this.element(childNode);
                }
              } else if (isObject(val)) {
                if (!this.options.ignoreDecorators && this.stringify.convertTextKey && key.indexOf(this.stringify.convertTextKey) === 0) {
                  lastChild = this.element(val);
                } else {
                  lastChild = this.element(key);
                  lastChild.element(val);
                }
              } else {
                lastChild = this.element(key, val);
              }
            }
          } else if (!this.options.keepNullNodes && text === null) {
            lastChild = this.dummy();
          } else {
            if (!this.options.ignoreDecorators && this.stringify.convertTextKey && name.indexOf(this.stringify.convertTextKey) === 0) {
              lastChild = this.text(text);
            } else if (!this.options.ignoreDecorators && this.stringify.convertCDataKey && name.indexOf(this.stringify.convertCDataKey) === 0) {
              lastChild = this.cdata(text);
            } else if (!this.options.ignoreDecorators && this.stringify.convertCommentKey && name.indexOf(this.stringify.convertCommentKey) === 0) {
              lastChild = this.comment(text);
            } else if (!this.options.ignoreDecorators && this.stringify.convertRawKey && name.indexOf(this.stringify.convertRawKey) === 0) {
              lastChild = this.raw(text);
            } else if (!this.options.ignoreDecorators && this.stringify.convertPIKey && name.indexOf(this.stringify.convertPIKey) === 0) {
              lastChild = this.instruction(name.substr(this.stringify.convertPIKey.length), text);
            } else {
              lastChild = this.node(name, attributes, text);
            }
          }
          if (lastChild == null) {
            throw new Error("Could not create any elements with: " + name + ". " + this.debugInfo());
          }
          return lastChild;
        };
        XMLNode2.prototype.insertBefore = function(name, attributes, text) {
          var child, i2, newChild, refChild, removed;
          if (name != null ? name.type : void 0) {
            newChild = name;
            refChild = attributes;
            newChild.setParent(this);
            if (refChild) {
              i2 = children.indexOf(refChild);
              removed = children.splice(i2);
              children.push(newChild);
              Array.prototype.push.apply(children, removed);
            } else {
              children.push(newChild);
            }
            return newChild;
          } else {
            if (this.isRoot) {
              throw new Error("Cannot insert elements at root level. " + this.debugInfo(name));
            }
            i2 = this.parent.children.indexOf(this);
            removed = this.parent.children.splice(i2);
            child = this.parent.element(name, attributes, text);
            Array.prototype.push.apply(this.parent.children, removed);
            return child;
          }
        };
        XMLNode2.prototype.insertAfter = function(name, attributes, text) {
          var child, i2, removed;
          if (this.isRoot) {
            throw new Error("Cannot insert elements at root level. " + this.debugInfo(name));
          }
          i2 = this.parent.children.indexOf(this);
          removed = this.parent.children.splice(i2 + 1);
          child = this.parent.element(name, attributes, text);
          Array.prototype.push.apply(this.parent.children, removed);
          return child;
        };
        XMLNode2.prototype.remove = function() {
          var i2, ref2;
          if (this.isRoot) {
            throw new Error("Cannot remove the root element. " + this.debugInfo());
          }
          i2 = this.parent.children.indexOf(this);
          [].splice.apply(this.parent.children, [i2, i2 - i2 + 1].concat(ref2 = [])), ref2;
          return this.parent;
        };
        XMLNode2.prototype.node = function(name, attributes, text) {
          var child, ref2;
          if (name != null) {
            name = getValue(name);
          }
          attributes || (attributes = {});
          attributes = getValue(attributes);
          if (!isObject(attributes)) {
            ref2 = [attributes, text], text = ref2[0], attributes = ref2[1];
          }
          child = new XMLElement(this, name, attributes);
          if (text != null) {
            child.text(text);
          }
          this.children.push(child);
          return child;
        };
        XMLNode2.prototype.text = function(value) {
          var child;
          if (isObject(value)) {
            this.element(value);
          }
          child = new XMLText(this, value);
          this.children.push(child);
          return this;
        };
        XMLNode2.prototype.cdata = function(value) {
          var child;
          child = new XMLCData(this, value);
          this.children.push(child);
          return this;
        };
        XMLNode2.prototype.comment = function(value) {
          var child;
          child = new XMLComment(this, value);
          this.children.push(child);
          return this;
        };
        XMLNode2.prototype.commentBefore = function(value) {
          var child, i2, removed;
          i2 = this.parent.children.indexOf(this);
          removed = this.parent.children.splice(i2);
          child = this.parent.comment(value);
          Array.prototype.push.apply(this.parent.children, removed);
          return this;
        };
        XMLNode2.prototype.commentAfter = function(value) {
          var child, i2, removed;
          i2 = this.parent.children.indexOf(this);
          removed = this.parent.children.splice(i2 + 1);
          child = this.parent.comment(value);
          Array.prototype.push.apply(this.parent.children, removed);
          return this;
        };
        XMLNode2.prototype.raw = function(value) {
          var child;
          child = new XMLRaw(this, value);
          this.children.push(child);
          return this;
        };
        XMLNode2.prototype.dummy = function() {
          var child;
          child = new XMLDummy(this);
          return child;
        };
        XMLNode2.prototype.instruction = function(target, value) {
          var insTarget, insValue, instruction, j2, len;
          if (target != null) {
            target = getValue(target);
          }
          if (value != null) {
            value = getValue(value);
          }
          if (Array.isArray(target)) {
            for (j2 = 0, len = target.length; j2 < len; j2++) {
              insTarget = target[j2];
              this.instruction(insTarget);
            }
          } else if (isObject(target)) {
            for (insTarget in target) {
              if (!hasProp.call(target, insTarget)) continue;
              insValue = target[insTarget];
              this.instruction(insTarget, insValue);
            }
          } else {
            if (isFunction(value)) {
              value = value.apply();
            }
            instruction = new XMLProcessingInstruction(this, target, value);
            this.children.push(instruction);
          }
          return this;
        };
        XMLNode2.prototype.instructionBefore = function(target, value) {
          var child, i2, removed;
          i2 = this.parent.children.indexOf(this);
          removed = this.parent.children.splice(i2);
          child = this.parent.instruction(target, value);
          Array.prototype.push.apply(this.parent.children, removed);
          return this;
        };
        XMLNode2.prototype.instructionAfter = function(target, value) {
          var child, i2, removed;
          i2 = this.parent.children.indexOf(this);
          removed = this.parent.children.splice(i2 + 1);
          child = this.parent.instruction(target, value);
          Array.prototype.push.apply(this.parent.children, removed);
          return this;
        };
        XMLNode2.prototype.declaration = function(version, encoding, standalone) {
          var doc, xmldec;
          doc = this.document();
          xmldec = new XMLDeclaration(doc, version, encoding, standalone);
          if (doc.children.length === 0) {
            doc.children.unshift(xmldec);
          } else if (doc.children[0].type === NodeType.Declaration) {
            doc.children[0] = xmldec;
          } else {
            doc.children.unshift(xmldec);
          }
          return doc.root() || doc;
        };
        XMLNode2.prototype.dtd = function(pubID, sysID) {
          var child, doc, doctype, i2, j2, k2, len, len1, ref2, ref3;
          doc = this.document();
          doctype = new XMLDocType(doc, pubID, sysID);
          ref2 = doc.children;
          for (i2 = j2 = 0, len = ref2.length; j2 < len; i2 = ++j2) {
            child = ref2[i2];
            if (child.type === NodeType.DocType) {
              doc.children[i2] = doctype;
              return doctype;
            }
          }
          ref3 = doc.children;
          for (i2 = k2 = 0, len1 = ref3.length; k2 < len1; i2 = ++k2) {
            child = ref3[i2];
            if (child.isRoot) {
              doc.children.splice(i2, 0, doctype);
              return doctype;
            }
          }
          doc.children.push(doctype);
          return doctype;
        };
        XMLNode2.prototype.up = function() {
          if (this.isRoot) {
            throw new Error("The root node has no parent. Use doc() if you need to get the document object.");
          }
          return this.parent;
        };
        XMLNode2.prototype.root = function() {
          var node;
          node = this;
          while (node) {
            if (node.type === NodeType.Document) {
              return node.rootObject;
            } else if (node.isRoot) {
              return node;
            } else {
              node = node.parent;
            }
          }
        };
        XMLNode2.prototype.document = function() {
          var node;
          node = this;
          while (node) {
            if (node.type === NodeType.Document) {
              return node;
            } else {
              node = node.parent;
            }
          }
        };
        XMLNode2.prototype.end = function(options) {
          return this.document().end(options);
        };
        XMLNode2.prototype.prev = function() {
          var i2;
          i2 = this.parent.children.indexOf(this);
          if (i2 < 1) {
            throw new Error("Already at the first node. " + this.debugInfo());
          }
          return this.parent.children[i2 - 1];
        };
        XMLNode2.prototype.next = function() {
          var i2;
          i2 = this.parent.children.indexOf(this);
          if (i2 === -1 || i2 === this.parent.children.length - 1) {
            throw new Error("Already at the last node. " + this.debugInfo());
          }
          return this.parent.children[i2 + 1];
        };
        XMLNode2.prototype.importDocument = function(doc) {
          var clonedRoot;
          clonedRoot = doc.root().clone();
          clonedRoot.parent = this;
          clonedRoot.isRoot = false;
          this.children.push(clonedRoot);
          return this;
        };
        XMLNode2.prototype.debugInfo = function(name) {
          var ref2, ref3;
          name = name || this.name;
          if (name == null && !((ref2 = this.parent) != null ? ref2.name : void 0)) {
            return "";
          } else if (name == null) {
            return "parent: <" + this.parent.name + ">";
          } else if (!((ref3 = this.parent) != null ? ref3.name : void 0)) {
            return "node: <" + name + ">";
          } else {
            return "node: <" + name + ">, parent: <" + this.parent.name + ">";
          }
        };
        XMLNode2.prototype.ele = function(name, attributes, text) {
          return this.element(name, attributes, text);
        };
        XMLNode2.prototype.nod = function(name, attributes, text) {
          return this.node(name, attributes, text);
        };
        XMLNode2.prototype.txt = function(value) {
          return this.text(value);
        };
        XMLNode2.prototype.dat = function(value) {
          return this.cdata(value);
        };
        XMLNode2.prototype.com = function(value) {
          return this.comment(value);
        };
        XMLNode2.prototype.ins = function(target, value) {
          return this.instruction(target, value);
        };
        XMLNode2.prototype.doc = function() {
          return this.document();
        };
        XMLNode2.prototype.dec = function(version, encoding, standalone) {
          return this.declaration(version, encoding, standalone);
        };
        XMLNode2.prototype.e = function(name, attributes, text) {
          return this.element(name, attributes, text);
        };
        XMLNode2.prototype.n = function(name, attributes, text) {
          return this.node(name, attributes, text);
        };
        XMLNode2.prototype.t = function(value) {
          return this.text(value);
        };
        XMLNode2.prototype.d = function(value) {
          return this.cdata(value);
        };
        XMLNode2.prototype.c = function(value) {
          return this.comment(value);
        };
        XMLNode2.prototype.r = function(value) {
          return this.raw(value);
        };
        XMLNode2.prototype.i = function(target, value) {
          return this.instruction(target, value);
        };
        XMLNode2.prototype.u = function() {
          return this.up();
        };
        XMLNode2.prototype.importXMLBuilder = function(doc) {
          return this.importDocument(doc);
        };
        XMLNode2.prototype.replaceChild = function(newChild, oldChild) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.removeChild = function(oldChild) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.appendChild = function(newChild) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.hasChildNodes = function() {
          return this.children.length !== 0;
        };
        XMLNode2.prototype.cloneNode = function(deep) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.normalize = function() {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.isSupported = function(feature, version) {
          return true;
        };
        XMLNode2.prototype.hasAttributes = function() {
          return this.attribs.length !== 0;
        };
        XMLNode2.prototype.compareDocumentPosition = function(other) {
          var ref, res;
          ref = this;
          if (ref === other) {
            return 0;
          } else if (this.document() !== other.document()) {
            res = DocumentPosition.Disconnected | DocumentPosition.ImplementationSpecific;
            if (Math.random() < 0.5) {
              res |= DocumentPosition.Preceding;
            } else {
              res |= DocumentPosition.Following;
            }
            return res;
          } else if (ref.isAncestor(other)) {
            return DocumentPosition.Contains | DocumentPosition.Preceding;
          } else if (ref.isDescendant(other)) {
            return DocumentPosition.Contains | DocumentPosition.Following;
          } else if (ref.isPreceding(other)) {
            return DocumentPosition.Preceding;
          } else {
            return DocumentPosition.Following;
          }
        };
        XMLNode2.prototype.isSameNode = function(other) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.lookupPrefix = function(namespaceURI) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.isDefaultNamespace = function(namespaceURI) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.lookupNamespaceURI = function(prefix) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.isEqualNode = function(node) {
          var i2, j2, ref2;
          if (node.nodeType !== this.nodeType) {
            return false;
          }
          if (node.children.length !== this.children.length) {
            return false;
          }
          for (i2 = j2 = 0, ref2 = this.children.length - 1; 0 <= ref2 ? j2 <= ref2 : j2 >= ref2; i2 = 0 <= ref2 ? ++j2 : --j2) {
            if (!this.children[i2].isEqualNode(node.children[i2])) {
              return false;
            }
          }
          return true;
        };
        XMLNode2.prototype.getFeature = function(feature, version) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.setUserData = function(key, data, handler) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.getUserData = function(key) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.contains = function(other) {
          if (!other) {
            return false;
          }
          return other === this || this.isDescendant(other);
        };
        XMLNode2.prototype.isDescendant = function(node) {
          var child, isDescendantChild, j2, len, ref2;
          ref2 = this.children;
          for (j2 = 0, len = ref2.length; j2 < len; j2++) {
            child = ref2[j2];
            if (node === child) {
              return true;
            }
            isDescendantChild = child.isDescendant(node);
            if (isDescendantChild) {
              return true;
            }
          }
          return false;
        };
        XMLNode2.prototype.isAncestor = function(node) {
          return node.isDescendant(this);
        };
        XMLNode2.prototype.isPreceding = function(node) {
          var nodePos, thisPos;
          nodePos = this.treePosition(node);
          thisPos = this.treePosition(this);
          if (nodePos === -1 || thisPos === -1) {
            return false;
          } else {
            return nodePos < thisPos;
          }
        };
        XMLNode2.prototype.isFollowing = function(node) {
          var nodePos, thisPos;
          nodePos = this.treePosition(node);
          thisPos = this.treePosition(this);
          if (nodePos === -1 || thisPos === -1) {
            return false;
          } else {
            return nodePos > thisPos;
          }
        };
        XMLNode2.prototype.treePosition = function(node) {
          var found, pos;
          pos = 0;
          found = false;
          this.foreachTreeNode(this.document(), function(childNode) {
            pos++;
            if (!found && childNode === node) {
              return found = true;
            }
          });
          if (found) {
            return pos;
          } else {
            return -1;
          }
        };
        XMLNode2.prototype.foreachTreeNode = function(node, func) {
          var child, j2, len, ref2, res;
          node || (node = this.document());
          ref2 = node.children;
          for (j2 = 0, len = ref2.length; j2 < len; j2++) {
            child = ref2[j2];
            if (res = func(child)) {
              return res;
            } else {
              res = this.foreachTreeNode(child, func);
              if (res) {
                return res;
              }
            }
          }
        };
        return XMLNode2;
      }();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLStringifier.js
var require_XMLStringifier = __commonJS({
  "node_modules/xmlbuilder/lib/XMLStringifier.js"(exports2, module2) {
    (function() {
      var XMLStringifier, bind = function(fn2, me) {
        return function() {
          return fn2.apply(me, arguments);
        };
      }, hasProp = {}.hasOwnProperty;
      module2.exports = XMLStringifier = function() {
        function XMLStringifier2(options) {
          this.assertLegalName = bind(this.assertLegalName, this);
          this.assertLegalChar = bind(this.assertLegalChar, this);
          var key, ref, value;
          options || (options = {});
          this.options = options;
          if (!this.options.version) {
            this.options.version = "1.0";
          }
          ref = options.stringify || {};
          for (key in ref) {
            if (!hasProp.call(ref, key)) continue;
            value = ref[key];
            this[key] = value;
          }
        }
        XMLStringifier2.prototype.name = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalName("" + val || "");
        };
        XMLStringifier2.prototype.text = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar(this.textEscape("" + val || ""));
        };
        XMLStringifier2.prototype.cdata = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          val = "" + val || "";
          val = val.replace("]]>", "]]]]><![CDATA[>");
          return this.assertLegalChar(val);
        };
        XMLStringifier2.prototype.comment = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          val = "" + val || "";
          if (val.match(/--/)) {
            throw new Error("Comment text cannot contain double-hypen: " + val);
          }
          return this.assertLegalChar(val);
        };
        XMLStringifier2.prototype.raw = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return "" + val || "";
        };
        XMLStringifier2.prototype.attValue = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar(this.attEscape(val = "" + val || ""));
        };
        XMLStringifier2.prototype.insTarget = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        };
        XMLStringifier2.prototype.insValue = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          val = "" + val || "";
          if (val.match(/\?>/)) {
            throw new Error("Invalid processing instruction value: " + val);
          }
          return this.assertLegalChar(val);
        };
        XMLStringifier2.prototype.xmlVersion = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          val = "" + val || "";
          if (!val.match(/1\.[0-9]+/)) {
            throw new Error("Invalid version number: " + val);
          }
          return val;
        };
        XMLStringifier2.prototype.xmlEncoding = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          val = "" + val || "";
          if (!val.match(/^[A-Za-z](?:[A-Za-z0-9._-])*$/)) {
            throw new Error("Invalid encoding: " + val);
          }
          return this.assertLegalChar(val);
        };
        XMLStringifier2.prototype.xmlStandalone = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          if (val) {
            return "yes";
          } else {
            return "no";
          }
        };
        XMLStringifier2.prototype.dtdPubID = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        };
        XMLStringifier2.prototype.dtdSysID = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        };
        XMLStringifier2.prototype.dtdElementValue = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        };
        XMLStringifier2.prototype.dtdAttType = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        };
        XMLStringifier2.prototype.dtdAttDefault = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        };
        XMLStringifier2.prototype.dtdEntityValue = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        };
        XMLStringifier2.prototype.dtdNData = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        };
        XMLStringifier2.prototype.convertAttKey = "@";
        XMLStringifier2.prototype.convertPIKey = "?";
        XMLStringifier2.prototype.convertTextKey = "#text";
        XMLStringifier2.prototype.convertCDataKey = "#cdata";
        XMLStringifier2.prototype.convertCommentKey = "#comment";
        XMLStringifier2.prototype.convertRawKey = "#raw";
        XMLStringifier2.prototype.assertLegalChar = function(str) {
          var regex, res;
          if (this.options.noValidation) {
            return str;
          }
          regex = "";
          if (this.options.version === "1.0") {
            regex = /[\0-\x08\x0B\f\x0E-\x1F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
            if (res = str.match(regex)) {
              throw new Error("Invalid character in string: " + str + " at index " + res.index);
            }
          } else if (this.options.version === "1.1") {
            regex = /[\0\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
            if (res = str.match(regex)) {
              throw new Error("Invalid character in string: " + str + " at index " + res.index);
            }
          }
          return str;
        };
        XMLStringifier2.prototype.assertLegalName = function(str) {
          var regex;
          if (this.options.noValidation) {
            return str;
          }
          this.assertLegalChar(str);
          regex = /^([:A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])([\x2D\.0-:A-Z_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*$/;
          if (!str.match(regex)) {
            throw new Error("Invalid character in name");
          }
          return str;
        };
        XMLStringifier2.prototype.textEscape = function(str) {
          var ampregex;
          if (this.options.noValidation) {
            return str;
          }
          ampregex = this.options.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g;
          return str.replace(ampregex, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r/g, "&#xD;");
        };
        XMLStringifier2.prototype.attEscape = function(str) {
          var ampregex;
          if (this.options.noValidation) {
            return str;
          }
          ampregex = this.options.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g;
          return str.replace(ampregex, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/\t/g, "&#x9;").replace(/\n/g, "&#xA;").replace(/\r/g, "&#xD;");
        };
        return XMLStringifier2;
      }();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/WriterState.js
var require_WriterState = __commonJS({
  "node_modules/xmlbuilder/lib/WriterState.js"(exports2, module2) {
    (function() {
      module2.exports = {
        None: 0,
        OpenTag: 1,
        InsideTag: 2,
        CloseTag: 3
      };
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLWriterBase.js
var require_XMLWriterBase = __commonJS({
  "node_modules/xmlbuilder/lib/XMLWriterBase.js"(exports2, module2) {
    (function() {
      var NodeType, WriterState, XMLCData, XMLComment, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDeclaration, XMLDocType, XMLDummy, XMLElement, XMLProcessingInstruction, XMLRaw, XMLText, XMLWriterBase, assign, hasProp = {}.hasOwnProperty;
      assign = require_Utility().assign;
      NodeType = require_NodeType();
      XMLDeclaration = require_XMLDeclaration();
      XMLDocType = require_XMLDocType();
      XMLCData = require_XMLCData();
      XMLComment = require_XMLComment();
      XMLElement = require_XMLElement();
      XMLRaw = require_XMLRaw();
      XMLText = require_XMLText();
      XMLProcessingInstruction = require_XMLProcessingInstruction();
      XMLDummy = require_XMLDummy();
      XMLDTDAttList = require_XMLDTDAttList();
      XMLDTDElement = require_XMLDTDElement();
      XMLDTDEntity = require_XMLDTDEntity();
      XMLDTDNotation = require_XMLDTDNotation();
      WriterState = require_WriterState();
      module2.exports = XMLWriterBase = function() {
        function XMLWriterBase2(options) {
          var key, ref, value;
          options || (options = {});
          this.options = options;
          ref = options.writer || {};
          for (key in ref) {
            if (!hasProp.call(ref, key)) continue;
            value = ref[key];
            this["_" + key] = this[key];
            this[key] = value;
          }
        }
        XMLWriterBase2.prototype.filterOptions = function(options) {
          var filteredOptions, ref, ref1, ref2, ref3, ref4, ref5, ref6;
          options || (options = {});
          options = assign({}, this.options, options);
          filteredOptions = {
            writer: this
          };
          filteredOptions.pretty = options.pretty || false;
          filteredOptions.allowEmpty = options.allowEmpty || false;
          filteredOptions.indent = (ref = options.indent) != null ? ref : "  ";
          filteredOptions.newline = (ref1 = options.newline) != null ? ref1 : "\n";
          filteredOptions.offset = (ref2 = options.offset) != null ? ref2 : 0;
          filteredOptions.dontPrettyTextNodes = (ref3 = (ref4 = options.dontPrettyTextNodes) != null ? ref4 : options.dontprettytextnodes) != null ? ref3 : 0;
          filteredOptions.spaceBeforeSlash = (ref5 = (ref6 = options.spaceBeforeSlash) != null ? ref6 : options.spacebeforeslash) != null ? ref5 : "";
          if (filteredOptions.spaceBeforeSlash === true) {
            filteredOptions.spaceBeforeSlash = " ";
          }
          filteredOptions.suppressPrettyCount = 0;
          filteredOptions.user = {};
          filteredOptions.state = WriterState.None;
          return filteredOptions;
        };
        XMLWriterBase2.prototype.indent = function(node, options, level) {
          var indentLevel;
          if (!options.pretty || options.suppressPrettyCount) {
            return "";
          } else if (options.pretty) {
            indentLevel = (level || 0) + options.offset + 1;
            if (indentLevel > 0) {
              return new Array(indentLevel).join(options.indent);
            }
          }
          return "";
        };
        XMLWriterBase2.prototype.endline = function(node, options, level) {
          if (!options.pretty || options.suppressPrettyCount) {
            return "";
          } else {
            return options.newline;
          }
        };
        XMLWriterBase2.prototype.attribute = function(att, options, level) {
          var r2;
          this.openAttribute(att, options, level);
          r2 = " " + att.name + '="' + att.value + '"';
          this.closeAttribute(att, options, level);
          return r2;
        };
        XMLWriterBase2.prototype.cdata = function(node, options, level) {
          var r2;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r2 = this.indent(node, options, level) + "<![CDATA[";
          options.state = WriterState.InsideTag;
          r2 += node.value;
          options.state = WriterState.CloseTag;
          r2 += "]]>" + this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r2;
        };
        XMLWriterBase2.prototype.comment = function(node, options, level) {
          var r2;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r2 = this.indent(node, options, level) + "<!-- ";
          options.state = WriterState.InsideTag;
          r2 += node.value;
          options.state = WriterState.CloseTag;
          r2 += " -->" + this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r2;
        };
        XMLWriterBase2.prototype.declaration = function(node, options, level) {
          var r2;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r2 = this.indent(node, options, level) + "<?xml";
          options.state = WriterState.InsideTag;
          r2 += ' version="' + node.version + '"';
          if (node.encoding != null) {
            r2 += ' encoding="' + node.encoding + '"';
          }
          if (node.standalone != null) {
            r2 += ' standalone="' + node.standalone + '"';
          }
          options.state = WriterState.CloseTag;
          r2 += options.spaceBeforeSlash + "?>";
          r2 += this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r2;
        };
        XMLWriterBase2.prototype.docType = function(node, options, level) {
          var child, i2, len, r2, ref;
          level || (level = 0);
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r2 = this.indent(node, options, level);
          r2 += "<!DOCTYPE " + node.root().name;
          if (node.pubID && node.sysID) {
            r2 += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
          } else if (node.sysID) {
            r2 += ' SYSTEM "' + node.sysID + '"';
          }
          if (node.children.length > 0) {
            r2 += " [";
            r2 += this.endline(node, options, level);
            options.state = WriterState.InsideTag;
            ref = node.children;
            for (i2 = 0, len = ref.length; i2 < len; i2++) {
              child = ref[i2];
              r2 += this.writeChildNode(child, options, level + 1);
            }
            options.state = WriterState.CloseTag;
            r2 += "]";
          }
          options.state = WriterState.CloseTag;
          r2 += options.spaceBeforeSlash + ">";
          r2 += this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r2;
        };
        XMLWriterBase2.prototype.element = function(node, options, level) {
          var att, child, childNodeCount, firstChildNode, i2, j2, len, len1, name, prettySuppressed, r2, ref, ref1, ref2;
          level || (level = 0);
          prettySuppressed = false;
          r2 = "";
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r2 += this.indent(node, options, level) + "<" + node.name;
          ref = node.attribs;
          for (name in ref) {
            if (!hasProp.call(ref, name)) continue;
            att = ref[name];
            r2 += this.attribute(att, options, level);
          }
          childNodeCount = node.children.length;
          firstChildNode = childNodeCount === 0 ? null : node.children[0];
          if (childNodeCount === 0 || node.children.every(function(e2) {
            return (e2.type === NodeType.Text || e2.type === NodeType.Raw) && e2.value === "";
          })) {
            if (options.allowEmpty) {
              r2 += ">";
              options.state = WriterState.CloseTag;
              r2 += "</" + node.name + ">" + this.endline(node, options, level);
            } else {
              options.state = WriterState.CloseTag;
              r2 += options.spaceBeforeSlash + "/>" + this.endline(node, options, level);
            }
          } else if (options.pretty && childNodeCount === 1 && (firstChildNode.type === NodeType.Text || firstChildNode.type === NodeType.Raw) && firstChildNode.value != null) {
            r2 += ">";
            options.state = WriterState.InsideTag;
            options.suppressPrettyCount++;
            prettySuppressed = true;
            r2 += this.writeChildNode(firstChildNode, options, level + 1);
            options.suppressPrettyCount--;
            prettySuppressed = false;
            options.state = WriterState.CloseTag;
            r2 += "</" + node.name + ">" + this.endline(node, options, level);
          } else {
            if (options.dontPrettyTextNodes) {
              ref1 = node.children;
              for (i2 = 0, len = ref1.length; i2 < len; i2++) {
                child = ref1[i2];
                if ((child.type === NodeType.Text || child.type === NodeType.Raw) && child.value != null) {
                  options.suppressPrettyCount++;
                  prettySuppressed = true;
                  break;
                }
              }
            }
            r2 += ">" + this.endline(node, options, level);
            options.state = WriterState.InsideTag;
            ref2 = node.children;
            for (j2 = 0, len1 = ref2.length; j2 < len1; j2++) {
              child = ref2[j2];
              r2 += this.writeChildNode(child, options, level + 1);
            }
            options.state = WriterState.CloseTag;
            r2 += this.indent(node, options, level) + "</" + node.name + ">";
            if (prettySuppressed) {
              options.suppressPrettyCount--;
            }
            r2 += this.endline(node, options, level);
            options.state = WriterState.None;
          }
          this.closeNode(node, options, level);
          return r2;
        };
        XMLWriterBase2.prototype.writeChildNode = function(node, options, level) {
          switch (node.type) {
            case NodeType.CData:
              return this.cdata(node, options, level);
            case NodeType.Comment:
              return this.comment(node, options, level);
            case NodeType.Element:
              return this.element(node, options, level);
            case NodeType.Raw:
              return this.raw(node, options, level);
            case NodeType.Text:
              return this.text(node, options, level);
            case NodeType.ProcessingInstruction:
              return this.processingInstruction(node, options, level);
            case NodeType.Dummy:
              return "";
            case NodeType.Declaration:
              return this.declaration(node, options, level);
            case NodeType.DocType:
              return this.docType(node, options, level);
            case NodeType.AttributeDeclaration:
              return this.dtdAttList(node, options, level);
            case NodeType.ElementDeclaration:
              return this.dtdElement(node, options, level);
            case NodeType.EntityDeclaration:
              return this.dtdEntity(node, options, level);
            case NodeType.NotationDeclaration:
              return this.dtdNotation(node, options, level);
            default:
              throw new Error("Unknown XML node type: " + node.constructor.name);
          }
        };
        XMLWriterBase2.prototype.processingInstruction = function(node, options, level) {
          var r2;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r2 = this.indent(node, options, level) + "<?";
          options.state = WriterState.InsideTag;
          r2 += node.target;
          if (node.value) {
            r2 += " " + node.value;
          }
          options.state = WriterState.CloseTag;
          r2 += options.spaceBeforeSlash + "?>";
          r2 += this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r2;
        };
        XMLWriterBase2.prototype.raw = function(node, options, level) {
          var r2;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r2 = this.indent(node, options, level);
          options.state = WriterState.InsideTag;
          r2 += node.value;
          options.state = WriterState.CloseTag;
          r2 += this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r2;
        };
        XMLWriterBase2.prototype.text = function(node, options, level) {
          var r2;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r2 = this.indent(node, options, level);
          options.state = WriterState.InsideTag;
          r2 += node.value;
          options.state = WriterState.CloseTag;
          r2 += this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r2;
        };
        XMLWriterBase2.prototype.dtdAttList = function(node, options, level) {
          var r2;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r2 = this.indent(node, options, level) + "<!ATTLIST";
          options.state = WriterState.InsideTag;
          r2 += " " + node.elementName + " " + node.attributeName + " " + node.attributeType;
          if (node.defaultValueType !== "#DEFAULT") {
            r2 += " " + node.defaultValueType;
          }
          if (node.defaultValue) {
            r2 += ' "' + node.defaultValue + '"';
          }
          options.state = WriterState.CloseTag;
          r2 += options.spaceBeforeSlash + ">" + this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r2;
        };
        XMLWriterBase2.prototype.dtdElement = function(node, options, level) {
          var r2;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r2 = this.indent(node, options, level) + "<!ELEMENT";
          options.state = WriterState.InsideTag;
          r2 += " " + node.name + " " + node.value;
          options.state = WriterState.CloseTag;
          r2 += options.spaceBeforeSlash + ">" + this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r2;
        };
        XMLWriterBase2.prototype.dtdEntity = function(node, options, level) {
          var r2;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r2 = this.indent(node, options, level) + "<!ENTITY";
          options.state = WriterState.InsideTag;
          if (node.pe) {
            r2 += " %";
          }
          r2 += " " + node.name;
          if (node.value) {
            r2 += ' "' + node.value + '"';
          } else {
            if (node.pubID && node.sysID) {
              r2 += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
            } else if (node.sysID) {
              r2 += ' SYSTEM "' + node.sysID + '"';
            }
            if (node.nData) {
              r2 += " NDATA " + node.nData;
            }
          }
          options.state = WriterState.CloseTag;
          r2 += options.spaceBeforeSlash + ">" + this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r2;
        };
        XMLWriterBase2.prototype.dtdNotation = function(node, options, level) {
          var r2;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r2 = this.indent(node, options, level) + "<!NOTATION";
          options.state = WriterState.InsideTag;
          r2 += " " + node.name;
          if (node.pubID && node.sysID) {
            r2 += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
          } else if (node.pubID) {
            r2 += ' PUBLIC "' + node.pubID + '"';
          } else if (node.sysID) {
            r2 += ' SYSTEM "' + node.sysID + '"';
          }
          options.state = WriterState.CloseTag;
          r2 += options.spaceBeforeSlash + ">" + this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r2;
        };
        XMLWriterBase2.prototype.openNode = function(node, options, level) {
        };
        XMLWriterBase2.prototype.closeNode = function(node, options, level) {
        };
        XMLWriterBase2.prototype.openAttribute = function(att, options, level) {
        };
        XMLWriterBase2.prototype.closeAttribute = function(att, options, level) {
        };
        return XMLWriterBase2;
      }();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLStringWriter.js
var require_XMLStringWriter = __commonJS({
  "node_modules/xmlbuilder/lib/XMLStringWriter.js"(exports2, module2) {
    (function() {
      var XMLStringWriter, XMLWriterBase, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      XMLWriterBase = require_XMLWriterBase();
      module2.exports = XMLStringWriter = function(superClass) {
        extend(XMLStringWriter2, superClass);
        function XMLStringWriter2(options) {
          XMLStringWriter2.__super__.constructor.call(this, options);
        }
        XMLStringWriter2.prototype.document = function(doc, options) {
          var child, i2, len, r2, ref;
          options = this.filterOptions(options);
          r2 = "";
          ref = doc.children;
          for (i2 = 0, len = ref.length; i2 < len; i2++) {
            child = ref[i2];
            r2 += this.writeChildNode(child, options, 0);
          }
          if (options.pretty && r2.slice(-options.newline.length) === options.newline) {
            r2 = r2.slice(0, -options.newline.length);
          }
          return r2;
        };
        return XMLStringWriter2;
      }(XMLWriterBase);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDocument.js
var require_XMLDocument = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDocument.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDOMConfiguration, XMLDOMImplementation, XMLDocument, XMLNode, XMLStringWriter, XMLStringifier, isPlainObject, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      isPlainObject = require_Utility().isPlainObject;
      XMLDOMImplementation = require_XMLDOMImplementation();
      XMLDOMConfiguration = require_XMLDOMConfiguration();
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      XMLStringifier = require_XMLStringifier();
      XMLStringWriter = require_XMLStringWriter();
      module2.exports = XMLDocument = function(superClass) {
        extend(XMLDocument2, superClass);
        function XMLDocument2(options) {
          XMLDocument2.__super__.constructor.call(this, null);
          this.name = "#document";
          this.type = NodeType.Document;
          this.documentURI = null;
          this.domConfig = new XMLDOMConfiguration();
          options || (options = {});
          if (!options.writer) {
            options.writer = new XMLStringWriter();
          }
          this.options = options;
          this.stringify = new XMLStringifier(options);
        }
        Object.defineProperty(XMLDocument2.prototype, "implementation", {
          value: new XMLDOMImplementation()
        });
        Object.defineProperty(XMLDocument2.prototype, "doctype", {
          get: function() {
            var child, i2, len, ref;
            ref = this.children;
            for (i2 = 0, len = ref.length; i2 < len; i2++) {
              child = ref[i2];
              if (child.type === NodeType.DocType) {
                return child;
              }
            }
            return null;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "documentElement", {
          get: function() {
            return this.rootObject || null;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "inputEncoding", {
          get: function() {
            return null;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "strictErrorChecking", {
          get: function() {
            return false;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "xmlEncoding", {
          get: function() {
            if (this.children.length !== 0 && this.children[0].type === NodeType.Declaration) {
              return this.children[0].encoding;
            } else {
              return null;
            }
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "xmlStandalone", {
          get: function() {
            if (this.children.length !== 0 && this.children[0].type === NodeType.Declaration) {
              return this.children[0].standalone === "yes";
            } else {
              return false;
            }
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "xmlVersion", {
          get: function() {
            if (this.children.length !== 0 && this.children[0].type === NodeType.Declaration) {
              return this.children[0].version;
            } else {
              return "1.0";
            }
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "URL", {
          get: function() {
            return this.documentURI;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "origin", {
          get: function() {
            return null;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "compatMode", {
          get: function() {
            return null;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "characterSet", {
          get: function() {
            return null;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "contentType", {
          get: function() {
            return null;
          }
        });
        XMLDocument2.prototype.end = function(writer) {
          var writerOptions;
          writerOptions = {};
          if (!writer) {
            writer = this.options.writer;
          } else if (isPlainObject(writer)) {
            writerOptions = writer;
            writer = this.options.writer;
          }
          return writer.document(this, writer.filterOptions(writerOptions));
        };
        XMLDocument2.prototype.toString = function(options) {
          return this.options.writer.document(this, this.options.writer.filterOptions(options));
        };
        XMLDocument2.prototype.createElement = function(tagName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createDocumentFragment = function() {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createTextNode = function(data) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createComment = function(data) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createCDATASection = function(data) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createProcessingInstruction = function(target, data) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createAttribute = function(name) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createEntityReference = function(name) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.getElementsByTagName = function(tagname) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.importNode = function(importedNode, deep) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createElementNS = function(namespaceURI, qualifiedName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createAttributeNS = function(namespaceURI, qualifiedName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.getElementsByTagNameNS = function(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.getElementById = function(elementId) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.adoptNode = function(source) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.normalizeDocument = function() {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.renameNode = function(node, namespaceURI, qualifiedName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.getElementsByClassName = function(classNames) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createEvent = function(eventInterface) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createRange = function() {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createNodeIterator = function(root, whatToShow, filter) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createTreeWalker = function(root, whatToShow, filter) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        return XMLDocument2;
      }(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDocumentCB.js
var require_XMLDocumentCB = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDocumentCB.js"(exports2, module2) {
    (function() {
      var NodeType, WriterState, XMLAttribute, XMLCData, XMLComment, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDeclaration, XMLDocType, XMLDocument, XMLDocumentCB, XMLElement, XMLProcessingInstruction, XMLRaw, XMLStringWriter, XMLStringifier, XMLText, getValue, isFunction, isObject, isPlainObject, ref, hasProp = {}.hasOwnProperty;
      ref = require_Utility(), isObject = ref.isObject, isFunction = ref.isFunction, isPlainObject = ref.isPlainObject, getValue = ref.getValue;
      NodeType = require_NodeType();
      XMLDocument = require_XMLDocument();
      XMLElement = require_XMLElement();
      XMLCData = require_XMLCData();
      XMLComment = require_XMLComment();
      XMLRaw = require_XMLRaw();
      XMLText = require_XMLText();
      XMLProcessingInstruction = require_XMLProcessingInstruction();
      XMLDeclaration = require_XMLDeclaration();
      XMLDocType = require_XMLDocType();
      XMLDTDAttList = require_XMLDTDAttList();
      XMLDTDEntity = require_XMLDTDEntity();
      XMLDTDElement = require_XMLDTDElement();
      XMLDTDNotation = require_XMLDTDNotation();
      XMLAttribute = require_XMLAttribute();
      XMLStringifier = require_XMLStringifier();
      XMLStringWriter = require_XMLStringWriter();
      WriterState = require_WriterState();
      module2.exports = XMLDocumentCB = function() {
        function XMLDocumentCB2(options, onData, onEnd) {
          var writerOptions;
          this.name = "?xml";
          this.type = NodeType.Document;
          options || (options = {});
          writerOptions = {};
          if (!options.writer) {
            options.writer = new XMLStringWriter();
          } else if (isPlainObject(options.writer)) {
            writerOptions = options.writer;
            options.writer = new XMLStringWriter();
          }
          this.options = options;
          this.writer = options.writer;
          this.writerOptions = this.writer.filterOptions(writerOptions);
          this.stringify = new XMLStringifier(options);
          this.onDataCallback = onData || function() {
          };
          this.onEndCallback = onEnd || function() {
          };
          this.currentNode = null;
          this.currentLevel = -1;
          this.openTags = {};
          this.documentStarted = false;
          this.documentCompleted = false;
          this.root = null;
        }
        XMLDocumentCB2.prototype.createChildNode = function(node) {
          var att, attName, attributes, child, i2, len, ref1, ref2;
          switch (node.type) {
            case NodeType.CData:
              this.cdata(node.value);
              break;
            case NodeType.Comment:
              this.comment(node.value);
              break;
            case NodeType.Element:
              attributes = {};
              ref1 = node.attribs;
              for (attName in ref1) {
                if (!hasProp.call(ref1, attName)) continue;
                att = ref1[attName];
                attributes[attName] = att.value;
              }
              this.node(node.name, attributes);
              break;
            case NodeType.Dummy:
              this.dummy();
              break;
            case NodeType.Raw:
              this.raw(node.value);
              break;
            case NodeType.Text:
              this.text(node.value);
              break;
            case NodeType.ProcessingInstruction:
              this.instruction(node.target, node.value);
              break;
            default:
              throw new Error("This XML node type is not supported in a JS object: " + node.constructor.name);
          }
          ref2 = node.children;
          for (i2 = 0, len = ref2.length; i2 < len; i2++) {
            child = ref2[i2];
            this.createChildNode(child);
            if (child.type === NodeType.Element) {
              this.up();
            }
          }
          return this;
        };
        XMLDocumentCB2.prototype.dummy = function() {
          return this;
        };
        XMLDocumentCB2.prototype.node = function(name, attributes, text) {
          var ref1;
          if (name == null) {
            throw new Error("Missing node name.");
          }
          if (this.root && this.currentLevel === -1) {
            throw new Error("Document can only have one root node. " + this.debugInfo(name));
          }
          this.openCurrent();
          name = getValue(name);
          if (attributes == null) {
            attributes = {};
          }
          attributes = getValue(attributes);
          if (!isObject(attributes)) {
            ref1 = [attributes, text], text = ref1[0], attributes = ref1[1];
          }
          this.currentNode = new XMLElement(this, name, attributes);
          this.currentNode.children = false;
          this.currentLevel++;
          this.openTags[this.currentLevel] = this.currentNode;
          if (text != null) {
            this.text(text);
          }
          return this;
        };
        XMLDocumentCB2.prototype.element = function(name, attributes, text) {
          var child, i2, len, oldValidationFlag, ref1, root;
          if (this.currentNode && this.currentNode.type === NodeType.DocType) {
            this.dtdElement.apply(this, arguments);
          } else {
            if (Array.isArray(name) || isObject(name) || isFunction(name)) {
              oldValidationFlag = this.options.noValidation;
              this.options.noValidation = true;
              root = new XMLDocument(this.options).element("TEMP_ROOT");
              root.element(name);
              this.options.noValidation = oldValidationFlag;
              ref1 = root.children;
              for (i2 = 0, len = ref1.length; i2 < len; i2++) {
                child = ref1[i2];
                this.createChildNode(child);
                if (child.type === NodeType.Element) {
                  this.up();
                }
              }
            } else {
              this.node(name, attributes, text);
            }
          }
          return this;
        };
        XMLDocumentCB2.prototype.attribute = function(name, value) {
          var attName, attValue;
          if (!this.currentNode || this.currentNode.children) {
            throw new Error("att() can only be used immediately after an ele() call in callback mode. " + this.debugInfo(name));
          }
          if (name != null) {
            name = getValue(name);
          }
          if (isObject(name)) {
            for (attName in name) {
              if (!hasProp.call(name, attName)) continue;
              attValue = name[attName];
              this.attribute(attName, attValue);
            }
          } else {
            if (isFunction(value)) {
              value = value.apply();
            }
            if (this.options.keepNullAttributes && value == null) {
              this.currentNode.attribs[name] = new XMLAttribute(this, name, "");
            } else if (value != null) {
              this.currentNode.attribs[name] = new XMLAttribute(this, name, value);
            }
          }
          return this;
        };
        XMLDocumentCB2.prototype.text = function(value) {
          var node;
          this.openCurrent();
          node = new XMLText(this, value);
          this.onData(this.writer.text(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.cdata = function(value) {
          var node;
          this.openCurrent();
          node = new XMLCData(this, value);
          this.onData(this.writer.cdata(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.comment = function(value) {
          var node;
          this.openCurrent();
          node = new XMLComment(this, value);
          this.onData(this.writer.comment(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.raw = function(value) {
          var node;
          this.openCurrent();
          node = new XMLRaw(this, value);
          this.onData(this.writer.raw(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.instruction = function(target, value) {
          var i2, insTarget, insValue, len, node;
          this.openCurrent();
          if (target != null) {
            target = getValue(target);
          }
          if (value != null) {
            value = getValue(value);
          }
          if (Array.isArray(target)) {
            for (i2 = 0, len = target.length; i2 < len; i2++) {
              insTarget = target[i2];
              this.instruction(insTarget);
            }
          } else if (isObject(target)) {
            for (insTarget in target) {
              if (!hasProp.call(target, insTarget)) continue;
              insValue = target[insTarget];
              this.instruction(insTarget, insValue);
            }
          } else {
            if (isFunction(value)) {
              value = value.apply();
            }
            node = new XMLProcessingInstruction(this, target, value);
            this.onData(this.writer.processingInstruction(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          }
          return this;
        };
        XMLDocumentCB2.prototype.declaration = function(version, encoding, standalone) {
          var node;
          this.openCurrent();
          if (this.documentStarted) {
            throw new Error("declaration() must be the first node.");
          }
          node = new XMLDeclaration(this, version, encoding, standalone);
          this.onData(this.writer.declaration(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.doctype = function(root, pubID, sysID) {
          this.openCurrent();
          if (root == null) {
            throw new Error("Missing root node name.");
          }
          if (this.root) {
            throw new Error("dtd() must come before the root node.");
          }
          this.currentNode = new XMLDocType(this, pubID, sysID);
          this.currentNode.rootNodeName = root;
          this.currentNode.children = false;
          this.currentLevel++;
          this.openTags[this.currentLevel] = this.currentNode;
          return this;
        };
        XMLDocumentCB2.prototype.dtdElement = function(name, value) {
          var node;
          this.openCurrent();
          node = new XMLDTDElement(this, name, value);
          this.onData(this.writer.dtdElement(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.attList = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
          var node;
          this.openCurrent();
          node = new XMLDTDAttList(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
          this.onData(this.writer.dtdAttList(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.entity = function(name, value) {
          var node;
          this.openCurrent();
          node = new XMLDTDEntity(this, false, name, value);
          this.onData(this.writer.dtdEntity(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.pEntity = function(name, value) {
          var node;
          this.openCurrent();
          node = new XMLDTDEntity(this, true, name, value);
          this.onData(this.writer.dtdEntity(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.notation = function(name, value) {
          var node;
          this.openCurrent();
          node = new XMLDTDNotation(this, name, value);
          this.onData(this.writer.dtdNotation(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.up = function() {
          if (this.currentLevel < 0) {
            throw new Error("The document node has no parent.");
          }
          if (this.currentNode) {
            if (this.currentNode.children) {
              this.closeNode(this.currentNode);
            } else {
              this.openNode(this.currentNode);
            }
            this.currentNode = null;
          } else {
            this.closeNode(this.openTags[this.currentLevel]);
          }
          delete this.openTags[this.currentLevel];
          this.currentLevel--;
          return this;
        };
        XMLDocumentCB2.prototype.end = function() {
          while (this.currentLevel >= 0) {
            this.up();
          }
          return this.onEnd();
        };
        XMLDocumentCB2.prototype.openCurrent = function() {
          if (this.currentNode) {
            this.currentNode.children = true;
            return this.openNode(this.currentNode);
          }
        };
        XMLDocumentCB2.prototype.openNode = function(node) {
          var att, chunk, name, ref1;
          if (!node.isOpen) {
            if (!this.root && this.currentLevel === 0 && node.type === NodeType.Element) {
              this.root = node;
            }
            chunk = "";
            if (node.type === NodeType.Element) {
              this.writerOptions.state = WriterState.OpenTag;
              chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + "<" + node.name;
              ref1 = node.attribs;
              for (name in ref1) {
                if (!hasProp.call(ref1, name)) continue;
                att = ref1[name];
                chunk += this.writer.attribute(att, this.writerOptions, this.currentLevel);
              }
              chunk += (node.children ? ">" : "/>") + this.writer.endline(node, this.writerOptions, this.currentLevel);
              this.writerOptions.state = WriterState.InsideTag;
            } else {
              this.writerOptions.state = WriterState.OpenTag;
              chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + "<!DOCTYPE " + node.rootNodeName;
              if (node.pubID && node.sysID) {
                chunk += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
              } else if (node.sysID) {
                chunk += ' SYSTEM "' + node.sysID + '"';
              }
              if (node.children) {
                chunk += " [";
                this.writerOptions.state = WriterState.InsideTag;
              } else {
                this.writerOptions.state = WriterState.CloseTag;
                chunk += ">";
              }
              chunk += this.writer.endline(node, this.writerOptions, this.currentLevel);
            }
            this.onData(chunk, this.currentLevel);
            return node.isOpen = true;
          }
        };
        XMLDocumentCB2.prototype.closeNode = function(node) {
          var chunk;
          if (!node.isClosed) {
            chunk = "";
            this.writerOptions.state = WriterState.CloseTag;
            if (node.type === NodeType.Element) {
              chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + "</" + node.name + ">" + this.writer.endline(node, this.writerOptions, this.currentLevel);
            } else {
              chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + "]>" + this.writer.endline(node, this.writerOptions, this.currentLevel);
            }
            this.writerOptions.state = WriterState.None;
            this.onData(chunk, this.currentLevel);
            return node.isClosed = true;
          }
        };
        XMLDocumentCB2.prototype.onData = function(chunk, level) {
          this.documentStarted = true;
          return this.onDataCallback(chunk, level + 1);
        };
        XMLDocumentCB2.prototype.onEnd = function() {
          this.documentCompleted = true;
          return this.onEndCallback();
        };
        XMLDocumentCB2.prototype.debugInfo = function(name) {
          if (name == null) {
            return "";
          } else {
            return "node: <" + name + ">";
          }
        };
        XMLDocumentCB2.prototype.ele = function() {
          return this.element.apply(this, arguments);
        };
        XMLDocumentCB2.prototype.nod = function(name, attributes, text) {
          return this.node(name, attributes, text);
        };
        XMLDocumentCB2.prototype.txt = function(value) {
          return this.text(value);
        };
        XMLDocumentCB2.prototype.dat = function(value) {
          return this.cdata(value);
        };
        XMLDocumentCB2.prototype.com = function(value) {
          return this.comment(value);
        };
        XMLDocumentCB2.prototype.ins = function(target, value) {
          return this.instruction(target, value);
        };
        XMLDocumentCB2.prototype.dec = function(version, encoding, standalone) {
          return this.declaration(version, encoding, standalone);
        };
        XMLDocumentCB2.prototype.dtd = function(root, pubID, sysID) {
          return this.doctype(root, pubID, sysID);
        };
        XMLDocumentCB2.prototype.e = function(name, attributes, text) {
          return this.element(name, attributes, text);
        };
        XMLDocumentCB2.prototype.n = function(name, attributes, text) {
          return this.node(name, attributes, text);
        };
        XMLDocumentCB2.prototype.t = function(value) {
          return this.text(value);
        };
        XMLDocumentCB2.prototype.d = function(value) {
          return this.cdata(value);
        };
        XMLDocumentCB2.prototype.c = function(value) {
          return this.comment(value);
        };
        XMLDocumentCB2.prototype.r = function(value) {
          return this.raw(value);
        };
        XMLDocumentCB2.prototype.i = function(target, value) {
          return this.instruction(target, value);
        };
        XMLDocumentCB2.prototype.att = function() {
          if (this.currentNode && this.currentNode.type === NodeType.DocType) {
            return this.attList.apply(this, arguments);
          } else {
            return this.attribute.apply(this, arguments);
          }
        };
        XMLDocumentCB2.prototype.a = function() {
          if (this.currentNode && this.currentNode.type === NodeType.DocType) {
            return this.attList.apply(this, arguments);
          } else {
            return this.attribute.apply(this, arguments);
          }
        };
        XMLDocumentCB2.prototype.ent = function(name, value) {
          return this.entity(name, value);
        };
        XMLDocumentCB2.prototype.pent = function(name, value) {
          return this.pEntity(name, value);
        };
        XMLDocumentCB2.prototype.not = function(name, value) {
          return this.notation(name, value);
        };
        return XMLDocumentCB2;
      }();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLStreamWriter.js
var require_XMLStreamWriter = __commonJS({
  "node_modules/xmlbuilder/lib/XMLStreamWriter.js"(exports2, module2) {
    (function() {
      var NodeType, WriterState, XMLStreamWriter, XMLWriterBase, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      NodeType = require_NodeType();
      XMLWriterBase = require_XMLWriterBase();
      WriterState = require_WriterState();
      module2.exports = XMLStreamWriter = function(superClass) {
        extend(XMLStreamWriter2, superClass);
        function XMLStreamWriter2(stream, options) {
          this.stream = stream;
          XMLStreamWriter2.__super__.constructor.call(this, options);
        }
        XMLStreamWriter2.prototype.endline = function(node, options, level) {
          if (node.isLastRootNode && options.state === WriterState.CloseTag) {
            return "";
          } else {
            return XMLStreamWriter2.__super__.endline.call(this, node, options, level);
          }
        };
        XMLStreamWriter2.prototype.document = function(doc, options) {
          var child, i2, j2, k2, len, len1, ref, ref1, results;
          ref = doc.children;
          for (i2 = j2 = 0, len = ref.length; j2 < len; i2 = ++j2) {
            child = ref[i2];
            child.isLastRootNode = i2 === doc.children.length - 1;
          }
          options = this.filterOptions(options);
          ref1 = doc.children;
          results = [];
          for (k2 = 0, len1 = ref1.length; k2 < len1; k2++) {
            child = ref1[k2];
            results.push(this.writeChildNode(child, options, 0));
          }
          return results;
        };
        XMLStreamWriter2.prototype.attribute = function(att, options, level) {
          return this.stream.write(XMLStreamWriter2.__super__.attribute.call(this, att, options, level));
        };
        XMLStreamWriter2.prototype.cdata = function(node, options, level) {
          return this.stream.write(XMLStreamWriter2.__super__.cdata.call(this, node, options, level));
        };
        XMLStreamWriter2.prototype.comment = function(node, options, level) {
          return this.stream.write(XMLStreamWriter2.__super__.comment.call(this, node, options, level));
        };
        XMLStreamWriter2.prototype.declaration = function(node, options, level) {
          return this.stream.write(XMLStreamWriter2.__super__.declaration.call(this, node, options, level));
        };
        XMLStreamWriter2.prototype.docType = function(node, options, level) {
          var child, j2, len, ref;
          level || (level = 0);
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          this.stream.write(this.indent(node, options, level));
          this.stream.write("<!DOCTYPE " + node.root().name);
          if (node.pubID && node.sysID) {
            this.stream.write(' PUBLIC "' + node.pubID + '" "' + node.sysID + '"');
          } else if (node.sysID) {
            this.stream.write(' SYSTEM "' + node.sysID + '"');
          }
          if (node.children.length > 0) {
            this.stream.write(" [");
            this.stream.write(this.endline(node, options, level));
            options.state = WriterState.InsideTag;
            ref = node.children;
            for (j2 = 0, len = ref.length; j2 < len; j2++) {
              child = ref[j2];
              this.writeChildNode(child, options, level + 1);
            }
            options.state = WriterState.CloseTag;
            this.stream.write("]");
          }
          options.state = WriterState.CloseTag;
          this.stream.write(options.spaceBeforeSlash + ">");
          this.stream.write(this.endline(node, options, level));
          options.state = WriterState.None;
          return this.closeNode(node, options, level);
        };
        XMLStreamWriter2.prototype.element = function(node, options, level) {
          var att, child, childNodeCount, firstChildNode, j2, len, name, prettySuppressed, ref, ref1;
          level || (level = 0);
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          this.stream.write(this.indent(node, options, level) + "<" + node.name);
          ref = node.attribs;
          for (name in ref) {
            if (!hasProp.call(ref, name)) continue;
            att = ref[name];
            this.attribute(att, options, level);
          }
          childNodeCount = node.children.length;
          firstChildNode = childNodeCount === 0 ? null : node.children[0];
          if (childNodeCount === 0 || node.children.every(function(e2) {
            return (e2.type === NodeType.Text || e2.type === NodeType.Raw) && e2.value === "";
          })) {
            if (options.allowEmpty) {
              this.stream.write(">");
              options.state = WriterState.CloseTag;
              this.stream.write("</" + node.name + ">");
            } else {
              options.state = WriterState.CloseTag;
              this.stream.write(options.spaceBeforeSlash + "/>");
            }
          } else if (options.pretty && childNodeCount === 1 && (firstChildNode.type === NodeType.Text || firstChildNode.type === NodeType.Raw) && firstChildNode.value != null) {
            this.stream.write(">");
            options.state = WriterState.InsideTag;
            options.suppressPrettyCount++;
            prettySuppressed = true;
            this.writeChildNode(firstChildNode, options, level + 1);
            options.suppressPrettyCount--;
            prettySuppressed = false;
            options.state = WriterState.CloseTag;
            this.stream.write("</" + node.name + ">");
          } else {
            this.stream.write(">" + this.endline(node, options, level));
            options.state = WriterState.InsideTag;
            ref1 = node.children;
            for (j2 = 0, len = ref1.length; j2 < len; j2++) {
              child = ref1[j2];
              this.writeChildNode(child, options, level + 1);
            }
            options.state = WriterState.CloseTag;
            this.stream.write(this.indent(node, options, level) + "</" + node.name + ">");
          }
          this.stream.write(this.endline(node, options, level));
          options.state = WriterState.None;
          return this.closeNode(node, options, level);
        };
        XMLStreamWriter2.prototype.processingInstruction = function(node, options, level) {
          return this.stream.write(XMLStreamWriter2.__super__.processingInstruction.call(this, node, options, level));
        };
        XMLStreamWriter2.prototype.raw = function(node, options, level) {
          return this.stream.write(XMLStreamWriter2.__super__.raw.call(this, node, options, level));
        };
        XMLStreamWriter2.prototype.text = function(node, options, level) {
          return this.stream.write(XMLStreamWriter2.__super__.text.call(this, node, options, level));
        };
        XMLStreamWriter2.prototype.dtdAttList = function(node, options, level) {
          return this.stream.write(XMLStreamWriter2.__super__.dtdAttList.call(this, node, options, level));
        };
        XMLStreamWriter2.prototype.dtdElement = function(node, options, level) {
          return this.stream.write(XMLStreamWriter2.__super__.dtdElement.call(this, node, options, level));
        };
        XMLStreamWriter2.prototype.dtdEntity = function(node, options, level) {
          return this.stream.write(XMLStreamWriter2.__super__.dtdEntity.call(this, node, options, level));
        };
        XMLStreamWriter2.prototype.dtdNotation = function(node, options, level) {
          return this.stream.write(XMLStreamWriter2.__super__.dtdNotation.call(this, node, options, level));
        };
        return XMLStreamWriter2;
      }(XMLWriterBase);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/index.js
var require_lib = __commonJS({
  "node_modules/xmlbuilder/lib/index.js"(exports2, module2) {
    (function() {
      var NodeType, WriterState, XMLDOMImplementation, XMLDocument, XMLDocumentCB, XMLStreamWriter, XMLStringWriter, assign, isFunction, ref;
      ref = require_Utility(), assign = ref.assign, isFunction = ref.isFunction;
      XMLDOMImplementation = require_XMLDOMImplementation();
      XMLDocument = require_XMLDocument();
      XMLDocumentCB = require_XMLDocumentCB();
      XMLStringWriter = require_XMLStringWriter();
      XMLStreamWriter = require_XMLStreamWriter();
      NodeType = require_NodeType();
      WriterState = require_WriterState();
      module2.exports.create = function(name, xmldec, doctype, options) {
        var doc, root;
        if (name == null) {
          throw new Error("Root element needs a name.");
        }
        options = assign({}, xmldec, doctype, options);
        doc = new XMLDocument(options);
        root = doc.element(name);
        if (!options.headless) {
          doc.declaration(options);
          if (options.pubID != null || options.sysID != null) {
            doc.dtd(options);
          }
        }
        return root;
      };
      module2.exports.begin = function(options, onData, onEnd) {
        var ref1;
        if (isFunction(options)) {
          ref1 = [options, onData], onData = ref1[0], onEnd = ref1[1];
          options = {};
        }
        if (onData) {
          return new XMLDocumentCB(options, onData, onEnd);
        } else {
          return new XMLDocument(options);
        }
      };
      module2.exports.stringWriter = function(options) {
        return new XMLStringWriter(options);
      };
      module2.exports.streamWriter = function(stream, options) {
        return new XMLStreamWriter(stream, options);
      };
      module2.exports.implementation = new XMLDOMImplementation();
      module2.exports.nodeType = NodeType;
      module2.exports.writerState = WriterState;
    }).call(exports2);
  }
});

// node_modules/xml2js/lib/builder.js
var require_builder = __commonJS({
  "node_modules/xml2js/lib/builder.js"(exports2) {
    (function() {
      "use strict";
      var builder, defaults, escapeCDATA, requiresCDATA, wrapCDATA, hasProp = {}.hasOwnProperty;
      builder = require_lib();
      defaults = require_defaults().defaults;
      requiresCDATA = function(entry) {
        return typeof entry === "string" && (entry.indexOf("&") >= 0 || entry.indexOf(">") >= 0 || entry.indexOf("<") >= 0);
      };
      wrapCDATA = function(entry) {
        return "<![CDATA[" + escapeCDATA(entry) + "]]>";
      };
      escapeCDATA = function(entry) {
        return entry.replace("]]>", "]]]]><![CDATA[>");
      };
      exports2.Builder = function() {
        function Builder(opts) {
          var key, ref, value;
          this.options = {};
          ref = defaults["0.2"];
          for (key in ref) {
            if (!hasProp.call(ref, key)) continue;
            value = ref[key];
            this.options[key] = value;
          }
          for (key in opts) {
            if (!hasProp.call(opts, key)) continue;
            value = opts[key];
            this.options[key] = value;
          }
        }
        Builder.prototype.buildObject = function(rootObj) {
          var attrkey, charkey, render, rootElement, rootName;
          attrkey = this.options.attrkey;
          charkey = this.options.charkey;
          if (Object.keys(rootObj).length === 1 && this.options.rootName === defaults["0.2"].rootName) {
            rootName = Object.keys(rootObj)[0];
            rootObj = rootObj[rootName];
          } else {
            rootName = this.options.rootName;
          }
          render = /* @__PURE__ */ function(_this) {
            return function(element, obj) {
              var attr, child, entry, index, key, value;
              if (typeof obj !== "object") {
                if (_this.options.cdata && requiresCDATA(obj)) {
                  element.raw(wrapCDATA(obj));
                } else {
                  element.txt(obj);
                }
              } else if (Array.isArray(obj)) {
                for (index in obj) {
                  if (!hasProp.call(obj, index)) continue;
                  child = obj[index];
                  for (key in child) {
                    entry = child[key];
                    element = render(element.ele(key), entry).up();
                  }
                }
              } else {
                for (key in obj) {
                  if (!hasProp.call(obj, key)) continue;
                  child = obj[key];
                  if (key === attrkey) {
                    if (typeof child === "object") {
                      for (attr in child) {
                        value = child[attr];
                        element = element.att(attr, value);
                      }
                    }
                  } else if (key === charkey) {
                    if (_this.options.cdata && requiresCDATA(child)) {
                      element = element.raw(wrapCDATA(child));
                    } else {
                      element = element.txt(child);
                    }
                  } else if (Array.isArray(child)) {
                    for (index in child) {
                      if (!hasProp.call(child, index)) continue;
                      entry = child[index];
                      if (typeof entry === "string") {
                        if (_this.options.cdata && requiresCDATA(entry)) {
                          element = element.ele(key).raw(wrapCDATA(entry)).up();
                        } else {
                          element = element.ele(key, entry).up();
                        }
                      } else {
                        element = render(element.ele(key), entry).up();
                      }
                    }
                  } else if (typeof child === "object") {
                    element = render(element.ele(key), child).up();
                  } else {
                    if (typeof child === "string" && _this.options.cdata && requiresCDATA(child)) {
                      element = element.ele(key).raw(wrapCDATA(child)).up();
                    } else {
                      if (child == null) {
                        child = "";
                      }
                      element = element.ele(key, child.toString()).up();
                    }
                  }
                }
              }
              return element;
            };
          }(this);
          rootElement = builder.create(rootName, this.options.xmldec, this.options.doctype, {
            headless: this.options.headless,
            allowSurrogateChars: this.options.allowSurrogateChars
          });
          return render(rootElement, rootObj).end(this.options.renderOpts);
        };
        return Builder;
      }();
    }).call(exports2);
  }
});

// node_modules/sax/lib/sax.js
var require_sax = __commonJS({
  "node_modules/sax/lib/sax.js"(exports2) {
    (function(sax) {
      sax.parser = function(strict, opt) {
        return new SAXParser(strict, opt);
      };
      sax.SAXParser = SAXParser;
      sax.SAXStream = SAXStream;
      sax.createStream = createStream;
      sax.MAX_BUFFER_LENGTH = 64 * 1024;
      var buffers = [
        "comment",
        "sgmlDecl",
        "textNode",
        "tagName",
        "doctype",
        "procInstName",
        "procInstBody",
        "entity",
        "attribName",
        "attribValue",
        "cdata",
        "script"
      ];
      sax.EVENTS = [
        "text",
        "processinginstruction",
        "sgmldeclaration",
        "doctype",
        "comment",
        "opentagstart",
        "attribute",
        "opentag",
        "closetag",
        "opencdata",
        "cdata",
        "closecdata",
        "error",
        "end",
        "ready",
        "script",
        "opennamespace",
        "closenamespace"
      ];
      function SAXParser(strict, opt) {
        if (!(this instanceof SAXParser)) {
          return new SAXParser(strict, opt);
        }
        var parser = this;
        clearBuffers(parser);
        parser.q = parser.c = "";
        parser.bufferCheckPosition = sax.MAX_BUFFER_LENGTH;
        parser.opt = opt || {};
        parser.opt.lowercase = parser.opt.lowercase || parser.opt.lowercasetags;
        parser.looseCase = parser.opt.lowercase ? "toLowerCase" : "toUpperCase";
        parser.tags = [];
        parser.closed = parser.closedRoot = parser.sawRoot = false;
        parser.tag = parser.error = null;
        parser.strict = !!strict;
        parser.noscript = !!(strict || parser.opt.noscript);
        parser.state = S2.BEGIN;
        parser.strictEntities = parser.opt.strictEntities;
        parser.ENTITIES = parser.strictEntities ? Object.create(sax.XML_ENTITIES) : Object.create(sax.ENTITIES);
        parser.attribList = [];
        if (parser.opt.xmlns) {
          parser.ns = Object.create(rootNS);
        }
        if (parser.opt.unquotedAttributeValues === void 0) {
          parser.opt.unquotedAttributeValues = !strict;
        }
        parser.trackPosition = parser.opt.position !== false;
        if (parser.trackPosition) {
          parser.position = parser.line = parser.column = 0;
        }
        emit(parser, "onready");
      }
      if (!Object.create) {
        Object.create = function(o) {
          function F3() {
          }
          F3.prototype = o;
          var newf = new F3();
          return newf;
        };
      }
      if (!Object.keys) {
        Object.keys = function(o) {
          var a = [];
          for (var i2 in o) if (o.hasOwnProperty(i2)) a.push(i2);
          return a;
        };
      }
      function checkBufferLength(parser) {
        var maxAllowed = Math.max(sax.MAX_BUFFER_LENGTH, 10);
        var maxActual = 0;
        for (var i2 = 0, l = buffers.length; i2 < l; i2++) {
          var len = parser[buffers[i2]].length;
          if (len > maxAllowed) {
            switch (buffers[i2]) {
              case "textNode":
                closeText(parser);
                break;
              case "cdata":
                emitNode(parser, "oncdata", parser.cdata);
                parser.cdata = "";
                break;
              case "script":
                emitNode(parser, "onscript", parser.script);
                parser.script = "";
                break;
              default:
                error(parser, "Max buffer length exceeded: " + buffers[i2]);
            }
          }
          maxActual = Math.max(maxActual, len);
        }
        var m3 = sax.MAX_BUFFER_LENGTH - maxActual;
        parser.bufferCheckPosition = m3 + parser.position;
      }
      function clearBuffers(parser) {
        for (var i2 = 0, l = buffers.length; i2 < l; i2++) {
          parser[buffers[i2]] = "";
        }
      }
      function flushBuffers(parser) {
        closeText(parser);
        if (parser.cdata !== "") {
          emitNode(parser, "oncdata", parser.cdata);
          parser.cdata = "";
        }
        if (parser.script !== "") {
          emitNode(parser, "onscript", parser.script);
          parser.script = "";
        }
      }
      SAXParser.prototype = {
        end: function() {
          end(this);
        },
        write,
        resume: function() {
          this.error = null;
          return this;
        },
        close: function() {
          return this.write(null);
        },
        flush: function() {
          flushBuffers(this);
        }
      };
      var Stream3;
      try {
        Stream3 = require("stream").Stream;
      } catch (ex) {
        Stream3 = function() {
        };
      }
      if (!Stream3) Stream3 = function() {
      };
      var streamWraps = sax.EVENTS.filter(function(ev) {
        return ev !== "error" && ev !== "end";
      });
      function createStream(strict, opt) {
        return new SAXStream(strict, opt);
      }
      function SAXStream(strict, opt) {
        if (!(this instanceof SAXStream)) {
          return new SAXStream(strict, opt);
        }
        Stream3.apply(this);
        this._parser = new SAXParser(strict, opt);
        this.writable = true;
        this.readable = true;
        var me = this;
        this._parser.onend = function() {
          me.emit("end");
        };
        this._parser.onerror = function(er2) {
          me.emit("error", er2);
          me._parser.error = null;
        };
        this._decoder = null;
        streamWraps.forEach(function(ev) {
          Object.defineProperty(me, "on" + ev, {
            get: function() {
              return me._parser["on" + ev];
            },
            set: function(h2) {
              if (!h2) {
                me.removeAllListeners(ev);
                me._parser["on" + ev] = h2;
                return h2;
              }
              me.on(ev, h2);
            },
            enumerable: true,
            configurable: false
          });
        });
      }
      SAXStream.prototype = Object.create(Stream3.prototype, {
        constructor: {
          value: SAXStream
        }
      });
      SAXStream.prototype.write = function(data) {
        if (typeof Buffer === "function" && typeof Buffer.isBuffer === "function" && Buffer.isBuffer(data)) {
          if (!this._decoder) {
            var SD = require("string_decoder").StringDecoder;
            this._decoder = new SD("utf8");
          }
          data = this._decoder.write(data);
        }
        this._parser.write(data.toString());
        this.emit("data", data);
        return true;
      };
      SAXStream.prototype.end = function(chunk) {
        if (chunk && chunk.length) {
          this.write(chunk);
        }
        this._parser.end();
        return true;
      };
      SAXStream.prototype.on = function(ev, handler) {
        var me = this;
        if (!me._parser["on" + ev] && streamWraps.indexOf(ev) !== -1) {
          me._parser["on" + ev] = function() {
            var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
            args.splice(0, 0, ev);
            me.emit.apply(me, args);
          };
        }
        return Stream3.prototype.on.call(me, ev, handler);
      };
      var CDATA = "[CDATA[";
      var DOCTYPE = "DOCTYPE";
      var XML_NAMESPACE = "http://www.w3.org/XML/1998/namespace";
      var XMLNS_NAMESPACE = "http://www.w3.org/2000/xmlns/";
      var rootNS = { xml: XML_NAMESPACE, xmlns: XMLNS_NAMESPACE };
      var nameStart = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
      var nameBody = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
      var entityStart = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
      var entityBody = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
      function isWhitespace(c) {
        return c === " " || c === "\n" || c === "\r" || c === "	";
      }
      function isQuote(c) {
        return c === '"' || c === "'";
      }
      function isAttribEnd(c) {
        return c === ">" || isWhitespace(c);
      }
      function isMatch(regex, c) {
        return regex.test(c);
      }
      function notMatch(regex, c) {
        return !isMatch(regex, c);
      }
      var S2 = 0;
      sax.STATE = {
        BEGIN: S2++,
        // leading byte order mark or whitespace
        BEGIN_WHITESPACE: S2++,
        // leading whitespace
        TEXT: S2++,
        // general stuff
        TEXT_ENTITY: S2++,
        // &amp and such.
        OPEN_WAKA: S2++,
        // <
        SGML_DECL: S2++,
        // <!BLARG
        SGML_DECL_QUOTED: S2++,
        // <!BLARG foo "bar
        DOCTYPE: S2++,
        // <!DOCTYPE
        DOCTYPE_QUOTED: S2++,
        // <!DOCTYPE "//blah
        DOCTYPE_DTD: S2++,
        // <!DOCTYPE "//blah" [ ...
        DOCTYPE_DTD_QUOTED: S2++,
        // <!DOCTYPE "//blah" [ "foo
        COMMENT_STARTING: S2++,
        // <!-
        COMMENT: S2++,
        // <!--
        COMMENT_ENDING: S2++,
        // <!-- blah -
        COMMENT_ENDED: S2++,
        // <!-- blah --
        CDATA: S2++,
        // <![CDATA[ something
        CDATA_ENDING: S2++,
        // ]
        CDATA_ENDING_2: S2++,
        // ]]
        PROC_INST: S2++,
        // <?hi
        PROC_INST_BODY: S2++,
        // <?hi there
        PROC_INST_ENDING: S2++,
        // <?hi "there" ?
        OPEN_TAG: S2++,
        // <strong
        OPEN_TAG_SLASH: S2++,
        // <strong /
        ATTRIB: S2++,
        // <a
        ATTRIB_NAME: S2++,
        // <a foo
        ATTRIB_NAME_SAW_WHITE: S2++,
        // <a foo _
        ATTRIB_VALUE: S2++,
        // <a foo=
        ATTRIB_VALUE_QUOTED: S2++,
        // <a foo="bar
        ATTRIB_VALUE_CLOSED: S2++,
        // <a foo="bar"
        ATTRIB_VALUE_UNQUOTED: S2++,
        // <a foo=bar
        ATTRIB_VALUE_ENTITY_Q: S2++,
        // <foo bar="&quot;"
        ATTRIB_VALUE_ENTITY_U: S2++,
        // <foo bar=&quot
        CLOSE_TAG: S2++,
        // </a
        CLOSE_TAG_SAW_WHITE: S2++,
        // </a   >
        SCRIPT: S2++,
        // <script> ...
        SCRIPT_ENDING: S2++
        // <script> ... <
      };
      sax.XML_ENTITIES = {
        "amp": "&",
        "gt": ">",
        "lt": "<",
        "quot": '"',
        "apos": "'"
      };
      sax.ENTITIES = {
        "amp": "&",
        "gt": ">",
        "lt": "<",
        "quot": '"',
        "apos": "'",
        "AElig": 198,
        "Aacute": 193,
        "Acirc": 194,
        "Agrave": 192,
        "Aring": 197,
        "Atilde": 195,
        "Auml": 196,
        "Ccedil": 199,
        "ETH": 208,
        "Eacute": 201,
        "Ecirc": 202,
        "Egrave": 200,
        "Euml": 203,
        "Iacute": 205,
        "Icirc": 206,
        "Igrave": 204,
        "Iuml": 207,
        "Ntilde": 209,
        "Oacute": 211,
        "Ocirc": 212,
        "Ograve": 210,
        "Oslash": 216,
        "Otilde": 213,
        "Ouml": 214,
        "THORN": 222,
        "Uacute": 218,
        "Ucirc": 219,
        "Ugrave": 217,
        "Uuml": 220,
        "Yacute": 221,
        "aacute": 225,
        "acirc": 226,
        "aelig": 230,
        "agrave": 224,
        "aring": 229,
        "atilde": 227,
        "auml": 228,
        "ccedil": 231,
        "eacute": 233,
        "ecirc": 234,
        "egrave": 232,
        "eth": 240,
        "euml": 235,
        "iacute": 237,
        "icirc": 238,
        "igrave": 236,
        "iuml": 239,
        "ntilde": 241,
        "oacute": 243,
        "ocirc": 244,
        "ograve": 242,
        "oslash": 248,
        "otilde": 245,
        "ouml": 246,
        "szlig": 223,
        "thorn": 254,
        "uacute": 250,
        "ucirc": 251,
        "ugrave": 249,
        "uuml": 252,
        "yacute": 253,
        "yuml": 255,
        "copy": 169,
        "reg": 174,
        "nbsp": 160,
        "iexcl": 161,
        "cent": 162,
        "pound": 163,
        "curren": 164,
        "yen": 165,
        "brvbar": 166,
        "sect": 167,
        "uml": 168,
        "ordf": 170,
        "laquo": 171,
        "not": 172,
        "shy": 173,
        "macr": 175,
        "deg": 176,
        "plusmn": 177,
        "sup1": 185,
        "sup2": 178,
        "sup3": 179,
        "acute": 180,
        "micro": 181,
        "para": 182,
        "middot": 183,
        "cedil": 184,
        "ordm": 186,
        "raquo": 187,
        "frac14": 188,
        "frac12": 189,
        "frac34": 190,
        "iquest": 191,
        "times": 215,
        "divide": 247,
        "OElig": 338,
        "oelig": 339,
        "Scaron": 352,
        "scaron": 353,
        "Yuml": 376,
        "fnof": 402,
        "circ": 710,
        "tilde": 732,
        "Alpha": 913,
        "Beta": 914,
        "Gamma": 915,
        "Delta": 916,
        "Epsilon": 917,
        "Zeta": 918,
        "Eta": 919,
        "Theta": 920,
        "Iota": 921,
        "Kappa": 922,
        "Lambda": 923,
        "Mu": 924,
        "Nu": 925,
        "Xi": 926,
        "Omicron": 927,
        "Pi": 928,
        "Rho": 929,
        "Sigma": 931,
        "Tau": 932,
        "Upsilon": 933,
        "Phi": 934,
        "Chi": 935,
        "Psi": 936,
        "Omega": 937,
        "alpha": 945,
        "beta": 946,
        "gamma": 947,
        "delta": 948,
        "epsilon": 949,
        "zeta": 950,
        "eta": 951,
        "theta": 952,
        "iota": 953,
        "kappa": 954,
        "lambda": 955,
        "mu": 956,
        "nu": 957,
        "xi": 958,
        "omicron": 959,
        "pi": 960,
        "rho": 961,
        "sigmaf": 962,
        "sigma": 963,
        "tau": 964,
        "upsilon": 965,
        "phi": 966,
        "chi": 967,
        "psi": 968,
        "omega": 969,
        "thetasym": 977,
        "upsih": 978,
        "piv": 982,
        "ensp": 8194,
        "emsp": 8195,
        "thinsp": 8201,
        "zwnj": 8204,
        "zwj": 8205,
        "lrm": 8206,
        "rlm": 8207,
        "ndash": 8211,
        "mdash": 8212,
        "lsquo": 8216,
        "rsquo": 8217,
        "sbquo": 8218,
        "ldquo": 8220,
        "rdquo": 8221,
        "bdquo": 8222,
        "dagger": 8224,
        "Dagger": 8225,
        "bull": 8226,
        "hellip": 8230,
        "permil": 8240,
        "prime": 8242,
        "Prime": 8243,
        "lsaquo": 8249,
        "rsaquo": 8250,
        "oline": 8254,
        "frasl": 8260,
        "euro": 8364,
        "image": 8465,
        "weierp": 8472,
        "real": 8476,
        "trade": 8482,
        "alefsym": 8501,
        "larr": 8592,
        "uarr": 8593,
        "rarr": 8594,
        "darr": 8595,
        "harr": 8596,
        "crarr": 8629,
        "lArr": 8656,
        "uArr": 8657,
        "rArr": 8658,
        "dArr": 8659,
        "hArr": 8660,
        "forall": 8704,
        "part": 8706,
        "exist": 8707,
        "empty": 8709,
        "nabla": 8711,
        "isin": 8712,
        "notin": 8713,
        "ni": 8715,
        "prod": 8719,
        "sum": 8721,
        "minus": 8722,
        "lowast": 8727,
        "radic": 8730,
        "prop": 8733,
        "infin": 8734,
        "ang": 8736,
        "and": 8743,
        "or": 8744,
        "cap": 8745,
        "cup": 8746,
        "int": 8747,
        "there4": 8756,
        "sim": 8764,
        "cong": 8773,
        "asymp": 8776,
        "ne": 8800,
        "equiv": 8801,
        "le": 8804,
        "ge": 8805,
        "sub": 8834,
        "sup": 8835,
        "nsub": 8836,
        "sube": 8838,
        "supe": 8839,
        "oplus": 8853,
        "otimes": 8855,
        "perp": 8869,
        "sdot": 8901,
        "lceil": 8968,
        "rceil": 8969,
        "lfloor": 8970,
        "rfloor": 8971,
        "lang": 9001,
        "rang": 9002,
        "loz": 9674,
        "spades": 9824,
        "clubs": 9827,
        "hearts": 9829,
        "diams": 9830
      };
      Object.keys(sax.ENTITIES).forEach(function(key) {
        var e2 = sax.ENTITIES[key];
        var s3 = typeof e2 === "number" ? String.fromCharCode(e2) : e2;
        sax.ENTITIES[key] = s3;
      });
      for (var s2 in sax.STATE) {
        sax.STATE[sax.STATE[s2]] = s2;
      }
      S2 = sax.STATE;
      function emit(parser, event, data) {
        parser[event] && parser[event](data);
      }
      function emitNode(parser, nodeType, data) {
        if (parser.textNode) closeText(parser);
        emit(parser, nodeType, data);
      }
      function closeText(parser) {
        parser.textNode = textopts(parser.opt, parser.textNode);
        if (parser.textNode) emit(parser, "ontext", parser.textNode);
        parser.textNode = "";
      }
      function textopts(opt, text) {
        if (opt.trim) text = text.trim();
        if (opt.normalize) text = text.replace(/\s+/g, " ");
        return text;
      }
      function error(parser, er2) {
        closeText(parser);
        if (parser.trackPosition) {
          er2 += "\nLine: " + parser.line + "\nColumn: " + parser.column + "\nChar: " + parser.c;
        }
        er2 = new Error(er2);
        parser.error = er2;
        emit(parser, "onerror", er2);
        return parser;
      }
      function end(parser) {
        if (parser.sawRoot && !parser.closedRoot) strictFail(parser, "Unclosed root tag");
        if (parser.state !== S2.BEGIN && parser.state !== S2.BEGIN_WHITESPACE && parser.state !== S2.TEXT) {
          error(parser, "Unexpected end");
        }
        closeText(parser);
        parser.c = "";
        parser.closed = true;
        emit(parser, "onend");
        SAXParser.call(parser, parser.strict, parser.opt);
        return parser;
      }
      function strictFail(parser, message) {
        if (typeof parser !== "object" || !(parser instanceof SAXParser)) {
          throw new Error("bad call to strictFail");
        }
        if (parser.strict) {
          error(parser, message);
        }
      }
      function newTag(parser) {
        if (!parser.strict) parser.tagName = parser.tagName[parser.looseCase]();
        var parent = parser.tags[parser.tags.length - 1] || parser;
        var tag = parser.tag = { name: parser.tagName, attributes: {} };
        if (parser.opt.xmlns) {
          tag.ns = parent.ns;
        }
        parser.attribList.length = 0;
        emitNode(parser, "onopentagstart", tag);
      }
      function qname(name, attribute) {
        var i2 = name.indexOf(":");
        var qualName = i2 < 0 ? ["", name] : name.split(":");
        var prefix = qualName[0];
        var local = qualName[1];
        if (attribute && name === "xmlns") {
          prefix = "xmlns";
          local = "";
        }
        return { prefix, local };
      }
      function attrib(parser) {
        if (!parser.strict) {
          parser.attribName = parser.attribName[parser.looseCase]();
        }
        if (parser.attribList.indexOf(parser.attribName) !== -1 || parser.tag.attributes.hasOwnProperty(parser.attribName)) {
          parser.attribName = parser.attribValue = "";
          return;
        }
        if (parser.opt.xmlns) {
          var qn = qname(parser.attribName, true);
          var prefix = qn.prefix;
          var local = qn.local;
          if (prefix === "xmlns") {
            if (local === "xml" && parser.attribValue !== XML_NAMESPACE) {
              strictFail(
                parser,
                "xml: prefix must be bound to " + XML_NAMESPACE + "\nActual: " + parser.attribValue
              );
            } else if (local === "xmlns" && parser.attribValue !== XMLNS_NAMESPACE) {
              strictFail(
                parser,
                "xmlns: prefix must be bound to " + XMLNS_NAMESPACE + "\nActual: " + parser.attribValue
              );
            } else {
              var tag = parser.tag;
              var parent = parser.tags[parser.tags.length - 1] || parser;
              if (tag.ns === parent.ns) {
                tag.ns = Object.create(parent.ns);
              }
              tag.ns[local] = parser.attribValue;
            }
          }
          parser.attribList.push([parser.attribName, parser.attribValue]);
        } else {
          parser.tag.attributes[parser.attribName] = parser.attribValue;
          emitNode(parser, "onattribute", {
            name: parser.attribName,
            value: parser.attribValue
          });
        }
        parser.attribName = parser.attribValue = "";
      }
      function openTag(parser, selfClosing) {
        if (parser.opt.xmlns) {
          var tag = parser.tag;
          var qn = qname(parser.tagName);
          tag.prefix = qn.prefix;
          tag.local = qn.local;
          tag.uri = tag.ns[qn.prefix] || "";
          if (tag.prefix && !tag.uri) {
            strictFail(parser, "Unbound namespace prefix: " + JSON.stringify(parser.tagName));
            tag.uri = qn.prefix;
          }
          var parent = parser.tags[parser.tags.length - 1] || parser;
          if (tag.ns && parent.ns !== tag.ns) {
            Object.keys(tag.ns).forEach(function(p) {
              emitNode(parser, "onopennamespace", {
                prefix: p,
                uri: tag.ns[p]
              });
            });
          }
          for (var i2 = 0, l = parser.attribList.length; i2 < l; i2++) {
            var nv = parser.attribList[i2];
            var name = nv[0];
            var value = nv[1];
            var qualName = qname(name, true);
            var prefix = qualName.prefix;
            var local = qualName.local;
            var uri = prefix === "" ? "" : tag.ns[prefix] || "";
            var a = {
              name,
              value,
              prefix,
              local,
              uri
            };
            if (prefix && prefix !== "xmlns" && !uri) {
              strictFail(parser, "Unbound namespace prefix: " + JSON.stringify(prefix));
              a.uri = prefix;
            }
            parser.tag.attributes[name] = a;
            emitNode(parser, "onattribute", a);
          }
          parser.attribList.length = 0;
        }
        parser.tag.isSelfClosing = !!selfClosing;
        parser.sawRoot = true;
        parser.tags.push(parser.tag);
        emitNode(parser, "onopentag", parser.tag);
        if (!selfClosing) {
          if (!parser.noscript && parser.tagName.toLowerCase() === "script") {
            parser.state = S2.SCRIPT;
          } else {
            parser.state = S2.TEXT;
          }
          parser.tag = null;
          parser.tagName = "";
        }
        parser.attribName = parser.attribValue = "";
        parser.attribList.length = 0;
      }
      function closeTag(parser) {
        if (!parser.tagName) {
          strictFail(parser, "Weird empty close tag.");
          parser.textNode += "</>";
          parser.state = S2.TEXT;
          return;
        }
        if (parser.script) {
          if (parser.tagName !== "script") {
            parser.script += "</" + parser.tagName + ">";
            parser.tagName = "";
            parser.state = S2.SCRIPT;
            return;
          }
          emitNode(parser, "onscript", parser.script);
          parser.script = "";
        }
        var t2 = parser.tags.length;
        var tagName = parser.tagName;
        if (!parser.strict) {
          tagName = tagName[parser.looseCase]();
        }
        var closeTo = tagName;
        while (t2--) {
          var close = parser.tags[t2];
          if (close.name !== closeTo) {
            strictFail(parser, "Unexpected close tag");
          } else {
            break;
          }
        }
        if (t2 < 0) {
          strictFail(parser, "Unmatched closing tag: " + parser.tagName);
          parser.textNode += "</" + parser.tagName + ">";
          parser.state = S2.TEXT;
          return;
        }
        parser.tagName = tagName;
        var s3 = parser.tags.length;
        while (s3-- > t2) {
          var tag = parser.tag = parser.tags.pop();
          parser.tagName = parser.tag.name;
          emitNode(parser, "onclosetag", parser.tagName);
          var x3 = {};
          for (var i2 in tag.ns) {
            x3[i2] = tag.ns[i2];
          }
          var parent = parser.tags[parser.tags.length - 1] || parser;
          if (parser.opt.xmlns && tag.ns !== parent.ns) {
            Object.keys(tag.ns).forEach(function(p) {
              var n = tag.ns[p];
              emitNode(parser, "onclosenamespace", { prefix: p, uri: n });
            });
          }
        }
        if (t2 === 0) parser.closedRoot = true;
        parser.tagName = parser.attribValue = parser.attribName = "";
        parser.attribList.length = 0;
        parser.state = S2.TEXT;
      }
      function parseEntity(parser) {
        var entity = parser.entity;
        var entityLC = entity.toLowerCase();
        var num;
        var numStr = "";
        if (parser.ENTITIES[entity]) {
          return parser.ENTITIES[entity];
        }
        if (parser.ENTITIES[entityLC]) {
          return parser.ENTITIES[entityLC];
        }
        entity = entityLC;
        if (entity.charAt(0) === "#") {
          if (entity.charAt(1) === "x") {
            entity = entity.slice(2);
            num = parseInt(entity, 16);
            numStr = num.toString(16);
          } else {
            entity = entity.slice(1);
            num = parseInt(entity, 10);
            numStr = num.toString(10);
          }
        }
        entity = entity.replace(/^0+/, "");
        if (isNaN(num) || numStr.toLowerCase() !== entity) {
          strictFail(parser, "Invalid character entity");
          return "&" + parser.entity + ";";
        }
        return String.fromCodePoint(num);
      }
      function beginWhiteSpace(parser, c) {
        if (c === "<") {
          parser.state = S2.OPEN_WAKA;
          parser.startTagPosition = parser.position;
        } else if (!isWhitespace(c)) {
          strictFail(parser, "Non-whitespace before first tag.");
          parser.textNode = c;
          parser.state = S2.TEXT;
        }
      }
      function charAt(chunk, i2) {
        var result = "";
        if (i2 < chunk.length) {
          result = chunk.charAt(i2);
        }
        return result;
      }
      function write(chunk) {
        var parser = this;
        if (this.error) {
          throw this.error;
        }
        if (parser.closed) {
          return error(
            parser,
            "Cannot write after close. Assign an onready handler."
          );
        }
        if (chunk === null) {
          return end(parser);
        }
        if (typeof chunk === "object") {
          chunk = chunk.toString();
        }
        var i2 = 0;
        var c = "";
        while (true) {
          c = charAt(chunk, i2++);
          parser.c = c;
          if (!c) {
            break;
          }
          if (parser.trackPosition) {
            parser.position++;
            if (c === "\n") {
              parser.line++;
              parser.column = 0;
            } else {
              parser.column++;
            }
          }
          switch (parser.state) {
            case S2.BEGIN:
              parser.state = S2.BEGIN_WHITESPACE;
              if (c === "\uFEFF") {
                continue;
              }
              beginWhiteSpace(parser, c);
              continue;
            case S2.BEGIN_WHITESPACE:
              beginWhiteSpace(parser, c);
              continue;
            case S2.TEXT:
              if (parser.sawRoot && !parser.closedRoot) {
                var starti = i2 - 1;
                while (c && c !== "<" && c !== "&") {
                  c = charAt(chunk, i2++);
                  if (c && parser.trackPosition) {
                    parser.position++;
                    if (c === "\n") {
                      parser.line++;
                      parser.column = 0;
                    } else {
                      parser.column++;
                    }
                  }
                }
                parser.textNode += chunk.substring(starti, i2 - 1);
              }
              if (c === "<" && !(parser.sawRoot && parser.closedRoot && !parser.strict)) {
                parser.state = S2.OPEN_WAKA;
                parser.startTagPosition = parser.position;
              } else {
                if (!isWhitespace(c) && (!parser.sawRoot || parser.closedRoot)) {
                  strictFail(parser, "Text data outside of root node.");
                }
                if (c === "&") {
                  parser.state = S2.TEXT_ENTITY;
                } else {
                  parser.textNode += c;
                }
              }
              continue;
            case S2.SCRIPT:
              if (c === "<") {
                parser.state = S2.SCRIPT_ENDING;
              } else {
                parser.script += c;
              }
              continue;
            case S2.SCRIPT_ENDING:
              if (c === "/") {
                parser.state = S2.CLOSE_TAG;
              } else {
                parser.script += "<" + c;
                parser.state = S2.SCRIPT;
              }
              continue;
            case S2.OPEN_WAKA:
              if (c === "!") {
                parser.state = S2.SGML_DECL;
                parser.sgmlDecl = "";
              } else if (isWhitespace(c)) {
              } else if (isMatch(nameStart, c)) {
                parser.state = S2.OPEN_TAG;
                parser.tagName = c;
              } else if (c === "/") {
                parser.state = S2.CLOSE_TAG;
                parser.tagName = "";
              } else if (c === "?") {
                parser.state = S2.PROC_INST;
                parser.procInstName = parser.procInstBody = "";
              } else {
                strictFail(parser, "Unencoded <");
                if (parser.startTagPosition + 1 < parser.position) {
                  var pad = parser.position - parser.startTagPosition;
                  c = new Array(pad).join(" ") + c;
                }
                parser.textNode += "<" + c;
                parser.state = S2.TEXT;
              }
              continue;
            case S2.SGML_DECL:
              if (parser.sgmlDecl + c === "--") {
                parser.state = S2.COMMENT;
                parser.comment = "";
                parser.sgmlDecl = "";
                continue;
              }
              if (parser.doctype && parser.doctype !== true && parser.sgmlDecl) {
                parser.state = S2.DOCTYPE_DTD;
                parser.doctype += "<!" + parser.sgmlDecl + c;
                parser.sgmlDecl = "";
              } else if ((parser.sgmlDecl + c).toUpperCase() === CDATA) {
                emitNode(parser, "onopencdata");
                parser.state = S2.CDATA;
                parser.sgmlDecl = "";
                parser.cdata = "";
              } else if ((parser.sgmlDecl + c).toUpperCase() === DOCTYPE) {
                parser.state = S2.DOCTYPE;
                if (parser.doctype || parser.sawRoot) {
                  strictFail(
                    parser,
                    "Inappropriately located doctype declaration"
                  );
                }
                parser.doctype = "";
                parser.sgmlDecl = "";
              } else if (c === ">") {
                emitNode(parser, "onsgmldeclaration", parser.sgmlDecl);
                parser.sgmlDecl = "";
                parser.state = S2.TEXT;
              } else if (isQuote(c)) {
                parser.state = S2.SGML_DECL_QUOTED;
                parser.sgmlDecl += c;
              } else {
                parser.sgmlDecl += c;
              }
              continue;
            case S2.SGML_DECL_QUOTED:
              if (c === parser.q) {
                parser.state = S2.SGML_DECL;
                parser.q = "";
              }
              parser.sgmlDecl += c;
              continue;
            case S2.DOCTYPE:
              if (c === ">") {
                parser.state = S2.TEXT;
                emitNode(parser, "ondoctype", parser.doctype);
                parser.doctype = true;
              } else {
                parser.doctype += c;
                if (c === "[") {
                  parser.state = S2.DOCTYPE_DTD;
                } else if (isQuote(c)) {
                  parser.state = S2.DOCTYPE_QUOTED;
                  parser.q = c;
                }
              }
              continue;
            case S2.DOCTYPE_QUOTED:
              parser.doctype += c;
              if (c === parser.q) {
                parser.q = "";
                parser.state = S2.DOCTYPE;
              }
              continue;
            case S2.DOCTYPE_DTD:
              if (c === "]") {
                parser.doctype += c;
                parser.state = S2.DOCTYPE;
              } else if (c === "<") {
                parser.state = S2.OPEN_WAKA;
                parser.startTagPosition = parser.position;
              } else if (isQuote(c)) {
                parser.doctype += c;
                parser.state = S2.DOCTYPE_DTD_QUOTED;
                parser.q = c;
              } else {
                parser.doctype += c;
              }
              continue;
            case S2.DOCTYPE_DTD_QUOTED:
              parser.doctype += c;
              if (c === parser.q) {
                parser.state = S2.DOCTYPE_DTD;
                parser.q = "";
              }
              continue;
            case S2.COMMENT:
              if (c === "-") {
                parser.state = S2.COMMENT_ENDING;
              } else {
                parser.comment += c;
              }
              continue;
            case S2.COMMENT_ENDING:
              if (c === "-") {
                parser.state = S2.COMMENT_ENDED;
                parser.comment = textopts(parser.opt, parser.comment);
                if (parser.comment) {
                  emitNode(parser, "oncomment", parser.comment);
                }
                parser.comment = "";
              } else {
                parser.comment += "-" + c;
                parser.state = S2.COMMENT;
              }
              continue;
            case S2.COMMENT_ENDED:
              if (c !== ">") {
                strictFail(parser, "Malformed comment");
                parser.comment += "--" + c;
                parser.state = S2.COMMENT;
              } else if (parser.doctype && parser.doctype !== true) {
                parser.state = S2.DOCTYPE_DTD;
              } else {
                parser.state = S2.TEXT;
              }
              continue;
            case S2.CDATA:
              if (c === "]") {
                parser.state = S2.CDATA_ENDING;
              } else {
                parser.cdata += c;
              }
              continue;
            case S2.CDATA_ENDING:
              if (c === "]") {
                parser.state = S2.CDATA_ENDING_2;
              } else {
                parser.cdata += "]" + c;
                parser.state = S2.CDATA;
              }
              continue;
            case S2.CDATA_ENDING_2:
              if (c === ">") {
                if (parser.cdata) {
                  emitNode(parser, "oncdata", parser.cdata);
                }
                emitNode(parser, "onclosecdata");
                parser.cdata = "";
                parser.state = S2.TEXT;
              } else if (c === "]") {
                parser.cdata += "]";
              } else {
                parser.cdata += "]]" + c;
                parser.state = S2.CDATA;
              }
              continue;
            case S2.PROC_INST:
              if (c === "?") {
                parser.state = S2.PROC_INST_ENDING;
              } else if (isWhitespace(c)) {
                parser.state = S2.PROC_INST_BODY;
              } else {
                parser.procInstName += c;
              }
              continue;
            case S2.PROC_INST_BODY:
              if (!parser.procInstBody && isWhitespace(c)) {
                continue;
              } else if (c === "?") {
                parser.state = S2.PROC_INST_ENDING;
              } else {
                parser.procInstBody += c;
              }
              continue;
            case S2.PROC_INST_ENDING:
              if (c === ">") {
                emitNode(parser, "onprocessinginstruction", {
                  name: parser.procInstName,
                  body: parser.procInstBody
                });
                parser.procInstName = parser.procInstBody = "";
                parser.state = S2.TEXT;
              } else {
                parser.procInstBody += "?" + c;
                parser.state = S2.PROC_INST_BODY;
              }
              continue;
            case S2.OPEN_TAG:
              if (isMatch(nameBody, c)) {
                parser.tagName += c;
              } else {
                newTag(parser);
                if (c === ">") {
                  openTag(parser);
                } else if (c === "/") {
                  parser.state = S2.OPEN_TAG_SLASH;
                } else {
                  if (!isWhitespace(c)) {
                    strictFail(parser, "Invalid character in tag name");
                  }
                  parser.state = S2.ATTRIB;
                }
              }
              continue;
            case S2.OPEN_TAG_SLASH:
              if (c === ">") {
                openTag(parser, true);
                closeTag(parser);
              } else {
                strictFail(parser, "Forward-slash in opening tag not followed by >");
                parser.state = S2.ATTRIB;
              }
              continue;
            case S2.ATTRIB:
              if (isWhitespace(c)) {
                continue;
              } else if (c === ">") {
                openTag(parser);
              } else if (c === "/") {
                parser.state = S2.OPEN_TAG_SLASH;
              } else if (isMatch(nameStart, c)) {
                parser.attribName = c;
                parser.attribValue = "";
                parser.state = S2.ATTRIB_NAME;
              } else {
                strictFail(parser, "Invalid attribute name");
              }
              continue;
            case S2.ATTRIB_NAME:
              if (c === "=") {
                parser.state = S2.ATTRIB_VALUE;
              } else if (c === ">") {
                strictFail(parser, "Attribute without value");
                parser.attribValue = parser.attribName;
                attrib(parser);
                openTag(parser);
              } else if (isWhitespace(c)) {
                parser.state = S2.ATTRIB_NAME_SAW_WHITE;
              } else if (isMatch(nameBody, c)) {
                parser.attribName += c;
              } else {
                strictFail(parser, "Invalid attribute name");
              }
              continue;
            case S2.ATTRIB_NAME_SAW_WHITE:
              if (c === "=") {
                parser.state = S2.ATTRIB_VALUE;
              } else if (isWhitespace(c)) {
                continue;
              } else {
                strictFail(parser, "Attribute without value");
                parser.tag.attributes[parser.attribName] = "";
                parser.attribValue = "";
                emitNode(parser, "onattribute", {
                  name: parser.attribName,
                  value: ""
                });
                parser.attribName = "";
                if (c === ">") {
                  openTag(parser);
                } else if (isMatch(nameStart, c)) {
                  parser.attribName = c;
                  parser.state = S2.ATTRIB_NAME;
                } else {
                  strictFail(parser, "Invalid attribute name");
                  parser.state = S2.ATTRIB;
                }
              }
              continue;
            case S2.ATTRIB_VALUE:
              if (isWhitespace(c)) {
                continue;
              } else if (isQuote(c)) {
                parser.q = c;
                parser.state = S2.ATTRIB_VALUE_QUOTED;
              } else {
                if (!parser.opt.unquotedAttributeValues) {
                  error(parser, "Unquoted attribute value");
                }
                parser.state = S2.ATTRIB_VALUE_UNQUOTED;
                parser.attribValue = c;
              }
              continue;
            case S2.ATTRIB_VALUE_QUOTED:
              if (c !== parser.q) {
                if (c === "&") {
                  parser.state = S2.ATTRIB_VALUE_ENTITY_Q;
                } else {
                  parser.attribValue += c;
                }
                continue;
              }
              attrib(parser);
              parser.q = "";
              parser.state = S2.ATTRIB_VALUE_CLOSED;
              continue;
            case S2.ATTRIB_VALUE_CLOSED:
              if (isWhitespace(c)) {
                parser.state = S2.ATTRIB;
              } else if (c === ">") {
                openTag(parser);
              } else if (c === "/") {
                parser.state = S2.OPEN_TAG_SLASH;
              } else if (isMatch(nameStart, c)) {
                strictFail(parser, "No whitespace between attributes");
                parser.attribName = c;
                parser.attribValue = "";
                parser.state = S2.ATTRIB_NAME;
              } else {
                strictFail(parser, "Invalid attribute name");
              }
              continue;
            case S2.ATTRIB_VALUE_UNQUOTED:
              if (!isAttribEnd(c)) {
                if (c === "&") {
                  parser.state = S2.ATTRIB_VALUE_ENTITY_U;
                } else {
                  parser.attribValue += c;
                }
                continue;
              }
              attrib(parser);
              if (c === ">") {
                openTag(parser);
              } else {
                parser.state = S2.ATTRIB;
              }
              continue;
            case S2.CLOSE_TAG:
              if (!parser.tagName) {
                if (isWhitespace(c)) {
                  continue;
                } else if (notMatch(nameStart, c)) {
                  if (parser.script) {
                    parser.script += "</" + c;
                    parser.state = S2.SCRIPT;
                  } else {
                    strictFail(parser, "Invalid tagname in closing tag.");
                  }
                } else {
                  parser.tagName = c;
                }
              } else if (c === ">") {
                closeTag(parser);
              } else if (isMatch(nameBody, c)) {
                parser.tagName += c;
              } else if (parser.script) {
                parser.script += "</" + parser.tagName;
                parser.tagName = "";
                parser.state = S2.SCRIPT;
              } else {
                if (!isWhitespace(c)) {
                  strictFail(parser, "Invalid tagname in closing tag");
                }
                parser.state = S2.CLOSE_TAG_SAW_WHITE;
              }
              continue;
            case S2.CLOSE_TAG_SAW_WHITE:
              if (isWhitespace(c)) {
                continue;
              }
              if (c === ">") {
                closeTag(parser);
              } else {
                strictFail(parser, "Invalid characters in closing tag");
              }
              continue;
            case S2.TEXT_ENTITY:
            case S2.ATTRIB_VALUE_ENTITY_Q:
            case S2.ATTRIB_VALUE_ENTITY_U:
              var returnState;
              var buffer;
              switch (parser.state) {
                case S2.TEXT_ENTITY:
                  returnState = S2.TEXT;
                  buffer = "textNode";
                  break;
                case S2.ATTRIB_VALUE_ENTITY_Q:
                  returnState = S2.ATTRIB_VALUE_QUOTED;
                  buffer = "attribValue";
                  break;
                case S2.ATTRIB_VALUE_ENTITY_U:
                  returnState = S2.ATTRIB_VALUE_UNQUOTED;
                  buffer = "attribValue";
                  break;
              }
              if (c === ";") {
                var parsedEntity = parseEntity(parser);
                if (parser.opt.unparsedEntities && !Object.values(sax.XML_ENTITIES).includes(parsedEntity)) {
                  parser.entity = "";
                  parser.state = returnState;
                  parser.write(parsedEntity);
                } else {
                  parser[buffer] += parsedEntity;
                  parser.entity = "";
                  parser.state = returnState;
                }
              } else if (isMatch(parser.entity.length ? entityBody : entityStart, c)) {
                parser.entity += c;
              } else {
                strictFail(parser, "Invalid character in entity name");
                parser[buffer] += "&" + parser.entity + c;
                parser.entity = "";
                parser.state = returnState;
              }
              continue;
            default: {
              throw new Error(parser, "Unknown state: " + parser.state);
            }
          }
        }
        if (parser.position >= parser.bufferCheckPosition) {
          checkBufferLength(parser);
        }
        return parser;
      }
      if (!String.fromCodePoint) {
        (function() {
          var stringFromCharCode = String.fromCharCode;
          var floor = Math.floor;
          var fromCodePoint = function() {
            var MAX_SIZE = 16384;
            var codeUnits = [];
            var highSurrogate;
            var lowSurrogate;
            var index = -1;
            var length = arguments.length;
            if (!length) {
              return "";
            }
            var result = "";
            while (++index < length) {
              var codePoint = Number(arguments[index]);
              if (!isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
              codePoint < 0 || // not a valid Unicode code point
              codePoint > 1114111 || // not a valid Unicode code point
              floor(codePoint) !== codePoint) {
                throw RangeError("Invalid code point: " + codePoint);
              }
              if (codePoint <= 65535) {
                codeUnits.push(codePoint);
              } else {
                codePoint -= 65536;
                highSurrogate = (codePoint >> 10) + 55296;
                lowSurrogate = codePoint % 1024 + 56320;
                codeUnits.push(highSurrogate, lowSurrogate);
              }
              if (index + 1 === length || codeUnits.length > MAX_SIZE) {
                result += stringFromCharCode.apply(null, codeUnits);
                codeUnits.length = 0;
              }
            }
            return result;
          };
          if (Object.defineProperty) {
            Object.defineProperty(String, "fromCodePoint", {
              value: fromCodePoint,
              configurable: true,
              writable: true
            });
          } else {
            String.fromCodePoint = fromCodePoint;
          }
        })();
      }
    })(typeof exports2 === "undefined" ? exports2.sax = {} : exports2);
  }
});

// node_modules/xml2js/lib/bom.js
var require_bom = __commonJS({
  "node_modules/xml2js/lib/bom.js"(exports2) {
    (function() {
      "use strict";
      exports2.stripBOM = function(str) {
        if (str[0] === "\uFEFF") {
          return str.substring(1);
        } else {
          return str;
        }
      };
    }).call(exports2);
  }
});

// node_modules/xml2js/lib/processors.js
var require_processors = __commonJS({
  "node_modules/xml2js/lib/processors.js"(exports2) {
    (function() {
      "use strict";
      var prefixMatch;
      prefixMatch = new RegExp(/(?!xmlns)^.*:/);
      exports2.normalize = function(str) {
        return str.toLowerCase();
      };
      exports2.firstCharLowerCase = function(str) {
        return str.charAt(0).toLowerCase() + str.slice(1);
      };
      exports2.stripPrefix = function(str) {
        return str.replace(prefixMatch, "");
      };
      exports2.parseNumbers = function(str) {
        if (!isNaN(str)) {
          str = str % 1 === 0 ? parseInt(str, 10) : parseFloat(str);
        }
        return str;
      };
      exports2.parseBooleans = function(str) {
        if (/^(?:true|false)$/i.test(str)) {
          str = str.toLowerCase() === "true";
        }
        return str;
      };
    }).call(exports2);
  }
});

// node_modules/xml2js/lib/parser.js
var require_parser = __commonJS({
  "node_modules/xml2js/lib/parser.js"(exports2) {
    (function() {
      "use strict";
      var bom, defaults, defineProperty, events, isEmpty, processItem, processors, sax, setImmediate, bind = function(fn2, me) {
        return function() {
          return fn2.apply(me, arguments);
        };
      }, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      sax = require_sax();
      events = require("events");
      bom = require_bom();
      processors = require_processors();
      setImmediate = require("timers").setImmediate;
      defaults = require_defaults().defaults;
      isEmpty = function(thing) {
        return typeof thing === "object" && thing != null && Object.keys(thing).length === 0;
      };
      processItem = function(processors2, item, key) {
        var i2, len, process2;
        for (i2 = 0, len = processors2.length; i2 < len; i2++) {
          process2 = processors2[i2];
          item = process2(item, key);
        }
        return item;
      };
      defineProperty = function(obj, key, value) {
        var descriptor;
        descriptor = /* @__PURE__ */ Object.create(null);
        descriptor.value = value;
        descriptor.writable = true;
        descriptor.enumerable = true;
        descriptor.configurable = true;
        return Object.defineProperty(obj, key, descriptor);
      };
      exports2.Parser = function(superClass) {
        extend(Parser, superClass);
        function Parser(opts) {
          this.parseStringPromise = bind(this.parseStringPromise, this);
          this.parseString = bind(this.parseString, this);
          this.reset = bind(this.reset, this);
          this.assignOrPush = bind(this.assignOrPush, this);
          this.processAsync = bind(this.processAsync, this);
          var key, ref, value;
          if (!(this instanceof exports2.Parser)) {
            return new exports2.Parser(opts);
          }
          this.options = {};
          ref = defaults["0.2"];
          for (key in ref) {
            if (!hasProp.call(ref, key)) continue;
            value = ref[key];
            this.options[key] = value;
          }
          for (key in opts) {
            if (!hasProp.call(opts, key)) continue;
            value = opts[key];
            this.options[key] = value;
          }
          if (this.options.xmlns) {
            this.options.xmlnskey = this.options.attrkey + "ns";
          }
          if (this.options.normalizeTags) {
            if (!this.options.tagNameProcessors) {
              this.options.tagNameProcessors = [];
            }
            this.options.tagNameProcessors.unshift(processors.normalize);
          }
          this.reset();
        }
        Parser.prototype.processAsync = function() {
          var chunk, err;
          try {
            if (this.remaining.length <= this.options.chunkSize) {
              chunk = this.remaining;
              this.remaining = "";
              this.saxParser = this.saxParser.write(chunk);
              return this.saxParser.close();
            } else {
              chunk = this.remaining.substr(0, this.options.chunkSize);
              this.remaining = this.remaining.substr(this.options.chunkSize, this.remaining.length);
              this.saxParser = this.saxParser.write(chunk);
              return setImmediate(this.processAsync);
            }
          } catch (error1) {
            err = error1;
            if (!this.saxParser.errThrown) {
              this.saxParser.errThrown = true;
              return this.emit(err);
            }
          }
        };
        Parser.prototype.assignOrPush = function(obj, key, newValue) {
          if (!(key in obj)) {
            if (!this.options.explicitArray) {
              return defineProperty(obj, key, newValue);
            } else {
              return defineProperty(obj, key, [newValue]);
            }
          } else {
            if (!(obj[key] instanceof Array)) {
              defineProperty(obj, key, [obj[key]]);
            }
            return obj[key].push(newValue);
          }
        };
        Parser.prototype.reset = function() {
          var attrkey, charkey, ontext, stack;
          this.removeAllListeners();
          this.saxParser = sax.parser(this.options.strict, {
            trim: false,
            normalize: false,
            xmlns: this.options.xmlns
          });
          this.saxParser.errThrown = false;
          this.saxParser.onerror = /* @__PURE__ */ function(_this) {
            return function(error) {
              _this.saxParser.resume();
              if (!_this.saxParser.errThrown) {
                _this.saxParser.errThrown = true;
                return _this.emit("error", error);
              }
            };
          }(this);
          this.saxParser.onend = /* @__PURE__ */ function(_this) {
            return function() {
              if (!_this.saxParser.ended) {
                _this.saxParser.ended = true;
                return _this.emit("end", _this.resultObject);
              }
            };
          }(this);
          this.saxParser.ended = false;
          this.EXPLICIT_CHARKEY = this.options.explicitCharkey;
          this.resultObject = null;
          stack = [];
          attrkey = this.options.attrkey;
          charkey = this.options.charkey;
          this.saxParser.onopentag = /* @__PURE__ */ function(_this) {
            return function(node) {
              var key, newValue, obj, processedKey, ref;
              obj = {};
              obj[charkey] = "";
              if (!_this.options.ignoreAttrs) {
                ref = node.attributes;
                for (key in ref) {
                  if (!hasProp.call(ref, key)) continue;
                  if (!(attrkey in obj) && !_this.options.mergeAttrs) {
                    obj[attrkey] = {};
                  }
                  newValue = _this.options.attrValueProcessors ? processItem(_this.options.attrValueProcessors, node.attributes[key], key) : node.attributes[key];
                  processedKey = _this.options.attrNameProcessors ? processItem(_this.options.attrNameProcessors, key) : key;
                  if (_this.options.mergeAttrs) {
                    _this.assignOrPush(obj, processedKey, newValue);
                  } else {
                    defineProperty(obj[attrkey], processedKey, newValue);
                  }
                }
              }
              obj["#name"] = _this.options.tagNameProcessors ? processItem(_this.options.tagNameProcessors, node.name) : node.name;
              if (_this.options.xmlns) {
                obj[_this.options.xmlnskey] = {
                  uri: node.uri,
                  local: node.local
                };
              }
              return stack.push(obj);
            };
          }(this);
          this.saxParser.onclosetag = /* @__PURE__ */ function(_this) {
            return function() {
              var cdata, emptyStr, key, node, nodeName, obj, objClone, old, s2, xpath;
              obj = stack.pop();
              nodeName = obj["#name"];
              if (!_this.options.explicitChildren || !_this.options.preserveChildrenOrder) {
                delete obj["#name"];
              }
              if (obj.cdata === true) {
                cdata = obj.cdata;
                delete obj.cdata;
              }
              s2 = stack[stack.length - 1];
              if (obj[charkey].match(/^\s*$/) && !cdata) {
                emptyStr = obj[charkey];
                delete obj[charkey];
              } else {
                if (_this.options.trim) {
                  obj[charkey] = obj[charkey].trim();
                }
                if (_this.options.normalize) {
                  obj[charkey] = obj[charkey].replace(/\s{2,}/g, " ").trim();
                }
                obj[charkey] = _this.options.valueProcessors ? processItem(_this.options.valueProcessors, obj[charkey], nodeName) : obj[charkey];
                if (Object.keys(obj).length === 1 && charkey in obj && !_this.EXPLICIT_CHARKEY) {
                  obj = obj[charkey];
                }
              }
              if (isEmpty(obj)) {
                if (typeof _this.options.emptyTag === "function") {
                  obj = _this.options.emptyTag();
                } else {
                  obj = _this.options.emptyTag !== "" ? _this.options.emptyTag : emptyStr;
                }
              }
              if (_this.options.validator != null) {
                xpath = "/" + function() {
                  var i2, len, results;
                  results = [];
                  for (i2 = 0, len = stack.length; i2 < len; i2++) {
                    node = stack[i2];
                    results.push(node["#name"]);
                  }
                  return results;
                }().concat(nodeName).join("/");
                (function() {
                  var err;
                  try {
                    return obj = _this.options.validator(xpath, s2 && s2[nodeName], obj);
                  } catch (error1) {
                    err = error1;
                    return _this.emit("error", err);
                  }
                })();
              }
              if (_this.options.explicitChildren && !_this.options.mergeAttrs && typeof obj === "object") {
                if (!_this.options.preserveChildrenOrder) {
                  node = {};
                  if (_this.options.attrkey in obj) {
                    node[_this.options.attrkey] = obj[_this.options.attrkey];
                    delete obj[_this.options.attrkey];
                  }
                  if (!_this.options.charsAsChildren && _this.options.charkey in obj) {
                    node[_this.options.charkey] = obj[_this.options.charkey];
                    delete obj[_this.options.charkey];
                  }
                  if (Object.getOwnPropertyNames(obj).length > 0) {
                    node[_this.options.childkey] = obj;
                  }
                  obj = node;
                } else if (s2) {
                  s2[_this.options.childkey] = s2[_this.options.childkey] || [];
                  objClone = {};
                  for (key in obj) {
                    if (!hasProp.call(obj, key)) continue;
                    defineProperty(objClone, key, obj[key]);
                  }
                  s2[_this.options.childkey].push(objClone);
                  delete obj["#name"];
                  if (Object.keys(obj).length === 1 && charkey in obj && !_this.EXPLICIT_CHARKEY) {
                    obj = obj[charkey];
                  }
                }
              }
              if (stack.length > 0) {
                return _this.assignOrPush(s2, nodeName, obj);
              } else {
                if (_this.options.explicitRoot) {
                  old = obj;
                  obj = {};
                  defineProperty(obj, nodeName, old);
                }
                _this.resultObject = obj;
                _this.saxParser.ended = true;
                return _this.emit("end", _this.resultObject);
              }
            };
          }(this);
          ontext = /* @__PURE__ */ function(_this) {
            return function(text) {
              var charChild, s2;
              s2 = stack[stack.length - 1];
              if (s2) {
                s2[charkey] += text;
                if (_this.options.explicitChildren && _this.options.preserveChildrenOrder && _this.options.charsAsChildren && (_this.options.includeWhiteChars || text.replace(/\\n/g, "").trim() !== "")) {
                  s2[_this.options.childkey] = s2[_this.options.childkey] || [];
                  charChild = {
                    "#name": "__text__"
                  };
                  charChild[charkey] = text;
                  if (_this.options.normalize) {
                    charChild[charkey] = charChild[charkey].replace(/\s{2,}/g, " ").trim();
                  }
                  s2[_this.options.childkey].push(charChild);
                }
                return s2;
              }
            };
          }(this);
          this.saxParser.ontext = ontext;
          return this.saxParser.oncdata = /* @__PURE__ */ function(_this) {
            return function(text) {
              var s2;
              s2 = ontext(text);
              if (s2) {
                return s2.cdata = true;
              }
            };
          }(this);
        };
        Parser.prototype.parseString = function(str, cb) {
          var err;
          if (cb != null && typeof cb === "function") {
            this.on("end", function(result) {
              this.reset();
              return cb(null, result);
            });
            this.on("error", function(err2) {
              this.reset();
              return cb(err2);
            });
          }
          try {
            str = str.toString();
            if (str.trim() === "") {
              this.emit("end", null);
              return true;
            }
            str = bom.stripBOM(str);
            if (this.options.async) {
              this.remaining = str;
              setImmediate(this.processAsync);
              return this.saxParser;
            }
            return this.saxParser.write(str).close();
          } catch (error1) {
            err = error1;
            if (!(this.saxParser.errThrown || this.saxParser.ended)) {
              this.emit("error", err);
              return this.saxParser.errThrown = true;
            } else if (this.saxParser.ended) {
              throw err;
            }
          }
        };
        Parser.prototype.parseStringPromise = function(str) {
          return new Promise(/* @__PURE__ */ function(_this) {
            return function(resolve, reject) {
              return _this.parseString(str, function(err, value) {
                if (err) {
                  return reject(err);
                } else {
                  return resolve(value);
                }
              });
            };
          }(this));
        };
        return Parser;
      }(events);
      exports2.parseString = function(str, a, b2) {
        var cb, options, parser;
        if (b2 != null) {
          if (typeof b2 === "function") {
            cb = b2;
          }
          if (typeof a === "object") {
            options = a;
          }
        } else {
          if (typeof a === "function") {
            cb = a;
          }
          options = {};
        }
        parser = new exports2.Parser(options);
        return parser.parseString(str, cb);
      };
      exports2.parseStringPromise = function(str, a) {
        var options, parser;
        if (typeof a === "object") {
          options = a;
        }
        parser = new exports2.Parser(options);
        return parser.parseStringPromise(str);
      };
    }).call(exports2);
  }
});

// node_modules/xml2js/lib/xml2js.js
var require_xml2js = __commonJS({
  "node_modules/xml2js/lib/xml2js.js"(exports2) {
    (function() {
      "use strict";
      var builder, defaults, parser, processors, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      defaults = require_defaults();
      builder = require_builder();
      parser = require_parser();
      processors = require_processors();
      exports2.defaults = defaults.defaults;
      exports2.processors = processors;
      exports2.ValidationError = function(superClass) {
        extend(ValidationError, superClass);
        function ValidationError(message) {
          this.message = message;
        }
        return ValidationError;
      }(Error);
      exports2.Builder = builder.Builder;
      exports2.Parser = parser.Parser;
      exports2.parseString = parser.parseString;
      exports2.parseStringPromise = parser.parseStringPromise;
    }).call(exports2);
  }
});

// node_modules/node-fetch/src/index.js
var import_node_http2 = __toESM(require("node:http"), 1);
var import_node_https = __toESM(require("node:https"), 1);
var import_node_zlib = __toESM(require("node:zlib"), 1);
var import_node_stream2 = __toESM(require("node:stream"), 1);
var import_node_buffer2 = require("node:buffer");

// node_modules/data-uri-to-buffer/dist/index.js
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i2 = 1; i2 < meta.length; i2++) {
    if (meta[i2] === "base64") {
      base64 = true;
    } else if (meta[i2]) {
      typeFull += `;${meta[i2]}`;
      if (meta[i2].indexOf("charset=") === 0) {
        charset = meta[i2].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
var dist_default = dataUriToBuffer;

// node_modules/node-fetch/src/body.js
var import_node_stream = __toESM(require("node:stream"), 1);
var import_node_util = require("node:util");
var import_node_buffer = require("node:buffer");
init_fetch_blob();
init_esm_min();

// node_modules/node-fetch/src/errors/base.js
var FetchBaseError = class extends Error {
  constructor(message, type) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.type = type;
  }
  get name() {
    return this.constructor.name;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
};

// node_modules/node-fetch/src/errors/fetch-error.js
var FetchError = class extends FetchBaseError {
  /**
   * @param  {string} message -      Error message for human
   * @param  {string} [type] -        Error type for machine
   * @param  {SystemError} [systemError] - For Node.js system error
   */
  constructor(message, type, systemError) {
    super(message, type);
    if (systemError) {
      this.code = this.errno = systemError.code;
      this.erroredSysCall = systemError.syscall;
    }
  }
};

// node_modules/node-fetch/src/utils/is.js
var NAME = Symbol.toStringTag;
var isURLSearchParameters = (object) => {
  return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
};
var isBlob = (object) => {
  return object && typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
};
var isAbortSignal = (object) => {
  return typeof object === "object" && (object[NAME] === "AbortSignal" || object[NAME] === "EventTarget");
};
var isDomainOrSubdomain = (destination, original) => {
  const orig = new URL(original).hostname;
  const dest = new URL(destination).hostname;
  return orig === dest || orig.endsWith(`.${dest}`);
};
var isSameProtocol = (destination, original) => {
  const orig = new URL(original).protocol;
  const dest = new URL(destination).protocol;
  return orig === dest;
};

// node_modules/node-fetch/src/body.js
var pipeline = (0, import_node_util.promisify)(import_node_stream.default.pipeline);
var INTERNALS = Symbol("Body internals");
var Body = class {
  constructor(body, {
    size = 0
  } = {}) {
    let boundary = null;
    if (body === null) {
      body = null;
    } else if (isURLSearchParameters(body)) {
      body = import_node_buffer.Buffer.from(body.toString());
    } else if (isBlob(body)) {
    } else if (import_node_buffer.Buffer.isBuffer(body)) {
    } else if (import_node_util.types.isAnyArrayBuffer(body)) {
      body = import_node_buffer.Buffer.from(body);
    } else if (ArrayBuffer.isView(body)) {
      body = import_node_buffer.Buffer.from(body.buffer, body.byteOffset, body.byteLength);
    } else if (body instanceof import_node_stream.default) {
    } else if (body instanceof FormData) {
      body = formDataToBlob(body);
      boundary = body.type.split("=")[1];
    } else {
      body = import_node_buffer.Buffer.from(String(body));
    }
    let stream = body;
    if (import_node_buffer.Buffer.isBuffer(body)) {
      stream = import_node_stream.default.Readable.from(body);
    } else if (isBlob(body)) {
      stream = import_node_stream.default.Readable.from(body.stream());
    }
    this[INTERNALS] = {
      body,
      stream,
      boundary,
      disturbed: false,
      error: null
    };
    this.size = size;
    if (body instanceof import_node_stream.default) {
      body.on("error", (error_) => {
        const error = error_ instanceof FetchBaseError ? error_ : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${error_.message}`, "system", error_);
        this[INTERNALS].error = error;
      });
    }
  }
  get body() {
    return this[INTERNALS].stream;
  }
  get bodyUsed() {
    return this[INTERNALS].disturbed;
  }
  /**
   * Decode response as ArrayBuffer
   *
   * @return  Promise
   */
  async arrayBuffer() {
    const { buffer, byteOffset, byteLength } = await consumeBody(this);
    return buffer.slice(byteOffset, byteOffset + byteLength);
  }
  async formData() {
    const ct2 = this.headers.get("content-type");
    if (ct2.startsWith("application/x-www-form-urlencoded")) {
      const formData = new FormData();
      const parameters = new URLSearchParams(await this.text());
      for (const [name, value] of parameters) {
        formData.append(name, value);
      }
      return formData;
    }
    const { toFormData: toFormData2 } = await Promise.resolve().then(() => (init_multipart_parser(), multipart_parser_exports));
    return toFormData2(this.body, ct2);
  }
  /**
   * Return raw response as Blob
   *
   * @return Promise
   */
  async blob() {
    const ct2 = this.headers && this.headers.get("content-type") || this[INTERNALS].body && this[INTERNALS].body.type || "";
    const buf = await this.arrayBuffer();
    return new fetch_blob_default([buf], {
      type: ct2
    });
  }
  /**
   * Decode response as json
   *
   * @return  Promise
   */
  async json() {
    const text = await this.text();
    return JSON.parse(text);
  }
  /**
   * Decode response as text
   *
   * @return  Promise
   */
  async text() {
    const buffer = await consumeBody(this);
    return new TextDecoder().decode(buffer);
  }
  /**
   * Decode response as buffer (non-spec api)
   *
   * @return  Promise
   */
  buffer() {
    return consumeBody(this);
  }
};
Body.prototype.buffer = (0, import_node_util.deprecate)(Body.prototype.buffer, "Please use 'response.arrayBuffer()' instead of 'response.buffer()'", "node-fetch#buffer");
Object.defineProperties(Body.prototype, {
  body: { enumerable: true },
  bodyUsed: { enumerable: true },
  arrayBuffer: { enumerable: true },
  blob: { enumerable: true },
  json: { enumerable: true },
  text: { enumerable: true },
  data: { get: (0, import_node_util.deprecate)(
    () => {
    },
    "data doesn't exist, use json(), text(), arrayBuffer(), or body instead",
    "https://github.com/node-fetch/node-fetch/issues/1000 (response)"
  ) }
});
async function consumeBody(data) {
  if (data[INTERNALS].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS].disturbed = true;
  if (data[INTERNALS].error) {
    throw data[INTERNALS].error;
  }
  const { body } = data;
  if (body === null) {
    return import_node_buffer.Buffer.alloc(0);
  }
  if (!(body instanceof import_node_stream.default)) {
    return import_node_buffer.Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const error = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(error);
        throw error;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error) {
    const error_ = error instanceof FetchBaseError ? error : new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error.message}`, "system", error);
    throw error_;
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return import_node_buffer.Buffer.from(accum.join(""));
      }
      return import_node_buffer.Buffer.concat(accum, accumBytes);
    } catch (error) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error.message}`, "system", error);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
var clone = (instance, highWaterMark) => {
  let p1;
  let p2;
  let { body } = instance[INTERNALS];
  if (instance.bodyUsed) {
    throw new Error("cannot clone body after it is used");
  }
  if (body instanceof import_node_stream.default && typeof body.getBoundary !== "function") {
    p1 = new import_node_stream.PassThrough({ highWaterMark });
    p2 = new import_node_stream.PassThrough({ highWaterMark });
    body.pipe(p1);
    body.pipe(p2);
    instance[INTERNALS].stream = p1;
    body = p2;
  }
  return body;
};
var getNonSpecFormDataBoundary = (0, import_node_util.deprecate)(
  (body) => body.getBoundary(),
  "form-data doesn't follow the spec and requires special treatment. Use alternative package",
  "https://github.com/node-fetch/node-fetch/issues/1167"
);
var extractContentType = (body, request) => {
  if (body === null) {
    return null;
  }
  if (typeof body === "string") {
    return "text/plain;charset=UTF-8";
  }
  if (isURLSearchParameters(body)) {
    return "application/x-www-form-urlencoded;charset=UTF-8";
  }
  if (isBlob(body)) {
    return body.type || null;
  }
  if (import_node_buffer.Buffer.isBuffer(body) || import_node_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
    return null;
  }
  if (body instanceof FormData) {
    return `multipart/form-data; boundary=${request[INTERNALS].boundary}`;
  }
  if (body && typeof body.getBoundary === "function") {
    return `multipart/form-data;boundary=${getNonSpecFormDataBoundary(body)}`;
  }
  if (body instanceof import_node_stream.default) {
    return null;
  }
  return "text/plain;charset=UTF-8";
};
var getTotalBytes = (request) => {
  const { body } = request[INTERNALS];
  if (body === null) {
    return 0;
  }
  if (isBlob(body)) {
    return body.size;
  }
  if (import_node_buffer.Buffer.isBuffer(body)) {
    return body.length;
  }
  if (body && typeof body.getLengthSync === "function") {
    return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
  }
  return null;
};
var writeToStream = async (dest, { body }) => {
  if (body === null) {
    dest.end();
  } else {
    await pipeline(body, dest);
  }
};

// node_modules/node-fetch/src/headers.js
var import_node_util2 = require("node:util");
var import_node_http = __toESM(require("node:http"), 1);
var validateHeaderName = typeof import_node_http.default.validateHeaderName === "function" ? import_node_http.default.validateHeaderName : (name) => {
  if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
    const error = new TypeError(`Header name must be a valid HTTP token [${name}]`);
    Object.defineProperty(error, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
    throw error;
  }
};
var validateHeaderValue = typeof import_node_http.default.validateHeaderValue === "function" ? import_node_http.default.validateHeaderValue : (name, value) => {
  if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
    const error = new TypeError(`Invalid character in header content ["${name}"]`);
    Object.defineProperty(error, "code", { value: "ERR_INVALID_CHAR" });
    throw error;
  }
};
var Headers = class _Headers extends URLSearchParams {
  /**
   * Headers class
   *
   * @constructor
   * @param {HeadersInit} [init] - Response headers
   */
  constructor(init) {
    let result = [];
    if (init instanceof _Headers) {
      const raw2 = init.raw();
      for (const [name, values] of Object.entries(raw2)) {
        result.push(...values.map((value) => [name, value]));
      }
    } else if (init == null) {
    } else if (typeof init === "object" && !import_node_util2.types.isBoxedPrimitive(init)) {
      const method = init[Symbol.iterator];
      if (method == null) {
        result.push(...Object.entries(init));
      } else {
        if (typeof method !== "function") {
          throw new TypeError("Header pairs must be iterable");
        }
        result = [...init].map((pair) => {
          if (typeof pair !== "object" || import_node_util2.types.isBoxedPrimitive(pair)) {
            throw new TypeError("Each header pair must be an iterable object");
          }
          return [...pair];
        }).map((pair) => {
          if (pair.length !== 2) {
            throw new TypeError("Each header pair must be a name/value tuple");
          }
          return [...pair];
        });
      }
    } else {
      throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
    }
    result = result.length > 0 ? result.map(([name, value]) => {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return [String(name).toLowerCase(), String(value)];
    }) : void 0;
    super(result);
    return new Proxy(this, {
      get(target, p, receiver) {
        switch (p) {
          case "append":
          case "set":
            return (name, value) => {
              validateHeaderName(name);
              validateHeaderValue(name, String(value));
              return URLSearchParams.prototype[p].call(
                target,
                String(name).toLowerCase(),
                String(value)
              );
            };
          case "delete":
          case "has":
          case "getAll":
            return (name) => {
              validateHeaderName(name);
              return URLSearchParams.prototype[p].call(
                target,
                String(name).toLowerCase()
              );
            };
          case "keys":
            return () => {
              target.sort();
              return new Set(URLSearchParams.prototype.keys.call(target)).keys();
            };
          default:
            return Reflect.get(target, p, receiver);
        }
      }
    });
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  toString() {
    return Object.prototype.toString.call(this);
  }
  get(name) {
    const values = this.getAll(name);
    if (values.length === 0) {
      return null;
    }
    let value = values.join(", ");
    if (/^content-encoding$/i.test(name)) {
      value = value.toLowerCase();
    }
    return value;
  }
  forEach(callback, thisArg = void 0) {
    for (const name of this.keys()) {
      Reflect.apply(callback, thisArg, [this.get(name), name, this]);
    }
  }
  *values() {
    for (const name of this.keys()) {
      yield this.get(name);
    }
  }
  /**
   * @type {() => IterableIterator<[string, string]>}
   */
  *entries() {
    for (const name of this.keys()) {
      yield [name, this.get(name)];
    }
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  /**
   * Node-fetch non-spec method
   * returning all headers and their values as array
   * @returns {Record<string, string[]>}
   */
  raw() {
    return [...this.keys()].reduce((result, key) => {
      result[key] = this.getAll(key);
      return result;
    }, {});
  }
  /**
   * For better console.log(headers) and also to convert Headers into Node.js Request compatible format
   */
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return [...this.keys()].reduce((result, key) => {
      const values = this.getAll(key);
      if (key === "host") {
        result[key] = values[0];
      } else {
        result[key] = values.length > 1 ? values : values[0];
      }
      return result;
    }, {});
  }
};
Object.defineProperties(
  Headers.prototype,
  ["get", "entries", "forEach", "values"].reduce((result, property) => {
    result[property] = { enumerable: true };
    return result;
  }, {})
);
function fromRawHeaders(headers = []) {
  return new Headers(
    headers.reduce((result, value, index, array) => {
      if (index % 2 === 0) {
        result.push(array.slice(index, index + 2));
      }
      return result;
    }, []).filter(([name, value]) => {
      try {
        validateHeaderName(name);
        validateHeaderValue(name, String(value));
        return true;
      } catch {
        return false;
      }
    })
  );
}

// node_modules/node-fetch/src/utils/is-redirect.js
var redirectStatus = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
var isRedirect = (code) => {
  return redirectStatus.has(code);
};

// node_modules/node-fetch/src/response.js
var INTERNALS2 = Symbol("Response internals");
var Response = class _Response extends Body {
  constructor(body = null, options = {}) {
    super(body, options);
    const status = options.status != null ? options.status : 200;
    const headers = new Headers(options.headers);
    if (body !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(body, this);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    this[INTERNALS2] = {
      type: "default",
      url: options.url,
      status,
      statusText: options.statusText || "",
      headers,
      counter: options.counter,
      highWaterMark: options.highWaterMark
    };
  }
  get type() {
    return this[INTERNALS2].type;
  }
  get url() {
    return this[INTERNALS2].url || "";
  }
  get status() {
    return this[INTERNALS2].status;
  }
  /**
   * Convenience property representing if the request ended normally
   */
  get ok() {
    return this[INTERNALS2].status >= 200 && this[INTERNALS2].status < 300;
  }
  get redirected() {
    return this[INTERNALS2].counter > 0;
  }
  get statusText() {
    return this[INTERNALS2].statusText;
  }
  get headers() {
    return this[INTERNALS2].headers;
  }
  get highWaterMark() {
    return this[INTERNALS2].highWaterMark;
  }
  /**
   * Clone this response
   *
   * @return  Response
   */
  clone() {
    return new _Response(clone(this, this.highWaterMark), {
      type: this.type,
      url: this.url,
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      ok: this.ok,
      redirected: this.redirected,
      size: this.size,
      highWaterMark: this.highWaterMark
    });
  }
  /**
   * @param {string} url    The URL that the new response is to originate from.
   * @param {number} status An optional status code for the response (e.g., 302.)
   * @returns {Response}    A Response object.
   */
  static redirect(url, status = 302) {
    if (!isRedirect(status)) {
      throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
    }
    return new _Response(null, {
      headers: {
        location: new URL(url).toString()
      },
      status
    });
  }
  static error() {
    const response = new _Response(null, { status: 0, statusText: "" });
    response[INTERNALS2].type = "error";
    return response;
  }
  static json(data = void 0, init = {}) {
    const body = JSON.stringify(data);
    if (body === void 0) {
      throw new TypeError("data is not JSON serializable");
    }
    const headers = new Headers(init && init.headers);
    if (!headers.has("content-type")) {
      headers.set("content-type", "application/json");
    }
    return new _Response(body, {
      ...init,
      headers
    });
  }
  get [Symbol.toStringTag]() {
    return "Response";
  }
};
Object.defineProperties(Response.prototype, {
  type: { enumerable: true },
  url: { enumerable: true },
  status: { enumerable: true },
  ok: { enumerable: true },
  redirected: { enumerable: true },
  statusText: { enumerable: true },
  headers: { enumerable: true },
  clone: { enumerable: true }
});

// node_modules/node-fetch/src/request.js
var import_node_url = require("node:url");
var import_node_util3 = require("node:util");

// node_modules/node-fetch/src/utils/get-search.js
var getSearch = (parsedURL) => {
  if (parsedURL.search) {
    return parsedURL.search;
  }
  const lastOffset = parsedURL.href.length - 1;
  const hash = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
  return parsedURL.href[lastOffset - hash.length] === "?" ? "?" : "";
};

// node_modules/node-fetch/src/utils/referrer.js
var import_node_net = require("node:net");
function stripURLForUseAsAReferrer(url, originOnly = false) {
  if (url == null) {
    return "no-referrer";
  }
  url = new URL(url);
  if (/^(about|blob|data):$/.test(url.protocol)) {
    return "no-referrer";
  }
  url.username = "";
  url.password = "";
  url.hash = "";
  if (originOnly) {
    url.pathname = "";
    url.search = "";
  }
  return url;
}
var ReferrerPolicy = /* @__PURE__ */ new Set([
  "",
  "no-referrer",
  "no-referrer-when-downgrade",
  "same-origin",
  "origin",
  "strict-origin",
  "origin-when-cross-origin",
  "strict-origin-when-cross-origin",
  "unsafe-url"
]);
var DEFAULT_REFERRER_POLICY = "strict-origin-when-cross-origin";
function validateReferrerPolicy(referrerPolicy) {
  if (!ReferrerPolicy.has(referrerPolicy)) {
    throw new TypeError(`Invalid referrerPolicy: ${referrerPolicy}`);
  }
  return referrerPolicy;
}
function isOriginPotentiallyTrustworthy(url) {
  if (/^(http|ws)s:$/.test(url.protocol)) {
    return true;
  }
  const hostIp = url.host.replace(/(^\[)|(]$)/g, "");
  const hostIPVersion = (0, import_node_net.isIP)(hostIp);
  if (hostIPVersion === 4 && /^127\./.test(hostIp)) {
    return true;
  }
  if (hostIPVersion === 6 && /^(((0+:){7})|(::(0+:){0,6}))0*1$/.test(hostIp)) {
    return true;
  }
  if (url.host === "localhost" || url.host.endsWith(".localhost")) {
    return false;
  }
  if (url.protocol === "file:") {
    return true;
  }
  return false;
}
function isUrlPotentiallyTrustworthy(url) {
  if (/^about:(blank|srcdoc)$/.test(url)) {
    return true;
  }
  if (url.protocol === "data:") {
    return true;
  }
  if (/^(blob|filesystem):$/.test(url.protocol)) {
    return true;
  }
  return isOriginPotentiallyTrustworthy(url);
}
function determineRequestsReferrer(request, { referrerURLCallback, referrerOriginCallback } = {}) {
  if (request.referrer === "no-referrer" || request.referrerPolicy === "") {
    return null;
  }
  const policy = request.referrerPolicy;
  if (request.referrer === "about:client") {
    return "no-referrer";
  }
  const referrerSource = request.referrer;
  let referrerURL = stripURLForUseAsAReferrer(referrerSource);
  let referrerOrigin = stripURLForUseAsAReferrer(referrerSource, true);
  if (referrerURL.toString().length > 4096) {
    referrerURL = referrerOrigin;
  }
  if (referrerURLCallback) {
    referrerURL = referrerURLCallback(referrerURL);
  }
  if (referrerOriginCallback) {
    referrerOrigin = referrerOriginCallback(referrerOrigin);
  }
  const currentURL = new URL(request.url);
  switch (policy) {
    case "no-referrer":
      return "no-referrer";
    case "origin":
      return referrerOrigin;
    case "unsafe-url":
      return referrerURL;
    case "strict-origin":
      if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
        return "no-referrer";
      }
      return referrerOrigin.toString();
    case "strict-origin-when-cross-origin":
      if (referrerURL.origin === currentURL.origin) {
        return referrerURL;
      }
      if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
        return "no-referrer";
      }
      return referrerOrigin;
    case "same-origin":
      if (referrerURL.origin === currentURL.origin) {
        return referrerURL;
      }
      return "no-referrer";
    case "origin-when-cross-origin":
      if (referrerURL.origin === currentURL.origin) {
        return referrerURL;
      }
      return referrerOrigin;
    case "no-referrer-when-downgrade":
      if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
        return "no-referrer";
      }
      return referrerURL;
    default:
      throw new TypeError(`Invalid referrerPolicy: ${policy}`);
  }
}
function parseReferrerPolicyFromHeader(headers) {
  const policyTokens = (headers.get("referrer-policy") || "").split(/[,\s]+/);
  let policy = "";
  for (const token of policyTokens) {
    if (token && ReferrerPolicy.has(token)) {
      policy = token;
    }
  }
  return policy;
}

// node_modules/node-fetch/src/request.js
var INTERNALS3 = Symbol("Request internals");
var isRequest = (object) => {
  return typeof object === "object" && typeof object[INTERNALS3] === "object";
};
var doBadDataWarn = (0, import_node_util3.deprecate)(
  () => {
  },
  ".data is not a valid RequestInit property, use .body instead",
  "https://github.com/node-fetch/node-fetch/issues/1000 (request)"
);
var Request = class _Request extends Body {
  constructor(input, init = {}) {
    let parsedURL;
    if (isRequest(input)) {
      parsedURL = new URL(input.url);
    } else {
      parsedURL = new URL(input);
      input = {};
    }
    if (parsedURL.username !== "" || parsedURL.password !== "") {
      throw new TypeError(`${parsedURL} is an url with embedded credentials.`);
    }
    let method = init.method || input.method || "GET";
    if (/^(delete|get|head|options|post|put)$/i.test(method)) {
      method = method.toUpperCase();
    }
    if (!isRequest(init) && "data" in init) {
      doBadDataWarn();
    }
    if ((init.body != null || isRequest(input) && input.body !== null) && (method === "GET" || method === "HEAD")) {
      throw new TypeError("Request with GET/HEAD method cannot have body");
    }
    const inputBody = init.body ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;
    super(inputBody, {
      size: init.size || input.size || 0
    });
    const headers = new Headers(init.headers || input.headers || {});
    if (inputBody !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(inputBody, this);
      if (contentType) {
        headers.set("Content-Type", contentType);
      }
    }
    let signal = isRequest(input) ? input.signal : null;
    if ("signal" in init) {
      signal = init.signal;
    }
    if (signal != null && !isAbortSignal(signal)) {
      throw new TypeError("Expected signal to be an instanceof AbortSignal or EventTarget");
    }
    let referrer = init.referrer == null ? input.referrer : init.referrer;
    if (referrer === "") {
      referrer = "no-referrer";
    } else if (referrer) {
      const parsedReferrer = new URL(referrer);
      referrer = /^about:(\/\/)?client$/.test(parsedReferrer) ? "client" : parsedReferrer;
    } else {
      referrer = void 0;
    }
    this[INTERNALS3] = {
      method,
      redirect: init.redirect || input.redirect || "follow",
      headers,
      parsedURL,
      signal,
      referrer
    };
    this.follow = init.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init.follow;
    this.compress = init.compress === void 0 ? input.compress === void 0 ? true : input.compress : init.compress;
    this.counter = init.counter || input.counter || 0;
    this.agent = init.agent || input.agent;
    this.highWaterMark = init.highWaterMark || input.highWaterMark || 16384;
    this.insecureHTTPParser = init.insecureHTTPParser || input.insecureHTTPParser || false;
    this.referrerPolicy = init.referrerPolicy || input.referrerPolicy || "";
  }
  /** @returns {string} */
  get method() {
    return this[INTERNALS3].method;
  }
  /** @returns {string} */
  get url() {
    return (0, import_node_url.format)(this[INTERNALS3].parsedURL);
  }
  /** @returns {Headers} */
  get headers() {
    return this[INTERNALS3].headers;
  }
  get redirect() {
    return this[INTERNALS3].redirect;
  }
  /** @returns {AbortSignal} */
  get signal() {
    return this[INTERNALS3].signal;
  }
  // https://fetch.spec.whatwg.org/#dom-request-referrer
  get referrer() {
    if (this[INTERNALS3].referrer === "no-referrer") {
      return "";
    }
    if (this[INTERNALS3].referrer === "client") {
      return "about:client";
    }
    if (this[INTERNALS3].referrer) {
      return this[INTERNALS3].referrer.toString();
    }
    return void 0;
  }
  get referrerPolicy() {
    return this[INTERNALS3].referrerPolicy;
  }
  set referrerPolicy(referrerPolicy) {
    this[INTERNALS3].referrerPolicy = validateReferrerPolicy(referrerPolicy);
  }
  /**
   * Clone this request
   *
   * @return  Request
   */
  clone() {
    return new _Request(this);
  }
  get [Symbol.toStringTag]() {
    return "Request";
  }
};
Object.defineProperties(Request.prototype, {
  method: { enumerable: true },
  url: { enumerable: true },
  headers: { enumerable: true },
  redirect: { enumerable: true },
  clone: { enumerable: true },
  signal: { enumerable: true },
  referrer: { enumerable: true },
  referrerPolicy: { enumerable: true }
});
var getNodeRequestOptions = (request) => {
  const { parsedURL } = request[INTERNALS3];
  const headers = new Headers(request[INTERNALS3].headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "*/*");
  }
  let contentLengthValue = null;
  if (request.body === null && /^(post|put)$/i.test(request.method)) {
    contentLengthValue = "0";
  }
  if (request.body !== null) {
    const totalBytes = getTotalBytes(request);
    if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
      contentLengthValue = String(totalBytes);
    }
  }
  if (contentLengthValue) {
    headers.set("Content-Length", contentLengthValue);
  }
  if (request.referrerPolicy === "") {
    request.referrerPolicy = DEFAULT_REFERRER_POLICY;
  }
  if (request.referrer && request.referrer !== "no-referrer") {
    request[INTERNALS3].referrer = determineRequestsReferrer(request);
  } else {
    request[INTERNALS3].referrer = "no-referrer";
  }
  if (request[INTERNALS3].referrer instanceof URL) {
    headers.set("Referer", request.referrer);
  }
  if (!headers.has("User-Agent")) {
    headers.set("User-Agent", "node-fetch");
  }
  if (request.compress && !headers.has("Accept-Encoding")) {
    headers.set("Accept-Encoding", "gzip, deflate, br");
  }
  let { agent } = request;
  if (typeof agent === "function") {
    agent = agent(parsedURL);
  }
  const search = getSearch(parsedURL);
  const options = {
    // Overwrite search to retain trailing ? (issue #776)
    path: parsedURL.pathname + search,
    // The following options are not expressed in the URL
    method: request.method,
    headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
    insecureHTTPParser: request.insecureHTTPParser,
    agent
  };
  return {
    /** @type {URL} */
    parsedURL,
    options
  };
};

// node_modules/node-fetch/src/errors/abort-error.js
var AbortError = class extends FetchBaseError {
  constructor(message, type = "aborted") {
    super(message, type);
  }
};

// node_modules/node-fetch/src/index.js
init_esm_min();
init_from();
var supportedSchemas = /* @__PURE__ */ new Set(["data:", "http:", "https:"]);
async function fetch2(url, options_) {
  return new Promise((resolve, reject) => {
    const request = new Request(url, options_);
    const { parsedURL, options } = getNodeRequestOptions(request);
    if (!supportedSchemas.has(parsedURL.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${parsedURL.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (parsedURL.protocol === "data:") {
      const data = dist_default(request.url);
      const response2 = new Response(data, { headers: { "Content-Type": data.typeFull } });
      resolve(response2);
      return;
    }
    const send = (parsedURL.protocol === "https:" ? import_node_https.default : import_node_http2.default).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error = new AbortError("The operation was aborted.");
      reject(error);
      if (request.body && request.body instanceof import_node_stream2.default.Readable) {
        request.body.destroy(error);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(parsedURL.toString(), options);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (error) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${error.message}`, "system", error));
      finalize();
    });
    fixResponseChunkedTransferBadEnding(request_, (error) => {
      if (response && response.body) {
        response.body.destroy(error);
      }
    });
    if (process.version < "v14") {
      request_.on("socket", (s2) => {
        let endedWithEventsCount;
        s2.prependListener("end", () => {
          endedWithEventsCount = s2._eventsCount;
        });
        s2.prependListener("close", (hadError) => {
          if (response && endedWithEventsCount < s2._eventsCount && !hadError) {
            const error = new Error("Premature close");
            error.code = "ERR_STREAM_PREMATURE_CLOSE";
            response.body.emit("error", error);
          }
        });
      });
    }
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers.get("Location");
        let locationURL = null;
        try {
          locationURL = location === null ? null : new URL(location, request.url);
        } catch {
          if (request.redirect !== "manual") {
            reject(new FetchError(`uri requested responds with an invalid redirect URL: ${location}`, "invalid-redirect"));
            finalize();
            return;
          }
        }
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: clone(request),
              signal: request.signal,
              size: request.size,
              referrer: request.referrer,
              referrerPolicy: request.referrerPolicy
            };
            if (!isDomainOrSubdomain(request.url, locationURL) || !isSameProtocol(request.url, locationURL)) {
              for (const name of ["authorization", "www-authenticate", "cookie", "cookie2"]) {
                requestOptions.headers.delete(name);
              }
            }
            if (response_.statusCode !== 303 && request.body && options_.body instanceof import_node_stream2.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            const responseReferrerPolicy = parseReferrerPolicyFromHeader(headers);
            if (responseReferrerPolicy) {
              requestOptions.referrerPolicy = responseReferrerPolicy;
            }
            resolve(fetch2(new Request(locationURL, requestOptions)));
            finalize();
            return;
          }
          default:
            return reject(new TypeError(`Redirect option '${request.redirect}' is not a valid value of RequestRedirect`));
        }
      }
      if (signal) {
        response_.once("end", () => {
          signal.removeEventListener("abort", abortAndFinalize);
        });
      }
      let body = (0, import_node_stream2.pipeline)(response_, new import_node_stream2.PassThrough(), (error) => {
        if (error) {
          reject(error);
        }
      });
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response(body, responseOptions);
        resolve(response);
        return;
      }
      const zlibOptions = {
        flush: import_node_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_node_zlib.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = (0, import_node_stream2.pipeline)(body, import_node_zlib.default.createGunzip(zlibOptions), (error) => {
          if (error) {
            reject(error);
          }
        });
        response = new Response(body, responseOptions);
        resolve(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw2 = (0, import_node_stream2.pipeline)(response_, new import_node_stream2.PassThrough(), (error) => {
          if (error) {
            reject(error);
          }
        });
        raw2.once("data", (chunk) => {
          if ((chunk[0] & 15) === 8) {
            body = (0, import_node_stream2.pipeline)(body, import_node_zlib.default.createInflate(), (error) => {
              if (error) {
                reject(error);
              }
            });
          } else {
            body = (0, import_node_stream2.pipeline)(body, import_node_zlib.default.createInflateRaw(), (error) => {
              if (error) {
                reject(error);
              }
            });
          }
          response = new Response(body, responseOptions);
          resolve(response);
        });
        raw2.once("end", () => {
          if (!response) {
            response = new Response(body, responseOptions);
            resolve(response);
          }
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_node_stream2.pipeline)(body, import_node_zlib.default.createBrotliDecompress(), (error) => {
          if (error) {
            reject(error);
          }
        });
        response = new Response(body, responseOptions);
        resolve(response);
        return;
      }
      response = new Response(body, responseOptions);
      resolve(response);
    });
    writeToStream(request_, request).catch(reject);
  });
}
function fixResponseChunkedTransferBadEnding(request, errorCallback) {
  const LAST_CHUNK = import_node_buffer2.Buffer.from("0\r\n\r\n");
  let isChunkedTransfer = false;
  let properLastChunkReceived = false;
  let previousChunk;
  request.on("response", (response) => {
    const { headers } = response;
    isChunkedTransfer = headers["transfer-encoding"] === "chunked" && !headers["content-length"];
  });
  request.on("socket", (socket) => {
    const onSocketClose = () => {
      if (isChunkedTransfer && !properLastChunkReceived) {
        const error = new Error("Premature close");
        error.code = "ERR_STREAM_PREMATURE_CLOSE";
        errorCallback(error);
      }
    };
    const onData = (buf) => {
      properLastChunkReceived = import_node_buffer2.Buffer.compare(buf.slice(-5), LAST_CHUNK) === 0;
      if (!properLastChunkReceived && previousChunk) {
        properLastChunkReceived = import_node_buffer2.Buffer.compare(previousChunk.slice(-3), LAST_CHUNK.slice(0, 3)) === 0 && import_node_buffer2.Buffer.compare(buf.slice(-2), LAST_CHUNK.slice(3)) === 0;
      }
      previousChunk = buf;
    };
    socket.prependListener("close", onSocketClose);
    socket.on("data", onData);
    request.on("close", () => {
      socket.removeListener("close", onSocketClose);
      socket.removeListener("data", onData);
    });
  });
}

// scripts/import-data.ts
var import_client = __toESM(require_default2());
var import_xml2js = __toESM(require_xml2js());
var PRICE_INCREASE_PERCENT = 20;
var upPrice = (price) => parseFloat((price * (1 + PRICE_INCREASE_PERCENT / 100)).toFixed(2));
var prisma = new import_client.PrismaClient();
var GIFTS_AUTH = "Basic " + Buffer.from(`${process.env.GIFTS_RU_LOGIN}:${process.env.GIFTS_RU_PASSWORD}`).toString("base64");
var OASIS_AUTH = `${process.env.OASIS_API_KEY}`;
var toSourcedId = (id2, sourceName) => `${id2}_[${sourceName}]`;
async function fetchGiftsXML(endpoint) {
  const url = `https://api2.gifts.ru/export/v2/catalogue/${endpoint}`;
  const res = await fetch2(url, { headers: { Authorization: GIFTS_AUTH } });
  return res.text();
}
async function fetchOasisXML(path) {
  const url = `https://api.oasiscatalog.com/v4/${path}?key=${OASIS_AUTH}`;
  const res = await fetch2(url);
  return res.text();
}
async function fetchHappyGiftsXML() {
  const url = "https://happygifts.ru/XML/all_items_export.xlm";
  const res = await fetch2(url);
  return res.text();
}
async function parseGiftsCategories(xml) {
  const rawData = await (0, import_xml2js.parseStringPromise)(xml);
  const parseCategories = (data, parentId = null, level = 0) => {
    const categories = [];
    data.forEach((item) => {
      const category = {
        id: toSourcedId(item.page_id[0], "Gifts" /* Gifts */),
        name: item.name[0],
        parentId,
        level,
        sourceName: "Gifts" /* Gifts */
      };
      categories.push(category);
      if (item.page && item.page.length > 0) {
        const subCategories = parseCategories(item.page, category.id, level + 1);
        categories.push(...subCategories);
      }
    });
    return categories;
  };
  return parseCategories(rawData.doct.page).filter((c) => c.id !== toSourcedId("1", "Gifts" /* Gifts */)).map((c) => ({ ...c, parentId: c.parentId === toSourcedId("1", "Gifts" /* Gifts */) ? null : c.parentId }));
}
async function parseGiftsProductsResult(xml) {
  const rawData = await (0, import_xml2js.parseStringPromise)(xml);
  const productCatalogTree = await parseGiftsMatchesProductWithCatalog(rawData);
  const products = [];
  const variants = [];
  rawData.doct.product.forEach((rawProduct) => {
    const productId = rawProduct.product_id[0];
    const pCategory = productCatalogTree[productId];
    if (typeof pCategory === "undefined") {
      return;
    }
    const pPrice = "price" in rawProduct.price[0] ? rawProduct.price[0].price[0] : "0";
    const product = {
      id: toSourcedId(productId, "Gifts" /* Gifts */),
      name: rawProduct.name[0],
      price: "product" in rawProduct ? parseFloat(pPrice) : null,
      categoryId: toSourcedId(pCategory, "Gifts" /* Gifts */),
      sourceName: "Gifts" /* Gifts */
    };
    products.push(product);
    if ("product" in rawProduct) {
      rawProduct.product.forEach((variant) => {
        if (variant.main_product[0] === productId) {
          variants.push({
            id: toSourcedId(variant.product_id[0], "Gifts" /* Gifts */),
            productId: product.id,
            name: variant.name[0],
            value: variant.size_code[0],
            price: parseFloat(variant.price[0].price[0]),
            sourceName: "Gifts" /* Gifts */
          });
        }
      });
    }
  });
  return {
    products,
    variants
  };
}
async function parseGiftsMatchesProductWithCatalog(rawData) {
  const parseTree = (data) => {
    const matches = {};
    data.forEach((item) => {
      if ("product" in item && item.product) {
        item.product.forEach((product) => {
          matches[product.product[0]] = product.page[0];
        });
      }
      if (item.page && item.page.length > 0) {
        Object.assign(matches, parseTree(item.page));
      }
    });
    return matches;
  };
  return parseTree(rawData.doct.page);
}
async function parseOasisCategories(xml) {
  const js2 = await (0, import_xml2js.parseStringPromise)(xml);
  return js2.response.item.map((rawCategory) => {
    return {
      id: toSourcedId(rawCategory.id[0], "Oasis" /* Oasis */),
      name: rawCategory.name[0],
      level: parseInt(rawCategory.level[0]),
      parentId: rawCategory.parent_id[0] ? toSourcedId(rawCategory.parent_id[0], "Oasis" /* Oasis */) : null,
      sourceName: "Oasis" /* Oasis */
    };
  });
}
async function parseOasisProductsResult(xml) {
  const js2 = await (0, import_xml2js.parseStringPromise)(xml);
  const products = [];
  const variants = [];
  js2.yml_catalog.shop[0].offers[0].offer.forEach((rawItem) => {
    const product = {
      id: toSourcedId(rawItem.$.id, "Oasis" /* Oasis */),
      name: rawItem.name[0],
      description: rawItem.description[0],
      price: parseFloat(rawItem.price[0]),
      categoryId: toSourcedId(rawItem.categoryId[0], "Oasis" /* Oasis */),
      sourceName: "Oasis" /* Oasis */
    };
    products.push(product);
  });
  return { products, variants };
}
async function parseHappyGiftsCategories(xml) {
  const js2 = await (0, import_xml2js.parseStringPromise)(xml);
  const mapCategories = (rawCategories, parentId = null) => {
    const categories = [];
    rawCategories.forEach((rawCategory) => {
      const sourcedCategoryId = toSourcedId(rawCategory.ID[0], "HappyGifts" /* HappyGifts */);
      categories.push({
        id: sourcedCategoryId,
        name: rawCategory.NAME[0],
        level: parseInt(rawCategory.LEVEL[0]),
        parentId,
        sourceName: "HappyGifts" /* HappyGifts */
      });
      if ("SUB_Group" in rawCategory) {
        rawCategory.SUB_Group.forEach((subGroup) => {
          const subCategories = mapSubGroup(subGroup, sourcedCategoryId);
          categories.push(...subCategories);
        });
      }
    });
    return categories;
  };
  const mapSubGroup = (rawSubGroup, parentId) => {
    const categories = [];
    const sourcedSubGroupId = toSourcedId(rawSubGroup.ID[0], "HappyGifts" /* HappyGifts */);
    categories.push({
      id: sourcedSubGroupId,
      name: rawSubGroup.NAME[0],
      level: parseInt(rawSubGroup.LEVEL[0]),
      parentId,
      sourceName: "HappyGifts" /* HappyGifts */
    });
    if ("SUB_CHILD_Group" in rawSubGroup) {
      rawSubGroup.SUB_CHILD_Group.forEach((subChildGroup) => {
        const subChildCategories = mapSubChildGroup(subChildGroup, sourcedSubGroupId);
        categories.push(...subChildCategories);
      });
    }
    return categories;
  };
  const mapSubChildGroup = (rawSubChildGroup, parentId) => {
    return [
      {
        id: toSourcedId(rawSubChildGroup.ID[0], "HappyGifts" /* HappyGifts */),
        name: rawSubChildGroup.NAME[0],
        level: parseInt(rawSubChildGroup.LEVEL[0]),
        parentId,
        sourceName: "HappyGifts" /* HappyGifts */
      }
    ];
  };
  return mapCategories(js2.Catalog_items_export.Catalog_groups[0].Group);
}
async function parseHappyGiftsProductsResult(xml) {
  const js2 = await (0, import_xml2js.parseStringPromise)(xml);
  const products = [];
  const variants = [];
  js2.Catalog_items_export.Items[0].Item.forEach((rawItem) => {
    const product = {
      id: toSourcedId(rawItem.ID[0], "HappyGifts" /* HappyGifts */),
      name: rawItem.NAME[0],
      categoryId: toSourcedId(rawItem.GROUP_ID[0], "HappyGifts" /* HappyGifts */),
      price: null,
      sourceName: "HappyGifts" /* HappyGifts */
    };
    products.push(product);
    rawItem.SubItems.forEach((subItem) => {
      subItem.SubItem.forEach((variant) => {
        const productVariant = {
          id: toSourcedId(variant.XML_ID[0], "HappyGifts" /* HappyGifts */),
          productId: product.id,
          name: variant.NAME[0],
          value: variant.Size[0],
          price: parseFloat(variant.Price[0]),
          sourceName: "HappyGifts" /* HappyGifts */
        };
        variants.push(productVariant);
      });
    });
  });
  return { products, variants };
}
async function writeToDb(categories, products, productVariants = []) {
  await prisma.$transaction(async (tx) => {
    await tx.product.deleteMany();
    await tx.productVariant.deleteMany();
    await tx.category.deleteMany();
    await tx.category.createMany({
      data: categories
    });
    await tx.product.createMany({
      data: products
    });
    for (const variant of productVariants) {
      try {
        await tx.productVariant.create({
          data: variant
        });
      } catch (error) {
        console.error(`\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0438 \u0432\u0430\u0440\u0438\u0430\u043D\u0442\u0430 \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u0430: ${JSON.stringify(variant)}`, error);
        throw "";
      }
    }
  }, { timeout: 2e4 });
}
async function main() {
  try {
    const [giftsXml, happyXml, oasisCatXml, oasisProdXml] = await Promise.all([
      fetchGiftsXML("catalogue.xml"),
      fetchHappyGiftsXML(),
      fetchOasisXML("categories"),
      fetchOasisXML("products")
    ]);
    const giftsCategories = await parseGiftsCategories(giftsXml);
    const giftsProductsResult = await parseGiftsProductsResult(giftsXml);
    const happyGiftsCategories = await parseHappyGiftsCategories(happyXml);
    const happyGiftsProductsResult = await parseHappyGiftsProductsResult(happyXml);
    const oasisCategories = await parseOasisCategories(oasisCatXml);
    const oasisProductsResult = await parseOasisProductsResult(oasisProdXml);
    const categories = [
      ...giftsCategories,
      ...happyGiftsCategories,
      ...oasisCategories
    ];
    const products = [
      ...giftsProductsResult.products,
      ...happyGiftsProductsResult.products,
      ...oasisProductsResult.products
    ].map((p) => ({
      ...p,
      price: p.price ? upPrice(p.price) : null
    })).filter((p) => categories.findIndex((c) => p.categoryId === c.id) !== -1);
    const productVariants = [
      ...giftsProductsResult.variants,
      ...happyGiftsProductsResult.variants,
      ...oasisProductsResult.variants
    ].map((p) => ({
      ...p,
      price: upPrice(p.price)
    }));
    await writeToDb(
      categories,
      products,
      productVariants
    );
    console.log("\u0418\u043C\u043F\u043E\u0440\u0442 \u0438\u0437 \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043D.");
  } catch (e2) {
    console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0438\u043C\u043F\u043E\u0440\u0442\u0430:", e2);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}
main();
/*! Bundled license information:

web-streams-polyfill/dist/ponyfill.es2018.js:
  (**
   * @license
   * web-streams-polyfill v3.3.3
   * Copyright 2024 Mattias Buelens, Diwank Singh Tomer and other contributors.
   * This code is released under the MIT license.
   * SPDX-License-Identifier: MIT
   *)

fetch-blob/index.js:
  (*! fetch-blob. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> *)

formdata-polyfill/esm.min.js:
  (*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> *)

node-domexception/index.js:
  (*! node-domexception. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> *)

.prisma/client/runtime/library.js:
  (*! Bundled license information:
  
  decimal.js/decimal.mjs:
    (*!
     *  decimal.js v10.4.3
     *  An arbitrary-precision Decimal type for JavaScript.
     *  https://github.com/MikeMcl/decimal.js
     *  Copyright (c) 2022 Michael Mclaughlin <M8ch88l@gmail.com>
     *  MIT Licence
     *)
  *)

sax/lib/sax.js:
  (*! http://mths.be/fromcodepoint v0.1.0 by @mathias *)
*/
