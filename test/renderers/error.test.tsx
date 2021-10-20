import React from "react"
import { act, create } from "react-test-renderer"
import { Render } from "../../src/Render"

describe('error', () => {
    // Must override the stack trace because it's unreliable.
    const predictableError = Object.assign(new Error("Something broke"), {
        stack: 'at foo (/project_path/foo.ts:2:14)\nat bar (/project_path/bar.ts:5:0'
    })
    test('closed', () => {
        const component = create(<Render data={predictableError} />)
        expect(component.toJSON()).toMatchSnapshot()
    })
    test('open', () => {
        const component = create(<Render data={predictableError} />)
        act(() => component.root.findByProps({ className: 'dt-error' }).props.onClick())
        expect(component.toJSON()).toMatchSnapshot()
    })
})