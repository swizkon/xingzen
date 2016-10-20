using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace WebAPIApplication.Controllers
{
    [Route("api/server")]
    public class ServerInfoController : Controller
    {
        // GET api/values
        [HttpGet, Route("environment")]
        public IDictionary<string, object> EnvironmentInfo()
        {
            IDictionary<string, object> envInfo = new Dictionary<string, object>();
            envInfo["DateTimeOffset"] = System.DateTimeOffset.Now;
            envInfo["MachineName"] = System.Environment.MachineName;
            envInfo["ProcessorCount"] = System.Environment.ProcessorCount;
            envInfo["CommandLineArgs"] = System.Environment.GetCommandLineArgs();
            
            return envInfo;
        }

        // GET api/values/5
        [HttpGet, Route("single/{id}")]
        public string Get(string id)
        {
            return "transaction id: " + id;
        }
        
    }
}
