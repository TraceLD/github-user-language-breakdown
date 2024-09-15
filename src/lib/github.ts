import ky from 'ky';

interface GitHubRepoResponse {
  stargazers_count: number;
}

export async function fetchStars(owner: string, repo: string): Promise<number> {
  const response = await ky
    .get(`https://api.github.com/repos/${owner}/${repo}`)
    .json<GitHubRepoResponse>();

  return response.stargazers_count;
}
