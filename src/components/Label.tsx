import { variable, Subscribe } from '@lbfalvy/mini-events'
import { classList } from '@lbfalvy/react-utils'
import React from 'react'
import './Label.scss'
import '../misc.scss'

export interface LabelContext {
    watch(key: any, callback: (hover: boolean, name: string) => any): () => void
    update(key: any, state: { hover?: boolean, name?: string }): boolean
    locate(name: string): any
} 

function makeCtx(): LabelContext {
    const entries = new WeakMap<any, [
        [[boolean, string]],
        Subscribe<[[boolean, string]]>,
        (v: [boolean, string]) => void
    ]>()
    const names = new Map<string, WeakRef<any>>()
    return {
        watch(key, callback) {
            let entry = entries.get(key)
            if (!entry) {
                entry = variable<[boolean, string]>([false, ''])
                try {
                    entries.set(key, entry)
                } catch (ex) {
                    console.error('Bad key!!', key)
                    throw new Error('Label was used with invalid weakmap index')
                }
            }
            const [[[hover, name]], subscribe] = entry
            callback(hover, name)
            return subscribe(value => callback(...value))
        },
        update(key, state) {
            let entry = entries.get(key)
            if (entry) {
                const [[[hover, name]], _, set] = entry
                set([state.hover ?? hover, state.name ?? name])
                // If the name changed and the old name referenced this same object
                // (was not a conflict), then delete it.
                if (name.length && state.name && names.get(name)?.deref() === key)
                    names.delete(name)
            } else {
                entry = variable<[boolean, string]>([state.hover ?? false, state.name ?? ''])
                entries.set(key, entry)
            }
            const name = state.name
            if (name?.length) {
                if (names.get(name)?.deref()) return false
                // The name table doesn't keep the object alive
                const ref = new WeakRef(key)
                names.set(name, ref)
                // The object's collection frees its spot in the name table
                new FinalizationRegistry(ref => {
                    if (names.get(name) == ref) names.delete(name)
                }).register(key, ref)
            }
            return true
        },
        locate(name) {
            return names.get(name)?.deref()
        }
    }
}

export const labelCtx = React.createContext(makeCtx())

export function Label({ to }: { to: any }): React.ReactElement {
    const [focus, setFocus] = React.useState(false)
    const [hover, setHover] = React.useState(false)
    const [conflict, setConflict] = React.useState(false)
    const [name, setName] = React.useState('')
    const ctx = React.useContext(labelCtx)
    const startHover = React.useCallback(() => ctx.update(to, { hover: true }), [ctx, to])
    const endHover = React.useCallback(() => ctx.update(to, { hover: false }), [ctx, to])
    const changeName = React.useCallback((name: string) => {
        setName(name)
        setConflict(!ctx.update(to, { name }))
    }, [ctx, to])
    React.useEffect(() => ctx.watch(to, (hover, name) => {
        setHover(hover)
        setName(name)
    }), [ctx, to])
    const [inputRef, setInputRef] = React.useState<HTMLInputElement|null>();
    // Autofocus
    React.useEffect(() => inputRef?.focus(), [inputRef])
    const blurOnEsc = React.useCallback((e: React.KeyboardEvent) => {
        if (e.key == 'Escape' && name.length == 0) setFocus(false)
    }, [name])
    return <span onMouseEnter={startHover} onMouseLeave={endHover}
        className={classList('insight__label', hover && 'hover', conflict && 'insight__conflict' )}
        onClick={e => {
            e.stopPropagation()
            setFocus(true)
        }}>
        ⌘{focus || name.length ?
            <input className='insight__input' ref={setInputRef} value={name} onKeyDown={blurOnEsc}
                onBlur={() => setFocus(false)} size={name?.length}
                onChange={e => changeName(e.target.value)} placeholder=' ' />
        :null}
    </span>
}