import { Entry, Typemap } from "../Typemap";
import { describe } from '../resolve';
import React from "react";
import { BlockEntry, Description, Key, Nametag, Pair, Toggle } from './utils';
import { Label } from '../components/Label';

export function arrayDescriber(arr: any[], tm: Typemap, length: number): string {
    let str = ''
    let i = 0;
    while (i < arr.length) {
        const leftover = length - str.length - 5
        if (0 < leftover) {
            if (str != '') str += ', '
            const value = describe(arr[i], tm, leftover)
            str += value
        } else break;
        i++
    }
    if (i < arr.length) str += '…'
    return `[${str}]`
}

export function subranges(arr: any[], range: [number, number]): [number, number][] {
    const [low, high] = range
    // If the whole array doesn't have 100 elements, it should fit on one screen
    const orderOfMagnitude = Math.ceil(Math.log10(high - low))
    const step = arr.length <= 100 ? 1 : 10**(orderOfMagnitude-1)
    const ranges: [number, number][] = []
    for (let i = low; i < high; i += step)
        if (Object.keys(arr.slice(i, i + step)).length)
            ranges.push([i, Math.min(i + step, high)])
    switch (ranges.length) {
        case 0: return []
        case 1: if (1 < step) return subranges(arr, ranges[0])
        default: return ranges
    }
}

interface ShowArrayRangeProps {
    array: any[]
    low: number
    high: number
    typemap: Typemap
}

function ShowArrayRange({ array, low, high, typemap }: ShowArrayRangeProps): React.ReactElement {
    const ranges = subranges(array, [low, high])
    return <BlockEntry>{{
        Title: ({ open }) => <>
            <Toggle open={open} />
            {low == 0 && high == array.length // If this is the whole array
                ? !open // and it isn't open
                    ? <Description>{arrayDescriber(array, typemap, 50)}</Description> // show description
                    : null // if it's open, show nothing
                : <Key>[{low}…{high - 1}]</Key> // if it's a subrange, always show ends
                }
        </>,
        body: () => <>{ranges.map(([l, h]) => <div key={l}>
            {h - l == 1
                ? <Pair index={l} value={array[l]} tm={typemap} />
                : <ShowArrayRange low={l} high={h} array={array} typemap={typemap} />}
        </div>)}</>
    }}</BlockEntry>
}

export function ArrayRenderer({ data, tm }: { data: any[], tm: Typemap }): React.ReactElement {
    return <>
        <Label to={data} />
        <Nametag name='Array' param={data.length} />
        <ShowArrayRange array={data} low={0} high={data.length} typemap={tm} />
    </>
}

export const arrayEntry = [ArrayRenderer, arrayDescriber] as Entry<any[]>