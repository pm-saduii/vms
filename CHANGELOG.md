# VMS v5.0 — Feature Changelog
_Last updated: session ปัจจุบัน_

## ✅ Features Complete (52/52 checks pass)

### CSS
- `.md` full properties + `transform:translateY(30px)`
- `.mo.open .md` `translateY(0)` — modals slide up
- `.mo` z-index 9000 (above login 8000)
- `.fs` dropdown arrow ▼ (background-image SVG)
- `.sb-item` compact padding 5px 10px
- `.pane` display:none (hidden by default)

### Modals (21 modals — all balanced, no stray content)
- `m-fee-detail` — complete: other_fee, carry, penalty rows + print button + NO X button
- `m-edit-fee` — has other_fee, penalty_note, discount, live total preview
- `m-addcar` — dropdown brand/color/province + image upload (5 photos, CAR_ rename, 1280px resize)
- `m-editcar` — same dropdowns
- `m-admin-addcar` — house select dropdown + image upload
- `m-admin-editcar` — full edit
- `m-forgot` — 2-step password reset
- `m-condetail` — dynamic IDs only (cd-phone, cd-line etc.), NO hardcoded data

### Settings Pane
- Single-page, 6 sections, NO tabs
- All 25 fields including invoice settings (bill_prefix, bank_branch, line_id, conditions)
- Pane div balanced

### Houses
- Table: 7 columns (บ้าน / เจ้าของ / โทร / อีเมล / ค่าส่วนกลาง / สถานะ / แก้ไข)
- Row render: h.phone + h.email both shown

### Fees
- `doGenerateFees` — reads from Settings (p1label, p1range, p1due, allowOutsideClick:false)
- `doGenerateFullYear` — full year bill with discount% from settings
- Full year button in fees header UI
- `openFeeDetail` — shows all rows (other_fee, carry, penalty10, collection) hide when 0

### Invoice Print
- `printFeeInvoice(id)` / `printFeeInvoiceById(id)` / `printResInvoice(id)`
- `_openInvoiceWindow(f)` — full layout matching PDF sample
- `_thaiNumberText()` — Thai baht words
- Invoice settings: bill_prefix, bank_branch, line_id, conditions (6 keys)

### Vehicle Management
- Admin page: 4 tabs (pending/active/inactive/all) + stats
- Resident page: pending section + approved list
- Approval flow: doApproveVehicle / doRejectVehicle
- Admin add car: house dropdown (from cache) + image upload
- Image upload: max 5, resize 1280px, rename CAR_YYYYMMDD_HHMMSS_xxx.jpg
- Routing: admin-vehicle, res-vehicle

### Startup
- Settings cache: reads from localStorage('vms5-settings') instantly on load

## 🔧 DO NOT CHANGE (fixed items that must persist)
- m-condetail: must NOT have hardcoded 081-111-2222 or @somsak_elec
- m-fee-detail: must NOT have md-x (X button)
- Settings pane: must NOT have tabs (stab-village, settings-tabs)
- .md CSS: must have `background:var(--card)` AND `transform:translateY(30px)`
- All 21 modals: must have balanced <div>/</div>
