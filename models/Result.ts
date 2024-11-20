export class Result {
    public code: number = 0;
    public message: string = "";
    public data?: any;
}

export class ApiResult {
    public data?: Result
    public headers?: Record<string, any>
}
