import React from "react";
import { Entry, Typemap } from "../Typemap";
import { BlockEntry, Nametag, Pair, Toggle } from "./utils";
import { Label, labelCtx } from "../components/Label";
import '../misc.scss'
import { Searchbar } from "../components/Searchbar";

export function mapDescriber(data: Map<any, any>): string {
    return `Map(${data.size})`
}

export function MapRenderer({ data, tm }: { data: Map<any, any>, tm: Typemap }): React.ReactElement {
    const [result, setResult] = React.useState<[any]|undefined>()
    return <BlockEntry>{{
        Title: ({ open }) => <>
            <Label to={data} />
            <Nametag name='Map' param={data.size} />
            <Toggle open={open} />
        </>,
        body: () => <>
            <div>
                <Searchbar result={result} tm={tm}
                    query={x => setResult(data.has(x) ? [data.get(x)] : undefined)} />
            </div>
            <div><Pair index='entries' value={[...data.entries()]} tm={tm} /></div>
        </>
    }}</BlockEntry>
}

export const mapEntry: Entry<Map<any, any>> = [MapRenderer, mapDescriber]