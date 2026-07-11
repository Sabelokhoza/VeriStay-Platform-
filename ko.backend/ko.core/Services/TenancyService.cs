using AutoMapper;
using ko.core.Contracts;
using ko.core.Models;
using ko.entity_framework;
using ko.entity_framework.entities;
using Microsoft.EntityFrameworkCore;
using static ko.core.Exceptions.ApiException;

namespace ko.core.Services
{
    public class TenancyService : ITenancyService
    {
        private readonly AppDbContext _appDbContext;
        private readonly IGenericService<Tenancy> _genericService;
        private readonly IAppLogger<TenancyService> _logger;
        private readonly IMapper _mapper;

        public TenancyService(
            AppDbContext appDbContext,
            IGenericService<Tenancy> genericService,
            IAppLogger<TenancyService> logger,
            IMapper mapper)
        {
            _appDbContext = appDbContext;
            _genericService = genericService;
            _logger = logger;
            _mapper = mapper;
        }

        #region CRUD

        public async Task<TenancyDto?> AddAsync(AddTenancyDto dto)
        {
            var canAdd = await onInsert(dto);
            if (!canAdd) return null;

            _logger.LogInformation("Adding tenancy to the database");

            var entity = _mapper.Map<Tenancy>(dto);
            entity.Status = TenancyStatus.Active;
            entity.DateCreated = DateTime.UtcNow;

            await _appDbContext.Tenancies.AddAsync(entity);
            await _appDbContext.SaveChangesAsync();

            var result = _mapper.Map<TenancyDto>(entity);
            _logger.LogInformation("Tenancy with id {0} has been added successfully", result.Id);

            await afterInsert(result);
            return result;
        }

        public async Task<List<TenancyDto>> GetAllAsync()
        {
            _logger.LogInformation("Retrieving all tenancies from the database");

            var data = await _appDbContext.Tenancies
                .Include(t => t.Student)
                .Include(t => t.Property)
                .ToListAsync();

            return _mapper.Map<List<TenancyDto>>(data);
        }

        public async Task<TenancyDto?> GetByIdAsync(int? id)
        {
            _logger.LogInformation("Attempting to retrieve tenancy with id {0}", id);

            var entity = await _appDbContext.Tenancies
                .Include(t => t.Student)
                .Include(t => t.Property)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (entity == null)
            {
                _logger.LogInformation("Tenancy with id {0} was not found", id);
                throw new NotFoundException(nameof(GetByIdAsync), id);
            }

            return _mapper.Map<TenancyDto>(entity);
        }

        public async Task<List<TenancyDto>> GetByStudentIdAsync(string studentId)
        {
            _logger.LogInformation("Retrieving tenancies for student {0}", studentId);

            var data = await _appDbContext.Tenancies
                .Include(t => t.Property)
                .Where(t => t.StudentId == studentId)
                .ToListAsync();

            return _mapper.Map<List<TenancyDto>>(data);
        }

        public async Task<List<TenancyDto>> GetByPropertyIdAsync(int propertyId)
        {
            _logger.LogInformation("Retrieving tenancies for property {0}", propertyId);

            var data = await _appDbContext.Tenancies
                .Include(t => t.Student)
                .Where(t => t.PropertyId == propertyId)
                .ToListAsync();

            return _mapper.Map<List<TenancyDto>>(data);
        }

        public async Task<bool> DeleteAsync(int? id)
        {
            _logger.LogInformation("Attempting to delete tenancy with id {0}", id);

            var entity = await GetByIdAsync(id);
            var canDelete = await onDelete(entity);
            if (!canDelete) return false;

            await _genericService.RemoveAsync(id);
            _logger.LogInformation("Tenancy with id {0} has been successfully removed", id);

            await afterDelete(entity);
            return true;
        }

        public async Task<bool> UpdateAsync(int id, TenancyDto dto)
        {
            _logger.LogInformation("Attempting to update tenancy with id {0}", id);

            if (id != dto.Id) return false;

            var entity = await _appDbContext.Tenancies.FindAsync(id);
            if (entity == null) throw new NotFoundException(nameof(UpdateAsync), id);

            try
            {
                var canUpdate = await onUpdate(dto);
                if (!canUpdate) return false;

                _mapper.Map(dto, entity);
                await _appDbContext.SaveChangesAsync();

                _logger.LogInformation("Tenancy with id {0} has been successfully updated", id);
                await afterUpdate(dto);
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (await _appDbContext.Tenancies.FindAsync(id) == null) return false;
                else throw;
            }
        }

        public async Task<bool> EndTenancyAsync(int id)
        {
            _logger.LogInformation("Ending tenancy with id {0}", id);

            var entity = await _appDbContext.Tenancies.FindAsync(id);
            if (entity == null) throw new NotFoundException(nameof(EndTenancyAsync), id);

            entity.Status = TenancyStatus.Ended;
            //entity.EndDate = DateTime.UtcNow;

            var property = await _appDbContext.Properties.FindAsync(entity.PropertyId);
            if (property != null)
            {
                property.IsAvailable = true;
            }

            await _appDbContext.SaveChangesAsync();

            _logger.LogInformation("Tenancy with id {0} has been ended", id);
            return true;
        }

        #endregion

        #region Events

        public Task<bool> onInsert(AddTenancyDto dto) => Task.FromResult(true);
        public Task<bool> afterInsert(TenancyDto dto) => Task.FromResult(true);
        public Task<bool> onUpdate(TenancyDto dto) => Task.FromResult(true);
        public Task<bool> afterUpdate(TenancyDto dto) => Task.FromResult(true);
        public Task<bool> onDelete(TenancyDto dto) => Task.FromResult(true);
        public Task<bool> afterDelete(TenancyDto dto) => Task.FromResult(true);

        #endregion
    }
}