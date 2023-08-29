using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.Entities;
using API.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
    public class TokenService : ITokenService
    {
        private readonly SymmetricSecurityKey _key;
        public TokenService(IConfiguration config) //in order to get our configuration and inject it into the service, we need to inject IConfiguration
        {
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));
        }
        public string CreateToken(AppUser user) //return JSON web token
        {
            var claims = new List<Claim> //claim is something, a bit of information that a user claims and in this case we are going to set our claims to UserName
            {
                new Claim(JwtRegisteredClaimNames.NameId, user.UserName)

            };

            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor//Describe the token that we are going to return
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(365),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}