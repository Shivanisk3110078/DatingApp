using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;
        public AccountController(DataContext context, ITokenService tokenService)
        {
            _tokenService = tokenService;
            _context = context;
        } 

        [HttpPost("register")] // POST: api/account/register //API Endpoint
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto) //send up this in an object In order for our API controller to bind to that object, this has to be an object and that would be one reason to use DTO so that we can get data from body of a request
        // Another reason would be if we go back to Postman and look at what we return as our AppUser, we can see that we are returning Id and username that's fine but then we've got the PasswordHash and PasswordSalt and I don't think anybody would ever suggest that returning mat data is a good idea.
        //So ofcousrse we would not want to send that back.
        //So, using a DTO allows us to create a different object and just send back the properties that we're interested in.
        // and there is other reasons that we will look at soon when it comes to relationships.
        // We are getting data from two different tables and relating them together then we can flatten that data into into a DTO object and just return that 
        {
            if(await UserExists(registerDto.Username)) //calling method and checking username that inside registerDto object
              return BadRequest("Usename is taken");

            using var hmac = new HMACSHA512(); // BY USING, using KEYWORD WHEN WE FINISH WITH HMACSHA512 CLASS THEN Disposed() METHOD IS GOING TO CALLED AND THE CLASS IS GOING TO BE REMOVED FROM MEMORY.

            var user = new AppUser  //Creating new user
            {
                UserName = registerDto.Username.ToLower(),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user)
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _context.Users.SingleOrDefaultAsync(AppUser =>
               AppUser.UserName == loginDto.Username);

            if(user == null) return Unauthorized("invalid username");

            using var hmac = new HMACSHA512(user.PasswordSalt);

            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for(int i = 0; i < computedHash.Length; i++)
            {
                if(computedHash[i] != user.PasswordHash[i]) return Unauthorized("invalid password");
            }

            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user)
            };        
        }

        private async Task<bool> UserExists(string username) 
        {
            return await _context.Users.AnyAsync(AppUser => AppUser.UserName == username.ToLower() ); //our sequence in this case is our Users table
                                                                                            //In AnyAsync() AppUser is going to refer a user in Users table
        }
    }
}