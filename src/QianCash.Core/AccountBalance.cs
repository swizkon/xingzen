namespace QianCash.Core;

public class AccountBalance
{
    public string AccountId { get; set; } = string.Empty;

    public List<CashAsset> Assets { get; set; } = new List<CashAsset>();
    
    public DateTimeOffset LastSync { get; set; }

    public string GetBalance() => "hahaha";
}