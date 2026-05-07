using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ko.entity_framework.Migrations
{
    /// <inheritdoc />
    public partial class FixingBuildIssue : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Announcements_AspNetUsers_LandlordId",
                table: "Announcements");

            migrationBuilder.DropForeignKey(
                name: "FK_Applications_AspNetUsers_StudentId",
                table: "Applications");

            migrationBuilder.DropForeignKey(
                name: "FK_Disputes_AspNetUsers_LandlordId",
                table: "Disputes");

            migrationBuilder.DropForeignKey(
                name: "FK_Disputes_AspNetUsers_StudentId",
                table: "Disputes");

            migrationBuilder.DropForeignKey(
                name: "FK_MaintenanceRequests_AspNetUsers_StudentId",
                table: "MaintenanceRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_Properties_AspNetUsers_LandlordId",
                table: "Properties");

            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_AspNetUsers_LandlordId",
                table: "Reviews");

            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_AspNetUsers_StudentId",
                table: "Reviews");

            migrationBuilder.DropForeignKey(
                name: "FK_Tenancies_AspNetUsers_StudentId",
                table: "Tenancies");

            migrationBuilder.DropForeignKey(
                name: "FK_VerificationDocuments_AspNetUsers_LandlordId",
                table: "VerificationDocuments");

            migrationBuilder.DropForeignKey(
                name: "FK_WaitingListEntries_AspNetUsers_StudentId",
                table: "WaitingListEntries");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_LandlordId",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Disputes_LandlordId",
                table: "Disputes");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "LandlordId",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "LandlordId",
                table: "Disputes");

            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "University",
                table: "AspNetUsers");

            migrationBuilder.RenameColumn(
                name: "StudentId",
                table: "WaitingListEntries",
                newName: "ApplicationUserId");

            migrationBuilder.RenameIndex(
                name: "IX_WaitingListEntries_StudentId",
                table: "WaitingListEntries",
                newName: "IX_WaitingListEntries_ApplicationUserId");

            migrationBuilder.RenameColumn(
                name: "LandlordId",
                table: "VerificationDocuments",
                newName: "ApplicationUserId");

            migrationBuilder.RenameIndex(
                name: "IX_VerificationDocuments_LandlordId",
                table: "VerificationDocuments",
                newName: "IX_VerificationDocuments_ApplicationUserId");

            migrationBuilder.RenameColumn(
                name: "StudentId",
                table: "Tenancies",
                newName: "ApplicationUserId");

            migrationBuilder.RenameIndex(
                name: "IX_Tenancies_StudentId",
                table: "Tenancies",
                newName: "IX_Tenancies_ApplicationUserId");

            migrationBuilder.RenameColumn(
                name: "StudentId",
                table: "Reviews",
                newName: "ApplicationUserId");

            migrationBuilder.RenameIndex(
                name: "IX_Reviews_StudentId",
                table: "Reviews",
                newName: "IX_Reviews_ApplicationUserId");

            migrationBuilder.RenameColumn(
                name: "LandlordId",
                table: "Properties",
                newName: "ApplicationUserId");

            migrationBuilder.RenameIndex(
                name: "IX_Properties_LandlordId",
                table: "Properties",
                newName: "IX_Properties_ApplicationUserId");

            migrationBuilder.RenameColumn(
                name: "StudentId",
                table: "MaintenanceRequests",
                newName: "ApplicationUserId");

            migrationBuilder.RenameIndex(
                name: "IX_MaintenanceRequests_StudentId",
                table: "MaintenanceRequests",
                newName: "IX_MaintenanceRequests_ApplicationUserId");

            migrationBuilder.RenameColumn(
                name: "StudentId",
                table: "Disputes",
                newName: "ApplicationUserId");

            migrationBuilder.RenameIndex(
                name: "IX_Disputes_StudentId",
                table: "Disputes",
                newName: "IX_Disputes_ApplicationUserId");

            migrationBuilder.RenameColumn(
                name: "StudentId",
                table: "Applications",
                newName: "ApplicationUserId");

            migrationBuilder.RenameIndex(
                name: "IX_Applications_StudentId",
                table: "Applications",
                newName: "IX_Applications_ApplicationUserId");

            migrationBuilder.RenameColumn(
                name: "LandlordId",
                table: "Announcements",
                newName: "ApplicationUserId");

            migrationBuilder.RenameIndex(
                name: "IX_Announcements_LandlordId",
                table: "Announcements",
                newName: "IX_Announcements_ApplicationUserId");

            migrationBuilder.AlterColumn<int>(
                name: "VerificationStatus",
                table: "AspNetUsers",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "StudentNumber",
                table: "AspNetUsers",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
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

            migrationBuilder.AlterColumn<decimal>(
                name: "Budget",
                table: "AspNetUsers",
                type: "numeric",
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "numeric",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Announcements_AspNetUsers_ApplicationUserId",
                table: "Announcements",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_AspNetUsers_ApplicationUserId",
                table: "Applications",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Disputes_AspNetUsers_ApplicationUserId",
                table: "Disputes",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MaintenanceRequests_AspNetUsers_ApplicationUserId",
                table: "MaintenanceRequests",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Properties_AspNetUsers_ApplicationUserId",
                table: "Properties",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_AspNetUsers_ApplicationUserId",
                table: "Reviews",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tenancies_AspNetUsers_ApplicationUserId",
                table: "Tenancies",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_VerificationDocuments_AspNetUsers_ApplicationUserId",
                table: "VerificationDocuments",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_WaitingListEntries_AspNetUsers_ApplicationUserId",
                table: "WaitingListEntries",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Announcements_AspNetUsers_ApplicationUserId",
                table: "Announcements");

            migrationBuilder.DropForeignKey(
                name: "FK_Applications_AspNetUsers_ApplicationUserId",
                table: "Applications");

            migrationBuilder.DropForeignKey(
                name: "FK_Disputes_AspNetUsers_ApplicationUserId",
                table: "Disputes");

            migrationBuilder.DropForeignKey(
                name: "FK_MaintenanceRequests_AspNetUsers_ApplicationUserId",
                table: "MaintenanceRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_Properties_AspNetUsers_ApplicationUserId",
                table: "Properties");

            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_AspNetUsers_ApplicationUserId",
                table: "Reviews");

            migrationBuilder.DropForeignKey(
                name: "FK_Tenancies_AspNetUsers_ApplicationUserId",
                table: "Tenancies");

            migrationBuilder.DropForeignKey(
                name: "FK_VerificationDocuments_AspNetUsers_ApplicationUserId",
                table: "VerificationDocuments");

            migrationBuilder.DropForeignKey(
                name: "FK_WaitingListEntries_AspNetUsers_ApplicationUserId",
                table: "WaitingListEntries");

            migrationBuilder.RenameColumn(
                name: "ApplicationUserId",
                table: "WaitingListEntries",
                newName: "StudentId");

            migrationBuilder.RenameIndex(
                name: "IX_WaitingListEntries_ApplicationUserId",
                table: "WaitingListEntries",
                newName: "IX_WaitingListEntries_StudentId");

            migrationBuilder.RenameColumn(
                name: "ApplicationUserId",
                table: "VerificationDocuments",
                newName: "LandlordId");

            migrationBuilder.RenameIndex(
                name: "IX_VerificationDocuments_ApplicationUserId",
                table: "VerificationDocuments",
                newName: "IX_VerificationDocuments_LandlordId");

            migrationBuilder.RenameColumn(
                name: "ApplicationUserId",
                table: "Tenancies",
                newName: "StudentId");

            migrationBuilder.RenameIndex(
                name: "IX_Tenancies_ApplicationUserId",
                table: "Tenancies",
                newName: "IX_Tenancies_StudentId");

            migrationBuilder.RenameColumn(
                name: "ApplicationUserId",
                table: "Reviews",
                newName: "StudentId");

            migrationBuilder.RenameIndex(
                name: "IX_Reviews_ApplicationUserId",
                table: "Reviews",
                newName: "IX_Reviews_StudentId");

            migrationBuilder.RenameColumn(
                name: "ApplicationUserId",
                table: "Properties",
                newName: "LandlordId");

            migrationBuilder.RenameIndex(
                name: "IX_Properties_ApplicationUserId",
                table: "Properties",
                newName: "IX_Properties_LandlordId");

            migrationBuilder.RenameColumn(
                name: "ApplicationUserId",
                table: "MaintenanceRequests",
                newName: "StudentId");

            migrationBuilder.RenameIndex(
                name: "IX_MaintenanceRequests_ApplicationUserId",
                table: "MaintenanceRequests",
                newName: "IX_MaintenanceRequests_StudentId");

            migrationBuilder.RenameColumn(
                name: "ApplicationUserId",
                table: "Disputes",
                newName: "StudentId");

            migrationBuilder.RenameIndex(
                name: "IX_Disputes_ApplicationUserId",
                table: "Disputes",
                newName: "IX_Disputes_StudentId");

            migrationBuilder.RenameColumn(
                name: "ApplicationUserId",
                table: "Applications",
                newName: "StudentId");

            migrationBuilder.RenameIndex(
                name: "IX_Applications_ApplicationUserId",
                table: "Applications",
                newName: "IX_Applications_StudentId");

            migrationBuilder.RenameColumn(
                name: "ApplicationUserId",
                table: "Announcements",
                newName: "LandlordId");

            migrationBuilder.RenameIndex(
                name: "IX_Announcements_ApplicationUserId",
                table: "Announcements",
                newName: "IX_Announcements_LandlordId");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Reviews",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "LandlordId",
                table: "Reviews",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LandlordId",
                table: "Disputes",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<int>(
                name: "VerificationStatus",
                table: "AspNetUsers",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<string>(
                name: "StudentNumber",
                table: "AspNetUsers",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<double>(
                name: "ReputationScore",
                table: "AspNetUsers",
                type: "double precision",
                nullable: true,
                oldClrType: typeof(double),
                oldType: "double precision");

            migrationBuilder.AlterColumn<decimal>(
                name: "Budget",
                table: "AspNetUsers",
                type: "numeric",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "numeric");

            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "AspNetUsers",
                type: "character varying(21)",
                maxLength: 21,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "University",
                table: "AspNetUsers",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_LandlordId",
                table: "Reviews",
                column: "LandlordId");

            migrationBuilder.CreateIndex(
                name: "IX_Disputes_LandlordId",
                table: "Disputes",
                column: "LandlordId");

            migrationBuilder.AddForeignKey(
                name: "FK_Announcements_AspNetUsers_LandlordId",
                table: "Announcements",
                column: "LandlordId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_AspNetUsers_StudentId",
                table: "Applications",
                column: "StudentId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Disputes_AspNetUsers_LandlordId",
                table: "Disputes",
                column: "LandlordId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Disputes_AspNetUsers_StudentId",
                table: "Disputes",
                column: "StudentId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MaintenanceRequests_AspNetUsers_StudentId",
                table: "MaintenanceRequests",
                column: "StudentId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Properties_AspNetUsers_LandlordId",
                table: "Properties",
                column: "LandlordId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_AspNetUsers_LandlordId",
                table: "Reviews",
                column: "LandlordId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_AspNetUsers_StudentId",
                table: "Reviews",
                column: "StudentId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tenancies_AspNetUsers_StudentId",
                table: "Tenancies",
                column: "StudentId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_VerificationDocuments_AspNetUsers_LandlordId",
                table: "VerificationDocuments",
                column: "LandlordId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_WaitingListEntries_AspNetUsers_StudentId",
                table: "WaitingListEntries",
                column: "StudentId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
