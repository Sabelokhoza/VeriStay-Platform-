using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ko.entity_framework.Migrations
{
    /// <inheritdoc />
    public partial class AddingIdentificationDocs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "IdentificationDocument",
                table: "AspNetUsers",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IdentificationDocument",
                table: "AspNetUsers");
        }
    }
}
