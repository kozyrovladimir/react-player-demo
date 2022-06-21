import React from 'react'

type DurationPropsType = {
    seconds: number
}

export default function Duration ({seconds}: DurationPropsType) {
    return (
        <time dateTime={`P${Math.round(seconds)}S`}>
            {format(seconds)}
        </time>
    )
}

export function format (seconds: number) {
    const date = new Date(seconds * 1000)
    const hh = date.getUTCHours()
    const mm = date.getUTCMinutes()
    const ss = pad(date.getUTCSeconds().toString())
    if (hh) {
        return `${hh}:${pad(mm.toString())}:${ss}`
    }
    return `${mm}:${ss}`
}

function pad (string: string) {
    return ('0' + string).slice(-2)
}
