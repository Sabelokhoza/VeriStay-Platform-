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

    public interface IEmailService
    {
        Task SendEmailAsync(string fromEmail, string fromName, string toEmail, string subject, string body, bool isHtml = false);
        Task SendEmailWithAttachmentsAsync(string fromEmail, string fromName, string toEmail, string subject, string body, bool isHtml, params string[] attachmentPaths);
        Task SendEmailWithCcBccAsync(string fromEmail, string fromName, string toEmail, string subject, string body, string[] ccEmails = null, string[] bccEmails = null);
        Task SendMultipartEmailAsync(string fromEmail, string fromName, string toEmail, string subject, string plainText, string htmlBody);
    }
}
