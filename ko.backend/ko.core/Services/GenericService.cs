using AutoMapper;
using AutoMapper.QueryableExtensions;
using ko.core.Contracts;
using ko.entity_framework;
using Microsoft.EntityFrameworkCore;
using static ko.core.Exceptions.ApiException;

namespace ko.core.Services
{
    public class GenericService<T> : IGenericService<T> where T : class
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public GenericService(AppDbContext appDbContext, IMapper mapper)
        {
            _context = appDbContext;
            _mapper = mapper;
        }


        public async Task<TResult> AddAsync<TSource, TResult>(TSource source)
        {
            var entity = _mapper.Map<T>(source);

            await _context.AddAsync(entity);
            await _context.SaveChangesAsync();

            return _mapper.Map<TResult>(entity);
        }

        public async Task<List<TResult>> GetAllAsync<TResult>()
        {
            return await _context.Set<T>()
                .ProjectTo<TResult>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }

        public async Task<TResult> GetByIdAsync<TResult>(int? id)
        {
            var result = await _context.Set<T>().FindAsync(id);

            if (result is null)
            {
                throw new NotFoundException(typeof(T).Name, id.HasValue ? id : "No key provided");
            }

            return _mapper.Map<TResult>(result);
        }

        public async Task RemoveAsync(int? id)
        {
            var entity = await GetByIdAsync<T>(id);

            _context.Set<T>().Remove(entity);
            await _context.SaveChangesAsync();

        }

        public async Task UpdateAsync<TSource>(int id, TSource source)
        {
            var entity = await GetByIdAsync<T>(id);

            _mapper.Map(source, entity);

            _context.Update(entity);
            await _context.SaveChangesAsync();
        }
    }
}
