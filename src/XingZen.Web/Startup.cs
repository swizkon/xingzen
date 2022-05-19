using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using XingZen.Web.Configuration;
using XingZen.Web.Domain.Services;

namespace XingZen.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    options.ConfigurationManager = new ConfigurationManager<OpenIdConnectConfiguration>("https://dev-094y38d9.us.auth0.com/.well-known/openid-configuration", new OpenIdConnectConfigurationRetriever());

                    options.SaveToken = true;
                    options.MetadataAddress = "https://dev-094y38d9.us.auth0.com/.well-known/openid-configuration";

                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        RequireExpirationTime = true
                    };


                });

            // requires using Microsoft.Extensions.Options
            services.Configure<DatabaseSettings>(
                Configuration.GetSection(nameof(DatabaseSettings)));

            services.AddSingleton<IDatabaseSettings>(sp =>
                sp.GetRequiredService<IOptions<DatabaseSettings>>().Value);

            services.AddSingleton<SpinnerService>();

            services.AddSwaggerDocumentation();

            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", builder =>
                {
                    //builder.AllowAnyOrigin();
                    //builder.AllowAnyHeader();
                    //builder.AllowAnyMethod();

                    builder.AllowAnyMethod().AllowAnyHeader();
                    builder.SetIsOriginAllowed((host) => true);
                    builder.AllowCredentials();
                });
            });
            services.AddControllers();

            services.AddMvc()
                .SetCompatibilityVersion(CompatibilityVersion.Version_3_0);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();

            app.UseCors("AllowAll");

            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseRouting();

            app.UseSwaggerDocumentation();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(config =>
            {
                config.MapControllers();
                config.MapFallbackToFile("index.html").AllowAnonymous();
            });
        }
    }
}