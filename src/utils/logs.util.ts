export function logError<T>(indicator : string,data : T)
{
    console.log(`[${indicator}] : `,data)
}

export function logInfo<T>(indicator : string,data : T)
{
    console.info(`[${indicator}] ${data}`)
}