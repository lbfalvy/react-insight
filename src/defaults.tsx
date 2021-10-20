import React from "react"
import { truncate } from "./truncate"
import { compileTypemap, TypemapConfig } from "./Typemap"
import { arrayEntry } from "./renderers/Array";
import { objectEntry } from "./renderers/Object";
import { functionEntry } from "./renderers/Function";
import './defaults.scss';
import { symbolEntry } from "./renderers/Symbol";
import { promiseEntry } from "./renderers/Promise";
import { asyncIterableEntry } from "./renderers/AsyncIterable";
import { errorEntry } from "./renderers/Error";
import { mapEntry } from "./renderers/Map";
import { setEntry } from "./renderers/Set";
import { dateEntry } from "./renderers/Date";

export const config: TypemapConfig = {
    typeof: {
        number: [
            ({ data }) =>
            <span className='insight__number'>
                {data.toString()}
            </span>,
            (n: number) => n.toString()
        ],
        bigint: [
            ({ data }) =>
            <span className='insight__bigint'>
                {data.toString()}n
            </span>,
            (bi, _, length) => truncate(bi.toString(), length-1, true)+'n'
        ],
        boolean: [
            ({ data }) =>
            <span className='insight__boolean'>
                {data.toString()}
            </span>,
            (b: boolean) => b.toString()
        ],
        function: functionEntry,
        string: [
            ({ data }) => 
            <span className='insight__string'>
                "{data}"
            </span>,
            (data, _, length) => `"${truncate(data, length - 2)}"`
        ],
        symbol: symbolEntry,
        undefined: [
            () => <span className='insight__undefined' style={{ color: '#0af' }}>
                undefined
            </span>,
            () => 'undefined'
        ],
        object: objectEntry
    },
    instanceof: [
        [Array, arrayEntry],
        [Promise, promiseEntry],
        [Error, errorEntry],
        [Map, mapEntry],
        [Set, setEntry],
        [Date, dateEntry]
    ],
    test: [
        [x => x === null, [
            () => <span className='insight__null'>null</span>,
            () => 'null'
        ]],
        [x => typeof x == 'object' && Symbol.asyncIterator in x, asyncIterableEntry]
    ]
}

export const typemap = compileTypemap(config)