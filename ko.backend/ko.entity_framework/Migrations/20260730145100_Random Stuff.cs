using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ko.entity_framework.Migrations
{
    /// <inheritdoc />
    public partial class RandomStuff : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AdminResolutionNotes",
                table: "Disputes",
                newName: "Title");

            migrationBuilder.AddColumn<string>(
                name: "AdminNotes",
                table: "Disputes",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "PropertyId",
                table: "Disputes",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Resolution",
                table: "Disputes",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "Complaints",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SubmittedById = table.Column<string>(type: "text", nullable: false),
                    LandlordId = table.Column<string>(type: "text", nullable: true),
                    PropertyId = table.Column<int>(type: "integer", nullable: true),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    AdminNotes = table.Column<string>(type: "text", nullable: false),
                    IsNotified = table.Column<bool>(type: "boolean", nullable: false),
                    DateCreated = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DateModified = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Complaints", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Complaints_AspNetUsers_SubmittedById",
                        column: x => x.SubmittedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Complaints_Properties_PropertyId",
                        column: x => x.PropertyId,
                        principalTable: "Properties",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Disputes_PropertyId",
                table: "Disputes",
                column: "PropertyId");

            migrationBuilder.CreateIndex(
                name: "IX_Complaints_PropertyId",
                table: "Complaints",
                column: "PropertyId");

            migrationBuilder.CreateIndex(
                name: "IX_Complaints_SubmittedById",
                table: "Complaints",
                column: "SubmittedById");

            migrationBuilder.AddForeignKey(
                name: "FK_Disputes_Properties_PropertyId",
                table: "Disputes",
                column: "PropertyId",
                principalTable: "Properties",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Disputes_Properties_PropertyId",
                table: "Disputes");

            migrationBuilder.DropTable(
                name: "Complaints");

            migrationBuilder.DropIndex(
                name: "IX_Disputes_PropertyId",
                table: "Disputes");

            migrationBuilder.DropColumn(
                name: "AdminNotes",
                table: "Disputes");

            migrationBuilder.DropColumn(
                name: "PropertyId",
                table: "Disputes");

            migrationBuilder.DropColumn(
                name: "Resolution",
                table: "Disputes");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Disputes",
                newName: "AdminResolutionNotes");
        }
    }
}
