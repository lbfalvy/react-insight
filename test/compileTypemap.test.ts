
import { resolve } from '../src/resolve'
import { compileTypemap, Entry, TypemapConfig } from "../src/Typemap"

describe('Compiles typemap configs into typemaps', () => {
    let entry: Entry<any>
    beforeEach(() => {
        entry = [jest.fn(), jest.fn()]
    })
    test('primitives', () => {
        const tmc: TypemapConfig = { typeof: {
            'number': entry
        }}
        expect(resolve(2, compileTypemap(tmc))).toEqual(entry)
    })
    test('instanceof', () => {
        const tmc: TypemapConfig = { instanceof: [
            [Array, entry]
        ]}
        expect(resolve([], compileTypemap(tmc))).toEqual(entry)
    })
    test('test', () => {
        const tmc: TypemapConfig = { test: [
            [x => x.foo == 'bar', entry]
        ]}
        expect(resolve({ foo: 'bar' }, compileTypemap(tmc))).toEqual(entry)
    })
    test('separate rows', () => {
        const f1 = jest.fn()
        const f2 = jest.fn()
        const tmc: TypemapConfig = { instanceof: [
            [Array, [f1, undefined]],
            [Array, [undefined, f2]]
        ]}
        const result = resolve([], compileTypemap(tmc))
        expect(result[0]).toBe(f1)
        expect(result[1]).toBe(f2)
    })
    test('separate classes', () => {
        const f1 = jest.fn()
        const f2 = jest.fn()
        const tmc: TypemapConfig = {
            instanceof: [[Array, [f1, undefined]]],
            test: [[x => Array.isArray(x), [undefined, f2]]]
        }
        const tm = compileTypemap(tmc)
        const result = resolve([], tm)
        expect(result[0]).toBe(f1)
        expect(result[1]).toBe(f2)
    })
})