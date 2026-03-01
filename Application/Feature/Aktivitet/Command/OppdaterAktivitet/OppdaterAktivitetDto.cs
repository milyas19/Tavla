namespace Application.Command.OppdaterAktivitet;

public class OppdaterAktivitetDto
{
    public int Id { get; set; }
    public DateTime Dato { get; set; }
    public DateTime EndDato { get; set; }
    public int PersonId { get; set; }
    public int VaktId { get; set; }
    public string Beskrivelse { get; set; } = string.Empty;
}
