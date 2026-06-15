using AutoMapper;
using AutoMapper.QueryableExtensions;
using ko.core.Contracts;
using ko.core.Models;
using ko.entity_framework;
using ko.entity_framework.entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using static ko.core.Exceptions.ApiException;

namespace ko.core.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IAppLogger<UserService> _logger;
        private readonly IMapper _mapper;
        private readonly AppDbContext _appDbContext;
        private readonly IStorageFileService _storageFileService;
        private readonly IServiceProvider _serviceProvider;

        public UserService(UserManager<ApplicationUser> userManager, IAppLogger<UserService> logger, IMapper mapper, AppDbContext identityDbContext, IServiceProvider serviceProvider)
        {
            _userManager = userManager;
            _logger = logger;
            _mapper = mapper;
            _appDbContext = identityDbContext;
            _serviceProvider = serviceProvider;
        }
        public async Task<ProfileDto> GetUser(string userId)
        {
            _logger.LogInformation("Fetching user with ID: {UserId}", userId);

            var user = await _appDbContext.Users.Where(w => w.Id == userId)
                .AsNoTracking()
                .ProjectTo<ProfileDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();

            if (user == null)
            {
                _logger.LogWarning("User with ID {UserId} not found.", userId);
                throw new NotFoundException("User with ID {UserId} not found.", userId);
            }
            else
            {
                _logger.LogInformation("User with ID {UserId} retrieved successfully.", userId);
            }

            return user;
        }
    }
}
