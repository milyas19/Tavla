namespace Persistence.Repository.TidsplanRepository
{
    public interface IAktivitetRepository<T> where T : class
    {
        Task<T> HentAktivitetByIdAsync(int aktivitetId);
        Task<List<T>> HentAktiviteterAsync();
        Task<T> OpprettAktivitetAsync(T tidsplan);
        Task<bool> SlettAktivitetAsync(int aktivitetId);
    }
}
