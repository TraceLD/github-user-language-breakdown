import type { ILanguages } from '@services/languages/[githubName].json';

export function getLanguagesChart(languagesData: ILanguages): void {
    const langs: { [x: string]: number } = languagesData.Languages;
    const langNames: string[] = Object.keys(langs);
    const langBytes: number[] = Object.values(langs);
    const totalBytes: number = langBytes.reduce((a: number, b: number) => a + b, 0);
    const langPercentages: number[] = langBytes.map((n: number) => (n / totalBytes) * 100);

    console.log(langNames);
    console.log(langPercentages);
}
