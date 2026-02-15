using Application.Feature.Kodeverk.Query.HentNavnList;
using Application.Feature.Kodeverk.Query.HentVaktList;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Application.Feature.Kodeverk.Command.OpprettVakt;

namespace API.Controllers
{
    [AllowAnonymous]
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

         [HttpPost("opprettvakt")]
        public async Task<IActionResult> OpprettVakt([FromBody] OpprettVaktDto opprettVaktDto)
        {
            var vakt = await _mediator.Send(new OpprettVaktCommand(opprettVaktDto));
            return Ok(vakt);
        }
    }
}
