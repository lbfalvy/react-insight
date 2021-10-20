import React from "react";
import { Label } from "../components/Label";
import { Entry } from "../Typemap";
import './Function.scss';

function getArgs(data: Function) {
    return new Array(data.length).fill('arg').map((s, i) => s + i).join(', ')
}

export function fnDescriber(data: Function) {
    const args = getArgs(data)
    return data.name.length
        ? `function ${data.name}(${args}) {…}`
        : `(${args}) => {…}`
}

export function FnRenderer({ data }: { data: Function }) {
    return <span className='insight__function'>
        <Label to={data} />
        {0 < data.name?.length ? <>
            <span className='insight__keyword'>function</span>
            <span className='insight__name'>{data.name}</span>
        </> :null}
        <span className='insight__param'>({getArgs(data)})</span>
        {data.name?.length == 0 ?
            <span className='insight__arrow'>=&gt;</span>
        :null}
        <span className='insight__body'>{'{…}'}</span>
    </span>
}

export const functionEntry: Entry<Function> = [FnRenderer, fnDescriber]