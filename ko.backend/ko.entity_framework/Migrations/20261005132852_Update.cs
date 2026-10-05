using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ko.entity_framework.Migrations
{
    /// <inheritdoc />
    public partial class Update : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LandlordRespondedAt",
                table: "Disputes",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LandlordResponse",
                table: "Disputes",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "LandlordRespondedAt",
                table: "Complaints",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LandlordResponse",
                table: "Complaints",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LandlordRespondedAt",
                table: "Disputes");

            migrationBuilder.DropColumn(
                name: "LandlordResponse",
                table: "Disputes");

            migrationBuilder.DropColumn(
                name: "LandlordRespondedAt",
                table: "Complaints");

            migrationBuilder.DropColumn(
                name: "LandlordResponse",
                table: "Complaints");
        }
    }
}
