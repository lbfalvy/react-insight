import React from "react"
import { create } from "react-test-renderer"
import { typemap } from "../../src/defaults"
import { Render } from "../../src/Render"
import { describe as getDescription } from '../../src/resolve'

describe('function renderer', () => {
    test('named', () => {
        const tpl = function foo(a: any, b: any, c: any) {}
        const component = create(<Render data={tpl} />)
        expect(component.toJSON()).toMatchSnapshot()
        expect(getDescription(tpl, typemap)).toEqual('function foo(arg0, arg1, arg2) {…}')
    })

    test('anonymous', () => {
        const anon = [(a: any, b: any, c: any) => {}][0]
        const component = create(<Render data={anon} />)
        expect(component.toJSON()).toMatchSnapshot()
    })
})