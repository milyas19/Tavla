using Entities;

namespace Persistence.Repository.TidsplanRepository
{
    public interface IAktivitetRepository
    {
        Task<Tidsplan> HentAktivitetByIdAsync(int aktivitetId);
        Task<List<Tidsplan>> HentAktiviteterAsync();
        Task<Tidsplan> OpprettAktivitetAsync(Tidsplan tidsplan);
        Task<bool> SlettAktivitetAsync(int aktivitetId);
    }
}
