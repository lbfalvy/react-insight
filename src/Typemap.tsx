import { ComponentType } from "react";
interface TypeofReturns {
    'string': string
    'number': number
    'bigint': bigint
    'boolean': boolean
    'symbol': symbol
    'undefined': undefined
    'object': object
    'function': Function
}

export type Renderer<T> = ComponentType<{ data: T, tm: Typemap }>
export type Describe<T> = (data: T, tm: Typemap, length: number) => string
export type Entry<T> =
    | [Renderer<T>|undefined, Describe<T>|undefined]
    | [Renderer<T>|undefined]

export type TestEntry<T> = [(data: any) => data is T, Entry<T>] | [(data: any) => boolean, Entry<any>]
export type InstanceofEntry<T> = [new (...args: any[]) => T, Entry<T>]

export interface TypemapConfig {
    typeof?: { [P in keyof TypeofReturns]?: Entry<TypeofReturns[P]> } | undefined
    instanceof?: InstanceofEntry<any>[]
    test?: TestEntry<any>[]
}

function combineTypeof(a: Exclude<TypemapConfig['typeof'], undefined>, b: typeof a): typeof a {
    type Key = keyof typeof a
    const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])] as Key[]
    return Object.fromEntries(keys.map(k => [k, [
        a[k]?.[0] ?? b[k]?.[0],
        a[k]?.[1] ?? b[k]?.[1]
    ]]))
}

export function merge(a: TypemapConfig, b: TypemapConfig): TypemapConfig {
    return {
        instanceof: [...b.instanceof ?? [], ...a.instanceof ?? []],
        test: [...b.test ?? [], ...a.test ?? []],
        typeof: a.typeof ? b.typeof
                ? combineTypeof(a.typeof, b.typeof)
                : a.typeof
            : b.typeof
                ? b.typeof
                : undefined
    }
}

export interface Typemap {
    typeof: { [P in keyof TypeofReturns]?: Entry<any> }
    instanceof: Map<new () => any, Entry<any>>
    test: Exclude<TypemapConfig['test'], undefined>
}

export function compileTypemap(config: TypemapConfig): Typemap {
    const instof = new Map<new () => AnalyserNode, Entry<any>>()
    config.instanceof?.forEach(([type, entry]) => {
        const old = instof.get(type)
        if (!old) return instof.set(type, entry)
        old[0] ??= entry[0]
        old[1] ??= entry[1]
    })
    const tests = new Map<(arg: any) => boolean, Entry<any>>()
    config.test?.forEach(([test, entry]) => {
        const old = tests.get(test)
        if (!old) return tests.set(test, entry)
        old[0] ??= entry[0]
        old[1] ??= entry[1]
    })
    return {
        typeof: config.typeof ?? {},
        test: [...tests.entries()],
        instanceof: instof
    }
}