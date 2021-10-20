import { classList } from "@lbfalvy/react-utils";
import React from "react";
import { Entry, Typemap } from "../Typemap";
import { RenderWith } from '../resolve';
import './Promise.scss';
import { Label } from "../components/Label";

export function promiseDescriber(data: Promise<any>, tm: Typemap, length: number): string {
    return 'Promise'
}

export function PromiseRenderer({ data, tm }: { data: Promise<any>, tm: Typemap }): React.ReactElement {
    const [status, setStatus] = React.useState<'fulfilled'|'rejected'>()
    const [value, setValue] = React.useState()
    React.useEffect(() => {
        data.then(v => {
            setStatus('fulfilled')
            setValue(v)
        }, e => {
            setStatus('rejected')
            setValue(e)
        })
    }, [data])
    return <span className='insight__promise'>
        <Label to={data} />
        <span className='insight__factoryname'>Promise</span>
        <span className='insight__promise_sign'>
            {status == 'fulfilled' ? <span className='insight__promise_fulfilled'>==&gt;</span>
            : status == 'rejected' ? <span className='insight__promise_rejected'>&lt;!&gt;</span>
            : <span className='insight__promise_pending'>...</span>}
        </span>
        {value && <RenderWith data={value} tm={tm} />}
    </span>
}

export const promiseEntry: Entry<Promise<any>> = [PromiseRenderer, promiseDescriber]