namespace XingZen.Configuration
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Security.Claims;
    using System.Threading.Tasks;

    using Microsoft.AspNetCore.Authentication;
    using Microsoft.AspNetCore.Authentication.Cookies;
    using Microsoft.AspNetCore.Authentication.OpenIdConnect;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc.Infrastructure;
    using Microsoft.AspNetCore.Mvc.Routing;
    using Microsoft.Extensions.Caching.Distributed;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.DependencyInjection.Extensions;


    public static class ServicesConfigurationExtensions
    {
        public static void AddSimpleCookieAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddAuthentication(
                    options =>
                    {
                        options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                        options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                        options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                    })
                    .AddCookie(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    o =>
                    {
                        o.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                        o.Cookie.SameSite = SameSiteMode.Lax;
                        o.Cookie.Name = "xingzen";
                        o.Cookie.Expiration = TimeSpan.FromMinutes(30);
                        o.SlidingExpiration = true;
                        o.ExpireTimeSpan = TimeSpan.FromMinutes(30);
                        o.LoginPath = new PathString("/session/signin");
                        o.LogoutPath = new PathString("/session/signout");
                    });
        }

        public static void AddOpenIdConnect(this IServiceCollection services, IConfiguration configuration)
        {
            var openIdConnectSettings = new OpenIdConnectSettings();

            configuration.GetSection("Authentication:OpenIdConnect").Bind(openIdConnectSettings);

            services.AddAuthentication(
                    options =>
                    {
                        options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                        options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                        options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
                    })
                    .AddCookie(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    o =>
                    {
                        o.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                        o.Cookie.SameSite = SameSiteMode.Lax;
                        o.Cookie.Name = "xingzen";
                        o.Cookie.Expiration = TimeSpan.FromMinutes(30);
                        o.SlidingExpiration = true;
                        o.ExpireTimeSpan = TimeSpan.FromMinutes(30);
                        o.LoginPath = new PathString("/oidc/login");
                        o.LogoutPath = new PathString("/oidc/logout");
                    })
                    .AddOpenIdConnect(o =>
                    {
                        o.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                        o.Authority = openIdConnectSettings.Authority;

                        o.ClientId = openIdConnectSettings.ClientId;
                        o.ClientSecret = openIdConnectSettings.ClientSecret;

                        o.TokenValidationParameters.ValidateIssuer = false;
                        
                        o.Events.OnRedirectToIdentityProvider = context =>
                        {
                            context.ProtocolMessage.Scope = "openid profile email";
                            return Task.CompletedTask;
                        };
                        
                        o.Events.OnTokenResponseReceived = OnTokenResponseReceived;
                    });
        }

        private static Task OnTokenResponseReceived(TokenResponseReceivedContext tokenResponseReceivedContext)
        {
            var tokenEndpointResponse = tokenResponseReceivedContext.TokenEndpointResponse;
            tokenResponseReceivedContext.ProtocolMessage.AccessToken = tokenEndpointResponse?.AccessToken;

            return Task.CompletedTask;
        }
    }
}