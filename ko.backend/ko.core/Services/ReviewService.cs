using AutoMapper;
using ko.core.Contracts;
using ko.core.Models;
using ko.entity_framework;
using ko.entity_framework.entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using static ko.core.Exceptions.ApiException;

namespace ko.core.Services
{
    public class ReviewService : IReviewService
    {
        private readonly AppDbContext _appDbContext;
        private readonly IGenericService<Review> _genericService;
        private readonly IAppLogger<ReviewService> _logger;
        private readonly IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;

        public ReviewService(
            AppDbContext appDbContext,
            IGenericService<Review> genericService,
            IAppLogger<ReviewService> logger,
            IMapper mapper,
            UserManager<ApplicationUser> userManager)
        {
            _appDbContext = appDbContext;
            _genericService = genericService;
            _logger = logger;
            _mapper = mapper;
            _userManager = userManager;
        }

        #region CRUD

        public async Task<ReviewDto?> AddAsync(string studentId, AddReviewDto dto)
        {
            var canAdd = await onInsert(dto);
            if (!canAdd) return null;

            _logger.LogInformation("Adding review from student {0} for landlord {1}", studentId, dto.LandlordId);

            if (dto.Rating < 1 || dto.Rating > 5)
                throw new ArgumentException("Rating must be between 1 and 5");
            var property = await _appDbContext.Properties.FirstOrDefaultAsync(w => w.Id == dto.PropertyId);
            var student = await _userManager.FindByIdAsync(studentId);
            var landlord = await _userManager.FindByIdAsync(dto.LandlordId);

            var entity = _mapper.Map<Review>(dto);
            entity.StudentId = studentId;
            entity.CreatedAt = DateTime.UtcNow;

            await _appDbContext.Reviews.AddAsync(entity);
            await _appDbContext.SaveChangesAsync();

            var result = _mapper.Map<ReviewDto>(entity);
            _logger.LogInformation("Review with id {0} has been added successfully", result.Id);

            await afterInsert(dto: result);
            result.LandlordName = landlord.FullName;
            result.StudentName = student.FullName;
            result.PropertyTitle = property.Title;
            return result;
        }

        public async Task<List<ReviewDto>> GetAllAsync()
        {
            _logger.LogInformation("Retrieving all reviews from the database");

            var data = await _appDbContext.Reviews
                .Include(r => r.Student)
                .Include(r => r.Landlord)
                .Include(r => r.Property)
                .ToListAsync();

            return _mapper.Map<List<ReviewDto>>(data);
        }

        public async Task<ReviewDto?> GetByIdAsync(int? id)
        {
            _logger.LogInformation("Attempting to retrieve review with id {0}", id);

            var entity = await _appDbContext.Reviews
                .Include(r => r.Student)
                .Include(r => r.Landlord)
                .Include(r => r.Property)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (entity == null)
            {
                _logger.LogInformation("Review with id {0} was not found", id);
                throw new NotFoundException(nameof(GetByIdAsync), id);
            }

            return _mapper.Map<ReviewDto>(entity);
        }

        public async Task<List<ReviewDto>> GetByLandlordIdAsync(string landlordId)
        {
            _logger.LogInformation("Retrieving reviews for landlord {0}", landlordId);

            var data = await _appDbContext.Reviews
                .Include(r => r.Student)
                .Include(r => r.Property)
                .Where(r => r.LandlordId == landlordId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return _mapper.Map<List<ReviewDto>>(data);
        }

        public async Task<List<ReviewDto>> GetByPropertyIdAsync(int propertyId)
        {
            _logger.LogInformation("Retrieving reviews for property {0}", propertyId);

            var data = await _appDbContext.Reviews
                .Where(r => r.PropertyId == propertyId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();


            var results = _mapper.Map<List<ReviewDto>>(data);

            foreach (var item in results)
            {
                var student = await _userManager.FindByIdAsync(item.StudentId);
                var landlord = await _userManager.FindByIdAsync(item.LandlordId);

                item.StudentName = student.FullName;
                item.LandlordName = landlord.FullName;
            }

            return results;
        }

        public async Task<List<ReviewDto>> GetByStudentIdAsync(string studentId)
        {
            _logger.LogInformation("Retrieving reviews written by student {0}", studentId);

            var data = await _appDbContext.Reviews
                .Include(r => r.Landlord)
                .Include(r => r.Property)
                .Where(r => r.StudentId == studentId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return _mapper.Map<List<ReviewDto>>(data);
        }

        public async Task<double> GetAverageRatingByLandlordIdAsync(string landlordId)
        {
            _logger.LogInformation("Calculating average rating for landlord {0}", landlordId);

            var ratings = await _appDbContext.Reviews
                .Where(r => r.LandlordId == landlordId)
                .Select(r => r.Rating)
                .ToListAsync();

            return ratings.Count == 0 ? 0 : Math.Round(ratings.Average(), 2);
        }

        public async Task<bool> DeleteAsync(int? id)
        {
            _logger.LogInformation("Attempting to delete review with id {0}", id);

            var entity = await GetByIdAsync(id);
            var canDelete = await onDelete(entity);
            if (!canDelete) return false;

            await _genericService.RemoveAsync(id);
            _logger.LogInformation("Review with id {0} has been successfully removed", id);

            await afterDelete(entity);
            return true;
        }

        #endregion

        #region Events

        public Task<bool> onInsert(AddReviewDto dto) => Task.FromResult(true);
        public Task<bool> afterInsert(ReviewDto dto) => Task.FromResult(true);
        public Task<bool> onDelete(ReviewDto dto) => Task.FromResult(true);
        public Task<bool> afterDelete(ReviewDto dto) => Task.FromResult(true);

        public Task<double> GetAverageRatingAsync(string landlordId)
        {
            throw new NotImplementedException();
        }

        #endregion
    }
}