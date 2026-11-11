// Run with: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { emailConfig, sendEmail } from "./email.ts";

type Call = { url: string; init: RequestInit };
const fakeFetch = (status: number, calls: Call[] = []) =>
  (async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), init: init ?? {} });
    return new Response(status === 200 ? '{"id":"abc"}' : '{"message":"nope"}', { status });
  }) as typeof fetch;

const cfg = { apiKey: "re_test_key", from: "Soham Kar <leads@send.sohambuilds.in>" };

test("posts to Resend with the key, sender, recipient and reply-to", async () => {
  const calls: Call[] = [];
  const ok = await sendEmail(cfg, "owner@example.com", "New brief", "Hello", "visitor@example.com", [], fakeFetch(200, calls));
  assert.equal(ok, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://api.resend.com/emails");
  const headers = calls[0].init.headers as Record<string, string>;
  assert.equal(headers.Authorization, "Bearer re_test_key");
  const sent = JSON.parse(String(calls[0].init.body));
  assert.deepEqual(sent.to, ["owner@example.com"]);
  assert.equal(sent.from, cfg.from);
  assert.equal(sent.reply_to, "visitor@example.com");
  assert.equal(sent.subject, "New brief");
  assert.equal(sent.text, "Hello");
  assert.equal(sent.attachments, undefined);
});

test("attachments are sent base64 encoded", async () => {
  const calls: Call[] = [];
  await sendEmail(cfg, "a@b.co", "CV", "Attached", "me@b.co", [{ filename: "cv.pdf", content: Buffer.from("PDFDATA") }], fakeFetch(200, calls));
  const sent = JSON.parse(String(calls[0].init.body));
  assert.deepEqual(sent.attachments, [{ filename: "cv.pdf", content: Buffer.from("PDFDATA").toString("base64") }]);
});

test("without an API key nothing is sent and it reports failure", async () => {
  const calls: Call[] = [];
  const ok = await sendEmail({ ...cfg, apiKey: undefined }, "a@b.co", "s", "b", "r@b.co", [], fakeFetch(200, calls));
  assert.equal(ok, false);
  assert.equal(calls.length, 0);
});

test("a rejection from Resend (bad key, unverified domain) reports failure", async () => {
  for (const status of [401, 403, 422, 429, 500]) {
    assert.equal(await sendEmail(cfg, "a@b.co", "s", "b", "r@b.co", [], fakeFetch(status)), false, `status ${status}`);
  }
});

test("config reads the environment and falls back to Resend's test sender", () => {
  assert.deepEqual(emailConfig({ RESEND_API_KEY: "k", LEAD_EMAIL_FROM: "X <x@y.in>" }), { apiKey: "k", from: "X <x@y.in>" });
  assert.deepEqual(emailConfig({ RESEND_API_KEY: "" }), { apiKey: undefined, from: "Portfolio leads <onboarding@resend.dev>" });
});
