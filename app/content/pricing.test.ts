// Run with: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { buyoutPrice, scaledPrices } from "./pricing.ts";

// Mobile example: setup 60,000, monthly 15,000, buy-out from 2,00,000
test("buying from day one costs the buyout figure", () => {
  assert.equal(buyoutPrice({ buyoutFrom: 200000 }), 200000);
});

test("starting monthly and buying at month 12 deducts setup and credits half the fees", () => {
  assert.equal(buyoutPrice({ buyoutFrom: 200000, setupPaid: 60000, monthlyFeesPaid: 12 * 15000 }), 50000);
});

test("the price never goes below 25% of the code price", () => {
  assert.equal(buyoutPrice({ buyoutFrom: 200000, setupPaid: 60000, monthlyFeesPaid: 40 * 15000 }), 50000);
  assert.equal(buyoutPrice({ buyoutFrom: 125000, setupPaid: 60000, monthlyFeesPaid: 24 * 15000 }), 31250);
});

const automation = { setup: 40000, licence: 18000, buyout: 200000, retainer: 12000 };

test("the from size stays as it is", () => {
  assert.deepEqual(scaledPrices(automation, 40000), { setup: 40000, monthly: 18000, buyout: 200000, maintenance: 12000 });
});

test("the from size keeps exact prices that are not round thousands", () => {
  const app = { setup: 60000, licence: 15000, buyout: 125000, retainer: 7500 };
  assert.deepEqual(scaledPrices(app, 60000), { setup: 60000, monthly: 15000, buyout: 125000, maintenance: 7500 });
});

test("doubling setup doubles the buyout and raises the monthly plan by about 50%", () => {
  assert.deepEqual(scaledPrices(automation, 80000), { setup: 80000, monthly: 27000, buyout: 400000, maintenance: 18000 });
});

test("a setup below the from price is treated as the from size", () => {
  assert.equal(scaledPrices(automation, 10000).setup, 40000);
});
