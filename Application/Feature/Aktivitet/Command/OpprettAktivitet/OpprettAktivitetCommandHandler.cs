using Entities;
using MediatR;
using Persistence.Repository.TidsplanRepository;

namespace Application.Command.OpprettAktivitet
{ 
    public class OpprettAktivitetCommandHandler : IRequestHandler<OpprettAktivitetCommand, OpprettetAktivitetDto>
    {
        private readonly IAktivitetRepository<Tidsplan> _repo;

        public OpprettAktivitetCommandHandler(IAktivitetRepository<Tidsplan> repo)
        {
            _repo = repo ?? throw new ArgumentNullException(nameof(repo));
        }

        public async Task<OpprettetAktivitetDto> Handle(OpprettAktivitetCommand request, CancellationToken cancellationToken)
        {
            var aktivitet = new Tidsplan
            {
                Dato = request.Dto.Dato,
                EndDato = request.Dto.EndDato,
                PersonId = request.Dto.PersonId, 
                VaktId = request.Dto.VaktId,
                Beskrivelse = request.Dto.Beskrivelse
            };

            await _repo.OpprettAktivitetAsync(aktivitet);

            var opprettetAktivitetDto = new OpprettetAktivitetDto
            {
                Id = aktivitet.Id,
                Dato = aktivitet.Dato,
                EndDato= aktivitet.EndDato,
                VaktId = aktivitet.VaktId,
                PersonId = aktivitet.PersonId,
                Beskrivelse = aktivitet.Beskrivelse
            };
            return opprettetAktivitetDto;
        }
    }

    public class OpprettAktivitetCommand : IRequest<OpprettetAktivitetDto>
    {
        public OpprettAktivitetDto Dto { get; set; }
        public OpprettAktivitetCommand(OpprettAktivitetDto dto)
        {
            Dto = dto;
        }
    }
}
