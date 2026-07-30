using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ko.entity_framework.Migrations
{
    /// <inheritdoc />
    public partial class mjgk : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Disputes_AspNetUsers_LandlordId",
                table: "Disputes");

            migrationBuilder.DropForeignKey(
                name: "FK_Disputes_AspNetUsers_StudentId",
                table: "Disputes");

            migrationBuilder.DropForeignKey(
                name: "FK_Disputes_Properties_PropertyId",
                table: "Disputes");

            migrationBuilder.DropIndex(
                name: "IX_Disputes_LandlordId",
                table: "Disputes");

            migrationBuilder.DropIndex(
                name: "IX_Disputes_PropertyId",
                table: "Disputes");

            migrationBuilder.DropIndex(
                name: "IX_Disputes_StudentId",
                table: "Disputes");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Disputes_LandlordId",
                table: "Disputes",
                column: "LandlordId");

            migrationBuilder.CreateIndex(
                name: "IX_Disputes_PropertyId",
                table: "Disputes",
                column: "PropertyId");

            migrationBuilder.CreateIndex(
                name: "IX_Disputes_StudentId",
                table: "Disputes",
                column: "StudentId");

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
                name: "FK_Disputes_Properties_PropertyId",
                table: "Disputes",
                column: "PropertyId",
                principalTable: "Properties",
                principalColumn: "Id");
        }
    }
}
