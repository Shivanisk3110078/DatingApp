using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace API.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme) //Now, in order for this service to be used, we need to add the middleware to authenticate the request.
                .AddJwtBearer(options => //This gives our server enough information to take a look at the token and validate it just based on the IssuerSigningKey which we have implemented.
                {
                options.TokenValidationParameters = new TokenValidationParameters  //specify all the rules about how our server should validate this token is a good token
                {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"])),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });

            return services;
        }
    }
}