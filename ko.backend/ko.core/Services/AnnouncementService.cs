using AutoMapper;
using ko.core.Contracts;
using ko.core.Models;
using ko.entity_framework;
using ko.entity_framework.entities;
using Microsoft.EntityFrameworkCore;
using static ko.core.Exceptions.ApiException;

namespace ko.core.Services
{
    public class AnnouncementService : IAnnouncementService
    {
        private readonly AppDbContext _appDbContext;
        private readonly IGenericService<Announcement> _genericService;
        private readonly IAppLogger<AnnouncementService> _logger;
        private readonly IMapper _mapper;

        public AnnouncementService(
            AppDbContext appDbContext,
            IGenericService<Announcement> genericService,
            IAppLogger<AnnouncementService> logger,
            IMapper mapper)
        {
            _appDbContext = appDbContext;
            _genericService = genericService;
            _logger = logger;
            _mapper = mapper;
        }

        #region CRUD

        public async Task<AnnouncementDto?> AddAsync(string landlordId, AddAnnouncementDto dto)
        {
            var canAdd = await onInsert(dto);
            if (!canAdd) return null;

            _logger.LogInformation("Adding announcement for landlord {0} to the database", landlordId);

            var entity = _mapper.Map<Announcement>(dto);
            entity.LandlordId = landlordId;
            entity.DateCreated = DateTime.UtcNow;

            await _appDbContext.Announcements.AddAsync(entity);
            await _appDbContext.SaveChangesAsync();

            var result = _mapper.Map<AnnouncementDto>(entity);
            _logger.LogInformation("Announcement with id {0} has been added successfully", result.Id);

            await afterInsert(result);
            return result;
        }

        public async Task<List<AnnouncementDto>> GetAllAsync()
        {
            _logger.LogInformation("Retrieving all announcements from the database");

            var data = await _appDbContext.Announcements
                .Include(a => a.Landlord)
                .Include(a => a.Property)
                .ToListAsync();

            return _mapper.Map<List<AnnouncementDto>>(data);
        }

        public async Task<AnnouncementDto?> GetByIdAsync(int? id)
        {
            _logger.LogInformation("Attempting to retrieve announcement with id {0}", id);

            var entity = await _appDbContext.Announcements
                .Include(a => a.Landlord)
                .Include(a => a.Property)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (entity == null)
            {
                _logger.LogInformation("Announcement with id {0} was not found", id);
                throw new NotFoundException(nameof(GetByIdAsync), id);
            }

            return _mapper.Map<AnnouncementDto>(entity);
        }

        public async Task<List<AnnouncementDto>> GetByPropertyIdAsync(int propertyId)
        {
            _logger.LogInformation("Retrieving announcements for property {0}", propertyId);

            var data = await _appDbContext.Announcements
                .Include(a => a.Landlord)
                .Where(a => a.PropertyId == propertyId)
                .OrderByDescending(a => a.DateCreated)
                .ToListAsync();

            return _mapper.Map<List<AnnouncementDto>>(data);
        }

        public async Task<bool> DeleteAsync(int? id)
        {
            _logger.LogInformation("Attempting to delete announcement with id {0}", id);

            var entity = await GetByIdAsync(id);
            var canDelete = await onDelete(entity);
            if (!canDelete) return false;

            await _genericService.RemoveAsync(id);
            _logger.LogInformation("Announcement with id {0} has been successfully removed", id);

            await afterDelete(entity);
            return true;
        }

        public async Task<bool> UpdateAsync(int id, AnnouncementDto dto)
        {
            _logger.LogInformation("Attempting to update announcement with id {0}", id);

            if (id != dto.Id) return false;

            var entity = await _appDbContext.Announcements.FindAsync(id);
            if (entity == null) throw new NotFoundException(nameof(UpdateAsync), id);

            try
            {
                var canUpdate = await onUpdate(dto);
                if (!canUpdate) return false;

                _mapper.Map(dto, entity);
                await _appDbContext.SaveChangesAsync();

                _logger.LogInformation("Announcement with id {0} has been successfully updated", id);
                await afterUpdate(dto);
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (await _appDbContext.Announcements.FindAsync(id) == null) return false;
                else throw;
            }
        }

        #endregion

        #region Events

        public Task<bool> onInsert(AddAnnouncementDto dto) => Task.FromResult(true);
        public Task<bool> afterInsert(AnnouncementDto dto) => Task.FromResult(true);
        public Task<bool> onUpdate(AnnouncementDto dto) => Task.FromResult(true);
        public Task<bool> afterUpdate(AnnouncementDto dto) => Task.FromResult(true);
        public Task<bool> onDelete(AnnouncementDto dto) => Task.FromResult(true);
        public Task<bool> afterDelete(AnnouncementDto dto) => Task.FromResult(true);

        #endregion
    }


public interface INotificationService
    {
        Task SendToUserAsync(string userId, string title, string message, string type);
        Task SendToTopicAsync(string topic, string title, string message, string type);
    }
}