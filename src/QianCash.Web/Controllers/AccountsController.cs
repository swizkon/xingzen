using Dapr;
using Microsoft.AspNetCore.Mvc;
using QianCash.Core;

namespace QianCash.Web.Controllers;

[ApiController]
[Route("[controller]")]
public class AccountsController : ControllerBase
{
    const string StoreName = "statestore";

    private readonly ILogger<AccountsController> _logger;

    public AccountsController(ILogger<AccountsController> logger)
    {
        _logger = logger;
    }

    [HttpGet("balance/{accountNumber}")]
    public AccountBalance GetAccountBalance(
        [FromState(StoreName, "accountNumber")] StateEntry<AccountBalance> balance)
    {
        return balance.Value ?? new AccountBalance();
    }

    [HttpPut("balance/{accountNumber}/{currency}/{amount}")]
    public async Task<AccountBalance> SetBalance(
        [FromState(StoreName, "accountNumber")] StateEntry<AccountBalance> balance,
        [FromRoute] string currency,
        [FromRoute] decimal amount)
    {
        balance.Value ??= new AccountBalance
        {
            AccountId = balance.Key,
            Balances = new List<Funds>()
        };

        balance.Value.Balances = balance.Value
            .Balances
            .Where(x => x.Currency != currency)
            .Append(new Funds
            {
                Amount = amount,
                Currency = currency
            })
            .ToList();

        balance.Value.LastSync = DateTimeOffset.UtcNow;

        var ok = await balance.TrySaveAsync();
        return balance.Value;
    }
}