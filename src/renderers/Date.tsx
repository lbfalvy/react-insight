import React from "react";
import { Entry, Typemap } from "..";
import './Date.scss';

function pad(n: number, width = 2): string {
    return '0'.repeat(width - Math.floor(Math.log10(n)) - 1) + n.toString()
    if (n < 10) return `0${n}`
    else return n.toString()
}

function processTZOffset(n: number): string {
    n /= 60
    if (0 == n) return 'UTC'
    if (0 < n) return `UTC+${n}`
    return `UTC${n.toString()}`
}

function format(date: Date): string {
    // yyyy-mm-dd
    const day = `${date.getFullYear()}-${pad(date.getMonth())}-${pad(date.getDate())}`
    // ss.mmm
    const seconds = `${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`
    // hh:mm
    const hourMin = `${pad(date.getHours())}:${pad(date.getMinutes())}`
    // UTC+n
    const tz = processTZOffset(date.getTimezoneOffset())
    return `${day} ${hourMin}:${seconds} ${tz}`
}

export function dateDescriber(data: Date): string {
    return format(data)
}

export function DateRenderer({ data, tm }: { data: Date, tm: Typemap }): React.ReactElement {
    return <span className='insight__date'>
        {format(data)}
    </span>
}

export const dateEntry: Entry<Date> = [DateRenderer, dateDescriber]