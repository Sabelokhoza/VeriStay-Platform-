using AutoMapper;
using ko.core.Contracts;
using ko.core.Models;
using ko.entity_framework;
using ko.entity_framework.entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using static ko.core.Exceptions.ApiException;

namespace ko.core.Services
{
    public class TenancyService : ITenancyService
    {
        private readonly AppDbContext _appDbContext;
        private readonly IGenericService<Tenancy> _genericService;
        private readonly IAppLogger<TenancyService> _logger;
        private readonly IMapper _mapper;
        private readonly IServiceProvider _serviceProvider;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILeaseAgreementService _leaseAgreementService;
        private readonly IFileUploadService _fileUploadService;



        public TenancyService(
            AppDbContext appDbContext,
            IGenericService<Tenancy> genericService,
            IAppLogger<TenancyService> logger,
            IMapper mapper,
        UserManager<ApplicationUser> userManager,
        IServiceProvider serviceProvider,
        ILeaseAgreementService leaseAgreementService,
        IFileUploadService fileUploadService)
        {
            _appDbContext = appDbContext;
            _genericService = genericService;
            _logger = logger;
            _mapper = mapper;
            _userManager = userManager;
            _serviceProvider = serviceProvider;
            _leaseAgreementService = leaseAgreementService;
            _fileUploadService = fileUploadService;
        }

        #region CRUD

        public async Task<TenancyDto?>  AddAsync(AddTenancyDto dto)
        {
            var canAdd = await onInsert(dto);
            if (!canAdd) return null;

            _logger.LogInformation("Adding tenancy to the database");

            var entity = _mapper.Map<Tenancy>(dto);
            entity.Status = TenancyStatus.Active;
            entity.DateCreated = DateTime.UtcNow;

            var student = await _appDbContext.Students.FindAsync(entity.StudentId);
            var property = await _appDbContext.Properties
                .Include(p => p.Landlord)
                .FirstOrDefaultAsync(p => p.Id == entity.PropertyId);

            entity.StudentName = student?.FullName ?? string.Empty;
            entity.PropertyTittle = property?.Title ?? string.Empty;
            entity.LandLordName = property?.Landlord?.FullName ?? string.Empty;


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
               
                .ToListAsync();

            return _mapper.Map<List<TenancyDto>>(data);
        }

        public async Task<TenancyDto?> GetByIdAsync(int? id)
        {
            _logger.LogInformation("Attempting to retrieve tenancy with id {0}", id);

            var entity = await _appDbContext.Tenancies
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

        public async Task<TenancyDto> GetTenacyInfoByStudentIdAsync(string studentId)
        {
            _logger.LogInformation("Retrieving tenancies for student {0}", studentId);

            var data = await _appDbContext.Tenancies
                .Where(t => t.StudentId == studentId)
                .OrderByDescending(o => o.Id)
                .FirstOrDefaultAsync();

            var dto = _mapper.Map<TenancyDto>(data);

            if (dto != null)
            {
                var _propertyService = _serviceProvider.GetService<IPropertyService>();
                var property = await _propertyService.GetByIdAsync(dto.PropertyId);
                dto.PropertyTitle = property.Title;
                var student = await _userManager.FindByIdAsync(dto.StudentId);
                var landlord =  await _userManager.FindByIdAsync(property.LandlordId);
                dto.StudentName = student.FullName;
                dto.LandlordName = landlord.FullName;
                dto.Location = $"{property.Address} - {property.City}";
                dto.LeaseDocument = string.IsNullOrEmpty( data.LeaseDocument) ? "" : await _fileUploadService.GetSignedUrlAsync("uploads", data.LeaseDocument);
            }

            return dto;
        }

        public async Task<TenancyDto> UploadLeaseDocumentAsync(int tenancyId, IFormFile leaseDocument)
        {
            _logger.LogInformation("Uploading lease document for tenancy {0}", tenancyId);

            var tenancy = await _appDbContext.Tenancies
                .FirstOrDefaultAsync(t => t.Id == tenancyId);

            if (tenancy == null)
                throw new NotFoundException(nameof(UploadLeaseDocumentAsync), tenancyId);

            var documentUrl = await _fileUploadService.UploadFileAsync(leaseDocument,"uploads" , "leases");

            if (string.IsNullOrEmpty(documentUrl))
                throw new BadRequestException("Failed to upload lease document");

            tenancy.LeaseDocument = documentUrl;

            await _appDbContext.SaveChangesAsync();

            _logger.LogInformation("Lease document uploaded successfully for tenancy {0}", tenancyId);

            return _mapper.Map<TenancyDto>(tenancy);
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
        public async Task<bool> afterInsert(TenancyDto dto)
        {
            var _propertyService = _serviceProvider.GetService<IPropertyService>();
            var propery = await _propertyService.GetByIdAsync(dto.PropertyId);
            if (propery.IsAvailable == false)
            {
                throw new  BadRequestException("Propery is fulli occupied , Try again next time");
            }

            propery.AvailableBeds = propery.AvailableBeds - 1;
            await _propertyService.UpdateAsync(propery.Id, propery);

            var entity = await _appDbContext.Tenancies.FindAsync(dto.Id);
            if (entity == null) return false;

            _logger.LogInformation("Generating lease agreement PDF for tenancy {0}", entity.Id);

            var student = await _userManager.FindByIdAsync(dto.StudentId);
            var landlord = await _userManager.FindByIdAsync(propery.LandlordId);
            entity.PropertyTittle = propery.Title;
            entity.LandLordName = landlord.FullName;
            entity.StudentName = student.FullName;
            var pdfBytes = _leaseAgreementService.Generate(entity);
            var fileName = $"lease-{entity.Id}-{Guid.NewGuid()}.pdf";

            using var stream = new MemoryStream(pdfBytes);
            var url = await _fileUploadService.UploadStreamAsync(stream, "uploads", "leases", fileName, "application/pdf");

            entity.LeaseDocument = url;
            await _appDbContext.SaveChangesAsync();

            _logger.LogInformation("Lease agreement generated and saved for tenancy {0}", entity.Id);
            return true;
        }

        public async Task<List<ProfileDto>> GetHousematesByUserId(string userId)
        {
            var tenancy = await GetTenacyInfoByStudentIdAsync(userId);

            if (tenancy == null)
            {
                return new List<ProfileDto>();
            }

            var tenacies = await _appDbContext.Tenancies.Where(w => w.PropertyId == tenancy.PropertyId).ToListAsync();

            var userService = _serviceProvider.GetService<IUserService>();
            var houseMates = new List<ProfileDto>();

            foreach (var item in tenacies)
            {
                var user = await userService.GetUser(item.StudentId);
                houseMates.Add(user);
            }

            return houseMates;
        }

        public async Task<List<ProfileDto>> GetTenanciesByProperties(List<PropertyDto> properties)
        {
            var tenacies = await _appDbContext.Tenancies.Where(w => properties.Select(s => s.Id).Contains(w.PropertyId)).ToListAsync();

            var userService = _serviceProvider.GetService<IUserService>();
            var houseMates = new List<ProfileDto>();

            foreach (var item in tenacies)
            {
                var user = await userService.GetUser(item.StudentId);
                houseMates.Add(user);
            }

            return houseMates;
        }

        public Task<bool> onUpdate(TenancyDto dto) => Task.FromResult(true);
        public Task<bool> afterUpdate(TenancyDto dto) => Task.FromResult(true);
        public Task<bool> onDelete(TenancyDto dto) => Task.FromResult(true);
        public Task<bool> afterDelete(TenancyDto dto) => Task.FromResult(true);

        #endregion
    }
}