import { cn } from '@/lib/utils';
import { GitHubRepoButton } from './github_repo_button';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 px-8 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        isScrolled &&
          'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      )}
    >
      <div className="flex h-14 items-center justify-between">
        <div className="flex items-center">
          <a href="/" className="flex items-center space-x-2">
            <span className="hover:text-md text-sm font-bold transition-all duration-200 ease-in-out hover:tracking-wide sm:text-base">
              github-language-breakdown
            </span>
          </a>
        </div>
        <div className="flex items-center">
          <GitHubRepoButton
            owner="TraceLD"
            repo="github-user-language-breakdown"
          />
        </div>
      </div>
    </header>
  );
}
