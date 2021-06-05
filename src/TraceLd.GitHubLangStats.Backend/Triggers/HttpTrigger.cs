using System.Net;
using System.Threading.Tasks;
using System.Web;
using MediatR;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Octokit;
using TraceLd.GitHubLangStats.Backend.Queries;

namespace TraceLd.GitHubLangStats.Backend.Triggers
{
    public class HttpTrigger
    {
        private readonly ILogger<HttpTrigger> _logger;
        private readonly IMediator _mediator;

        public HttpTrigger(ILogger<HttpTrigger> logger, IMediator mediator)
        {
            _logger = logger;
            _mediator = mediator;
        }

        [Function("GetGitHubLangsStats")]
        public async Task<HttpResponseData> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get")]
            HttpRequestData req,
            FunctionContext executionContext)
        {
            // bind;
            var queryParams = HttpUtility.ParseQueryString(req.Url.Query);
            var githubName = queryParams["name"];
            bool.TryParse(queryParams["isOrg"], out var isOrg); // if fails will be set to default (false);
            
            if (githubName is null) return req.CreateResponse(HttpStatusCode.BadRequest);

            GetGitHubLangsStats.Result queryRes;
            try
            {
                queryRes = await _mediator.Send(new GetGitHubLangsStats.Query(githubName, isOrg));
            }
            catch(NotFoundException)
            {
                return req.CreateResponse(HttpStatusCode.NotFound);
            }
            
            var response = req.CreateResponse();
            await response.WriteAsJsonAsync(queryRes);
            return response;
        }
    }
}