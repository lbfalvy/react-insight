import React from "react";
import ReactDOM from "react-dom";
import { Render } from "./Render";
import { openCtx } from "./renderers/utils";

const root = document.createElement('div')
document.body.appendChild(root)

class Player {
    readonly type = 'player'
    friends: Player[] = []
    constructor(readonly roles: string[]) {}
}

class MyIterable implements AsyncIterable<number> {
    last = 0;
    [Symbol.asyncIterator]() {
        const itble = this
        return {
            async next() {
                await new Promise(res => setTimeout(res, 1000))
                return {
                    done: 24 <= itble.last,
                    value: itble.last++
                }
            }
        }
    }
}

const asyncIterable = new MyIterable()

function doom() { throw new Error('Something broke') }
function rancid() { doom() }
function getError() {
    try { rancid() } catch(ex) { return ex }
}

const pilot = new Player(['pilot'])
const captain = new Player(['captain'])
pilot.friends.push(captain)
captain.friends.push(pilot)

const map = new Map<any, any>()
map.set('Ronald', 12)
map.set('Peter', 43)
map.set('REEEE', Infinity)
map.set(captain, 'red')

const fibset = new Set<number>([1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144])

function Main(): React.ReactElement {
    return <openCtx.Provider value={false}>
        <div><Render data={undefined} /></div>
        <div><Render data={null} /></div>
        <div><Render data={0.123456789} /></div>
        <div><Render data={123456789123456789n} /></div>
        <div><Render data={new Date()} /></div>
        <div><Render data={true} /></div>
        <div><Render data={"It is proven that there cannot exist an algorithm that proves everything provable, so no matter how good our computers become we will never run out of riddles."} /></div>
        <div><Render data={Symbol('Intrinsically unique, a Symbol can identify a unit of code.')} /></div>
        <div><Render data={function foo(a: any, b: any, c: any) {}} /></div>
        <div><Render data={[(a: any, b: any, c: any) => {}][0]} /></div>
        <div><Render data={new Array(10000).fill(1).map(() => Math.random())} /></div>
        <div><Render data={new Player(['impostor', 'pilot'])} /></div>
        <div><Render data={Promise.resolve('Delivered, as promised')} /></div>
        <div><Render data={Promise.reject(new Error('Something broke'))} /></div>
        <div><Render data={new Promise(() => {})} /></div>
        <div><Render data={getError()} /></div>
        <div><Render data={map} /></div>
        <div><Render data={captain} /></div>
        <div><Render data={pilot} /></div>
        <div><Render data={asyncIterable} /></div>
        <div><Render data={fibset} /></div>
    </openCtx.Provider>
}
ReactDOM.render(<Main />, root)