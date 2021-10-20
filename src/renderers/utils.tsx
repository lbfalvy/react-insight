import React from "react";
import { Typemap } from "../Typemap";
import { RenderWith } from "../resolve";
import './utils.scss';

interface NametagProps {
    name: React.ReactNode
    param?: string|number
}

export function Nametag({ name, param }: NametagProps): React.ReactElement {
    return <span className='insight__nametag'>
        {name}
        {param?
            <span className='insight__param'>({param})</span>
        :null}
    </span>
}

export function Toggle({ open }: { open: boolean }): React.ReactElement {
    return <span className='insight__toggle'>[{open ? '-' : '+'}]</span>
}

export function Description({ children }: { children: React.ReactNode }): React.ReactElement {
    return <span className='insight__description'>{children}</span>
}

export function Key({ children }: { children: React.ReactNode }): React.ReactElement {
    return <span className='insight__key'>{children}</span>
}

export function Pair({ index, value, tm }: { index: any, value: any, tm: Typemap }): React.ReactElement {
    return <span className='insight__pair'>
        <Key>
            {typeof index == 'string' ? index : <RenderWith data={index} tm={tm} />}
        </Key>
        <span className='insight__colon'>:</span>
        <RenderWith data={value} tm={tm} />
    </span>
}

interface BlockProps {
    pre?: string
    post?: string
    children: React.ReactNode
}

export function Block({ pre, post, children }: BlockProps): React.ReactElement {
    return <div className='insight__block'>
        {pre? <div className='insight__pre'>{pre}</div> :null}
        <div className='insight__contents'>
            {children}
        </div>
        {post? <div className='insight__post'>{post}</div> :null}
    </div>
}

interface BlockEntryProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
    children: {
        Title: ({ open }: { open: boolean }) => React.ReactElement
        body: () => React.ReactElement
    }
    pre?: string
    post?: string
}

export const openCtx = React.createContext(true)

export function BlockEntry({ children: { Title, body: Body }, pre, post, ...rest }: BlockEntryProps): React.ReactElement {
    const openByDefault = React.useContext(openCtx)
    const [open, toggle] = React.useReducer(b => !b, openByDefault)
    return <openCtx.Provider value={false}>
        <span onClick={e => e.stopPropagation()} {...rest}>
            <span onClick={() => toggle()}>
                <Title open={open} />
            </span>
            {open ? <Block pre={pre} post={post}>
                {Body()}
            </Block> : null}
        </span>
    </openCtx.Provider>
}