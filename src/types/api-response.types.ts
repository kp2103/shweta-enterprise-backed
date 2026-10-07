export interface ApiResponse
{
    success : boolean,
    message : string,
    [key:string] : unknown
}


export interface PgError extends Error {
    code: string;
}