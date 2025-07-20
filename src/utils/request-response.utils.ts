export const successResponse = <T>(message:string = 'Request successful', data:T, errors:any[] | null = null) => {
    return {
        success:true,
        data,
        message,
        errors
    }
}

export const errorResponse = (statusCode:number, message:string, error:string = 'Internal server error') => {
return {
    success:false,
    statusCode,
    message,
    error
}
}