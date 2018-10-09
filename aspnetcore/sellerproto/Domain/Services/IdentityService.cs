
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace XingZen.Domain.Services
{
    // public interface IIdentityService
    // {
    //     string Email(List<Claim> claims);
    // }


    public static class IdentityService  // : IIdentityService
    {
        public static string Email(ClaimsPrincipal user)
        {
            return user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value
             ?? user.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress")?.Value 
             ?? user.Claims.FirstOrDefault(c => c.Type == "emails")?.Value
             ?? "user@example.com";
        }
    }

}