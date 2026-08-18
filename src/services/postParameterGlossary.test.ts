import assert from "node:assert/strict";
import test from "node:test";
import { postParameterCategoryLabels, postParameterTerms, postProblemCategoryLabels, postProblemRecipes } from "../data/postParameterGlossary.js";

test("post glossary covers every practical parameter category", () => {
  for (const category of Object.keys(postParameterCategoryLabels)) assert.ok(postParameterTerms.some((item) => item.category === category), `missing ${category}`);
});

test("post glossary explains direction, reason, example and caution", () => {
  assert.ok(postParameterTerms.length >= 50);
  for (const item of postParameterTerms) assert.ok(item.increase && item.decrease && item.example && item.why && item.caution, `incomplete ${item.id}`);
});

test("post glossary includes highlights and shadows", () => {
  assert.ok(postParameterTerms.some((item) => item.term === "Highlights"));
  assert.ok(postParameterTerms.some((item) => item.term === "Shadows"));
});

test("post diagnosis recipes cover picture, audio and delivery problems", () => {
  for (const category of Object.keys(postProblemCategoryLabels)) assert.ok(postProblemRecipes.some((item) => item.category === category), `missing recipe ${category}`);
  assert.ok(postProblemRecipes.length >= 10);
});

test("every diagnosis step links to a known parameter", () => {
  const ids = new Set(postParameterTerms.map((item) => item.id));
  for (const recipe of postProblemRecipes) for (const step of recipe.steps) assert.ok(ids.has(step.parameterId), `${recipe.id} references ${step.parameterId}`);
});
