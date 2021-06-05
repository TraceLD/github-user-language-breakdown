import type { ApiResult } from '@core/apiResult';
import { get } from './_api';

export interface ILanguages {
    Name: string;
    Languages: Map<string, number>;
}

export async function getLanguages(
    githubName: string,
    isOrg: boolean
): Promise<ApiResult<ILanguages>> {
    return await get<ILanguages>(`getgithublangsstats?name=${githubName}&isOrg=${isOrg}`);
}
