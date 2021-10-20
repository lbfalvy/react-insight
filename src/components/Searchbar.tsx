import { classList } from "@lbfalvy/react-utils"
import React from "react"
import { labelCtx } from "../components/Label"
import { RenderWith } from "../resolve"
import { Typemap } from "../Typemap"
import './Searchbar.scss'

interface SearchbarProps {
    query: (q: any) => void
    result: [any]|undefined
    tm: Typemap
}

export function Searchbar({ query, result, tm }: SearchbarProps): React.ReactElement {
    const { locate } = React.useContext(labelCtx)
    const [text, setText] = React.useState('')
    const [error, setError] = React.useState(false)
    const [mode, modeSwitch] = React.useReducer(old => {
        switch (old) {
            case 'label': return 'code'
            case 'code': return 'label'
            default: return 'label'
        }
    }, 'label')
    React.useEffect(() => {
        switch (mode) {
            case 'label': query(locate(text)); return
            case 'code':
                try {
                    query(Function(`"use strict";return (${text})`)())
                    setError(false)
                } catch { setError(true) }
        }
    }, [mode, text])
    return <span className='insight__searchbar'>
        <button className='insight__button' onClick={modeSwitch}>{mode}</button>
        <input className={classList('insight__input',
            error && text.length && 'error', `insight__searchbar_${mode}`)}
            size={Math.max(text.length, 10)} value={text}
            onChange={e => setText(e.target.value)} />
        {!error && result ? <span className='insight__result'>
            <RenderWith data={result[0]} tm={tm} />
        </span> : <span className='insight__notfound'>&lt;no result&gt;</span>}
    </span>
}