using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using XingZen.Web.Domain.Contracts;
using XingZen.Web.Domain.Models;
using XingZen.Web.Domain.Services;

namespace XingZen.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InfoController : ControllerBase
    {
        private readonly ILogger<InfoController> _logger;

        public InfoController(ILogger<InfoController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IActionResult Get()
        {
            _logger.LogInformation("User: " + HttpContext?.User?.Identity?.Name);

            var data = string.Join(", ", HttpContext?.User.Claims.Select(x => x.Type) ?? Array.Empty<string>());

            return Ok(data);
        }
    }
}
