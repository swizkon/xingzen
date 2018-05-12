using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Hubs
{
    public class TransactionHub : Hub
    {
        public Task Send(string message)
        {
            return Clients.All.InvokeAsync("Send", message);
        }

        public Task RegisterPurchaseOrder(string groupName, string orderId, decimal amount, string currency)
        {
            return Clients.All.InvokeAsync("PurchaseOrderRegistered", groupName, orderId, amount, currency);
        }

        public void Subscribe(string groupName)
        {
            this.Groups.AddAsync(this.Context.ConnectionId, groupName);
        }

        public Task Unsubscribe(string groupName)
        {
            return Groups.RemoveAsync(Context.ConnectionId, groupName);
        }

    }
}