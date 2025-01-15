import { PrismaClient } from "@prisma/client";

const initialTags = [{name: "JavaScript"}, {name: "Python"}, {name: "HTML/CSS"}, {name: "SQL"}, {name: "TypeScript"}, {name: "Java"}, {name: "C#"}, {name: "PHP"}, {name: "C++"}, {name: "Go"}, {name: "Rust"}, {name: "Kotlin"}, {name: "Swift"}, {name: "Dart"}, {name: "Ruby"}, {name: "R"}, {name: "Shell"}, {name: "Perl"}, {name: "Scala"}, {name: "Objective-C"}, {name: "Lua"}, {name: "MATLAB"}, {name: "Haskell"}, {name: "Clojure"}, {name: "F#"}, {name: "Elixir"}, {name: "Assembly"}, {name: "VB.NET"}, {name: "Solidity"}, {name: "Erlang"}, {name: "Fortran"}, {name: "VHDL"}, {name: "Verilog"}, {name: "Crystal"}, {name: "Ada"}, {name: "D"}, {name: "Nim"}, {name: "Groovy"}, {name: "Julia"}, {name: "OCaml"}, {name: "T-SQL"}, {name: "Xojo"}, {name: "Apex"}, {name: "Prolog"}, {name: "Scheme"}, {name: "SASS"}, {name: "ActionScript"}, {name: "Forth"}, {name: "ABAP"}, {name: "ColdFusion"}, {name: "LabVIEW"}, {name: "COBOL"}, {name: "Tcl"}, {name: "PL/SQL"}, {name: "Hack"}, {name: "Racket"}, {name: "GLSL"}, {name: "Zig"}, {name: "Pawn"}, {name: "OpenCL"}, {name: "VBScript"}, {name: "Haxe"}, {name: "CoffeeScript"}, {name: "Vala"}, {name: "Q#"}, {name: "Awk"}, {name: "PostScript"}, {name: "Chapel"}, {name: "XSLT"}, {name: "Idris"}, {name: "Smalltalk"}, {name: "Simula"}, {name: "Red"}, {name: "Rebol"}, {name: "JScript"}, {name: "Logo"}, {name: "Eiffel"}, {name: "Mercury"}, {name: "Boo"}, {name: "Pike"}, {name: "PureScript"}, {name: "Datalog"}, {name: "MaxScript"}, {name: "GDScript"}, {name: "Pug"}, {name: "Euphoria"}, {name: "Nix"}, {name: "Ring"}, {name: "Agda"}, {name: "Mojo"}, {name: "Yacc"}, {name: "Standard ML"}, {name: "Io"}, {name: "Genie"}, {name: "ATS"}, {name: "Factor"}, {name: "Joy"}, {name: "Wren"}, {name: "Oz"}, {name: "Reason"}];
const prisma = new PrismaClient();

/**
 * Loads initial tag data into the database.
 *
 * This function uses Prisma's transaction feature to insert predefined tags
 * into the database in a single operation.
 *
 * @returns {Promise<void>} Resolves when the operation is complete.
 *
 * @throws {Error} If the database operation fails.
 *
 * @author Mikael Gaete López
 */
const LoadTags = async () => {
    await prisma.$transaction([
        prisma.tag.createMany({
            data: initialTags
        })
    ]);
}

LoadTags()
    .then(() => console.log("Tags inserted successfully"))
    .catch((error) => console.log(error));
