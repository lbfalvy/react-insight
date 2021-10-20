import { when } from "@lbfalvy/when"
import React from "react"
import { act, create } from "react-test-renderer"
import { typemap } from "../../src/defaults"
import { Render } from "../../src/Render"
import { describe as getDescription } from '../../src/resolve'

describe('promise renderer', () => {
    test('description', () => {
        const p = Promise.resolve('foo')
        expect(getDescription(p, typemap)).toBe('Promise')
    })
    test('resolved', () => {
        const [promise, resolve] = when('sync')
        const component = create(<Render data={promise} />)
        act(() => resolve('Test string'))
        expect(component.toJSON()).toMatchSnapshot()
    })
    test('rejected', () => {
        const [promise, _, reject] = when('sync')
        const component = create(<Render data={promise} />)
        act(() => reject(new Error('something broke')))
        expect(component.toJSON()).toMatchSnapshot()
    })
})