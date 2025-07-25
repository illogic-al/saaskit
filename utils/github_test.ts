// Copyright 2023-2025 the Deno authors. All rights reserved. MIT license.
import { assertRejects } from "@std/assert/rejects";
import { getGitHubUser } from "./github.ts";
import { returnsNext, stub } from "@std/testing/mock";
import { assertEquals } from "@std/assert/equals";
import { STATUS_CODE } from "@std/http/status";
import { BadRequestError } from "@/utils/http.ts";

Deno.test("[plugins] getGitHubUser()", async (test) => {
  await test.step("rejects on error message", async () => {
    const message = crypto.randomUUID();
    using _fetchStub = stub(
      globalThis,
      "fetch",
      returnsNext([
        Promise.resolve(
          Response.json({ message }, { status: STATUS_CODE.BadRequest }),
        ),
      ]),
    );
    await assertRejects(
      async () => await getGitHubUser(crypto.randomUUID()),
      BadRequestError,
      message,
    );
  });

  await test.step("resolves to a GitHub user object", async () => {
    const body = { login: crypto.randomUUID(), email: crypto.randomUUID() };
    using _fetchStub = stub(
      globalThis,
      "fetch",
      returnsNext([Promise.resolve(Response.json(body))]),
    );
    assertEquals(await getGitHubUser(crypto.randomUUID()), body);
  });
});
