using AutoMapper;
using ko.core.Contracts;
using ko.core.Models;
using ko.entity_framework;
using ko.entity_framework.entities;
using Microsoft.EntityFrameworkCore;
using static ko.core.Exceptions.ApiException;

namespace ko.core.Services
{
    public class ApplicationService : IApplicationService
    {
        private readonly AppDbContext _appDbContext;
        private readonly IGenericService<Application> _genericService;
        private readonly IAppLogger<ApplicationService> _logger;
        private readonly IMapper _mapper;

        public ApplicationService(
            AppDbContext appDbContext,
            IGenericService<Application> genericService,
            IAppLogger<ApplicationService> logger,
            IMapper mapper)
        {
            _appDbContext = appDbContext;
            _genericService = genericService;
            _logger = logger;
            _mapper = mapper;
        }

        #region CRUD

        public async Task<ApplicationDto?> AddAsync(string studentId, AddApplicationDto dto)
        {
            var canAdd = await onInsert(dto);
            if (!canAdd) return null;

            _logger.LogInformation("Adding application for student {0} to the database", studentId);

            var entity = _mapper.Map<Application>(dto);
            entity.StudentId = studentId;
            entity.Status = ApplicationStatus.Pending;
            entity.DateCreated = DateTime.UtcNow;

            await _appDbContext.Applications.AddAsync(entity);
            await _appDbContext.SaveChangesAsync();

            var result = _mapper.Map<ApplicationDto>(entity);
            _logger.LogInformation("Application with id {0} has been added successfully", result.Id);

            await afterInsert(result);
            return result;
        }

        public async Task<List<ApplicationDto>> GetAllAsync()
        {
            _logger.LogInformation("Retrieving all applications from the database");

            var data = await _appDbContext.Applications
                .Include(a => a.Student)
                .Include(a => a.Property)
                .ToListAsync();

            return _mapper.Map<List<ApplicationDto>>(data);
        }

        public async Task<ApplicationDto?> GetByIdAsync(int? id)
        {
            _logger.LogInformation("Attempting to retrieve application with id {0}", id);

            var entity = await _appDbContext.Applications
                .Include(a => a.Student)
                .Include(a => a.Property)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (entity == null)
            {
                _logger.LogInformation("Application with id {0} was not found", id);
                throw new NotFoundException(nameof(GetByIdAsync), id);
            }

            return _mapper.Map<ApplicationDto>(entity);
        }

        public async Task<List<ApplicationDto>> GetByStudentIdAsync(string studentId)
        {
            _logger.LogInformation("Retrieving applications for student {0}", studentId);

            var data = await _appDbContext.Applications
                .Include(a => a.Property)
                .Where(a => a.StudentId == studentId)
                .ToListAsync();

            return _mapper.Map<List<ApplicationDto>>(data);
        }

        public async Task<List<ApplicationDto>> GetByPropertyIdAsync(int propertyId)
        {
            _logger.LogInformation("Retrieving applications for property {0}", propertyId);

            var data = await _appDbContext.Applications
                .Include(a => a.Student)
                .Where(a => a.PropertyId == propertyId)
                .ToListAsync();

            return _mapper.Map<List<ApplicationDto>>(data);
        }

        public async Task<bool> DeleteAsync(int? id)
        {
            _logger.LogInformation("Attempting to delete application with id {0}", id);

            var entity = await GetByIdAsync(id);
            var canDelete = await onDelete(entity);
            if (!canDelete) return false;

            await _genericService.RemoveAsync(id);
            _logger.LogInformation("Application with id {0} has been successfully removed", id);

            await afterDelete(entity);
            return true;
        }

        public async Task<bool> ReviewAsync(ReviewApplicationDto dto)
        {
            _logger.LogInformation("Reviewing application with id {0}", dto.ApplicationId);

            var entity = await _appDbContext.Applications.FindAsync(dto.ApplicationId);
            if (entity == null) throw new NotFoundException(nameof(ReviewAsync), dto.ApplicationId);

            var mapped = _mapper.Map<ApplicationDto>(entity);
            var canUpdate = await onUpdate(mapped);
            if (!canUpdate) return false;

            entity.Status = dto.Status;
            //entity.ReviewNotes = dto.ReviewNotes;
            //entity.DateReviewed = DateTime.UtcNow;

            await _appDbContext.SaveChangesAsync();

            _logger.LogInformation("Application with id {0} has been reviewed with status {1}", dto.ApplicationId, dto.Status);
            await afterUpdate(_mapper.Map<ApplicationDto>(entity));
            return true;
        }

        #endregion

        #region Events

        public Task<bool> onInsert(AddApplicationDto dto) => Task.FromResult(true);
        public Task<bool> afterInsert(ApplicationDto dto) => Task.FromResult(true);
        public Task<bool> onUpdate(ApplicationDto dto) => Task.FromResult(true);
        public Task<bool> afterUpdate(ApplicationDto dto) => Task.FromResult(true);
        public Task<bool> onDelete(ApplicationDto dto) => Task.FromResult(true);
        public Task<bool> afterDelete(ApplicationDto dto) => Task.FromResult(true);

        #endregion
    }
}