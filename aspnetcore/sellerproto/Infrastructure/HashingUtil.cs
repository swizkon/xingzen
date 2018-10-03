
// using System.Security.Cryptography;
// using System.Text;

// namespace Infra
// {
//     public static class HashingUtil
//     {
//         public static string CalculateMD5Hash(string input)
//         {
//             var md5 = MD5.Create();

//             byte[] hash = md5.ComputeHash(Encoding.ASCII.GetBytes(input));

//             var sb = new StringBuilder();

//             for (int i = 0; i < hash.Length; i++)
//             {
//                 sb.Append(hash[i].ToString("x2"));
//             }
//             return sb.ToString();
//         }
//     }
// }
