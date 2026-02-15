namespace Entities;
public class Tidsplan
{
    public int Id { get; set; }
    public DateTime Dato { get; set; }
    public DateTime EndDato { get; set; }
    public Person Person { get; set; }
    public int PersonId { get; set; }
    public Vakt Vakt { get; set; }
    public int VaktId { get; set; }
    public string? Beskrivelse { get; set; }
}
