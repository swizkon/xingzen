using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Hubs
{
    public class TransactionHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            await Clients.All.SendAsync("SendAction", Context.ConnectionId, "joined");
        }

        public override async Task OnDisconnectedAsync(Exception ex)
        {
            await Clients.All.SendAsync("SendAction", Context.User.Identity.Name, "left");
        }
        
        public Task Send(string message)
        {
            return Clients.All.SendAsync("Send", message);
        }

        public Task RegisterPurchaseOrder(string groupName, string orderId, decimal amount, string currency)
        {
            return Clients.Group(groupName).SendAsync("PurchaseOrderRegistered", groupName, orderId, amount, currency);
        }

        public void Subscribe(string groupName)
        {
            this.Groups.AddToGroupAsync(this.Context.ConnectionId, groupName);
        }

        public Task Unsubscribe(string groupName)
        {
            return Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        }
    }
}