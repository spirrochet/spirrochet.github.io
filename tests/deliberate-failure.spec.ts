import { test, expect } from '@playwright/test';

// Exists only to see the required check block a merge. Never merge it.
test('a deliberately failing test', () => {
   expect(1).toBe(2);
});
