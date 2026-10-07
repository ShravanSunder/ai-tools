import { assertEquals } from "jsr:@std/assert@1";
import { decideSubjectPermission } from "./permission-policy.ts";
Deno.test("subject permits only read and search permissions", () => {
  assertEquals(decideSubjectPermission("read"), "allow_once");
  assertEquals(decideSubjectPermission("search"), "allow_once");
  for (const kind of ["execute", "edit", "delete", "move", undefined]) {
    assertEquals(decideSubjectPermission(kind), "reject_once");
  }
});
