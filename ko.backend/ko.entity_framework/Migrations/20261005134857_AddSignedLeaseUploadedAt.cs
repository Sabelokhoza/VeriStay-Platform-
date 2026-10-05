using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ko.entity_framework.Migrations
{
    /// <inheritdoc />
    public partial class AddSignedLeaseUploadedAt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "SignedLeaseUploadedAt",
                table: "Tenancies",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SignedLeaseUploadedAt",
                table: "Tenancies");
        }
    }
}
