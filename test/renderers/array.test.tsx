import { subranges } from "../../src/renderers/Array"

describe('array renderer', () => {
    describe('subranges', () => {
        test('trivial case, 10k', () => {
            const arr = new Array(10_000).fill(1)
            expect(subranges(arr, [0, arr.length])).toEqual([
                [0, 1000],
                [1000, 2000],
                [2000, 3000],
                [3000, 4000],
                [4000, 5000],
                [5000, 6000],
                [6000, 7000],
                [7000, 8000],
                [8000, 9000],
                [9000, 10_000]
            ])
        })
        test('advanced case', () => {
            const arr = new Array(6775).fill(1)
            expect(subranges(arr, [0, arr.length])).toEqual([
                [0, 1000],
                [1000, 2000],
                [2000, 3000],
                [3000, 4000],
                [4000, 5000],
                [5000, 6000],
                [6000, 6775],
            ])
        })
        test('less than 100', () => {
            const arr = new Array(35).fill(1)
            function* reference() {
                for (let i = 0; i < 35; i++)
                    yield [i, i + 1]
            }
            expect(subranges(arr, [0, arr.length])).toEqual([...reference()])
        })
    })
})