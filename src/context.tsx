import React from "react";
import { config } from "./defaults";
import { compileTypemap, merge, Typemap, TypemapConfig } from "./Typemap";

const ctx = React.createContext<TypemapConfig>(config)

export function useTypemap(): Typemap {
    const context = React.useContext(ctx)
    return React.useMemo(() => compileTypemap(context), [context])
}

type ProviderProps = Parameters<React.Provider<TypemapConfig>>[0]

function makeDepArray(cfg: TypemapConfig) {
    return [Object.entries(cfg.typeof ?? {}), cfg.instanceof, cfg.test].flat(Infinity)
}

export function Provider(
    { value, children }: ProviderProps
): React.ReactElement {
    const old = React.useContext(ctx)
    const current = React.useMemo(
        () => merge(old, value),
        [old, ...makeDepArray(value)]
    )
    return <ctx.Provider value={current}>
        {children}
    </ctx.Provider>
}

interface ExtenderProps {
    children: React.ReactNode
    callback: (conf: TypemapConfig) => TypemapConfig
}

export function Extender({ callback, children }: ExtenderProps): React.ReactElement {
    const old = React.useContext(ctx)
    const current = React.useMemo(() => callback(old), [callback, old])
    const preserved = React.useMemo(() => current, makeDepArray(current))
    return <ctx.Provider value={preserved}>
        {children}
    </ctx.Provider>
}