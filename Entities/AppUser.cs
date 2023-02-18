using Microsoft.AspNetCore.Identity;

namespace Entities;
public class AppUser : IdentityUser
{
    public string DisplayName { get; set; }
    public string Bio { get; set; }
}