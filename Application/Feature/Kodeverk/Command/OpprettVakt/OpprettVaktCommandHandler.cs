using AutoMapper;
using Entities;
using MediatR;
using Persistence.Repository.KodeverkRepository;

namespace Application.Feature.Kodeverk.Command.OpprettVakt
{
    public class HentPersonQueryHandler : IRequestHandler<OpprettVaktCommand, OpprettetVaktDto>
    {
        private readonly IKodeverkRepository _repo;
        private readonly IMapper _mapper;

        public HentPersonQueryHandler(IKodeverkRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<OpprettetVaktDto> Handle(OpprettVaktCommand request, CancellationToken cancellationToken)
        {
            var vakt = new Vakt
            {
                VaktType = request.Dto.VaktType
            };
            await _repo.OpprettVakt(vakt);

            var opprettetVakt = new OpprettetVaktDto
            {
                Id = vakt.Id,
                VaktType = vakt.VaktType
            };

            return opprettetVakt;
        }
    }

    public class OpprettVaktCommand : IRequest<OpprettetVaktDto>
    {
        public OpprettVaktDto Dto { get; set; }

        public OpprettVaktCommand(OpprettVaktDto dto)
        {
            Dto = dto;
        }
    }
}
