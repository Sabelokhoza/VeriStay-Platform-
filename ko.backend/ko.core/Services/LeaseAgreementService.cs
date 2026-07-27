using ko.core.Contracts;
using ko.entity_framework.entities;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace ko.core.Services
{
    public class LeaseAgreementService : ILeaseAgreementService
    {
        public byte[] Generate(Tenancy tenancy)
        {

            QuestPDF.Settings.License = LicenseType.Community;
            var document = QuestPDF.Fluent.Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(40);
                    page.DefaultTextStyle(x => x.FontSize(11).FontFamily("Arial"));

                    page.Header().Element(ComposeHeader);
                    page.Content().Element(c => ComposeContent(c, tenancy));
                    page.Footer().Element(ComposeFooter);
                });
            });

            return document.GeneratePdf();
        }

        private void ComposeHeader(IContainer container)
        {
            container.Row(row =>
            {
                row.RelativeItem().Column(col =>
                {
                    col.Item().Text("VeriStay").FontSize(20).Bold().FontColor("#1a1a2e");
                    col.Item().Text("Verified Student Accommodation Platform")
                        .FontSize(9).FontColor(Colors.Grey.Medium);
                });

                row.ConstantItem(180).AlignRight().Text("RESIDENTIAL LEASE AGREEMENT")
                    .FontSize(10).Bold().FontColor("#4f8ef7");
            });
        }

        private void ComposeFooter(IContainer container)
        {
            container.AlignCenter().Text(text =>
            {
                text.Span("Page ").FontSize(8).FontColor(Colors.Grey.Medium);
                text.CurrentPageNumber().FontSize(8).FontColor(Colors.Grey.Medium);
                text.Span(" of ").FontSize(8).FontColor(Colors.Grey.Medium);
                text.TotalPages().FontSize(8).FontColor(Colors.Grey.Medium);
            });
        }

        private void ComposeContent(IContainer container, Tenancy t)
        {
            container.PaddingVertical(20).Column(col =>
            {
                col.Spacing(14);

                col.Item().LineHorizontal(1).LineColor(Colors.Grey.Lighten2);

                col.Item().Text(
                    $"This Lease Agreement (\"Agreement\") is entered into on {DateTime.UtcNow:dd MMMM yyyy}, " +
                    $"between the Landlord and the Tenant named below, for the rental of the property described herein.");

                // --- Parties ---
                col.Item().Element(c => SectionTitle(c, "1. Parties"));
                col.Item().Row(row =>
                {
                    row.RelativeItem().Element(c => PartyBox(c, "LANDLORD", t.LandLordName));
                    row.ConstantItem(20);
                    row.RelativeItem().Element(c => PartyBox(c, "TENANT (STUDENT)", t.StudentName));
                });

                // --- Property ---
                col.Item().Element(c => SectionTitle(c, "2. Property"));
                col.Item().Background("#f8f9fa").Padding(12).Column(pc =>
                {
                    pc.Spacing(4);
                    pc.Item().Text(row => { row.Span("Property: ").Bold(); row.Span(t.PropertyTittle); });
                });

                // --- Lease term ---
                col.Item().Element(c => SectionTitle(c, "3. Lease Term"));
                col.Item().Text(
                    $"The lease shall commence on {t.LeaseStartDate:dd MMMM yyyy} and terminate on " +
                    $"{t.LeaseEndDate:dd MMMM yyyy}, unless terminated earlier in accordance with the terms of this Agreement.");

                // --- Rent ---
                col.Item().Element(c => SectionTitle(c, "4. Rent"));
                col.Item().Text(
                    $"The Tenant agrees to pay the Landlord a monthly rent of R {t.MonthlyRent:N2}, due on or before " +
                    $"the 1st day of each calendar month, for the duration of the lease term.");

                // --- Terms ---
                col.Item().Element(c => SectionTitle(c, "5. General Terms"));
                col.Item().Text(
                    "5.1  The Tenant shall maintain the property in good condition and report any maintenance " +
                    "issues promptly via the VeriStay platform.\n" +
                    "5.2  The Tenant shall not sublet the property without prior written consent from the Landlord.\n" +
                    "5.3  Either party may raise a dispute or request early termination through the VeriStay platform, " +
                    "subject to applicable notice periods.\n" +
                    "5.4  This Agreement is governed by the laws of the Republic of South Africa.");

                // --- Signatures ---
                col.Item().PaddingTop(10).Element(c => SectionTitle(c, "6. Signatures"));
                col.Item().Text("By signing below, both parties acknowledge that they have read, understood, " +
                                 "and agree to be bound by the terms of this Agreement.")
                    .FontSize(9).FontColor(Colors.Grey.Darken1);

                col.Item().PaddingTop(10).Row(row =>
                {
                    row.RelativeItem().Element(c => SignatureBlock(c, "Landlord Signature", t.LandLordName));
                    row.ConstantItem(30);
                    row.RelativeItem().Element(c => SignatureBlock(c, "Tenant Signature", t.StudentName));
                });
            });
        }

        private void SectionTitle(IContainer container, string title)
        {
            container.PaddingTop(6).Text(title).FontSize(12).Bold().FontColor("#1a1a2e");
        }

        private void PartyBox(IContainer container, string label, string name)
        {
            container.Border(1).BorderColor(Colors.Grey.Lighten2).Padding(10).Column(c =>
            {
                c.Spacing(3);
                c.Item().Text(label).FontSize(9).Bold().FontColor(Colors.Grey.Medium);
                c.Item().Text(string.IsNullOrWhiteSpace(name) ? "N/A" : name).FontSize(12).Bold();
            });
        }

        private void SignatureBlock(IContainer container, string label, string name)
        {
            container.Column(c =>
            {
                c.Spacing(4);
                c.Item().Height(50); // blank space for a wet/pen signature
                c.Item().LineHorizontal(1).LineColor(Colors.Grey.Darken1);
                c.Item().Text(label).FontSize(9).Bold().FontColor(Colors.Grey.Medium);
                c.Item().Text(string.IsNullOrWhiteSpace(name) ? "N/A" : name).FontSize(10);
                c.Item().PaddingTop(6).Text("Date: ______________________").FontSize(9).FontColor(Colors.Grey.Darken1);
            });
        }
    }
}