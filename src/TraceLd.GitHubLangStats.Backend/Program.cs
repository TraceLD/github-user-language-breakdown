using System;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Octokit;

namespace TraceLd.GitHubLangStats.Backend
{
    public class Program
    {
        private const string AppName = "github-user-language-breakdown";
        
        public static void Main()
        {
            var host = new HostBuilder()
                .ConfigureFunctionsWorkerDefaults()
                .ConfigureAppConfiguration(builder =>
                {
                    builder.AddEnvironmentVariables(prefix: "GITHUB_");
                })
                .ConfigureServices((context, services) =>
                {
                    services.AddScoped<IGitHubClient, GitHubClient>(_ =>
                    {
                        var token = context.Configuration.GetSection("API_KEY").Value;
                        
                        if (token is null)
                        {
                            throw new NullReferenceException(nameof(token));
                        } 
                        
                        var c = new GitHubClient(new ProductHeaderValue(AppName));
                        var tokenAuth = new Credentials(token, AuthenticationType.Bearer);
                        c.Credentials = tokenAuth;

                        return c;
                    });
                    services.AddLogging();
                    services.AddMediatR(typeof(Program));
                })
                .Build();

            host.Run();
        }
    }
}