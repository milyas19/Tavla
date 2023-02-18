using AutoMapper;
using Entities;
using MediatR;
using Persistence.Repository.TidsplanRepository;

namespace Application.Query.HentAktiviteter
{
    public class HentAktiviteterQueryHandler : IRequestHandler<HentAktiviteterQuery, List<HentAktivitetDto>>
    {
        private readonly IAktivitetRepository _repo;
        private readonly IMapper _mapper;

        public HentAktiviteterQueryHandler(IAktivitetRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<List<HentAktivitetDto>> Handle(HentAktiviteterQuery query, CancellationToken cancellationToken)
        {
            var aktivitet = await _repo.HentAktiviteterAsync();
            var mappedAktiviteter = _mapper.Map<List<HentAktivitetDto>>(aktivitet);

            return mappedAktiviteter;
        }
    }

    public class HentAktiviteterQuery : IRequest<List<HentAktivitetDto>>
    {

    }
}
