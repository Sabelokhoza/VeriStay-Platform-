using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ko.core.Contracts
{
    public interface IFileUploadService
    {
        Task<string> UploadFileAsync(IFormFile file, string bucketName, string? folder = null);
        Task<bool> DeleteFileAsync(string bucketName, string filePath);
        Task<byte[]> DownloadFileAsync(string bucketName, string filePath);
        string GetPublicUrl(string bucketName, string filePath);
        Task<string> GetSignedUrlAsync(string bucketName, string filePath, int expiresIn = 3600);
        Task<string> UploadStreamAsync(Stream stream, string bucketName, string? folder, string fileName, string contentType);
    }
}
