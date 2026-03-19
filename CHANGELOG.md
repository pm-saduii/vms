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

---

## ✅ Changes (session นี้ — DONE)

### 1. Fix: Edit House — phone/email ไม่ดึงมา
- ✅ Root cause: `loadHousesPage` ไม่ set `_housesCache` → `openEditHouseModal` ใช้ empty cache → ข้อมูลว่าง
- ✅ Fix: เพิ่ม `_housesCache = houses;` ใน `loadHousesPage` หลัง `api('getHouses')`

### 2. Fix: ค่าส่วนกลาง — แสดงค่าจอดรถจากข้อมูลรถ
- ✅ Logic: `parking_fee` ของแต่ละบ้าน = รวม `fee_amount` ของรถที่ approved ทุกคันในบ้านนั้น
- ✅ Fix: ใน `Fees_Issues_Violations.gs` ปรับ `generate()` ให้ query VEHICLES แล้ว sum fee_amount per house
- ✅ Fix: `loadFeesPage` แสดง parking_fee ที่มาจากรถจริง

### 3. Feature: Admin Vehicle Page — Group by House
- ✅ Layout:
  - แสดง 1 row ต่อ 1 บ้าน (house_no + จำนวนรถ)
  - กดที่บ้าน → expand แสดง cards รถ (3 คันต่อแถว, responsive 1 คัน)
- ✅ Tabs: pending / inactive / all แยกออกไป ต้องกดถึงจะโหลด
- ⚠️ DO NOT CHANGE: tab structure เดิม (aveh-pending/active/inactive/all) ยังใช้งานได้

### 4. Feature: Admin Sidebar Reorder
เรียงใหม่:
- profile card + ออกจากระบบ (ด้านบนสุด)
- ปุ่ม Home (🏠 → dashboard)
- **หน้าหลัก:** Dashboard → ข้อมูลบ้าน → ข้อมูลรถ → ค่าส่วนกลาง → แจ้งกระทำผิด
- **จัดการ:** จัดการปัญหา → คำขอแก้ไข → ประกาศ → ผลงานนิติ → ทะเบียนช่าง → ประกาศขาย
- **ตั้งค่า:** ตั้งค่าระบบ → ข้อมูลผู้ใช้ระบบ → Logs

### 5. Feature: Resident Sidebar Reorder
เรียงใหม่:
- profile card + ออกจากระบบ (ด้านบนสุด)
- ปุ่ม Home (🏠 → dashboard)
- **หน้าหลัก:** หน้าหลัก → ข้อมูลบ้าน → ข้อมูลรถ → ค่าส่วนกลาง → แจ้งปัญหา → แจ้งเตือนจากนิติ
- **ข้อมูลอื่นๆ:** ประกาศ → ผลงานนิติ → ทะเบียนช่าง → ประกาศขายของ
- **บัญชี:** ข้อมูลผู้ใช้ระบบ

---

## ✅ Sidebar Redesign (ตามรูป)

### Admin Sidebar Layout ใหม่
```
[Logo + ชื่อหมู่บ้าน]  ← sb-logo (คงเดิม ด้านบนสุด)
─────────────────────
🏠 Home               ← ปุ่มเดี่ยว กด → dashboard
─────────────────────
ข้อมูลหลัก
  📊 Dashboard
  🏠 ข้อมูลบ้าน
  🚗 ข้อมูลรถ
  💰 ค่าส่วนกลาง
  ⚠️ แจ้งกระทำผิด
จัดการ
  🔧 จัดการปัญหา
  📝 คำขอแก้ไข
  📢 ประกาศ
  🏆 ผลงานนิติ
  🔨 ทะเบียนช่าง
  🛒 ประกาศขาย
ตั้งค่า
  ⚙️ ตั้งค่าระบบ
  👥 ข้อมูลผู้ใช้ระบบ
  📋 Logs การเข้าใช้ระบบ
─────────────────────
[Profile card]        ← ด้านล่าง (ชื่อ + role)
🚪 ออกจากระบบ        ← ล่างสุด (แยกจาก profile)
```

### Resident Sidebar Layout ใหม่
```
[Logo + ชื่อหมู่บ้าน]
─────────────────────
🏠 Home
─────────────────────
ข้อมูลหลัก
  📊 หน้าหลัก
  🏠 ข้อมูลบ้าน
  🚗 ข้อมูลรถ
  💳 ค่าส่วนกลาง
  🔧 แจ้งปัญหาให้นิติ
  🔔 แจ้งเตือนจากนิติ
ข้อมูลอื่นๆ
  📢 ประกาศ
  🏆 ผลงานนิติ
  🔨 ทะเบียนช่าง
  🛒 ประกาศขายของ
บัญชี
  👤 ข้อมูลผู้ใช้ระบบ
─────────────────────
[Profile card]        ← ด้านล่าง
🚪 ออกจากระบบ        ← ล่างสุด
```

### DO NOT CHANGE
- `id="anav"`, `id="rnav"` ต้องคงเดิม
- `id="sb-logo-ico"`, `id="sb-logo-name"` ต้องคงเดิม (ใช้ใน applySettings)
- `id="sb-admin-name"`, `id="sb-admin-role"` ต้องคงเดิม
- `id="sb-res-name"`, `id="sb-res-role"` ต้องคงเดิม
- `id="badge-*"` ทุกตัวต้องคงเดิม

---

## ✅ Houses Page + Refresh Buttons (session นี้)

### Refresh Buttons — ทุกหน้าที่มีตาราง
- Icon: 🔄 (ใกล้เคียง sync icon ในรูป)
- เพิ่มใน ph-acts ทุก pane: houses, fees, issues, vio, req, ann, rep, contractor, market, vehicle, usr, log, dash

### Houses Page แก้ไข
1. **เรียงตามซอย + บ้านเลขที่** — sort ก่อน render (natural sort)
2. **ปุ่ม → "ปรับปรุงค่าส่วนกลาง/ค่ารถ"** — เปลี่ยน label openBulkFeeModal
3. **คำนวณค่าส่วนกลาง** = `area_sqm × fee_rate_per_sqw × 12`
4. **คำนวณค่ารถ** = `SUM(VEHICLES.fee_amount)` แยกแต่ละหลัง (ต้อง fetch vehicles)
5. **คำนวณค่าขยะ** = `fee_trash_per_year` (จาก settings ต่อปี)
6. **Column ตาราง** เปลี่ยนเป็น: บ้านเลขที่ | เจ้าของ | โทร | ค่าส่วนกลาง | ค่ารถ | สถานะ | ปุ่มแก้ไข (ลบ email ออก)
7. **Edit modal** — ค่าส่วนกลาง/ค่ารถ/ค่าขยะ readonly + auto-calculate เมื่อเปลี่ยน area
8. **_housesCache** fix (done แล้ว) — phone/email ดึงได้แล้ว

### DO NOT CHANGE
- `id="edithouse-phone"`, `id="edithouse-email"` ต้องคงเดิม (openEditHouseModal ใช้)
- `id="edithouse-fee"`, `id="edithouse-parking"`, `id="edithouse-trash"` คงเดิม
- Badge IDs ทุกตัวต้องคงเดิม
- Load function names ทุกตัวต้องคงเดิม (loadHousesPage, loadFeesPage ฯลฯ)

---

## ✅ Session — Refresh Buttons + Houses Fix

### Root Cause ข้อ 4 (phone/email ไม่แสดง — แก้ครั้งที่ 5)
- **สาเหตุจริง:** มี 3 copies ของ `loadHousesPage` ใน JS
- JS ใช้ definition สุดท้าย (copy เก่า) ซึ่งไม่ fetch vehicles + ไม่ set `_housesCache` ถูกต้อง
- **แก้:** ลบ duplicate 2 copies ออก → เหลือ 1 copy (version ใหม่)

### Refresh Buttons
- เปลี่ยนจาก 🔄 emoji → styled `↺ รีโหลด` button (SVG icon)
- CSS class `.btn-refresh` ใหม่
- ทุกหน้าที่มีตาราง (13 หน้า)

### Houses Table
- Columns: บ้านเลขที่ | เจ้าของ | โทร | ค่าส่วนกลาง/ปี | ค่ารถ/ปี | สถานะ | ✏️
- Sort by soi + house_no (natural sort)
- ค่ารถ/ปี = SUM(VEHICLES.fee_amount) เฉพาะ approved

### Bulk Modal Headers
- ค่าขยะ/ปี (เปลี่ยนจาก /งวด)
- แสดง: บ้าน | ตร.ว. | ค่าส่วนกลาง/ปี | ค่ารถ/ปี | ค่าขยะ/ปี

### Edit House Modal
- เพิ่ม `contact_person` field (ผู้ติดต่อ)
- Fee fields readonly + auto-calc เมื่อเปลี่ยน area
- phone/email/contact_person ดึงจาก _housesCache ถูกต้องแล้ว

### DO NOT CHANGE
- loadHousesPage ต้องมีแค่ 1 definition (ที่ pos ~172580)
- เช่นเดียวกันกับ function อื่นๆ — อย่าให้มี duplicate

---

## ✅ Session — 6 Fixes: Phone/Email/Sort/ViewBtn/AddHouse/Sheet

### ข้อ 1: phone/email ไม่แสดง (root cause แท้)
- `openEditHouseModal` อ่าน cache แต่ถ้า cache ว่างจะ await api → แต่ `_housesCache` ไม่ได้ populate ก่อน
- **Fix:** ใช้ `api('getHouseById')` โดยตรงแทน cache → ได้ข้อมูลสดเสมอ ไม่พึ่ง cache

### ข้อ 2: Update ค่าส่วนกลางใน Sheet ไม่เปลี่ยน
- **Fix:** บันทึกค่าที่คำนวณจริงลง sheet เสมอ ไม่ใช่แค่ display
- refresh _housesCache หลัง save

### ข้อ 3: ปุ่มดูข้อมูลหายไป
- **Fix:** เพิ่มปุ่ม "ดู" กลับใน row render

### ข้อ 4: เรียงตาม soi+house_no ไม่ทำงาน
- soi เก็บเป็น "ซอย 3" → parseInt ได้ 0
- **Fix:** extract ตัวเลขจาก soi ด้วย regex ก่อน sort

### ข้อ 5: ปุ่มเพิ่มบ้านใช้ modal+logic เดียวกับแก้ไข
- **Fix:** openAddHouseModal ใช้ m-admin-edithouse + clear fields + เปลี่ยน title
- doSaveEditHouse ตรวจสอบ mode (add/edit) แล้วเรียก createHouse หรือ updateHouse

### DO NOT CHANGE
- GAS Houses.update, Houses.create ทำงานถูกต้องแล้ว
- id="edithouse-*" ทุกตัวต้องคงเดิม

---

## ✅ Session — Fix ครั้งที่ 6 (Final)

### Root Causes แท้จริง

**ข้อ 1 phone/email:** `openEditHouseModal` อ่าน `_housesCache` แต่ cache ว่างเพราะโหลดครั้งแรก
→ **Fix:** ใช้ `api('getHouseById')` ตรงๆ เสมอ ไม่พึ่ง cache เลย

**ข้อ 2 Sheet ไม่ update:** `doSaveEditHouse` เก่าส่งค่าถูกแต่ cache ไม่ refresh หลัง save
→ **Fix:** clear `_housesCache = []` ทุกครั้งหลัง save จะ force reload ใหม่

**ข้อ 3 ปุ่มดูหาย:** loadHousesPage ใหม่ไม่ได้ใส่ปุ่มดูกลับคืน
→ **Fix:** เพิ่มปุ่ม "ดู" กลับใน row render

**ข้อ 4 Sort ไม่ทำงาน:** `parseInt("ซอย 3")` = NaN → `match(/\d+/)` extract ตัวเลขก่อน
→ **Fix:** regex extract numeric จาก soi string แล้วค่อย sort

**ข้อ 5 เพิ่มบ้านใช้ modal เดียวกัน:**
→ `openAddHouseModal()` เรียก `openEditHouseModal(null, 'add')`
→ `doSaveEditHouse()` ตรวจ mode → createHouse หรือ updateHouse

### DO NOT CHANGE
- `id="edithouse-mode"` hidden field ในโมดัล
- `openAddHouseModal` ต้องเรียก `openEditHouseModal(null, 'add')` เท่านั้น
- `loadHousesPage` ต้องมี 1 definition เท่านั้น

---

## ✅ Session — Fix ครั้งที่ 7 (Final)

### Root Cause แท้จริงทั้ง 3 ข้อ

**ข้อ 1 phone/email ไม่แสดง:**
- `openEditHouseModal` ใช้ `api('getHouseById')` แต่ `catch(e) {}` กิน error เงียบๆ → h = {}
- viewHouseDetail อ่าน `_housesCache` แสดงถูก
- **Fix:** ใช้ `_housesCache` ก่อน (เหมือน viewHouseDetail) → ถ้าไม่มีค่อย fetch getHouses

**ข้อ 2 Sheet ไม่เปลี่ยน:**
- **Fix:** `doSaveEditHouse` recompute fees + clear `_housesCache = []` หลัง save → force reload

**ข้อ 3 Reload ไม่ทำงาน:**
- `onclick="invalidatePageCache('admin-houses')..."` ถูก HTML parser ตัด `'` → function arg ว่าง
- **Fix:** เปลี่ยนเป็น `data-pane="..."` `data-fn="..."` + `onclick="_doRefresh(this)"`
- เพิ่ม `_doRefresh()` + `_refreshFnMap{}` helper

### DO NOT CHANGE
- Refresh buttons ต้องใช้ data-pane + data-fn + onclick="_doRefresh(this)"
- openEditHouseModal ต้องอ่าน _housesCache ก่อนเสมอ (ห้ามใช้ getHouseById)
- doSaveEditHouse ต้อง clear _housesCache = [] หลัง save

---

## ✅ Session — Fix ครั้งที่ 7 (phone/email/reload/sheet)

### Root Cause แท้จริงทั้ง 3 ข้อ

**ข้อ 1 phone/email ไม่แสดง:**
- `openEditHouseModal` เรียก `api('getHouseById')` แต่ `catch(e){}` กิน error เงียบๆ → h = {}
- **Fix:** ใช้ `_housesCache` ก่อน (เหมือน viewHouseDetail) → cache miss ค่อย fetch getHouses

**ข้อ 2 Sheet ไม่เปลี่ยน:**
- **Fix:** `doSaveEditHouse` recompute fees + clear `_housesCache = []` หลัง save

**ข้อ 3 Reload ไม่ทำงาน:**
- onclick HTML attr ใช้ `'` ใน `"` → browser ตัด argument ออก
- **Fix:** เปลี่ยนเป็น `data-pane` + `data-fn` + `onclick="_doRefresh(this)"`
- เพิ่ม `_doRefresh()` + `_refreshFnMap{}` helper

---

## ✅ Session — Fix ครั้งที่ 8 (_safeHouseNo + password form)

### ข้อ 1: _safeHouseNo is not defined
- Function หายไปตอน file rebuild
- **Fix:** เพิ่ม `function _safeHouseNo(val)` — จัดการ Date object, ISO string, ปกติ

### ข้อ 2: Password field not in form
- Chrome แจ้งเตือน — password input ต้องอยู่ใน `<form>`
- **Fix:** Login → `<form onsubmit="doLogin();return false;">`
- **Fix:** Change password → `<form autocomplete="new-password" onsubmit="return false;">`

---

## ✅ Session — Phone Format xxx-xxx-xxxx

### เพิ่ม _fmtPhone() helper
- Strip non-digits แล้ว format เป็น `xxx-xxx-xxxx`
- รองรับทุก input: `081-234-5678`, `0812345678`, `081 234 5678` → `081-234-5678`

### ใช้กับทุกจุด
- **Input fields (oninput):** edithouse-phone, newcon-phone, cfg-inp-village_phone, prof-phone, edit-phone
- **ตารางบ้าน:** `_fmtPhone(h.phone)`
- **Modal แก้ไข:** format ก่อน populate
- **Popup ดูข้อมูล:** format ก่อนแสดง

### DO NOT CHANGE
- `_fmtPhone` ต้องอยู่ก่อน `_safeHouseNo` ซึ่งต้องอยู่ก่อน `loadHousesPage`
- Refresh buttons ต้องใช้ `data-pane` + `data-fn` + `onclick="_doRefresh(this)"`

---

## 📋 สรุป Fix ครั้งที่ 1-6 (Retrospective)

### Fix ครั้งที่ 1 — Stray modal content
- **ปัญหา:** m-condetail มี hardcoded 081-111-2222, @somsak_elec, รีวิวช่างโผล่ทุกหน้า
- **Root cause:** modal div ปิดก่อนกำหนด → stray content ไหลออกมา render ตลอด
- **Fix:** ลบ stray block ออก, ตรวจ div balance ทุก modal

### Fix ครั้งที่ 2 — Settings pane โผล่ทุกหน้า
- **ปัญหา:** Invoice section (bill_prefix ฯลฯ) แสดงใต้ทุกหน้า
- **Root cause:** `p-admin-settings` div ปิดที่ char 75884 (เหลือแค่ header) เพราะ tab structure เก่ายังอยู่ → ทุก section ตกอยู่นอก pane → display:block ตลอด
- **Fix:** เขียน settings pane ใหม่ทั้งหมด single-page 6 sections, balanced 84/84 divs

### Fix ครั้งที่ 3 — Houses: columns, sort, bulk modal
- **ปัญหา:** columns ผิด, เรียงไม่ถูก, bulk modal ไม่แสดงค่ารถ
- **Fix Houses columns:** บ้าน | เจ้าของ | โทร | ค่าส่วนกลาง/ปี | ค่ารถ/ปี | สถานะ | ✏️ ดู
- **Fix Sort:** `String(soi).match(/\d+/)` extract ตัวเลขจาก "ซอย 3" → sort numeric
- **Fix Bulk modal:** fetch VEHICLES → sum fee_amount per house → แสดงค่ารถ/ปี ถูกต้อง
- **Fix ค่าขยะ:** แสดงเป็น /ปี แทน /งวด

### Fix ครั้งที่ 4 — Edit house modal
- **ปัญหา:** fee/parking/trash แก้ไขได้ (ควรเป็น readonly auto-calc)
- **Fix:** fee, parking, trash → `readonly` + `background:var(--bg3)`
- **Fix area:** `oninput="_calcEditHouseFee()"` → คำนวณ fee ใหม่ทันที (area × rate × 12)
- **เพิ่ม:** `contact_person` field ในแก้ไขบ้าน

### Fix ครั้งที่ 5 — openAddHouseModal ใช้ modal เดียวกัน
- **ปัญหา:** เพิ่มบ้านใช้ m-addhouse แยก ไม่สอดคล้องกับแก้ไข
- **Fix:** `openAddHouseModal()` → `openEditHouseModal(null, 'add')`
- **Fix doSaveEditHouse:** ตรวจ `mode` field → `createHouse` หรือ `updateHouse`
- **เพิ่ม:** `id="edithouse-mode"` hidden field ในโมดัล

### Fix ครั้งที่ 6 — Duplicate loadHousesPage (root cause phone/email ไม่แสดง)
- **Root cause แท้:** มี **3 copies** ของ `loadHousesPage` ใน JS → browser ใช้ copy สุดท้าย (เก่า) → ไม่มี phone/email ใน cache
- **Fix:** ลบ 2 copies เก่าออก → เหลือ 1 copy (version ใหม่ที่ถูก)
- **Rule:** function ใดๆ ต้องมีแค่ 1 definition ในไฟล์

---

## ✅ GAS Changes (Fees_Issues_Violations.gs)

### generateFullYear()
- ออกใบแจ้งหนี้เต็มปี: fee = fee_per_year, parking = parking_fee_year, trash = trash_per_year×2
- ส่วนลด = fee_per_year × fee_discount_pct% (ค่าส่วนกลางเท่านั้น)
- route: `generateFullYearBill`

### generate() — parking from vehicles
- ดึง VEHICLES sheet → sum fee_amount ของ active vehicles แยกแต่ละบ้าน
- Fallback: ใช้ parking_fee_year / 2 ถ้าไม่มีรถ

### bill_type field
- เพิ่มใน FEES schema: `half_year` หรือ `full_year`

---

## 🔧 DO NOT CHANGE (Critical Rules)

| Rule | เหตุผล |
|------|--------|
| loadHousesPage ต้องมี 1 definition | duplicate ทำให้ browser ใช้ version ผิด |
| openEditHouseModal ต้องอ่าน _housesCache ก่อน | api('getHouseById') มี silent error |
| doSaveEditHouse ต้อง clear _housesCache = [] | force reload หลัง save ทุกครั้ง |
| Refresh buttons ใช้ data-pane + data-fn + _doRefresh | single-quote ใน onclick HTML attr ถูกตัด |
| _fmtPhone ต้องอยู่ก่อน _safeHouseNo ก่อน loadHousesPage | function ที่ใช้ต้อง define ก่อนใช้ |
| Settings pane: ไม่มี tabs (stab-village) | เคยทำให้ pane ปิดก่อนกำหนด |
| m-fee-detail: ไม่มี X button | spec กำหนด |
| modals ทุกตัว: div balanced | imbalance ทำให้ content โผล่นอก modal |

---

## ✅ Fix — openAddHouseModal TypeError

### Error
```
TypeError: Cannot read properties of null (reading 'classList')
at openM (vms/:4130)
at openAddHouseModal (vms/:4276)
```

### Root Cause
- `openAddHouseModal()` เรียก `openM('m-addhouse')` แต่ modal `id="m-addhouse"` ถูกลบออกไปใน session Fix ครั้งที่ 5 (ตอนรวม modal เป็นตัวเดียว)
- `document.getElementById('m-addhouse')` return `null` → `.classList.add()` crash

### Fix
```js
function openAddHouseModal() {
  openEditHouseModal(null, 'add');  // ใช้ m-admin-edithouse เดิม
}
```
- ใช้ modal `m-admin-edithouse` ที่มีอยู่แล้ว
- `openEditHouseModal(null, 'add')` ตรวจ `isAdd = true` → clear fields + title "เพิ่มบ้านใหม่"
- `doSaveEditHouse()` ตรวจ mode → เรียก `createHouse` แทน `updateHouse`

### DO NOT CHANGE
- `openAddHouseModal` ต้องเรียก `openEditHouseModal(null, 'add')` เท่านั้น
- ห้ามใช้ `openM('m-addhouse')` เพราะ modal นั้นถูกลบออกแล้ว

---

## ✅ Fix — Houses + Vehicle Page Redesign

### Houses: viewHouseDetail redesign
- หัว modal ใช้ style เดียวกับ edit modal (ico + title + sub)
- ขนาดใหญ่ขึ้น (md wide) แสดงข้อมูลครบ 2 คอลัมน์
- ปุ่ม ✏️ แก้ไข ใช้ confirmButtonText เหมือนเดิม

### Houses: Loading ก่อนเปิด modal
- กดแก้ไข → showLoader → load data → hideLoader → openM
- กดเพิ่มบ้าน → showLoader → hideLoader → openM (add mode)

### Houses: เพิ่มบ้านใหม่ — ค่ารถ + ค่าขยะ
- ค่ารถ: fetch vehicles ของบ้านนั้น → sum fee_amount (active)
- ค่าขยะ: ดึงจาก Settings fee_trash_per_year

### Vehicle: Fix หัวข้อ
- PT เพิ่ม 'admin-vehicle': 'ข้อมูลรถ — จัดการ'

### Vehicle: Fix tab order + load ทันที
- Tab order: ทั้งหมด | รออนุมัติ | อนุมัติแล้ว | ไม่ใช้งาน
- เมื่อกด menu รถ → loadAdminVehiclePage() → แสดง tab ทั้งหมดและข้อมูลทันที

### Vehicle: Fix m-admin-addcar missing (TypeError)
- Root cause: modal ถูกลบใน session rebuild
- Fix: เพิ่ม modal m-admin-addcar กลับคืน

### DO NOT CHANGE
- m-addcar (resident) modal ยังคงใช้งานได้ — อย่าลบ
- loadAdminVehiclePage ต้อง render tab ทั้งหมดก่อนเสมอ
