using System.Net;
using System.Security.Claims;
using API.DTOs;
using API.Services;
using Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly TokenService _tokenService;
        public AccountController(UserManager<AppUser> userManager, TokenService tokenService)
        {
            _tokenService = tokenService;
            _userManager = userManager;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login([FromBody] LoginDto loginDto)
        {
            var user = await _userManager.Users
                .FirstOrDefaultAsync(x =>
                    x.Email == loginDto.Email || x.UserName == loginDto.Email);

            if (user == null) return Unauthorized(CreateUnauthorizedUserObject());

            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if (result)
            {
                return Ok(CreateUserObject(user));
            }

            return Unauthorized(CreateUnauthorizedUserObject());
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await _userManager.Users.AnyAsync(x => x.UserName == registerDto.Username))
            {
                ModelState.AddModelError("username", "Username is already existed");
                return ValidationProblem();
            }

            if (await _userManager.Users.AnyAsync(x => x.Email == registerDto.Email))
            {
                ModelState.AddModelError("email", "Email is associated to an existing account");
                return ValidationProblem();
            }

            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Username
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
            {
                return CreateUserObject(user);
            }

            return BadRequest(result.Errors);
        }

        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.Users
                .FirstOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));

            if (user == null) return Unauthorized(CreateUnauthorizedUserObject());

            return CreateUserObject(user);
        }

        private UserDto CreateUserObject(AppUser user) => new UserDto
        {
            DisplayName = user.DisplayName,
            Token = _tokenService.CreateToken(user),
            Username = user.UserName,
            StatusCode = (int)HttpStatusCode.OK,
            Success = true,
        };

        private UserDto CreateUnauthorizedUserObject()
        {
            return new UserDto
            {
                DisplayName = null,
                Token = null,
                Username = null,
                StatusCode = (int)HttpStatusCode.Unauthorized,
                Success = false,
            };
        }
    }
}