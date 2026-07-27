
using ko.core.Contracts;
using ko.entity_framework.entities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace ko.core.Services
{
    public interface IReceiptGeneratorService
    {
        Task<string> GenerateAndUploadReceiptAsync(RentPayment payment, Tenancy tenancy);
    }

    public class ReceiptGeneratorService : IReceiptGeneratorService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IAppLogger<ReceiptGeneratorService> _logger;

        public ReceiptGeneratorService(
            IAppLogger<ReceiptGeneratorService> logger,
            IServiceProvider serviceProvider)
        {
            _logger = logger;
            QuestPDF.Settings.License = LicenseType.Community;
            _serviceProvider = serviceProvider;
        }

        public async Task<string> GenerateAndUploadReceiptAsync(
            RentPayment payment,
            Tenancy tenancy)
        {
            _logger.LogInformation(
                "Generating receipt for payment {0} on tenancy {1}",
                payment.Id, tenancy.Id);

            var receiptNumber = $"VSTAY-{tenancy.Id:D4}-{payment.PaidAt:yyyyMMdd}-{payment.Id:D6}";
            var pdfBytes = GeneratePdf(payment, tenancy, receiptNumber);
            var fileName = $"receipt-{receiptNumber}.pdf";
            var formFile = CreateFormFile(pdfBytes, fileName);

            var _fileUploadService = _serviceProvider.GetRequiredService<IFileUploadService>();

            var uploadedUrl = await _fileUploadService.UploadFileAsync(formFile, "uploads", "receipts");

            _logger.LogInformation(
                "Receipt {0} uploaded → {1}", receiptNumber, uploadedUrl);

            return uploadedUrl;
        }

        // =============================================
        // PDF Generation
        // =============================================
        private static byte[] GeneratePdf(
    RentPayment payment,
    Tenancy tenancy,
    string receiptNumber)
        {
            var student = tenancy.Student;
            var property = tenancy.Property;
            var paidAt = payment.PaidAt ?? DateTime.UtcNow;
            var monthYear = payment.DueDate.ToString("MMMM yyyy");
            var amount = payment.Amount.ToString("N0");

            var propTitle = !string.IsNullOrWhiteSpace(property?.Title) && property.Title != "string"
                ? property.Title
                : $"Property #{tenancy.PropertyId}";

            return Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(0);
                    page.DefaultTextStyle(x => x.FontFamily("Arial").FontSize(10));

                    page.Content().Column(col =>
                    {
                        // ── Header ────────────────────────────────────────
                        col.Item()
                            .Background(Colors.Blue.Darken2)
                            .Padding(36)
                            .Row(row =>
                            {
                                row.RelativeItem().Column(c =>
                                {
                                    c.Item().Text(text =>
                                    {
                                        text.Span("Veri")
                                            .FontSize(28).Bold()
                                            .FontColor(Colors.White);
                                        text.Span("Stay")
                                            .FontSize(28).Bold()
                                            .FontColor(Colors.Blue.Lighten4);
                                    });
                                    c.Item().PaddingTop(4)
                                        .Text("Verified Student Accommodation Platform")
                                        .FontSize(11)
                                        .FontColor(Colors.Blue.Lighten4);
                                });

                                row.RelativeItem().AlignRight().Column(c =>
                                {
                                    c.Item().Text("RECEIPT")
                                        .FontSize(22).Bold()
                                        .FontColor(Colors.White);
                                    c.Item().PaddingTop(4)
                                        .Text($"#{receiptNumber}")
                                        .FontSize(9).Italic()
                                        .FontColor(Colors.Blue.Lighten4);
                                    c.Item().PaddingTop(2)
                                        .Text($"{paidAt:dd MMM yyyy, HH:mm} UTC")
                                        .FontSize(9)
                                        .FontColor(Colors.Blue.Lighten4);
                                });
                            });

                        // ── Status banner ──────────────────────────────────
                        col.Item()
                            .Background(Colors.Green.Lighten4)
                            .BorderBottom(1)
                            .BorderColor(Colors.Green.Lighten2)
                            .Padding(14)
                            .PaddingLeft(36)
                            .Text("✓  Payment Confirmed — Simulated · No real funds transferred")
                            .FontSize(11).Bold()
                            .FontColor(Colors.Green.Darken2);

                        // ── Body ──────────────────────────────────────────
                        col.Item().Padding(36).Column(body =>
                        {
                            // Amount block
                            body.Item()
                                .Background(Colors.Blue.Lighten4)
                                .Border(1)
                                .BorderColor(Colors.Blue.Lighten2)
                                .Padding(28)
                                .Column(c =>
                                {
                                    c.Item().AlignCenter()
                                        .Text("Amount Paid")
                                        .FontSize(11)
                                        .FontColor(Colors.Grey.Darken2);

                                    c.Item().PaddingTop(6).AlignCenter()
                                        .Text($"R {amount}")
                                        .FontSize(42).Bold()
                                        .FontColor(Colors.Blue.Darken2);

                                    c.Item().PaddingTop(6).AlignCenter()
                                        .Text($"Rent for {monthYear}")
                                        .FontSize(11)
                                        .FontColor(Colors.Grey.Darken2);
                                });

                            body.Item().PaddingTop(20);

                            // Receipt ref bar
                            body.Item()
                                .Background(Colors.Grey.Lighten4)
                                .Border(1)
                                .BorderColor(Colors.Grey.Lighten2)
                                .Padding(12)
                                .Row(row =>
                                {
                                    row.RelativeItem()
                                        .Text("Receipt Number")
                                        .FontSize(10)
                                        .FontColor(Colors.Grey.Darken2);

                                    row.AutoItem()
                                        .Text(receiptNumber)
                                        .FontSize(11).Bold().Italic()
                                        .FontColor(Colors.Blue.Darken2);
                                });

                            body.Item().PaddingTop(24);

                            // ── Payment details only ───────────────────────
                            body.Item()
                                .Text("PAYMENT DETAILS")
                                .FontSize(9).Bold()
                                .FontColor(Colors.Grey.Darken1);

                            body.Item().PaddingTop(8).Table(table =>
                            {
                                table.ColumnsDefinition(c =>
                                {
                                    c.RelativeColumn(2); // label column wider
                                    c.RelativeColumn(3); // value column
                                });

                                void AddRow(string label, string value, bool highlight = false)
                                {
                                    table.Cell()
                                        .Background(Colors.Grey.Lighten4)
                                        .Border(1)
                                        .BorderColor(Colors.Grey.Lighten2)
                                        .Padding(10)
                                        .Text(label)
                                        .FontSize(9).Bold()
                                        .FontColor(Colors.Grey.Darken2);

                                    table.Cell()
                                        .Border(1)
                                        .BorderColor(Colors.Grey.Lighten2)
                                        .Padding(10)
                                        .Text(value)
                                        .FontSize(10)
                                        .FontColor(highlight
                                            ? Colors.Green.Darken1
                                            : Colors.Black);
                                }

                                AddRow("Property", propTitle);
                                AddRow("Rent Period", monthYear);
                                AddRow("Due Date", payment.DueDate.ToString("dd MMM yyyy"));
                                AddRow("Paid On", paidAt.ToString("dd MMM yyyy, HH:mm") + " UTC");
                                AddRow("Amount", $"R {amount}");
                                AddRow("Monthly Rent", $"R {tenancy.MonthlyRent:N0}");
                                AddRow("Tenancy ID", $"#{tenancy.Id}");
                                AddRow("Payment Method", "Simulated Card");
                                AddRow("Status", "✓ Paid", highlight: true);
                            });

                            // ── PAID watermark ─────────────────────────────
                            body.Item().PaddingTop(40).AlignCenter()
                                .Text("PAID")
                                .FontSize(72).Bold().Italic()
                                .FontColor(Colors.Green.Lighten3);
                        });

                        // ── Footer ─────────────────────────────────────────
                        col.Item()
                            .Background(Colors.Grey.Lighten4)
                            .BorderTop(1)
                            .BorderColor(Colors.Grey.Lighten2)
                            .Padding(24)
                            .Column(footer =>
                            {
                                footer.Item().AlignCenter().Text(text =>
                                {
                                    text.Span("Veri").Bold().FontColor(Colors.Blue.Darken2);
                                    text.Span("Stay").Bold().FontColor(Colors.Blue.Medium);
                                });

                                footer.Item().PaddingTop(8).AlignCenter()
                                    .Text(
                                        "This receipt confirms the above rent payment has been recorded in VeriStay.\n" +
                                        "This is a simulated payment for demonstration purposes only.\n" +
                                        "No real financial transaction has taken place.")
                                    .FontSize(9)
                                    .FontColor(Colors.Grey.Darken1)
                                    .LineHeight(1.6f);

                                footer.Item().PaddingTop(12).AlignCenter()
                                    .Text($"© {DateTime.UtcNow.Year} VeriStay · Verified Student Accommodation Platform")
                                    .FontSize(8)
                                    .FontColor(Colors.Grey.Medium);
                            });
                    });
                });
            }).GeneratePdf();
        }

        // =============================================
        // Wrap byte[] as IFormFile
        // =============================================

        private static IFormFile CreateFormFile(byte[] bytes, string fileName)
        {
            var stream = new MemoryStream(bytes);
            return new FormFile(
                baseStream: stream,
                baseStreamOffset: 0,
                length: bytes.Length,
                name: "file",
                fileName: fileName)
            {
                Headers = new HeaderDictionary(),
                ContentType = "application/pdf",
            };
        }
    }
}