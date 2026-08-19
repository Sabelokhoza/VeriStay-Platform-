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
        private readonly INotificationService _notificationService;

        public AnnouncementService(
            AppDbContext appDbContext,
            IGenericService<Announcement> genericService,
            IAppLogger<AnnouncementService> logger,
            IMapper mapper,
            INotificationService notificationService)
        {
            _appDbContext = appDbContext;
            _genericService = genericService;
            _logger = logger;
            _mapper = mapper;
            _notificationService = notificationService;
        }

        #region CRUD

        public async Task<AnnouncementDto> AddAsync(string landlordId, AddAnnouncementDto dto)
        {
            _logger.LogInformation(
                "Adding announcement for landlord {0} on property {1}",
                landlordId, dto.PropertyId);

            var entity = new Announcement
            {
                LandlordId = landlordId,
                PropertyId = dto.PropertyId,
                Message = dto.Message,
                DateCreated = DateTime.UtcNow,
            };

            await _appDbContext.Announcements.AddAsync(entity);
            await _appDbContext.SaveChangesAsync();

            var property = await _appDbContext.Properties
                .FirstOrDefaultAsync(p => p.Id == dto.PropertyId);

            var propertyTitle = property?.Title ?? $"Property #{dto.PropertyId}";

            var tenantIds = await (
                from t in _appDbContext.Tenancies
                where t.PropertyId == dto.PropertyId
                   && t.Status == TenancyStatus.Active
                select t.StudentId
            ).ToListAsync();

            _logger.LogInformation(
                "Sending announcement push to {0} tenant(s) for property {1}",
                tenantIds.Count, dto.PropertyId);

            foreach (var tenantId in tenantIds)
            {
                await _notificationService.SendToUserAsync(
                    userId: tenantId,
                    title: $"📢 Announcement — {propertyTitle}",
                    message: dto.Message.Length > 100
                        ? dto.Message.Substring(0, 100) + "…"
                        : dto.Message,
                    type: "announcement");
            }

            await _notificationService.SendToTopicAsync(
                topic: $"property_{dto.PropertyId}",
                title: $"📢 {propertyTitle}",
                message: dto.Message.Length > 100
                    ? dto.Message.Substring(0, 100) + "…"
                    : dto.Message,
                type: "announcement");

            var landlord = await _appDbContext.Users
                .FirstOrDefaultAsync(u => u.Id == landlordId);

            return new AnnouncementDto
            {
                Id = entity.Id,
                LandlordId = landlordId,
                LandlordName = landlord?.FullName ?? string.Empty,
                PropertyId = dto.PropertyId,
                PropertyTitle = propertyTitle,
                Message = dto.Message,
                PostedAt = entity.DateCreated.HasValue
                    ? DateTime.SpecifyKind(entity.DateCreated.Value, DateTimeKind.Utc)
                    : DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Utc),
            };
        }

        public async Task<List<AnnouncementDto>> GetByLandlordIdAsync(string landlordId)
        {
            _logger.LogInformation(
                "Retrieving announcements for landlord {0}", landlordId);

            var data = await (
                from a in _appDbContext.Announcements
                join landlord in _appDbContext.Users
                    on a.LandlordId equals landlord.Id
                join property in _appDbContext.Properties
                    on a.PropertyId equals property.Id
                where a.LandlordId == landlordId
                orderby a.DateCreated descending
                select new AnnouncementDto
                {
                    Id = a.Id,
                    LandlordId = a.LandlordId,
                    LandlordName = landlord.FullName,
                    PropertyId = a.PropertyId,
                    PropertyTitle = property.Title,
                    Message = a.Message,

                    PostedAt = a.DateCreated.HasValue
                        ? DateTime.SpecifyKind(a.DateCreated.Value, DateTimeKind.Utc)
                        : DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                }
                ).ToListAsync();

            return data;
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