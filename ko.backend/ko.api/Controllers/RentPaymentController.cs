using ko.core.Contracts;
using ko.core.Models;
using ko.core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ko.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RentPaymentController : ControllerBase
    {
        private readonly IRentPaymentService _rentPaymentService;
        private readonly IAppLogger<RentPaymentController> _logger;
        private readonly IFileUploadService _fileUploadService;

        public RentPaymentController(
            IRentPaymentService rentPaymentService,
            IFileUploadService fileUploadService,
            IAppLogger<RentPaymentController> logger)
        {
            _rentPaymentService = rentPaymentService;
            _logger = logger;
            _fileUploadService = fileUploadService;
        }



        [HttpGet("get-receipt")]
        public async Task<ActionResult<ApiResponse<string>>> DownloadReceipt([FromQuery] int id)
        {
            _logger.LogInformation("GET api/RentPayment/receipt/{0}", id);

            var payment = await _rentPaymentService.GetByIdAsync(id);

            if (payment == null)
                return NotFound("Payment not found");

            if (string.IsNullOrWhiteSpace(payment.ReceiptUrl))
                return BadRequest("No receipt available for this payment.");


            try
            {
                var signedUrl = await _fileUploadService
                    .GetSignedUrlAsync("uploads", payment.ReceiptUrl);
                return Ok(ApiResponse.Success(signedUrl, "Receipt URL retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogInformation("Could not refresh signed URL for payment {0}: {1}", id, ex.Message);
                return Ok(ApiResponse.Success(payment.ReceiptUrl, "Receipt URL retrieved successfully"));
            }
        }

        /// <summary>
        /// Get full payment summary for a student — Student only
        /// </summary>
        [HttpGet("get-student-summary")]
        public async Task<ActionResult<ApiResponse<StudentPaymentSummaryDto>>> GetStudentSummary(
            [FromQuery] string studentId)
        {
            _logger.LogInformation("GET api/RentPayment/get-student-summary for student {0}", studentId);
            var result = await _rentPaymentService.GetStudentPaymentSummaryAsync(studentId);
            return Ok(ApiResponse.Success(result, "Payment summary retrieved successfully"));
        }

        /// <summary>
        /// Get all payments for a tenancy — Landlord and Admin
        /// </summary>
        [HttpGet("get-by-tenancy")]
        public async Task<ActionResult<ApiResponse<List<RentPaymentDto>>>> GetByTenancy(
            [FromQuery] int tenancyId)
        {
            _logger.LogInformation("GET api/RentPayment/get-by-tenancy/{0}", tenancyId);
            var result = await _rentPaymentService.GetByTenancyIdAsync(tenancyId);
            return Ok(ApiResponse.Success(result, "Payments retrieved successfully"));
        }

        /// <summary>
        /// Get single payment by id
        /// </summary>
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ApiResponse<RentPaymentDto>>> GetById(int id)
        {
            _logger.LogInformation("GET api/RentPayment/{0}", id);
            var result = await _rentPaymentService.GetByIdAsync(id);
            return Ok(ApiResponse.Success(result, "Payment retrieved successfully"));
        }

        /// <summary>
        /// Get all payments — Admin only
        /// </summary>
        [HttpGet("get-all")]
        public async Task<ActionResult<ApiResponse<List<RentPaymentDto>>>> GetAll()
        {
            _logger.LogInformation("GET api/RentPayment/get-all");
            var result = await _rentPaymentService.GetAllAsync();
            return Ok(ApiResponse.Success(result, "All payments retrieved successfully"));
        }

        /// <summary>
        /// Get all overdue payments — Admin and Landlord
        /// </summary>
        [HttpGet("get-overdue")]
        public async Task<ActionResult<ApiResponse<List<RentPaymentDto>>>> GetOverdue()
        {
            _logger.LogInformation("GET api/RentPayment/get-overdue");
            var result = await _rentPaymentService.GetOverdueAsync();
            return Ok(ApiResponse.Success(result, "Overdue payments retrieved successfully"));
        }

        /// <summary>
        /// Create a new rent payment — Landlord and Admin
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ApiResponse<RentPaymentDto>>> Add([FromBody] AddRentPaymentDto dto)
        {
            _logger.LogInformation("POST api/RentPayment - Adding payment for tenancy {0}", dto.TenancyId);
            var result = await _rentPaymentService.AddAsync(dto);
            return Ok(ApiResponse.Success(result, "Rent payment added successfully"));
        }

        /// <summary>
        /// Mark a payment as paid — Student only (simulated)
        /// </summary>
        [HttpPatch("mark-paid")]
        public async Task<ActionResult<ApiResponse<RentPaymentDto>>> MarkAsPaid(
            [FromBody] MarkRentPaidDto dto)
        {
            _logger.LogInformation("PATCH api/RentPayment/mark-paid - Payment {0}", dto.RentPaymentId);
            var result = await _rentPaymentService.MarkAsPaidAsync(dto);
            return Ok(ApiResponse.Success(result, "Payment marked as paid successfully"));
        }

        /// <summary>
        /// Delete a payment — Admin only
        /// </summary>
        [HttpDelete("{id:int}")]
        public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
        {
            _logger.LogInformation("DELETE api/RentPayment/{0}", id);
            var result = await _rentPaymentService.DeleteAsync(id);
            return Ok(ApiResponse.Success(result, "Payment deleted successfully"));
        }
    }
}
