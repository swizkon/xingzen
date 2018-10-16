
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace XingZen.Domain.Services
{
    public static class IdentityService
    {
        public static string Email(ClaimsPrincipal user)
        {
            return user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value
             ?? user.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress")?.Value
             ?? user.Claims.FirstOrDefault(c => c.Type == "emails")?.Value
             ?? "user@example.com";
        }

        public static string Name(ClaimsPrincipal user)
        {
            return user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value
             ?? "Anonym köpar";
        }

        public static string UserId(ClaimsPrincipal user)
        {
            return Swizkon.Infrastructure.Utils.HashingUtil.CalculateMD5Hash(Email(user).ToLower());
        }
    }
}