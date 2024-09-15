import ky from 'ky';

export type GetUserLangsResponse = {
  name: string;
  langs: Record<string, number>;
};

export type LangsChartData = Array<{ lang: string; percentage: number }>;

export async function fetchChartData(
  name: string,
  isOrg: boolean,
): Promise<LangsChartData> {
  const response = await fetchLanguageStats(name, isOrg);

  const langsEntries = Object.entries(response.langs);
  const totalBytes = langsEntries.reduce((sum, [, bytes]) => sum + bytes, 0);

  return langsEntries
    .map(([lang, bytes]) => ({
      lang,
      percentage: (bytes / totalBytes) * 100,
      fill: createCssVariable(lang),
    }))
    .sort((a, b) => b.percentage - a.percentage);
}

async function fetchLanguageStats(
  name: string,
  isOrg: boolean,
): Promise<GetUserLangsResponse> {
  const queryParams = new URLSearchParams();
  queryParams.set('name', name);
  queryParams.set('isOrg', isOrg.toString());

  const response = await ky
    .get(`/api/langs?${queryParams.toString()}`, { timeout: 3 * 60 * 1000 })
    .json<GetUserLangsResponse>();

  return response;
}

/**
 * Creates the sanitised CSS variable that will be used for colour by ReCharts.
 */
function createCssVariable(language: string): string {
  let cssVar = language.replaceAll('#', '1');
  cssVar = cssVar.replaceAll('+', '2');
  cssVar = cssVar.replaceAll("'", '3');
  cssVar = cssVar.replaceAll('-', '4');
  cssVar = cssVar.replaceAll(' ', '');

  return `var(--color-${cssVar})`;
}
