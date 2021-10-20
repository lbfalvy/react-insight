import React from "react";
import { Entry, Typemap } from "../Typemap";
import { describe } from '../resolve';
import { Label } from "../components/Label";
import { BlockEntry, Description, Nametag, Pair, Toggle } from "./utils";

function objectDescriber(data: Record<string, any>, tm: Typemap, length: number): string {
    // If it has an explicit toString function, invoke that
    if (data['toString'] && data['toString'] !== Object.prototype.toString)
        return data.toString()
    // Otherwise, it'll be described by some of its shorter-named own properties.
    let str = ''
    const names = Object.getOwnPropertyNames(data)
    let i = 0;
    let skipped = false
    while (i < names.length) {
        const name = names[i] + ': '
        const leftover = length - str.length - name.length - 3 // ellipsis and two braces
        if (0 < leftover) {
            if (str != '') str += ', '
            const value = describe(data[names[i]], tm, leftover)
            str += name + value
        } else skipped = true
        i++
    }
    if (skipped) str += '…'
    return `{${str}}`
}

function ObjectRenderer({ data, tm }: { data: object, tm: Typemap }) {
    const name = data[Symbol.toStringTag as keyof object]
        ?? Object.getPrototypeOf(data)?.constructor?.name
        ?? 'Object'
    const getEntries = React.useCallback(
        () => Object.getOwnPropertyNames(data)
            .map(name => [name, data[name as keyof object]])
            .concat([['__prototype__', Object.getPrototypeOf(data)]]),
        [data]
    )
    return <BlockEntry pre='{' post='}'>{{
        Title: ({ open }) => <>
            <Label to={data} />
            <Nametag name={name} />
            <Toggle open={open} />
            {!open?
                <Description>{objectDescriber(data, tm, 50)}</Description>
            :null}
        </>,
        body: () => <>{getEntries().map(([key, value]) => <div>
            <Pair key={key} index={key} value={value} tm={tm} />
        </div>)}</>
    }}</BlockEntry>
}

export const objectEntry = [ObjectRenderer, objectDescriber] as Entry<object>