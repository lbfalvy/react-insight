import React from "react";
import { Label } from "../components/Label";
import { Entry, Typemap } from "../Typemap";
import './Error.scss';
import { BlockEntry } from "./utils";

export function errorDescriber(data: Error): string {
    return `${data.name}: ${data.message}`
}

export function ErrorRenderer({ data, tm }: { data: Error, tm: Typemap }): React.ReactElement {
    return <BlockEntry className='dt-error'>{{
        Title: () => <>
            <Label to={data} />
            <span className='error_name'>{data.name}:</span>
            <span className='error_message'>{data.message}</span>
        </>,
        body: () => <div className='error_stack'>{data.stack}</div>
    }}</BlockEntry>
}

export const errorEntry: Entry<Error> = [ErrorRenderer, errorDescriber]