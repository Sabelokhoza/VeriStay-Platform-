using ko.core.Contracts;
using Microsoft.AspNetCore.Http;
using Supabase.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ko.core.Services
{
    public class FileUploadService : IFileUploadService
    {
        private readonly Supabase.Client _supabaseClient;
        private readonly IAppLogger<FileUploadService> _logger;

        public FileUploadService(Supabase.Client supabaseClient, IAppLogger<FileUploadService> logger)
        {
            _supabaseClient = supabaseClient;
            _logger = logger;
        }

        public async Task<string> UploadFileAsync(IFormFile file, string bucketName, string? folder = null)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is required");

            try
            {
                _logger.LogInformation("Uploading file {FileName} to bucket {BucketName}", file.FileName, bucketName);

                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                var filePath = string.IsNullOrEmpty(folder) ? fileName : $"{folder}/{fileName}";

                using var memoryStream = new MemoryStream();
                await file.CopyToAsync(memoryStream);
                var fileBytes = memoryStream.ToArray();

                await _supabaseClient.Storage
                    .From(bucketName)
                    .Upload(fileBytes, filePath, new Supabase.Storage.FileOptions
                    {
                        ContentType = file.ContentType,
                        Upsert = false
                    });

                _logger.LogInformation("File uploaded successfully to {FilePath}", filePath);
                return filePath;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, "Error uploading file {FileName} to bucket {BucketName}", file.FileName, bucketName);
                throw new Exception($"Failed to upload file: {ex.Message}", ex);
            }
        }

        public async Task<bool> DeleteFileAsync(string bucketName, string filePath)
        {
            try
            {
                _logger.LogInformation("Deleting file {FilePath} from bucket {BucketName}", filePath, bucketName);

                await _supabaseClient.Storage
                    .From(bucketName)
                    .Remove(filePath);

                _logger.LogInformation("File deleted successfully: {FilePath}", filePath);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, "Error deleting file {FilePath} from bucket {BucketName}", filePath, bucketName);
                return false;
            }
        }

        public async Task<byte[]> DownloadFileAsync(string bucketName, string filePath)
        {
            try
            {
                _logger.LogInformation("Downloading file {FilePath} from bucket {BucketName}", filePath, bucketName);

                var fileBytes = await _supabaseClient.Storage
                 .From(bucketName)
                 .Download(filePath, (TransformOptions?)null);
                if (fileBytes == null || fileBytes.Length == 0)
                {
                    _logger.LogWarning("Downloaded file is empty: {FilePath}", filePath);
                    throw new InvalidOperationException("Downloaded file is empty");
                }

                _logger.LogInformation("File downloaded successfully: {FilePath}, Size: {Size} bytes", filePath, fileBytes.Length);
                return fileBytes;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, "Error downloading file {FilePath} from bucket {BucketName}", filePath, bucketName);
                throw new Exception($"Failed to download file from {bucketName}/{filePath}: {ex.Message}", ex);
            }
        }

        public string GetPublicUrl(string bucketName, string filePath)
        {
            try
            {
                _logger.LogInformation("Getting public URL for {FilePath} from bucket {BucketName}", filePath, bucketName);

                var publicUrl = _supabaseClient.Storage
                    .From(bucketName)
                    .GetPublicUrl(filePath);

                return publicUrl;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, "Error getting public URL for {FilePath}", filePath);
                throw new Exception($"Failed to get public URL: {ex.Message}", ex);
            }
        }

        public async Task<string> GetSignedUrlAsync(string bucketName, string filePath, int expiresIn = 3600)
        {
            try
            {
                _logger.LogInformation("Creating signed URL for {FilePath} from bucket {BucketName}", filePath, bucketName);

                var signedUrl = await _supabaseClient.Storage
                    .From(bucketName)
                    .CreateSignedUrl(filePath, expiresIn);

                signedUrl = signedUrl.TrimEnd('?');


                return signedUrl;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, "Error creating signed URL for {FilePath}", filePath);
                throw new Exception($"Failed to create signed URL: {ex.Message}", ex);
            }
        }

        public async Task<bool> FileExistsAsync(string bucketName, string filePath)
        {
            try
            {
                var directory = Path.GetDirectoryName(filePath)?.Replace("\\", "/") ?? "";
                var fileName = Path.GetFileName(filePath);

                var files = await _supabaseClient.Storage
                    .From(bucketName)
                    .List(directory);

                return files.Any(f => f.Name == fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, "Error checking if file exists: {FilePath}", filePath);
                return false;
            }
        }

        public async Task<string> UploadStreamAsync(Stream stream, string bucketName, string? folder, string fileName, string contentType)
        {
            if (stream == null || stream.Length == 0)
                throw new ArgumentException("Stream is required");

            try
            {
                _logger.LogInformation("Uploading stream {FileName} to bucket {BucketName}", fileName, bucketName);

                var filePath = string.IsNullOrEmpty(folder) ? fileName : $"{folder}/{fileName}";

                using var memoryStream = new MemoryStream();
                await stream.CopyToAsync(memoryStream);
                var fileBytes = memoryStream.ToArray();

                await _supabaseClient.Storage
                    .From(bucketName)
                    .Upload(fileBytes, filePath, new Supabase.Storage.FileOptions
                    {
                        ContentType = contentType,
                        Upsert = false
                    });

                _logger.LogInformation("Stream uploaded successfully to {FilePath}", filePath);
                return filePath;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, "Error uploading stream {FileName} to bucket {BucketName}", fileName, bucketName);
                throw new Exception($"Failed to upload stream: {ex.Message}", ex);
            }
        }

        public async Task<List<string>> ListFilesAsync(string bucketName, string? folder = null)
        {
            try
            {
                _logger.LogInformation("Listing files in bucket {BucketName}, folder: {Folder}", bucketName, folder ?? "root");

                var files = await _supabaseClient.Storage
                    .From(bucketName)
                    .List(folder ?? "");

                return files.Select(f => f.Name).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, "Error listing files in bucket {BucketName}", bucketName);
                throw new Exception($"Failed to list files: {ex.Message}", ex);
            }
        }
    }
}
