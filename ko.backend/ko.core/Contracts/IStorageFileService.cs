using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ko.core.Contracts
{
    public interface IStorageFileService
    {
        Task<string> UploadAsync(string bucketName, IFormFile file, string? key = null);
        Task<FileStreamResult> DownloadAsync(string bucketName, string key); 
        Task DeleteAsync(string bucketName, string key);
        Task<string> GeneratePresignedUrlAsync(string bucketName, string key, TimeSpan expiresIn);
    }
}
