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

using Swizkon.Infrastructure.Authentication;

using Swashbuckle.AspNetCore.Swagger;
using XingZen.Domain.Repositories;
using XingZen.Domain.Repositories.Interfaces;
using XingZen.Domain.Services;
using XingZen.Domain.Model;
using XingZen.Infrastructure.Services.Generators.Interfaces;
using XingZen.Infrastructure.Services.Generators;

namespace sellerproto
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; set; }

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
                .AddEnvironmentVariables()
                .AddCommandLine(new string[]{
                       "--Azure:StorageConnectionString", "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;"
                   });

            if (env.IsDevelopment())
            {
                builder.AddCommandLine(new string[]{
                       "--Azure:StorageConnectionString", "DefaultEndpointsProtocol=http;"
                       + "AccountName=devstoreaccount1;"
                       + "AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;" 
                       + "BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;"
                       + "QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;"
                       + "TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;"
                   });
            }

            Configuration = builder.Build();

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Fake API V1");
            });

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

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info { Title = "Fake API", Version = "v1" });
            });

            services.AddDistributedMemoryCache();
            services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromHours(1);
                options.Cookie.HttpOnly = true;
            });

            services.AddSingleton<IGenerator, PincodeGenerator>();

            services.AddSingleton<IRepository<Store>, StoreRepository>();

            services.AddSingleton<IRepository<PurchaseOrder>, PurchaseOrderRepository>();
            
            services.AddSingleton<IRepository<Deposit>, DepositRepository>();

            services.AddScoped<IStoreService, StoreService>();

            services.AddLogging();
        }
    }
}
