using System;
using System.Collections.Generic;
using System.Collections.Concurrent;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WebAPIApplication.Domain;

namespace WebAPIApplication.Controllers
{
    [Route("api/purchases")]
    public class PurchaseController : Controller
    {
        private static ConcurrentDictionary<Guid, PurchaseOrder> pendingPurchases = new ConcurrentDictionary<Guid, PurchaseOrder>(); 

        // GET api/values
        [HttpGet, Route("orders")]
        public IEnumerable<Guid> ListPurchaseOrders()
        {
            return pendingPurchases.Values.Select(g =>g.PurchaseOrderId);
        }

        // GET api/values/5
        [HttpGet, Route("details/{PurchaseOrderId}")]
        public ActionResult Get(Guid purchaseOrderId)
        {
            PurchaseOrder purchaseOrder;
            var found = pendingPurchases.TryGetValue(purchaseOrderId, out purchaseOrder);
            if(!found)
                return new NotFoundResult();

            return new JsonResult(purchaseOrder);

            //  NotFoundResult();
            // return purchaseOrder;
        }

        // POST api/values
        [HttpPost, Route("")]
        public void Post(string amount = "123456", string description = "No description")
        {
            decimal purchaseAmount;
            if(!decimal.TryParse(amount, out purchaseAmount))
            {
                throw new ArgumentException("amount");
            }

            Guid receivingAccountId = Guid.NewGuid();
            Guid purchaseOrderId = Guid.NewGuid();

            pendingPurchases.TryAdd(purchaseOrderId, new PurchaseOrder{
                 PurchaseOrderId = purchaseOrderId,
                 ReceivingAccountId = receivingAccountId,
                 Amount = purchaseAmount,
                 InitiationDate = DateTimeOffset.Now, 
                 ExpirationDate = DateTimeOffset.Now.AddSeconds(30),
                 Description = description
            });
        }

        // PUT api/values/5
        [HttpPut("{PurchaseOrderId}")]
        public ActionResult AcceptPurchaseOrder(Guid purchaseOrderId)
        {
            PurchaseOrder purchaseOrder;
            var found = pendingPurchases.TryRemove(purchaseOrderId, out purchaseOrder);

            if(!found)
                return new NotFoundResult();

            if(purchaseOrder.ExpirationDate < DateTimeOffset.Now)
                return new BadRequestResult();

            return NoContent();
            // Info on who accepted the purchase maybe should be in a header instead?
            // Like some meta data
        }

        // DELETE api/values/5
        [HttpDelete("{PurchaseOrderId}")]
        public void CancelPurchaseOrder(Guid purchaseOrderId)
        {
            PurchaseOrder purchaseOrder;
            var found = pendingPurchases.TryRemove(purchaseOrderId, out purchaseOrder);
        }
    }
}
