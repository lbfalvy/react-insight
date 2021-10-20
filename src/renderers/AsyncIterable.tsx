import React from "react";
import { Typemap, Entry } from "../Typemap";
import { RenderWith } from '../resolve';
import './AsyncIterable.scss'
import { BlockEntry, Nametag, Toggle } from "./utils";
import { Label } from "../components/Label";

export function aiDescriber(): string {
    return 'AsyncIterable'
}

export const aiScrollbackCtx = React.createContext(1000)

export function AiRenderer({ data, tm }: { data: AsyncIterable<any>, tm: Typemap}): React.ReactElement {
    const iterator = React.useMemo(() => data[Symbol.asyncIterator](), [data])
    const scrollback = React.useContext(aiScrollbackCtx)
    const [{ length, log }, act] = React.useReducer(
        (old: { length: number, log: any[] }, action: ['flush']|['push', any]) => {
            const [cmd, ...args] = action
            const { length, log } = old
            switch (cmd) {
                case 'flush': return { length: 0, log: [] }
                case 'push':
                    const discarded = Math.max(log.length + args.length - scrollback, 0)
                    return {
                        length: length + args.length,
                        log: [...log.slice(discarded), ...args]
                    }
                default: throw new Error('Unknown action!')
            }
        },
        { length: 0, log: [] }
    )
    const [done, setDone] = React.useState(false)
    React.useEffect(() => {
        setDone(false)
        act(['flush'])
        const cb = (res: IteratorResult<any>) => {
            if (!res.done || res.value) act(['push', res.value])
            if (!res.done) iterator.next().then(cb)
            else setDone(true)
        }
        iterator.next().then(cb)
    }, [iterator])
    return <BlockEntry>{{
        Title: ({ open }) => <>
            <Label to={data} />
            <Nametag name='AsyncIterable' param={`${length}, ${done ? 'done' : 'waiting'}`} />
            <Toggle open={open} />
        </>,
        body: () => <>
            {log.map((entry, i) => <div key={i}>
                <RenderWith data={entry} tm={tm} />
            </div>)}
            <div className='insight__ai_status'>{done ? 'done' : 'waiting'}</div>
        </>
    }}</BlockEntry>
}

export const asyncIterableEntry: Entry<AsyncIterable<any>> = [AiRenderer, aiDescriber]