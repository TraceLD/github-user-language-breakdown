/**
 * Represents the result of an API call.
 */
export class ApiResult<T> {
    private _entity?: T | undefined | null;
    private _errorCode?: number | undefined;

    /**
     * Creates a new @see ApiResult<T> from a sucessful response.
     *
     * @param entity Result's body.
     * @returns Result of the API call created from a successful response.
     */
    static fromSuccess<T>(entity: T): ApiResult<T> {
        const res = new ApiResult<T>();
        res._entity = entity;
        return res;
    }

    /**
     * Creates a new @see ApiResult<T> from an unsuccesful response.
     *
     * @param errorCode HTTP Error Code.
     * @returns Result of the API call created from an unsuccesful response.
     */
    static fromError<T>(errorCode: number): ApiResult<T> {
        const res = new ApiResult<T>();
        res._errorCode = errorCode;
        return res;
    }

    /**
     * Instantiates a new instance of @see ApiResult<T> .
     */
    private constructor() {}

    /**
     * Get the entity contained within the @see ApiResult<T> .
     *
     * Undefined if there was an error.
     */
    get entity(): T | undefined | null {
        return this._entity;
    }

    /**
     * Get whether there was an API error.
     */
    get isError(): boolean {
        return this._errorCode === undefined;
    }

    /**
     * Get the error code. Undefined if the request was successful.
     */
    get errorCode(): number | undefined {
        return this._errorCode;
    }
}