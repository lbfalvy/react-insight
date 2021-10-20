import React from "react";
import { Typemap, Entry } from "../Typemap";
import { describe, RenderWith } from '../resolve';
import './Symbol.scss';
import './utils.scss';
import { Label } from "../components/Label";

export function symbolDescriber(data: symbol, tm: Typemap, length: number) {
    return `Symbol(${describe(data.description, tm, length - 8)})`;
}

export function SymbolRenderer({ data, tm }: { data: symbol, tm: Typemap }): React.ReactElement {
    return <>
        <span className='insight__factoryname'>Symbol</span>
        <span className='insight__param'>
            (<RenderWith data={data.description} tm={tm} />)
        </span>
    </>
}

export const symbolEntry: Entry<symbol> = [SymbolRenderer, symbolDescriber]