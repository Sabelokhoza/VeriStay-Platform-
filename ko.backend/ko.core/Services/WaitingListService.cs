using AutoMapper;
using ko.core.Contracts;
using ko.core.Models;
using ko.entity_framework;
using ko.entity_framework.entities;
using Microsoft.EntityFrameworkCore;
using static ko.core.Exceptions.ApiException;

namespace ko.core.Services
{
    public class WaitingListService : IWaitingListService
    {
        private readonly AppDbContext _appDbContext;
        private readonly IGenericService<WaitingListEntry> _genericService;
        private readonly IAppLogger<WaitingListService> _logger;
        private readonly IMapper _mapper;

        public WaitingListService(
            AppDbContext appDbContext,
            IGenericService<WaitingListEntry> genericService,
            IAppLogger<WaitingListService> logger,
            IMapper mapper)
        {
            _appDbContext = appDbContext;
            _genericService = genericService;
            _logger = logger;
            _mapper = mapper;
        }

        #region CRUD

        public async Task<WaitingListEntryDto?> AddAsync(string studentId, AddWaitingListEntryDto dto)
        {
            var canAdd = await onInsert(dto);
            if (!canAdd) return null;

            _logger.LogInformation("Adding waiting list entry for student {0} to property {1}", studentId, dto.PropertyId);

            var entity = _mapper.Map<WaitingListEntry>(dto);
            entity.StudentId = studentId;
            entity.DateCreated = DateTime.UtcNow;

            await _appDbContext.WaitingListEntries.AddAsync(entity);
            await _appDbContext.SaveChangesAsync();

            var result = _mapper.Map<WaitingListEntryDto>(entity);
            _logger.LogInformation("Waiting list entry with id {0} has been added successfully", result.Id);

            await afterInsert(result);
            return result;
        }

        public async Task<List<WaitingListEntryDto>> GetAllAsync()
        {
            _logger.LogInformation("Retrieving all waiting list entries from the database");

            var data = await _appDbContext.WaitingListEntries
                .Include(w => w.Student)
                .Include(w => w.Property)
                .ToListAsync();

            return _mapper.Map<List<WaitingListEntryDto>>(data);
        }

        public async Task<WaitingListEntryDto?> GetByIdAsync(int? id)
        {
            _logger.LogInformation("Attempting to retrieve waiting list entry with id {0}", id);

            var entity = await _appDbContext.WaitingListEntries
                .Include(w => w.Student)
                .Include(w => w.Property)
                .FirstOrDefaultAsync(w => w.Id == id);

            if (entity == null)
            {
                _logger.LogInformation("Waiting list entry with id {0} was not found", id);
                throw new NotFoundException(nameof(GetByIdAsync), id);
            }

            return _mapper.Map<WaitingListEntryDto>(entity);
        }

        public async Task<List<WaitingListEntryDto>> GetByPropertyIdAsync(int propertyId)
        {
            _logger.LogInformation("Retrieving waiting list entries for property {0}", propertyId);

            var data = await _appDbContext.WaitingListEntries
                .Include(w => w.Student)
                .Where(w => w.PropertyId == propertyId)
                .OrderBy(w => w.DateCreated)
                .ToListAsync();

            return _mapper.Map<List<WaitingListEntryDto>>(data);
        }

        public async Task<List<WaitingListEntryDto>> GetByStudentIdAsync(string studentId)
        {
            _logger.LogInformation("Retrieving waiting list entries for student {0}", studentId);

            var data = await _appDbContext.WaitingListEntries
                .Include(w => w.Property)
                .Where(w => w.StudentId == studentId)
                .ToListAsync();

            return _mapper.Map<List<WaitingListEntryDto>>(data);
        }

        public async Task<bool> DeleteAsync(int? id)
        {
            _logger.LogInformation("Attempting to delete waiting list entry with id {0}", id);

            var entity = await GetByIdAsync(id);
            var canDelete = await onDelete(entity);
            if (!canDelete) return false;

            await _genericService.RemoveAsync(id);
            _logger.LogInformation("Waiting list entry with id {0} has been successfully removed", id);

            await afterDelete(entity);
            return true;
        }

        public async Task<bool> NotifyNextAsync(int propertyId)
        {
            _logger.LogInformation("Notifying next student on waiting list for property {0}", propertyId);

            var next = await _appDbContext.WaitingListEntries
                .Where(w => w.PropertyId == propertyId)
                .OrderBy(w => w.DateCreated)
                .FirstOrDefaultAsync();

            if (next == null)
            {
                _logger.LogInformation("No pending waiting list entries found for property {0}", propertyId);
                return false;
            }


            await _appDbContext.SaveChangesAsync();

            _logger.LogInformation("Student {0} notified for property {1}", next.StudentId, propertyId);
            return true;
        }

        #endregion

        #region Events

        public Task<bool> onInsert(AddWaitingListEntryDto dto) => Task.FromResult(true);
        public Task<bool> afterInsert(WaitingListEntryDto dto) => Task.FromResult(true);
        public Task<bool> onDelete(WaitingListEntryDto dto) => Task.FromResult(true);
        public Task<bool> afterDelete(WaitingListEntryDto dto) => Task.FromResult(true);

        #endregion
    }
}