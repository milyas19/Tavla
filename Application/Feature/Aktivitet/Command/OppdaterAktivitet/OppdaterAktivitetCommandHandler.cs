using MediatR;
using Persistence.Repository.TidsplanRepository;

namespace Application.Command.OppdaterAktivitet;

public class OppdaterAktivitetCommandHandler(IAktivitetRepository repo)
    : IRequestHandler<OppdaterAktivitetCommand, OppdaterAktivitetDto>
{
    public async Task<OppdaterAktivitetDto> Handle(OppdaterAktivitetCommand request, CancellationToken cancellationToken)
    {
        var dto = request.Dto;
        var aktivitet = await repo.HentAktivitetByIdAsync(dto.Id)
            ?? throw new KeyNotFoundException($"Aktivitet med Id {dto.Id} ble ikke funnet.");

        (aktivitet.Dato, aktivitet.EndDato, aktivitet.PersonId, aktivitet.VaktId, aktivitet.Beskrivelse) =
            (dto.Dato, dto.EndDato, dto.PersonId, dto.VaktId, dto.Beskrivelse);

        await repo.OppdaterAktivitetAsync(aktivitet);

        return new OppdaterAktivitetDto
        {
            Id = aktivitet.Id,
            Dato = aktivitet.Dato,
            EndDato = aktivitet.EndDato,
            PersonId = aktivitet.PersonId,
            VaktId = aktivitet.VaktId,
            Beskrivelse = aktivitet.Beskrivelse
        };
    }
}

public record OppdaterAktivitetCommand(OppdaterAktivitetDto Dto) : IRequest<OppdaterAktivitetDto>;   
