using AutoMapper;
using MediatR;
using Persistence.Repository.KodeverkRepository;

namespace Application.Feature.Kodeverk.Query.HentNavnList
{
    public class HentPersonQueryHandler : IRequestHandler<HentNavnListQuery, List<HentPersonDto>>
    {
        private readonly IKodeverkRepository _repo;
        private readonly IMapper _mapper;

        public HentPersonQueryHandler(IKodeverkRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<List<HentPersonDto>> Handle(HentNavnListQuery request, CancellationToken cancellationToken)
        {
            var navn = await _repo.HentNavnList();
            return _mapper.Map<List<HentPersonDto>>(navn);
          
        }
    }

    public class HentNavnListQuery : IRequest<List<HentPersonDto>>
    {
    }
}
