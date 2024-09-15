import { Star, LoaderCircleIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useQuery } from '@tanstack/react-query';
import { fetchStars } from '@/lib/github';

type GitHubRepoButtonProps = {
  owner: string;
  repo: string;
};

export function GitHubRepoButton({ owner, repo }: GitHubRepoButtonProps) {
  const { isPending, error, data } = useQuery({
    queryKey: ['repoStars', owner, repo],
    queryFn: async () => await fetchStars(owner, repo),
    staleTime: 10 * (60 * 1000),
    gcTime: 15 * (60 * 1000),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return (
    <Button asChild variant="outline" size="sm" className="h-8">
      <a
        href={`https://github.com/${owner}/${repo}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Star className="mr-1 h-4 w-4" />
        <span className="hidden sm:inline">Star on GitHub</span>

        {!error && (
          <>
            <Separator orientation="vertical" className="mx-1 h-4" />
            {isPending ? (
              <LoaderCircleIcon className="h-4 animate-spin" />
            ) : (
              <span className="text-xs">{data}</span>
            )}
          </>
        )}
      </a>
    </Button>
  );
}
