import { FUNC_API_BASE_URL } from '../../config';
import { ApiResult } from '../apiResult';

/**
 * Combines a URL with the base URL of the backend API set in config.ts.
 *
 * @param url URL to combine.
 * @returns Combined URL.
 */
function combineUrls(url: string): string {
    return `${FUNC_API_BASE_URL}/${url}`;
}

/**
 * Sends a GET request to the backend API on the behalf of
 * the currently logged in user.
 *
 * @param url GET endpoint's URL.
 * @returns GET response's body mapped to a TS model.
 * @throws @see NonOkResponseError if the server responds with a non-OK response.
 */
export async function get<T>(url: string): Promise<ApiResult<T>> {
    const res: Response = await fetch(combineUrls(url), {
        method: 'GET',
    });

    if (!res.ok) {
        return ApiResult.fromError<T>(res.status);
    }

    const resObj: T = await res.json();
    return ApiResult.fromSuccess<T>(resObj);
}
