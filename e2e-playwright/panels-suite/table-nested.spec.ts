import { test, expect } from '@grafana/plugin-e2e';

import { runA11yAudit } from '../utils/axe-a11y';

import { waitForTableLoad } from './table-utils';

const DASHBOARD_UID = 'dcb9f5e9-8066-4397-889e-864b99555dbb';

test.use({ viewport: { width: 2000, height: 1080 } });

test.describe('Panels test: Table - Nested', { tag: ['@panels', '@table'] }, () => {
  test('a11y', { tag: ['@a11y'] }, async ({ gotoDashboardPage, selectors, page }) => {
    const dashboardPage = await gotoDashboardPage({
      uid: DASHBOARD_UID,
      queryParams: new URLSearchParams({ viewPanel: '4' }),
    });

    await expect(
      dashboardPage.getByGrafanaSelector(selectors.components.Panels.Panel.title('Nested tables'))
    ).toBeVisible();

    await waitForTableLoad(page);

    await expect(page.locator('[role="row"]').filter({ visible: true })).toHaveCount(3); // header + 2 rows

    const firstRowExpander = dashboardPage
      .getByGrafanaSelector(selectors.components.Panels.Visualization.TableNG.RowExpander)
      .first();

    await firstRowExpander.click();
    await expect(page.locator('[role="row"]').filter({ visible: true })).not.toHaveCount(3);

    await runA11yAudit(page);
  });

  test('Tests nested table expansion', async ({ gotoDashboardPage, selectors, page }) => {
    const dashboardPage = await gotoDashboardPage({
      uid: DASHBOARD_UID,
      queryParams: new URLSearchParams({ editPanel: '4' }),
    });

    await expect(
      dashboardPage.getByGrafanaSelector(selectors.components.Panels.Panel.title('Nested tables'))
    ).toBeVisible();

    await waitForTableLoad(page);

    await expect(page.locator('[role="row"]').filter({ visible: true })).toHaveCount(3); // header + 2 rows

    const firstRowExpander = dashboardPage
      .getByGrafanaSelector(selectors.components.Panels.Visualization.TableNG.RowExpander)
      .first();

    await firstRowExpander.click();
    await expect(page.locator('[role="row"]').filter({ visible: true })).not.toHaveCount(3); // more rows are present now, it is dynamic tho.

    // TODO: test sorting

    await firstRowExpander.click();
    await expect(page.locator('[role="row"]').filter({ visible: true })).toHaveCount(3); // back to original state
  });
});
