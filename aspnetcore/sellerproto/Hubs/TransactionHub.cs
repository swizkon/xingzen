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
        
        public Task Notify(string message)
        {
            System.Diagnostics.Trace.WriteLine("Task Notify(string message)");
            return Clients.All.SendAsync("Notify", message);
        }

        public Task NotifyStoreBalance(string groupName, string amount, string currency)
        {
            // System.Diagnostics.Trace.WriteLine("Task NotifyStoreBalance(string groupName, decimal amount, string currency)");
            return Clients.Group(groupName).SendAsync("StoreBalanceAdjusted", groupName, amount, currency);
        }

        public Task RegisterPurchaseOrder(string groupName, string orderId, decimal amount, string currency)
        {
            return Clients.Group(groupName).SendAsync("PurchaseOrderRegistered", groupName, orderId, amount, currency);
        }

        public Task AcceptPurchaseOrder(string groupName, string orderId, decimal amount, string currency)
        {
            return Clients.Group(groupName).SendAsync("PurchaseOrderAccepted", groupName, orderId, amount, currency);
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