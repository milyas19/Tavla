using Application.Feature.Kodeverk.Query.HentNavnList;
using Application.Feature.Kodeverk.Query.HentVaktList;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class KodeverkController : ControllerBase
    {
        private readonly IMediator _mediator;

        public KodeverkController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("navnlist")]
        public async Task<IActionResult> HentNavnList()
        {
            var navnList = await _mediator.Send(new HentNavnListQuery());
            return Ok(navnList);
        }


        [HttpGet("vaktlist")]
        public async Task<IActionResult> HentVaktList()
        {
            var vaktList = await _mediator.Send(new HentVaktListQuery());
            return Ok(vaktList);
        }
    }
}
