using System.Collections.Generic;
using System.Security.Claims;
using XingZen.Domain.Model;

namespace XingZen.Domain.Services
{
    public interface IStoreService
    {
        Store CreateStore(string name, ClaimsPrincipal owner);

        IList<Store> StoresByUser(ClaimsPrincipal owner);
    }
}