import React from "react"
import { create } from "react-test-renderer"
import { typemap } from "../../src/defaults"
import { Render } from "../../src/Render"
import { describe as getDescription } from '../../src/resolve'

describe('symbol renderer', () => {
    test('symbol', () => {
        const tpl = Symbol('test symbol')
        const component = create(<Render data={tpl} />)
        expect(component.toJSON()).toMatchSnapshot()
        expect(getDescription(tpl, typemap)).toEqual('Symbol("test symbol")')
    })
})