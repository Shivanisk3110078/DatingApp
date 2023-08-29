using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]  //all of the endpoint inside this controller, we want to authorize every request 
    public class UsersController : BaseApiController
    {
        private readonly DataContext _context;

        public UsersController(DataContext context)
        {
            _context = context;
        }
        
        [AllowAnonymous]  // we wanted get users to be allowed for anonymous users and we could say allow anonymous for this particular request.
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
        {
            var users = await _context.Users.ToListAsync();

            return users;
        }

       // [Authorize] //In order to ensure that only Authorized users can access a specific endpoint then we can specify that we want them to Authorize to it and we could do that via an attribute
                    //Now, if a user wants to get an individual user, they wil only be allowed if they pass upto us or our API server an authentication token and in our case that going to be a JWT.  
        [HttpGet("{id}")]
        public async Task<ActionResult<AppUser>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            return user;
        }
        
    }
}


