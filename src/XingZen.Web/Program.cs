using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

namespace XingZen.Web
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration((hostingContext, config) =>
                {
                    var env = hostingContext.HostingEnvironment;
                    config.AddYamlFile("AppSettings.yml", optional: true, reloadOnChange: true);
                    config.AddYamlFile($"AppSettings.{env.EnvironmentName}.yml", optional: true, reloadOnChange: true);
                     
                    if (env.IsDevelopment())
                        config.AddUserSecrets<Startup>();
                })
                .ConfigureWebHostDefaults(webBuilder => { webBuilder.UseStartup<Startup>(); });
    }
}