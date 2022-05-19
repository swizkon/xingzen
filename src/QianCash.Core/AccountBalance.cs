namespace QianCash.Core;

public class AccountBalance
{
    public string AccountId { get; set; } = string.Empty;

    public List<Funds> Balances { get; set; } = new List<Funds>();
    
    public DateTimeOffset LastSync { get; set; }

    public string GetBalance() => "hahaha";
}