using AutoMapper;
using MediatR;
using Persistence.Repository.KodeverkRepository;

namespace Application.Feature.Kodeverk.Query.HentVaktList
{
    public class HentVaktQueryHandler : IRequestHandler<HentVaktListQuery, List<HentVaktDto>>
    {
        private readonly IKodeverkRepository _repo;
        private readonly IMapper _mapper;

        public HentVaktQueryHandler(IKodeverkRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<List<HentVaktDto>> Handle(HentVaktListQuery request, CancellationToken cancellationToken)
        {
            var vakter = await _repo.HentVaktList();
            return _mapper.Map<List<HentVaktDto>>(vakter);
        }
    }

    public class HentVaktListQuery : IRequest<List<HentVaktDto>>
    {

    }
}
