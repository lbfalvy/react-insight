import React from "react"
import { typemap } from "./defaults"
import { truncate } from "./truncate"
import { Entry, Typemap } from "./Typemap"

export function resolve<T>(o: any, tm: Typemap): Entry<T> {
    const final: Entry<T> = [undefined, undefined]
    for (const [test, entry] of tm.test) {
        if (!test(o)) continue
        const Render = final[0] ??= entry[0]
        const describe = final[1] ??= entry[1]
        if (Render && describe) return final
    }
    for (const [Type, entry] of tm.instanceof) {
        if (!(o instanceof Type)) continue
        const Render = final[0] ??= entry[0]
        const describe = final[1] ??= entry[1]
        if (Render && describe) return final
    }
    const typeofEntry = tm.typeof?.[typeof o]
    if (typeofEntry) {
        final[0] ??= typeofEntry[0]
        final[1] ??= typeofEntry[1]
    }
    return final
}

interface RenderProps {
    data: any,
    tm: Typemap
}

export function RenderWith({ data, tm }: RenderProps): React.ReactElement {
    const [Component] = resolve(data, tm)
    if (!Component) throw new Error('Missing component. Did you merge the default config?')
    return <Component data={data} tm={tm} />
}

export function describe(d: any, tm: Typemap, length = 50): string {
    const entry = resolve(d, tm)
    const string = entry[1]?.(d, tm, length)
    if (!string) throw new Error('Missing describer. Did you merge the default config?')
    return truncate(string, length)
}