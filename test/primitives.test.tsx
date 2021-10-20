import React from "react"
import { create } from "react-test-renderer"
import { config } from "../src/defaults"
import { Render } from "../src/Render"
import { describe as getDescription } from '../src/resolve'
import { compileTypemap } from "../src/Typemap"

describe('Primitive components', () => {
    const typemap = compileTypemap(config)
    test('number', () => {
        const component = create(<Render data={1/3} />)
        expect(component.toJSON()).toMatchSnapshot()
        expect(getDescription(1 / 3, typemap, 10)).toMatchInlineSnapshot(`"0.3333333…"`)
    })
    test('bigint', () => {
        const component = create(<Render data={213476893621n} />)
        expect(component.toJSON()).toMatchSnapshot()
        expect(getDescription(213476893621n, typemap, 10)).toMatchInlineSnapshot(`"…76893621n"`)
    })
    test('boolean', () => {
        const component = create(<Render data={true} />)
        expect(component.toJSON()).toMatchSnapshot()
        expect(getDescription(true, typemap)).toEqual("true")
    })
    test('string', () => {
        const component = create(<Render data={"Test string"} />)
        expect(component.toJSON()).toMatchSnapshot()
        expect(getDescription("Test string", typemap)).toEqual('"Test string"')
    })
    test('undefined', () => {
        const component = create(<Render data={undefined} />)
        expect(component.toJSON()).toMatchSnapshot()
        expect(getDescription(undefined, typemap)).toEqual('undefined')
    })
    test('null', () => {
        const component = create(<Render data={null} />)
        expect(component.toJSON()).toMatchSnapshot()
        expect(getDescription(null, typemap)).toEqual('null')
    })
})