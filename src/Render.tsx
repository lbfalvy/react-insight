import React from "react";
import { RenderWith } from "./resolve";
import { Typemap } from "./Typemap";
import { typemap } from './defaults';

export function Render({ data, tm }: { data: any, tm?: Typemap }): React.ReactElement {
    return <RenderWith data={data} tm={tm ?? typemap} />
}