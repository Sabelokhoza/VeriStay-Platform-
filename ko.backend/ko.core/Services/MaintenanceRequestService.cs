using AutoMapper;
using ko.core.Contracts;
using ko.core.Models;
using ko.entity_framework;
using ko.entity_framework.entities;
using Microsoft.EntityFrameworkCore;
using static ko.core.Exceptions.ApiException;

namespace ko.core.Services
{
    public class MaintenanceRequestService : IMaintenanceRequestService
    {
        private readonly AppDbContext _appDbContext;
        private readonly IGenericService<MaintenanceRequest> _genericService;
        private readonly IAppLogger<MaintenanceRequestService> _logger;
        private readonly IMapper _mapper;
        private readonly IEmailServiceMailJet _emailServiceMailJet;

        public MaintenanceRequestService(
            AppDbContext appDbContext,
            IGenericService<MaintenanceRequest> genericService,
            IAppLogger<MaintenanceRequestService> logger,
            IMapper mapper,
            IEmailServiceMailJet emailServiceMailJet)
        {
            _appDbContext = appDbContext;
            _genericService = genericService;
            _logger = logger;
            _mapper = mapper;
            _emailServiceMailJet = emailServiceMailJet;
        }

        #region CRUD

        public async Task<MaintenanceRequestDto?> AddAsync(string studentId, AddMaintenanceRequestDto dto)
        {
            var canAdd = await onInsert(dto);
            if (!canAdd) return null;

            _logger.LogInformation("Adding maintenance request for student {0} on tenancy {1}", studentId, dto);

            var entity = _mapper.Map<MaintenanceRequest>(dto);
            entity.StudentId = studentId;
            entity.Status = MaintenanceStatus.Open;
            entity.DateCreated = DateTime.UtcNow;

            await _appDbContext.MaintenanceRequests.AddAsync(entity);
            await _appDbContext.SaveChangesAsync();

            var result = _mapper.Map<MaintenanceRequestDto>(entity);
            _logger.LogInformation("Maintenance request with id {0} has been added successfully", result.Id);

            await afterInsert(result);
            return result;
        }

        public async Task<bool> MarkAsResolvedAsync(UpdateMaintenanceRequestDto updateMaintenanceRequestDto)
        {
            updateMaintenanceRequestDto.Status = MaintenanceStatus.Resolved;
            await _genericService.UpdateAsync(updateMaintenanceRequestDto.Id ,updateMaintenanceRequestDto);

            SendMaintainanceFeedbackEmailAsync(updateMaintenanceRequestDto);
            return true;
        }

        private void SendMaintainanceFeedbackEmailAsync(UpdateMaintenanceRequestDto updateMaintenanceRequestDto)
        {
            
        }

        public async Task<List<MaintenanceRequestDto>> GetAllAsync()
        {
            _logger.LogInformation("Retrieving all maintenance requests from the database");

            var data = await _appDbContext.MaintenanceRequests
                .ToListAsync();

            return _mapper.Map<List<MaintenanceRequestDto>>(data);
        }

        public async Task<MaintenanceRequestDto?> GetByIdAsync(int? id)
        {
            _logger.LogInformation("Attempting to retrieve maintenance request with id {0}", id);

            var entity = await _appDbContext.MaintenanceRequests
                .FirstOrDefaultAsync(m => m.Id == id);

            if (entity == null)
            {
                _logger.LogInformation("Maintenance request with id {0} was not found", id);
                throw new NotFoundException(nameof(GetByIdAsync), id);
            }

            return _mapper.Map<MaintenanceRequestDto>(entity);
        }

        public async Task<List<MaintenanceRequestDto>> GetByStudentIdAsync(string studentId)
        {
            _logger.LogInformation("Retrieving maintenance requests for student {0}", studentId);

            var data = await _appDbContext.MaintenanceRequests
                .Where(m => m.StudentId == studentId)
                .OrderByDescending(m => m.DateCreated)
                .ToListAsync();

            return _mapper.Map<List<MaintenanceRequestDto>>(data);
        }

        public async Task<List<MaintenanceRequestDto>> GetByPropertyIdAsync(int propertyId)
        {
            _logger.LogInformation("Retrieving maintenance requests for property {0}", propertyId);

            var data = await _appDbContext.MaintenanceRequests
                .Include(m => m.Student)
                .Where(m => m.PropertyId == propertyId)
                .OrderByDescending(m => m.DateCreated)
                .ToListAsync();

            return _mapper.Map<List<MaintenanceRequestDto>>(data);
        }

        public async Task<List<MaintenanceRequestDto>> GetOpenMantainanceByPropertiesAsync(List<PropertyDto> properties)
        {
            _logger.LogInformation("Retrieving maintenance requests for properties {0}", properties);

            var data = await _appDbContext.MaintenanceRequests
                .Where( m => m.Status == MaintenanceStatus.Open &&  properties.Select(s => s.Id).Contains(m.PropertyId ))
                .OrderByDescending(m => m.Id)
                .ToListAsync();

            return _mapper.Map<List<MaintenanceRequestDto>>(data);
        }

        public async Task<List<MaintenanceRequestDto>> GetMantainanceByPropertiesAsync(List<PropertyDto> properties)
        {
            _logger.LogInformation("Retrieving maintenance requests for properties {0}", properties);

            var data = await _appDbContext.MaintenanceRequests
                .Where(m => properties.Select(s => s.Id).Contains(m.PropertyId))
                .OrderByDescending(m => m.Id)
                .ToListAsync();

            return _mapper.Map<List<MaintenanceRequestDto>>(data);
        }

        public async Task<bool> DeleteAsync(int? id)
        {
            _logger.LogInformation("Attempting to delete maintenance request with id {0}", id);

            var entity = await GetByIdAsync(id);
            var canDelete = await onDelete(entity);
            if (!canDelete) return false;

            await _genericService.RemoveAsync(id);
            _logger.LogInformation("Maintenance request with id {0} has been successfully removed", id);

            await afterDelete(entity);
            return true;
        }

        //public async Task<bool> UpdateStatusAsync(int id, MaintenanceRequestStatus status, string? landlordNotes)
        //{
        //    _logger.LogInformation("Updating status of maintenance request {0} to {1}", id, status);

        //    var entity = await _appDbContext.MaintenanceRequests.FindAsync(id);
        //    if (entity == null) throw new NotFoundException(nameof(UpdateStatusAsync), id);

        //    var mapped = _mapper.Map<MaintenanceRequestDto>(entity);
        //    var canUpdate = await onUpdate(mapped);
        //    if (!canUpdate) return false;

        //    entity.Status = status;
        //    entity.LandlordNotes = landlordNotes;
        //    entity.DateResolved = status == MaintenanceRequestStatus.Resolved ? DateTime.UtcNow : entity.DateResolved;

        //    await _appDbContext.SaveChangesAsync();

        //    _logger.LogInformation("Maintenance request {0} status updated to {1}", id, status);
        //    await afterUpdate(_mapper.Map<MaintenanceRequestDto>(entity));
        //    return true;
        //}

        #endregion

        #region Events

        public Task<bool> onInsert(AddMaintenanceRequestDto dto) => Task.FromResult(true);
        public Task<bool> afterInsert(MaintenanceRequestDto dto) => Task.FromResult(true);
        public Task<bool> onUpdate(MaintenanceRequestDto dto) => Task.FromResult(true);
        public Task<bool> afterUpdate(MaintenanceRequestDto dto) => Task.FromResult(true);
        public Task<bool> onDelete(MaintenanceRequestDto dto) => Task.FromResult(true);
        public Task<bool> afterDelete(MaintenanceRequestDto dto) => Task.FromResult(true);

        #endregion
    }
}