using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Http;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Mvc;

namespace WebAPIApplication.Services
{
    [Route("api/eventstore")]
    public class EventStoreController
    {
        // GET api/values
        [HttpGet, Route("streams/{streamName}/metadata")]
        public IDictionary<string, object> StreamMetadata(string streamName)
        {
            // http://localhost:2113/streams/plans
            // http://localhost:2113/streams/plans/metadata
            IDictionary<string, object> envInfo = new Dictionary<string, object>()
            {
                {"streamName",  streamName}
            };
            
            return envInfo;
        }

        // GET api/values
        [HttpGet, Route("streams/{streamName}/events")]
        public async Task<string> StreamEvents(string streamName)
        {
            HttpResponseMessage response = new HttpResponseMessage();
            using(HttpClient client = new HttpClient())
            {
                // client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic","YWRtaW46Y2hhbmdlaXQ=");
                client.DefaultRequestHeaders.Accept.Add( new MediaTypeWithQualityHeaderValue("application/json"));
                //  = new AuthenticationHeaderValue("Basic","YWRtaW46Y2hhbmdlaXQ=");
                var res = await client.GetAsync("http://localhost:2113/streams/" + streamName + "?embed=tryharder");

                response.Content = res.Content;
            }

            return response.Content.ReadAsStringAsync().Result;
        }
    }
}
