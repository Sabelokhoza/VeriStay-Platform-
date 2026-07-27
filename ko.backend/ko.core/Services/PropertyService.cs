using AutoMapper;
using ko.core.Contracts;
using ko.core.Models;
using ko.entity_framework;
using ko.entity_framework.entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using static ko.core.Exceptions.ApiException;

namespace ko.core.Services
{
    public class PropertyService : IPropertyService
    {
        private readonly AppDbContext _appDbContext;
        private readonly IGenericService<Property> _genericService;
        private readonly IAppLogger<PropertyService> _logger;
        private readonly IMapper _mapper;
        private readonly IFileUploadService _fileUploadService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IServiceProvider _serviceProvider;

        public PropertyService(
            AppDbContext appDbContext,
            IGenericService<Property> genericService,
            IAppLogger<PropertyService> logger,
            IMapper mapper,
            IFileUploadService fileUploadService,
            UserManager<ApplicationUser> userManager,
            IServiceProvider serviceProvider)
        {
            _appDbContext = appDbContext;
            _genericService = genericService;
            _logger = logger;
            _mapper = mapper;
            _fileUploadService = fileUploadService;
            _userManager = userManager;
            _serviceProvider = serviceProvider;
        }

        #region CRUD

        public async Task<PropertyDto?> AddAsync(AddPropertyDto dto)
        {
            var canAdd = await onInsert(dto);
            if (!canAdd) return null;

            _logger.LogInformation("Adding property to the database");

            var entity = _mapper.Map<Property>(dto);
            entity.Status = PropertyStatus.Approved;
            entity.IsAvailable = true;
            entity.DateCreated = DateTime.UtcNow;

            await _appDbContext.Properties.AddAsync(entity);
            await _appDbContext.SaveChangesAsync();

            var result = _mapper.Map<PropertyDto>(entity);
            _logger.LogInformation("Property with id {0} has been added successfully", result.Id);

            await afterInsert(result);
            return result;
        }

        public async Task<List<PropertyDto>> GetAllAsync()
        {
            _logger.LogInformation("Retrieving all properties from the database");

            var data = await _appDbContext.Properties
                .ToListAsync();

            return _mapper.Map<List<PropertyDto>>(data);
        }


        public async Task<PropertyDto?> GetByIdAsync(int? id)
        {
            _logger.LogInformation("Attempting to retrieve property with id {0}", id);

            var entity = await _appDbContext.Properties
                .FirstOrDefaultAsync(p => p.Id == id);

            if (entity == null)
            {
                _logger.LogInformation("Property with id {0} was not found", id);
                throw new NotFoundException(nameof(GetByIdAsync), id);
            }

            return _mapper.Map<PropertyDto>(entity);
        }

        public async Task<List<PropertyDto>> GetByLandlordIdAsync(string landlordId)
        {
            _logger.LogInformation("Retrieving properties for landlord {0}", landlordId);

            var data = await _appDbContext.Properties
                .Where(p => p.LandlordId == landlordId)
                .ToListAsync();

            return _mapper.Map<List<PropertyDto>>(data);
        }

        public async Task<List<PropertyDto>> GetApprovedAsync()
        {
            _logger.LogInformation("Retrieving all approved properties");

            var data = await _appDbContext.Properties
                .Include(p => p.Landlord)
                .Include(p => p.Images)
                .Where(p => p.Status == PropertyStatus.Approved && p.IsAvailable)
                .ToListAsync();

            return _mapper.Map<List<PropertyDto>>(data);
        }

        public async Task<bool> UpdatePropertyAsync(int id, UpdatePropertyDto dto)
        {
            _logger.LogInformation("Attempting to update property with id {PropertyId}", id);

            if (id != dto.Id)
                return false;

            var property = await _appDbContext.Properties
                .FirstOrDefaultAsync(p => p.Id == id);

            if (property == null)
                throw new NotFoundException(nameof(Property), id);

            try
            {
                

                property.Title = dto.Title;
                property.Description = dto.Description;
                property.Address = dto.Address;
                property.City = dto.City;
                property.MonthlyRent = dto.MonthlyRent;
                property.AvailableBeds = dto.AvailableBeds;
                property.AvailableFrom = dto.AvailableFrom;
                property.IsAvailable = dto.IsAvailable;
                property.Amenities = dto.Amenities;
               

                await _appDbContext.SaveChangesAsync();

                _logger.LogInformation("Property with id {PropertyId} updated successfully", id);

                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _appDbContext.Properties.AnyAsync(p => p.Id == id))
                    return false;

                throw;
            }
        }

        public async Task<bool> UpdateAsync(int id, PropertyDto dto)
        {
            _logger.LogInformation("Attempting to update property with id {0}", id);

            if (id != dto.Id) return false;

            if (dto.AvailableBeds == 0)
            {
                dto.IsAvailable = false;
            }

            var entity = await _appDbContext.Properties.FindAsync(id);
            if (entity == null) throw new NotFoundException(nameof(UpdateAsync), id);

            try
            {
                var canUpdate = await onUpdate(dto);
                if (!canUpdate) return false;

                _mapper.Map(dto, entity);
                await _appDbContext.SaveChangesAsync();

                _logger.LogInformation("Property with id {0} has been successfully updated", id);
                await afterUpdate(dto);
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (await _appDbContext.Properties.FindAsync(id) == null) return false;
                else throw;
            }
        }

        public async Task<bool> DeleteAsync(int? id)
        {
            _logger.LogInformation("Attempting to delete property with id {0}", id);

            var entity = await GetByIdAsync(id);
            var canDelete = await onDelete(entity);
            if (!canDelete) return false;

            await _genericService.RemoveAsync(id);
            _logger.LogInformation("Property with id {0} has been successfully removed", id);

            await afterDelete(entity);
            return true;
        }

        public async Task<bool> ApproveAsync(int id)
        {
            _logger.LogInformation("Approving property with id {0}", id);

            var entity = await _appDbContext.Properties.FindAsync(id);
            if (entity == null) throw new NotFoundException(nameof(ApproveAsync), id);

            entity.Status = PropertyStatus.Approved;
            await _appDbContext.SaveChangesAsync();


            _logger.LogInformation("Property with id {0} has been approved", id);
            return true;
        }

        public async Task<bool> RejectAsync(int id)
        {
            _logger.LogInformation("Rejecting property with id {0}", id);

            var entity = await _appDbContext.Properties.FindAsync(id);
            if (entity == null) throw new NotFoundException(nameof(RejectAsync), id);

            entity.Status = PropertyStatus.Rejected;
            await _appDbContext.SaveChangesAsync();

            _logger.LogInformation("Property with id {0} has been rejected", id);
            return true;
        }

        public async Task<bool> DelistAsync(int id)
        {
            _logger.LogInformation("Delisting property with id {0}", id);

            var entity = await _appDbContext.Properties.FindAsync(id);
            if (entity == null) throw new NotFoundException(nameof(DelistAsync), id);

            entity.Status = PropertyStatus.Delisted;
            entity.IsAvailable = false;
            await _appDbContext.SaveChangesAsync();

            _logger.LogInformation("Property with id {0} has been delisted", id);
            return true;
        }

        public async Task<bool> ToggleAvailabilityAsync(int id)
        {
            _logger.LogInformation("Toggling availability for property with id {0}", id);

            var entity = await _appDbContext.Properties.FindAsync(id);
            if (entity == null) throw new NotFoundException(nameof(ToggleAvailabilityAsync), id);

            entity.IsAvailable = !entity.IsAvailable;
            await _appDbContext.SaveChangesAsync();

            _logger.LogInformation("Property with id {0} availability toggled to {1}", id, entity.IsAvailable);
            return true;
        }

        public async Task<List<PropertyDto>> SearchAsync(
            string? city = null,
            decimal? minRent = null,
            decimal? maxRent = null,
            int? minBeds = null,
            string? amenity = null)
        {
            _logger.LogInformation("Searching properties with filters");

            var query = _appDbContext.Properties
                .Include(p => p.Landlord)
                .Include(p => p.Images)
                .Where(p => p.Status == PropertyStatus.Approved && p.IsAvailable)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(city))
                query = query.Where(p => p.City.ToLower().Contains(city.ToLower()));

            if (minRent.HasValue)
                query = query.Where(p => p.MonthlyRent >= minRent.Value);

            if (maxRent.HasValue)
                query = query.Where(p => p.MonthlyRent <= maxRent.Value);

            if (minBeds.HasValue)
                query = query.Where(p => p.AvailableBeds >= minBeds.Value);

            if (!string.IsNullOrWhiteSpace(amenity))
                query = query.Where(p => p.Amenities.Contains(amenity));

            var data = await query.ToListAsync();
            return _mapper.Map<List<PropertyDto>>(data);
        }

        #endregion

        #region Property Images

        public async Task<PropertyImageDto?> AddImageAsync(AddPropertyImageDto dto)
        {
            _logger.LogInformation("Adding image to property {0}", dto.PropertyId);

            var imageUrl = await _fileUploadService.UploadFileAsync(dto.image, "uploads", "images");
            dto.ImageUrl = imageUrl;

            var entity = _mapper.Map<PropertyImage>(dto);

            await _appDbContext.PropertyImages.AddAsync(entity);
            await _appDbContext.SaveChangesAsync();

            _logger.LogInformation("Image with id {0} added to property {1}", entity.Id, dto.PropertyId);
            return _mapper.Map<PropertyImageDto>(entity);
        }

        public async Task<List<PropertyImageDto>> GetImagesByPropertyIdAsync(int propertyId)
        {
            _logger.LogInformation("Retrieving images for property {0}", propertyId);

            var images = await _appDbContext.PropertyImages
                .Where(i => i.PropertyId == propertyId)
                .ToListAsync();

            foreach (var item in images)
            {
                item.ImageUrl = await _fileUploadService.GetSignedUrlAsync("uploads" ,item.ImageUrl);
            }

            

            return _mapper.Map<List<PropertyImageDto>>(images);
        }
        public async Task<PropertyImageDto> GetPrimaryImageByPropertyIdAsync(int propertyId)
        {
            _logger.LogInformation("Retrieving primary image for property {0}", propertyId);

            var images = await _appDbContext.PropertyImages
                .Where(i => i.PropertyId == propertyId && i.IsPrimary == true)
                .FirstOrDefaultAsync();

            return _mapper.Map<PropertyImageDto>(images);
        }


        public async Task<bool> DeleteImageAsync(int imageId)
        {
            _logger.LogInformation("Deleting image with id {0}", imageId);

            var image = await _appDbContext.PropertyImages.FindAsync(imageId);
            if (image == null) throw new NotFoundException(nameof(DeleteImageAsync), imageId);

            _appDbContext.PropertyImages.Remove(image);
            await _appDbContext.SaveChangesAsync();

            _logger.LogInformation("Image with id {0} has been deleted", imageId);
            return true;
        }

        public async Task<bool> SetPrimaryImageAsync(int imageId)
        {
            _logger.LogInformation("Setting image {0} as primary", imageId);

            var image = await _appDbContext.PropertyImages.FindAsync(imageId);
            if (image == null) throw new NotFoundException(nameof(SetPrimaryImageAsync), imageId);

            var siblings = await _appDbContext.PropertyImages
                .Where(i => i.PropertyId == image.PropertyId)
                .ToListAsync();

            siblings.ForEach(i => i.IsPrimary = false);
            image.IsPrimary = true;

            await _appDbContext.SaveChangesAsync();
            _logger.LogInformation("Image {0} set as primary for property {1}", imageId, image.PropertyId);
            return true;
        }

        #endregion

        #region Events

        public Task<bool> onInsert(AddPropertyDto dto) => Task.FromResult(true);
        public Task<bool> onUpdate(PropertyDto dto) => Task.FromResult(true);
        public Task<bool> onDelete(PropertyDto dto) => Task.FromResult(true);
        public Task<bool> afterInsert(PropertyDto dto) => Task.FromResult(true);
        public Task<bool> afterUpdate(PropertyDto dto) => Task.FromResult(true);
        public Task<bool> afterDelete(PropertyDto dto) => Task.FromResult(true);

        #endregion

        public async Task<List<ListingDto>> GetListings()
        {
            var properties = await _appDbContext.Properties
                .ToListAsync();

            var listings = new List<ListingDto>();


            foreach (var item in properties)
            {
                var listing = _mapper.Map<ListingDto>(item);
                listing.Image = await GetPrimaryImageByPropertyIdAsync(item.Id);
                if (listing.Image != null)
                {
                    listing.Image.ImageUrl = await _fileUploadService.GetSignedUrlAsync("uploads", listing.Image.ImageUrl);
                }

                listings.Add(listing);
            }

            return listings;
        }

        public async Task<ListingDto> GetProperyInfoAsync(int propertyId)
        {
            var property = await _appDbContext.Properties.FirstOrDefaultAsync(w => w.Id == propertyId);

            var listing = _mapper.Map<ListingDto>(property);


            listing.Image = await GetPrimaryImageByPropertyIdAsync(property.Id);
            if (listing.Image != null)
            {
                listing.Image.ImageUrl = await _fileUploadService.GetSignedUrlAsync("uploads", listing.Image.ImageUrl);
            }

            return listing;
        }

        public async Task<List<ListingDto>> GetListings(
              string? city = null,
              string? title = null,
              string? address = null,
              string? description = null)
        {
            var query = _appDbContext.Properties
                .Where(p => p.IsAvailable) // add isAvaila
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(city))
                query = query.Where(p => p.City.ToLower().Contains(city.ToLower()));

            if (!string.IsNullOrWhiteSpace(title))
                query = query.Where(p => p.Title.ToLower().Contains(title.ToLower()));

            if (!string.IsNullOrWhiteSpace(address))
                query = query.Where(p => p.Address.ToLower().Contains(address.ToLower()));

            if (!string.IsNullOrWhiteSpace(description))
                query = query.Where(p => p.Description.ToLower().Contains(description.ToLower()));

            var data = await query.ToListAsync();


            var listings = new List<ListingDto>();

            foreach (var item in data)
            {
                var listing = _mapper.Map<ListingDto>(item);
                listing.Image = await GetPrimaryImageByPropertyIdAsync(item.Id);
                if (listing.Image != null)
                {
                    listing.Image.ImageUrl = await _fileUploadService.GetSignedUrlAsync("uploads", listing.Image.ImageUrl);
                }

                listings.Add(listing);
            }

            return listings;
        }

        public async Task<ListingDetailsDto> GetListingDetailsbyPropertyId(int id)
        {
            var item = await GetByIdAsync(id);

            var listing = _mapper.Map<ListingDetailsDto>(item);
            var landlord = await _userManager.FindByIdAsync(listing.LandlordId);
            listing.LandLordPhoneNumber = landlord.PhoneNumber;
            listing.LandLordEmail = landlord.Email;
            listing.LandlordName = landlord.FullName;
            listing.Images = await GetImagesByPropertyIdAsync(item.Id);
           
            var _reviewService =  _serviceProvider.GetRequiredService<IReviewService>();
            listing.Reviews = await _reviewService.GetByPropertyIdAsync(id);

            return listing;
        }

    }
}