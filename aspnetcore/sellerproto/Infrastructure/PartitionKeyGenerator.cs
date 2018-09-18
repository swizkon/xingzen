
using System;
using System.Security.Claims;

namespace Infra
{

    public class PartitionKeyGenerator
    {
        internal static string FromClaimsPrincipal(ClaimsPrincipal owner)
        {
            return owner.FindFirst(ClaimTypes.NameIdentifier).Value;
        }
    }
}