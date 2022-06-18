using Dapr;
using Microsoft.AspNetCore.Mvc;
using QianCash.Core;

namespace QianCash.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountsController : ControllerBase
{
    const string StoreName = "statestore";

    private readonly ILogger<AccountsController> _logger;

    public AccountsController(ILogger<AccountsController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public IEnumerable<string> GetAccounts()
    {
        return new [] {"jonas2", "jenny2"};
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
        [FromRoute] KnownCurrency currency,
        [FromRoute] decimal amount)
    {
        balance.Value ??= new AccountBalance
        {
            AccountId = balance.Key,
            Assets = new List<CashAsset>()
        };

        balance.Value.Assets = balance.Value
            .Assets
            .Where(x => x.Currency != currency.ToString())
            .Append(new CashAsset
            {
                Amount = amount,
                Currency = currency.ToString()
            })
            .Where(x => x.Amount > 0)
            .OrderBy(x => x.Currency)
            .ToList();

        balance.Value.LastSync = DateTimeOffset.UtcNow;

        var ok = await balance.TrySaveAsync();
        return balance.Value;
    }
}
