import React from "react";
import { Entry, Typemap } from "../Typemap";
import { BlockEntry, Nametag, Pair, Toggle } from "./utils";
import { Label, labelCtx } from "../components/Label";
import '../misc.scss'
import { Searchbar } from "../components/Searchbar";

export function setDescriber(data: Set<any>): string {
    return `Set(${data.size})`
}

export function SetRenderer({ data, tm }: { data: Set<any>, tm: Typemap }): React.ReactElement {
    const [result, setResult] = React.useState<[any]|undefined>()
    return <BlockEntry>{{
        Title: ({ open }) => <>
            <Label to={data} />
            <Nametag name='Set' param={data.size} />
            <Toggle open={open} />
        </>,
        body: () => <>
            <div>
                <Searchbar result={result} tm={tm}
                    query={x => setResult(data.has(x) ? [true] : [false])} />
            </div>
            <div><Pair index='values' value={[...data.values()]} tm={tm} /></div>
        </>
    }}</BlockEntry>
}

export const setEntry: Entry<Set<any>> = [SetRenderer, setDescriber]