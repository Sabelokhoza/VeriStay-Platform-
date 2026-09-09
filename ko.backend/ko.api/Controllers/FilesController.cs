using ko.core.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography.Xml;

namespace ko.api.Controllers
{
    public class FilesController : BaseController
    {
        private readonly IFileUploadService _fileUploadService;

        public FilesController(IFileUploadService fileUploadService)
        {
            _fileUploadService = fileUploadService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile(IFormFile file, [FromQuery] string bucketName = "uploads")
        {
            try
            {
                var filePath = await _fileUploadService.UploadFileAsync(file, bucketName, "documents");

                var publicUrl = $"https://nwiqvwivjrtwyacomlqq.supabase.co/storage/v1/object/public/{bucketName}/{filePath}";

                return Ok(new { FilePath = filePath, PublicUrl = publicUrl });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpDelete("{bucketName}/{*filePath}")]
        public async Task<IActionResult> DeleteFile(string bucketName, string filePath)
        {
            var success = await _fileUploadService.DeleteFileAsync(bucketName, filePath);
            return success ? Ok() : NotFound();
        }

        [HttpGet("download/{bucketName}/{*filePath}")]
        public async Task<IActionResult> DownloadFile(string bucketName, string filePath)
        {
            try
            {
                var fileBytes = await _fileUploadService.DownloadFileAsync(bucketName, filePath);
                return File(fileBytes, "application/octet-stream");
            }
            catch
            {
                return NotFound();
            }
        }
        [HttpGet("get-signed-url")]
        public async Task<string> GetSignedUrl(string filePath)
        {
            var url = await _fileUploadService.GetSignedUrlAsync("uploads", filePath);
            return url;
        }
    }
}
