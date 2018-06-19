using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hubs;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using sellerproto.Infrastructure;

namespace sellerproto
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; set; }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();

            /*
            if (env.IsDevelopment())
            {
                builder.SetBasePath(env.ContentRootPath)
                        .AddJsonFile("appsettings.json", optional: true)
                        .AddJsonFile("appsettings.local.json", optional: true)
                        .AddJsonFile("appsettings.Development.json", optional: true)
                        .AddEnvironmentVariables();
            }
            Configuration = builder.Build();
            */

            app.UseStaticFiles()
                .UseSession()
                .UseAuthentication()
                .UseSignalR(routes =>
                {
                    routes.MapHub<TransactionHub>("/transactionHub");
                })
                .UseMvc(routes =>
                {
                    routes.MapRoute(
                        name: "default",
                        template: "{controller=Home}/{action=Index}/{id?}");
                });
        }


        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            Console.WriteLine("ConfigureServices(IServiceCollection services)");

            services.AddAuthentication(sharedOptions =>
            {
                sharedOptions.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                sharedOptions.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
            })
            .AddAzureAdB2C(options => Configuration.Bind("Authentication:AzureAdB2C", options))
            .AddCookie();

            services.AddMvc();
            services.AddSignalR();

            services.AddDistributedMemoryCache();
            services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromHours(1);
                options.Cookie.HttpOnly = true;
            });

            services.AddLogging();
        }
    }
}
