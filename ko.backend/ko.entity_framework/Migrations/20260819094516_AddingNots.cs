using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ko.entity_framework.Migrations
{
    /// <inheritdoc />
    public partial class AddingNots : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Announcements_AspNetUsers_StudentId",
                table: "Announcements");

            migrationBuilder.DropForeignKey(
                name: "FK_Properties_AspNetUsers_StudentId",
                table: "Properties");

            migrationBuilder.DropForeignKey(
                name: "FK_VerificationDocuments_AspNetUsers_StudentId",
                table: "VerificationDocuments");

            migrationBuilder.DropIndex(
                name: "IX_VerificationDocuments_StudentId",
                table: "VerificationDocuments");

            migrationBuilder.DropIndex(
                name: "IX_Properties_StudentId",
                table: "Properties");

            migrationBuilder.DropIndex(
                name: "IX_Announcements_StudentId",
                table: "Announcements");

            migrationBuilder.DropColumn(
                name: "StudentId",
                table: "VerificationDocuments");

            migrationBuilder.DropColumn(
                name: "StudentId",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "StudentId",
                table: "Announcements");

            migrationBuilder.AlterColumn<double>(
                name: "ReputationScore",
                table: "AspNetUsers",
                type: "double precision",
                nullable: true,
                oldClrType: typeof(double),
                oldType: "double precision");

            migrationBuilder.CreateTable(
                name: "AppNotifications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Message = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false),
                    IsRead = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppNotifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppNotifications_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppNotifications_UserId",
                table: "AppNotifications",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppNotifications");

            migrationBuilder.AddColumn<string>(
                name: "StudentId",
                table: "VerificationDocuments",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StudentId",
                table: "Properties",
                type: "text",
                nullable: true);

            migrationBuilder.AlterColumn<double>(
                name: "ReputationScore",
                table: "AspNetUsers",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0,
                oldClrType: typeof(double),
                oldType: "double precision",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StudentId",
                table: "Announcements",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_VerificationDocuments_StudentId",
                table: "VerificationDocuments",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Properties_StudentId",
                table: "Properties",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Announcements_StudentId",
                table: "Announcements",
                column: "StudentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Announcements_AspNetUsers_StudentId",
                table: "Announcements",
                column: "StudentId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Properties_AspNetUsers_StudentId",
                table: "Properties",
                column: "StudentId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_VerificationDocuments_AspNetUsers_StudentId",
                table: "VerificationDocuments",
                column: "StudentId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
