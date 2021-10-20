const terminator = '…'

export function truncate(long: string, length: number, front = false): string {
    if (long.length <= length) return long
    if (front) return terminator + long.substring(long.length - length + terminator.length)
    return long.substring(0, length - terminator.length) + terminator
}