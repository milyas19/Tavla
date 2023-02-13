using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Persons",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Navn = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Persons", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Vakts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    VaktType = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vakts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Tidsplans",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Dato = table.Column<DateTime>(type: "TEXT", nullable: false),
                    EndDato = table.Column<DateTime>(type: "TEXT", nullable: false),
                    PersonId = table.Column<int>(type: "INTEGER", nullable: false),
                    VaktId = table.Column<int>(type: "INTEGER", nullable: false),
                    Beskrivelse = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tidsplans", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tidsplans_Persons_PersonId",
                        column: x => x.PersonId,
                        principalTable: "Persons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Tidsplans_Vakts_VaktId",
                        column: x => x.VaktId,
                        principalTable: "Vakts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Persons",
                columns: new[] { "Id", "Navn" },
                values: new object[] { 1, "Nadia" });

            migrationBuilder.InsertData(
                table: "Vakts",
                columns: new[] { "Id", "VaktType" },
                values: new object[] { 1, "Morgen" });

            migrationBuilder.CreateIndex(
                name: "IX_Tidsplans_PersonId",
                table: "Tidsplans",
                column: "PersonId");

            migrationBuilder.CreateIndex(
                name: "IX_Tidsplans_VaktId",
                table: "Tidsplans",
                column: "VaktId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Tidsplans");

            migrationBuilder.DropTable(
                name: "Persons");

            migrationBuilder.DropTable(
                name: "Vakts");
        }
    }
}
