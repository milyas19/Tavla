using Entities;
using MediatR;
using Persistence.Repository.TidsplanRepository;

namespace Application.Feature.Aktivitet.Command.SlettAktivitet
{
    public class SlettAktivitetCommandHandler : IRequestHandler<SlettAktivitetCommand, SlettAktivitetDto>
    {
        private readonly IAktivitetRepository _repo;

        public SlettAktivitetCommandHandler(IAktivitetRepository repo)
        {
            _repo = repo;
        }
        public async Task<SlettAktivitetDto> Handle(SlettAktivitetCommand request, CancellationToken cancellationToken)
        {
            var aktivitetToBeDeleted = await _repo.HentAktivitetByIdAsync(request.AktivitetId);
            if (aktivitetToBeDeleted == null)
            {
                throw new Exception("Record not found in database");
            }
            var isDeleted = await _repo.SlettAktivitetAsync(request.AktivitetId);

            return new SlettAktivitetDto { IsDeleted = isDeleted };
        }
    }

    public class SlettAktivitetCommand : IRequest<SlettAktivitetDto>
    {
        public int AktivitetId { get; }

        public SlettAktivitetCommand(int aktivitetId)
        {
            AktivitetId = aktivitetId;
        }

    }
}
