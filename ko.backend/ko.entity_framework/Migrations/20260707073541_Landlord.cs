using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ko.entity_framework.Migrations
{
    /// <inheritdoc />
    public partial class Landlord : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.AlterColumn<int>(
                name: "VerificationStatus",
                table: "AspNetUsers",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AlterColumn<int>(
                name: "VerificationStatus",
                table: "AspNetUsers",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<double>(
                name: "ReputationScore",
                table: "AspNetUsers",
                type: "double precision",
                nullable: true,
                oldClrType: typeof(double),
                oldType: "double precision");
        }
    }
}
