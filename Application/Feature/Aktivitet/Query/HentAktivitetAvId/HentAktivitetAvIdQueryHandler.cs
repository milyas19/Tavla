using AutoMapper;
using Entities;
using MediatR;
using Persistence.Repository.TidsplanRepository;

namespace Application.Query.HentAktivitetAvId
{ 
    public class HentAktivitetAvIdQueryHandler : IRequestHandler<HentAktivitetQuery, HentAktivitetDto>
    {
        private readonly IAktivitetRepository<Tidsplan> _repo;

        public HentAktivitetAvIdQueryHandler(IAktivitetRepository<Tidsplan> repo)
        {
            _repo = repo;
        }

        public async Task<HentAktivitetDto> Handle(HentAktivitetQuery query, CancellationToken cancellationToken)
        {
            var aktivitet = await _repo.HentAktivitetByIdAsync(query.Id);
            var mappedAktiviteter = new HentAktivitetDto
            {
                Id = aktivitet.Id,
                PersonId = aktivitet.PersonId,
                VaktId = aktivitet.VaktId,
                Dato = aktivitet.Dato,
                EndDato = aktivitet.EndDato,
                Beskrivelse = aktivitet.Beskrivelse
            };

            return mappedAktiviteter;
        }
    }

    public class HentAktivitetQuery : IRequest<HentAktivitetDto>
    {
        public int Id { get; }

        public HentAktivitetQuery(int id)
        {
            Id = id;
        }
    }
}
