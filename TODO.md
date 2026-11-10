# TODO - Make pages aligned & responsive

## Step 1: CSS-only responsive/alignment fix (DONE)
- Updated `PerformX/css/style.css` responsive rules.
- Critical fix: on <=900px, set `.main-content { margin-left: 0; }` so fixed sidebar slide-out does not leave a left offset.
- Improved mobile spacing for `.topbar` and `.content-area`.
- Added small-table padding tightening at <=600px and <=420px.

## Step 2: Verification (manual)
- Open these pages at desktop/tablet/mobile widths and confirm:
  - sidebar + main alignment
  - cards/grids stacking
  - no horizontal overflow on tables

Pages to check:
- `index.html`
- `pages/dashboard.html`
- `pages/employee-list.html`
- `pages/employee-form.html`
- `pages/attendance.html`
- `pages/salary.html`
- `pages/employee-portal.html`

