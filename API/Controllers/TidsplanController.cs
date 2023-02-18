using Application.Command.OpprettAktivitet;
using Application.Feature.Aktivitet.Command.SlettAktivitet;
using Application.Query.HentAktivitetAvId;
using Application.Query.HentAktiviteter;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    [Authorize]
    [ApiController]
    [Route("api/[controller]")]

    public class TidsplanerController : ControllerBase
    {
        ILogger<TidsplanerController> _logger;
        private readonly IMediator _mediator;

        public TidsplanerController(ILogger<TidsplanerController> logger, IMediator mediator)
        {
            _mediator = mediator;
            _logger = logger;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> HentAktivitetAvId(int id)
        {
            var aktiviteter = await _mediator.Send(new HentAktivitetQuery(id));
            if (aktiviteter != null)
            {
                return Ok(aktiviteter);
            }

            return NotFound("No aktivitet in database. Please add an aktivitet first.");
        }

        [HttpGet]
        public async Task<IActionResult> HentAktiviteter()
        {
            var aktiviteter = await _mediator.Send(new HentAktiviteterQuery());
            if (aktiviteter != null)
            {
                return Ok(aktiviteter);
            }

            return NotFound("No aktiviteter in database. Please add an aktivitet first.");

        }

        [HttpPost]
        public async Task<IActionResult> OpprettAktivitet([FromBody] OpprettAktivitetDto opprettAktivitetDto)
        {
            var aktivitet = await _mediator.Send(new OpprettAktivitetCommand(opprettAktivitetDto));
            if (aktivitet == null)
            {
                return BadRequest("Data is not valid");
            }
            return Ok(aktivitet);
        }

        [HttpDelete("{aktivitetId}")]
        public async Task<ActionResult<bool>> SlettAktivitet(int aktivitetId)
        {
            var response = await _mediator.Send(new SlettAktivitetCommand(aktivitetId));
            if (response != null)
                return Ok(true);
            return BadRequest("Record not found in database");
        }
    }
}
