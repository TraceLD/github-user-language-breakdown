using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Octokit;

namespace TraceLd.GitHubLangStats.Backend.Queries
{
    public class GetGitHubLangsStats
    {
        public record Query(string Name, bool IsOrg) : IRequest<Result>;

        public record Result(string Name, Dictionary<string, long> Languages);
        
        public class Handler : IRequestHandler<Query, Result>
        {
            private readonly IGitHubClient _client;

            public Handler(IGitHubClient client)
            {
                _client = client;
            }

            public async Task<Result> Handle(Query request, CancellationToken cancellationToken)
            {
                var (name, isOrg) = request;
                var options = new ApiOptions
                {
                    PageCount = 1,
                    PageSize = 100
                };
                var repoIds = !isOrg
                    ? (await _client.Repository.GetAllForUser(name, options)).Where(r => r.Fork == false).Select(r => r.Id)
                    : (await _client.Repository.GetAllForOrg(name, options)).Where(r => r.Fork == false).Select(r => r.Id);
                var languages = new Dictionary<string, long>();

                foreach (var repoId in repoIds)
                {
                    var repoLangs = await _client.Repository.GetAllLanguages(repoId);

                    foreach (var repoLang in repoLangs)
                    {
                        if (!languages.ContainsKey(repoLang.Name))
                        {
                            languages[repoLang.Name] = repoLang.NumberOfBytes;
                        }
                        else
                        {
                            languages[repoLang.Name] += repoLang.NumberOfBytes;
                        }
                    }
                }

                return new Result(name, languages);
            }
        }
    }
}