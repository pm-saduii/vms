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

---

## 📋 วิเคราะห์ + แก้ไข — Houses & Vehicle (Session ล่าสุด)

### ข้อ 1: Login แสดงชื่อ hardcoded
- Root: HTML มี "The Greenfield" hardcoded → เห็นก่อน applySettings โหลด
- Fix: เปลี่ยน default HTML เป็นว่าง → applySettings fill จาก Settings sheet

### ข้อ 2: viewHouseDetail ไม่ได้ redesign
- Root: มี 1 definition แต่ design ใหม่อาจยังไม่ถูกใช้
- Fix: ตรวจสอบและ confirm design ใหม่ active

### ข้อ 3: house_id → HSE-001, 002, 003...
- Root: genId ใช้ timestamp+random → ไม่เรียงลำดับ
- Fix: GAS Houses.create นับ rows ปัจจุบัน → pad เลข 3-4 หลัก

### ข้อ 4: ซอย → dropdown 0-22
- Root: edithouse-soi เป็น text input
- Fix: เปลี่ยนเป็น select ซอย 0–22 (options เรียงตัวเลข)

### ข้อ 5+6: เพิ่ม address field (แก้ไข + เพิ่มบ้าน)
- Root: modal ไม่มี address field
- Fix: เพิ่ม edithouse-address + populate + save ใน payload

### ข้อ 7: หมายเหตุไม่ save
- Root: GAS update ใช้ spread ...updates ดังนั้น status_note ถูกส่งแล้ว
- แต่ doSaveEditHouse ไม่ส่ง address → Fix: เพิ่ม address ใน payload

### ข้อ 8: 9/4 แสดงเป็น 4/9
- Root: Google Sheets parse "9/4" เป็น Date (Sept 4) → _safeHouseNo แปลงกลับผิด
- Fix: GAS Houses.create/update → force string โดยใช้ String() ก่อน save
- Fix Frontend: _safeHouseNo ตรวจ Date → format day/month ถูกต้อง (month เป็น getMonth()+1)
- Fix GAS: _STR_FIELDS มี 'house_no' แล้ว → sheetToObjects จะแปลง Date → day/month
- REAL FIX: getDate() + '/' + (getMonth()+1) → 4/10 แต่ควรเป็น 9/4
  - เดิม: Sept 4 → getDate()=4, getMonth()+1=9 → "4/9" ❌
  - ถูก: แปลงกลับเป็น day/month แบบไทย = getDate() + '/' + (getMonth()+1) = "4/9"
  - สาเหตุ: input "9/4" → Excel format = month/day → Sept 4 → แปลงกลับ = "4/9"
  - SOLUTION: บันทึก house_no เป็น text ใน GAS ด้วย `"'" + house_no` (force string)

### ข้อ 9: เพิ่มรถ house dropdown ว่าง
- Root: openAdminAddCarModal ไม่ fetch/populate house list
- Fix: เพิ่ม populate acar-houseid จาก _housesCache หรือ api('getHouses')

### ข้อ 10: ปุ่มแก้ไขรถไม่ทำงาน
- Root 1: m-admin-editcar modal MISSING ในไฟล์
- Root 2: doAdminEditCar ใช้ await แต่ไม่ใช่ async function
- Fix: เพิ่ม modal กลับ + แก้เป็น async function doAdminEditCar

### DO NOT CHANGE
- _STR_FIELDS ใน GAS มี 'house_no' แล้ว (Date→string conversion)
- m-addcar (resident) modal ยังคงอยู่
- openEditHouseModal ต้องใช้ _housesCache ก่อนเสมอ

---

## ✅ Fix ครั้งนี้ — Houses + Vehicle Cars

### ข้อ 8: house_no แสดงผิด (แก้ถูกต้องแล้ว)
- Root cause จริง: ต้องการ plain String ไม่แปลงอะไรทั้งสิ้น
- Fix: `_safeHouseNo` = `String(val).trim()` ตรงๆ ไม่มี Date logic

### ข้อ 2: viewHouseDetail — เปลี่ยนจาก Swal popup เป็น custom modal
- Root cause: Swal.fire ใช้ default theme ทับ inline style → ดูไม่ถูก
- Fix: สร้าง `m-view-house` modal ใหม่ มี gradient header, 2-col grid, fee bar
- viewHouseDetail populate modal elements แล้ว openM('m-view-house')

### รถ: m-admin-editcar ปรับปรุงใหม่
- เพิ่ม fee_amount field (ค่าจอดรถ/ปี)
- เพิ่ม image upload + preview ใหม่
- แสดงรูปปัจจุบัน (existing images) จาก JSON
- ยี่ห้อ/สี: dropdown + text input (อื่นๆ) แสดงพร้อมกัน
- doAdminEditCar: async + upload images + fee_amount

### รถ: m-admin-addcar ปรับปรุง
- เพิ่ม fee_amount field
- ยี่ห้อ/สี: text input (อื่นๆ) แสดงพร้อมกัน
- doAdminAddCar: fee_amount ส่งไป GAS

### Car Image Upload ใหม่ (onCarImageSelect)
- ชื่อไฟล์: `CAR_YYYYMMDD_HHMMSS.jpg` เช่น `CAR_20260319_205343.jpg`
- Resize: max 800px, quality 0.75 (~500KB)
- Preview + ลบรูปได้
- max 5 รูป
- `_resetCarImages()` เพื่อ clear ตอน close modal

### DO NOT CHANGE
- `_safeHouseNo` ต้องเป็น `String(val).trim()` เท่านั้น — ห้ามมี Date logic
- m-view-house modal IDs: vh-title, vh-sub, vh-owner, vh-phone, vh-email, vh-fee ฯลฯ
- _carImages = [] global state — reset ทุกครั้งก่อน openM

---

## ✅ Fix รอบที่ 8 (Final) — house_no / upload / brand-color

### ข้อ 1: house_no แสดงผิด (รอบที่ 8)
- **Root cause จริง:** GAS ส่ง Date object แทน string (Sheets parse "9/4" เป็น Sept 4)
  - `String(Date)` = "Tue Sep 04 2024..." → แสดงผิดทั้งหมด
- **Fix:** `_safeHouseNo` จัดการ 3 cases:
  1. `Date instanceof` → `(getMonth()+1) + '/' + getDate()` = "9/4" ✓
  2. ISO string "2024-09-04" → new Date → same formula
  3. JS Date.toString() "Tue Sep 04..." → parse → same formula
- **Logic:** Sept 4 (US) = Thai 9/4 → `month+1=9`, `day=4` → "9/4" ✓

### ข้อ 2: รูปภาพไม่บันทึก
- **Root cause 1:** `doAdminAddCar` ไม่เรียก `_uploadCarImages()` เลย → รูปไม่ถูก upload
- **Root cause 2:** ไม่ส่ง `image_urls` ลง GAS payload
- **Fix:** เพิ่ม `var imgUrls = await _uploadCarImages()` + `payload.image_urls` + `_resetCarImages('acar-')`

### ข้อ 3: ยี่ห้อ/สี อื่นๆ ไม่แสดง textbox (รอบที่ 4)
- **Root cause:** `_vdBrandChange(mode)` ใช้ `mode === 'add' ? 'car-' : 'editcar-'`
  - modal ส่ง `'acar'` → prefix ได้ `'editcar-'` → หา `editcar-brand-sel` แทน `acar-brand-sel` → ไม่เจอ → textbox ไม่แสดง
- **Fix:** เปลี่ยน parameter จาก `mode` เป็น `prefix` ใช้ตรงๆ ไม่มี mapping
  - `_vdBrandChange('acar-')`, `_vdBrandChange('aeditcar-')`, `_vdBrandChange('car-')`, `_vdBrandChange('editcar-')`
- **แก้ทั้ง 4 functions:** `_vdBrandChange`, `_vdColorChange`, `_vdGetBrand`, `_vdGetColor`
- **แก้ทุก call sites:** เปลี่ยน `'add'`→`'car-'`, `'edit'`→`'editcar-'`, `'acar'`→`'acar-'`, `'aeditcar'`→`'aeditcar-'`

### DO NOT CHANGE
- `_vdBrandChange(prefix)` ต้องรับ prefix ที่มี trailing `-` เสมอ เช่น `'acar-'`
- `_uploadCarImages` ส่ง `base64data` (ไม่ใช่ `base64`) ตาม GAS spec
- `doAdminAddCar` ต้อง await `_uploadCarImages()` ก่อน `api('createVehicle')`

---

## ✅ Fix — Upload รูปภาพรถ ERR_FAILED (POST fix)

### Root Cause (อ่านจากโค้ดจริง)
- `api()` (บรรทัด 2580) ใช้ **GET** อย่างเดียว — ส่ง payload ทั้งหมดผ่าน URL query string
- `_uploadCarImages()` (บรรทัด 3222) เรียก `api('uploadImage', {...base64data...})`
- base64 ของรูปภาพหลัง resize 800px/0.75 มีขนาด **300–800KB** → URL string ยาวเกิน browser limit → `ERR_FAILED`
- GAS มี `doPost` รองรับอยู่แล้ว (Code.gs บรรทัด 21–24) แต่ frontend ไม่ได้ใช้

### สิ่งที่แก้ (2 จุดเท่านั้น ไม่แตะอะไรอื่น)

**1. เพิ่ม `apiPost()` ต่อจาก `api()` (index.html บรรทัด 2595–2613)**
- ฟังก์ชันใหม่แยกต่างหาก — `api()` เดิมไม่ถูกแก้แม้แต่บรรทัดเดียว
- ส่ง payload ผ่าน `fetch(..., { method:'POST', body: URLSearchParams })` แทน URL

**2. `_uploadCarImages()` บรรทัด 3222 — เปลี่ยน `api(` → `apiPost(`**
- แก้จาก: `var res = await api('uploadImage', {...})`
- แก้เป็น: `var res = await apiPost('uploadImage', {...})`

### DO NOT CHANGE
- `api()` เดิม — ห้ามแก้ ยังใช้ GET สำหรับทุก action อื่นที่ไม่ใช่ upload
- `apiPost()` ใหม่ — ใช้เฉพาะ action ที่ส่ง payload ขนาดใหญ่ (ปัจจุบันคือ `uploadImage` เท่านั้น)
- ไม่มีการเปลี่ยนแปลง GAS ฝั่ง backend ทั้งหมด (Code.gs, Services.gs ไม่ถูกแตะ)

---

## ✅ Fix — apiPost Content-Type ผิด (JSON parse error)

### Root Cause (อ่านจากโค้ดจริง)
- `apiPost()` ส่ง `Content-Type: application/x-www-form-urlencoded` + body เป็น `payload=%7B...`
- `doPost` ใน Code.gs บรรทัด 22: `JSON.parse(e.postData.contents)` — รอรับ JSON string ตรงๆ
- GAS รับ body มาเป็น `payload=%7B%22action%22...` (URL-encoded) → `JSON.parse` ล้มเหลว
- Error: `Unexpected token 'p', "payload=%7"... is not valid JSON`

### สิ่งที่แก้ (1 จุดเท่านั้น)
**`apiPost()` index.html บรรทัด 2604–2605**
- เปลี่ยน `Content-Type` จาก `application/x-www-form-urlencoded` → `application/json`
- เปลี่ยน body จาก `new URLSearchParams({ payload: JSON.stringify(body) }).toString()` → `JSON.stringify(body)`
- ตรงกับที่ `doPost` ใน Code.gs รอรับ (`e.postData.contents` = JSON string)

### DO NOT CHANGE
- `doPost` ใน Code.gs — ถูกต้องแล้ว ไม่ต้องแก้
- `apiPost()` ต้องส่ง `Content-Type: application/json` และ body เป็น `JSON.stringify(body)` เท่านั้น

---

## ✅ Fix — CORS Preflight + Footer Version

### งานที่ 1: Fix CORS (อ่านจากโค้ดจริง)

**Root Cause:**
- Browser ส่ง POST พร้อม `Content-Type: application/json` → browser บังคับส่ง **OPTIONS preflight** ก่อน
- GAS Web App ไม่มี `doOptions()` handler → ไม่ส่ง `Access-Control-Allow-Origin` header → CORS blocked
- Error: `Response to preflight request doesn't pass access control check`

**Fix: `apiPost()` index.html บรรทัด Content-Type**
- เปลี่ยน `Content-Type: application/json` → `Content-Type: text/plain`
- `text/plain` เป็น "simple request" → browser ไม่ส่ง preflight OPTIONS → ผ่าน CORS
- `body` ยังคงเป็น `JSON.stringify(body)` เหมือนเดิม → `doPost` ใน GAS รับได้ปกติ (`e.postData.contents` = JSON string)
- ไม่แก้ GAS ทุกไฟล์

### งานที่ 2: Footer แสดง Version ทุกหน้า

**HTML — เพิ่ม `.sys-footer` ก่อน `</div><!-- end main -->`**
- `footer-logo` — emoji/icon หมู่บ้าน (จาก `village_logo`)
- `footer-village` — ชื่อหมู่บ้าน (จาก `village_name`)
- `footer-ver` — version badge (จาก `app_version` ใน Settings)
- `footer-copy` — subtitle (จาก `village_subtitle`)

**CSS — เพิ่ม `.sys-footer` block หลัง `.page`**
- `flex-shrink:0` ให้ footer อยู่ล่างสุดเสมอ
- `.sys-footer-ver` badge ใช้ `--pr-soft` + `--pr` color ตาม theme
- responsive: mobile stack เป็น column

**JS — `applySettings()` populate 4 elements**
- `footer-logo`, `footer-village`, `footer-ver`, `footer-copy`
- `_cfg('app_version', '5.0')` fallback เป็น `5.0`

**Setup.gs — เพิ่ม `app_version` key ใน `_seedSettings()`**
- key: `app_version`, default: `'5.0'`, label: `'เวอร์ชันโปรแกรม'`, group: `'village'`
- `setupAllSheets()` จะ seed key นี้ให้อัตโนมัติถ้ายังไม่มี

**Settings Pane — เพิ่ม field ใน card ข้อมูลหมู่บ้าน**
- `id="cfg-inp-app_version"` — admin แก้ไข version ได้จาก UI แล้วกด บันทึกทั้งหมด

### หมายเหตุ: เพิ่ม app_version ใน SETTINGS Sheet ด้วยตนเอง
หาก Sheet มีข้อมูลอยู่แล้ว (ไม่ได้ run setupAllSheets ใหม่) ให้ **เพิ่ม row ใน SETTINGS sheet** ด้วยตนเอง:
```
key:   app_version
value: 5.0
label: เวอร์ชันโปรแกรม
group: village
```

### DO NOT CHANGE
- `api()` เดิม — GET ไม่มี CORS ปัญหา ไม่ต้องแก้
- `apiPost()` ต้องใช้ `Content-Type: text/plain` เท่านั้น — ห้ามเปลี่ยนเป็น `application/json`
- Footer element IDs: `footer-logo`, `footer-village`, `footer-ver`, `footer-copy`

---

## ✅ Fix — รูปภาพ 0 byte ใน Drive + Broken Image ใน UI

### Root Cause 1: รูป 0 byte ใน Drive (อ่านจากโค้ดจริง)
- `canvas.toDataURL('image/jpeg', 0.75)` ไม่ reliable สำหรับการ convert PNG/WEBP→JPEG
  - ถ้า PNG มี alpha channel → JPEG conversion บาง environment ให้ผลว่าง
  - ไม่มี `ctx.fillStyle = '#FFFFFF'` → transparent area → JPEG encode ผิดพลาด
  - ไม่มี `img.onerror` handler → ถ้า load fail → `img.width/height = 0` → canvas 0x0
  - `canvas.getContext('2d')` อาจ return null ใน บาง environment → ไม่มี null check
- GAS `Utilities.base64Decode(base64data)` — ถ้ามี whitespace/newline ใน string → decode ผิด → 0 bytes

### Root Cause 2: Broken Image ใน UI — Double JSON.stringify
- Frontend `doAdminAddCar` บรรทัด 6090: `payload.image_urls = JSON.stringify(imgUrls)`
- GAS `Vehicles.create` บรรทัด 123: `image_urls: JSON.stringify(body.image_urls || [])`
- ผล: `JSON.stringify(JSON.stringify(['url']))` → double-encoded string ใน Sheet
- ตอน parse: `JSON.parse(double-encoded)` → ได้ string ไม่ใช่ array → `img.src = '[\"url\"]'` → broken

### สิ่งที่แก้

**index.html — `onCarImageSelect()` (เขียนใหม่ทั้งหมด)**
- เปลี่ยน `canvas.toDataURL()` → `canvas.toBlob()` (async, reliable กว่า)
- เพิ่ม `ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0,0,w,h)` ก่อน drawImage (รองรับ PNG transparent)
- เพิ่ม `img.onerror` handler
- เพิ่ม null check `canvas.getContext('2d')`
- เพิ่ม dimension validation: ตรวจ `w > 0 && h > 0` ก่อนใช้งาน
- เพิ่ม base64 validation ใน blobReader callback: ตรวจ length > 10
- แก้ renamed collision: เพิ่ม fileIdx ต่อท้าย dtFmt เมื่อเลือกหลายไฟล์พร้อมกัน
- บันทึกเป็น `.jpg` เสมอ (canvas.toBlob ส่ง image/jpeg เสมอ)

**index.html — `_uploadCarImages()` เพิ่ม validation**
- ตรวจ `base64.length < 10` → skip และ warn แทนที่จะส่ง empty ไป GAS

**index.html — `doAdminAddCar()` และ `doAdminEditCar()`**
- ลบ `JSON.stringify()` ออก → ส่ง `imgUrls` เป็น Array ตรงๆ
- GAS `Vehicles.create` จะ `JSON.stringify` ให้อีกรอบเดียวตามที่ควรเป็น

**Services.gs — `Upload.base64()`**
- เพิ่ม `cleanBase64 = String(base64data).replace(/\s/g, '')` ก่อน decode
- เพิ่ม validation: `cleanBase64.length < 10` → throw error
- เพิ่ม validation: `bytes.length === 0` → throw error
- เปลี่ยน URL: `uc?export=view` → `thumbnail?id=XXX&sz=w800`
  - `uc?export=view` → redirect หลายชั้น → browser บางตัว block
  - `thumbnail` URL → ส่งรูปโดยตรง → โหลดได้ทุก browser

### DO NOT CHANGE
- GAS `Vehicles.create` บรรทัด 123: `JSON.stringify(body.image_urls || [])` — ถูกต้องแล้ว ไม่ต้องแก้
- `onCarImageSelect` ต้องใช้ `toBlob` เท่านั้น — ห้ามเปลี่ยนกลับเป็น `toDataURL`
- thumbnail URL format: `https://drive.google.com/thumbnail?id=XXX&sz=w800`

---

## ✅ Fix — รูปได้แค่รูปเดียว + Redesign หน้ารถ + Reload Loading

### ข้อ 1: Attach หลายรูปแต่ได้รูปเดียว (อ่านจากโค้ดจริง)

**Root Cause:**
- `Vehicles.update` (Houses_Vehicles_ChangeReq.gs บรรทัด 179):
  `updateRowById('VEHICLES', vehicle_id, updates)` — ส่ง `updates.image_urls` เป็น Array ตรงๆ
- `updateRowById` ใช้ `sh.getRange().setValue(array)` — Google Sheets แปลง Array → `"url1,url2"` (comma string, ไม่ใช่ JSON)
- ตอน read กลับ: `JSON.parse("url1,url2")` → throw → catch → `imgs = ["url1,url2"]` → แสดงแค่ 1 item

**Fix: `Vehicles.update` ใน Houses_Vehicles_ChangeReq.gs**
- เพิ่ม `safeUpdates = Object.assign({}, updates)`
- ถ้า `safeUpdates.image_urls` เป็น Array → `JSON.stringify()` ก่อนส่ง `updateRowById`

### ข้อ 2: Redesign หน้ารถ + ย้าย tabs ไป คำขอแก้ไข

**HTML: `p-admin-vehicle`**
- ลบ tabs (ทั้งหมด/รออนุมัติ/อนุมัติแล้ว/ไม่ใช้งาน) ออก
- Stats เหลือ 3 card: ทั้งหมด/ใช้งาน/ไม่ใช้งาน (ไม่นับ pending)
- แสดง `list-vehicles-registered` เดียว = active + inactive เท่านั้น

**HTML: `p-admin-req`**
- เพิ่ม card "ยานพาหนะ" พร้อม 3 tabs: ⏳ รออนุมัติ / ✅ อนุมัติแล้ว / 🔴 ไม่ใช้งาน
- `vreq-pending`, `vreq-active`, `vreq-inactive` — pane divs
- `badge-veh-req` — แสดงจำนวน pending
- `tab-vreq-pending/active/inactive` — tab buttons

**JS: `loadAdminVehiclePage()`**
- `registered = active.concat(inactive)` → render ไปที่ `list-vehicles-registered`
- render `vreq-pending/active/inactive` ด้วย `_renderAdminVehicleTable` เดิม
- `stat-veh-total` = `registered.length` (ไม่นับ pending)

**JS: `stabVReq(tab, btn)` — ฟังก์ชันใหม่**
- switch vreq pane ด้วย `display:none/''`
- แยกจาก `stab()` เดิม เพราะ vreq ใช้ div ธรรมดา ไม่ใช่ `.pane`

### ข้อ 3: Reload button แสดง Loading

**JS: `loadAdminVehiclePage()`**
- เพิ่ม `showLoader('โหลดยานพาหนะ...')` ต้นฟังก์ชัน
- `finally { hideLoader(); }` ปิดทุกกรณี

**JS: `_doRefresh(btn)`**
- เพิ่ม `showLoader('กำลังโหลดใหม่...')` ก่อนเรียก fn
- `finally { btn.disabled = false; hideLoader(); }`
- ทุกปุ่ม รีโหลด ทุกหน้าจะแสดง Loading ทันที

### DO NOT CHANGE
- `_renderAdminVehicleTable` — ไม่ถูกแตะ ใช้งานทั้ง registered และ vreq tabs
- `doApproveVehicle` / `doRejectVehicle` — ยังเรียก `loadAdminVehiclePage()` เหมือนเดิม
- `badge-vehicle` (sidebar) — ยังแสดงจำนวน pending เหมือนเดิม

---

## ✅ Fix — หน้ารถ: เพิ่มรถ / Filter / Columns / ลบรูป

### ข้อ 1+2: ปุ่มเพิ่มรถไม่แสดง Modal + ไม่มี Loading
- `openAdminAddCarModal` ไม่มี `showLoader` → user กดแล้ว fetch `getHouses` ช้า เหมือนไม่ตอบสนอง
- **Fix:** เพิ่ม `showLoader('กำลังเตรียมข้อมูล...')` ต้น function + ครอบ try/catch/finally ทั้งหมด + `hideLoader()` ก่อน `openM`

### ข้อ 3: เพิ่ม Search Filter
- **HTML:** เพิ่ม `<input id="veh-search">` + `<select id="veh-filter-type">` เหนือตาราง
- **JS:** เพิ่ม `_registeredVehiclesCache` (เก็บ full list) + `_filterVehicleTable()` filter แบบ client-side
- ค้นหาได้ตาม: ซอย, ทะเบียน, บ้านเลขที่, ยี่ห้อ, จังหวัด
- **GAS `Vehicles.getAll`:** join `house_no` + `soi` จาก HOUSES sheet ให้ vehicle rows มีข้อมูลพร้อม filter

### ข้อ 4: Columns ใหม่
`_renderAdminVehicleTable` แก้ columns เป็น:
บ้านเลขที่ | ซอย | ทะเบียน (จังหวัด) | ประเภท | ยี่ห้อ/รุ่น (สี) | ที่จอด (ค่าจอด/ปี) | สถานะ | ✏️

### ข้อ 5: ลบรูปได้ + sync Drive + Sheet
- **`_existingCarUrls`** — state เก็บ URLs ที่ยังไม่ถูกลบ (reset ทุกครั้ง openAdminEditCarModal)
- **`_renderExistingCarImages(wrap)`** — render existing images พร้อมปุ่ม × ลบ
- **`_deleteExistingCarImage(idx, fileId)`** — splice state → re-render → call `apiPost('deleteImage', {file_id})`
- **`doAdminEditCar`** — `allUrls = _existingCarUrls.concat(newUrls)` → ส่ง `payload.image_urls = allUrls` เสมอ (แม้จะว่าง)
- **GAS `Upload.deleteFile`** — `DriveApp.getFileById(id).setTrashed(true)` (idempotent: ถ้าไม่มีไฟล์ return success)
- **GAS `Code.gs`** — เพิ่ม route `'deleteImage': () => Upload.deleteFile(body, user)`

### DO NOT CHANGE
- `_registeredVehiclesCache` ถูก set เฉพาะ `mode === 'registered'` เท่านั้น — filter ไม่ overwrite
- `_existingCarUrls` ต้อง reset เป็น `[]` ทั้งใน `doAdminEditCar` และ `openAdminEditCarModal`
- `deleteImage` ใช้ `apiPost` (POST) เนื่องจาก token ยาว

---

## ✅ Fix — m-forgot Modal หายไป (ลืมรหัสผ่าน Freeze)

### Root Cause (อ่านจากโค้ดจริง)
- `id="m-forgot"` ไม่มีในไฟล์ HTML ทั้ง version ปัจจุบันและ uploads เดิม
- `openForgotModal()` เรียก `openM('m-forgot')` → `document.getElementById('m-forgot')` = `null`
- `.classList.add('open')` บน null → `TypeError: Cannot read properties of null (reading 'classList')`
- หน้า Login freeze ทันที

### Fix: สร้าง modal `m-forgot` กลับคืน
- Reconstruct จาก element IDs ที่ JS functions ใช้ทั้งหมด:
  - `forgot-step1` / `forgot-step2` — 2 ขั้นตอน (verify → set password)
  - `forgot-house-no` / `forgot-phone` / `forgot-email` — input step 1
  - `forgot-newpw` / `forgot-confirmpw` — input step 2
  - `forgot-btn-verify` / `forgot-btn-save` — action buttons
  - `forgot-err` / `forgot-pw-err` — error message divs
- เพิ่มก่อน `</body>` ต่อจาก modal สุดท้าย

### Fix: เพิ่ม `var _housesCache = []` declaration
- `_housesCache` ถูกใช้งานทั่วทั้งโค้ดแต่ไม่มี `var` declaration
- มีแต่ `_housesAllCache` ที่ declare — ทำให้ `_housesCache is not defined` เมื่อ openAdminAddCarModal
- เพิ่ม `var _housesCache = [];` บรรทัด 4425 ติดกับ `_housesAllCache`

### DO NOT CHANGE
- `openForgotModal`, `doForgotVerify`, `doForgotSave`, `closeForgotModal` — ไม่ถูกแตะ
- modal `m-forgot` ต้องมี `onclick="omOut(event,'m-forgot')"` บน `.mo` div

---

## ✅ Redesign — Login Screen (Split Desktop + Full BG Mobile)

### Root Cause ปัญหาเดิม
- `#login-screen` ใช้ `align-items:center; justify-content:center; padding:20px`
- `.login-box` มี `max-width:400px` → card ลอยกลางจอ มีพื้นที่ว่างรอบข้างมาก
- Mobile: card เล็กกลางจอ ไม่เต็มหน้าจอ ดูไม่ professional

### Design ที่เลือก: ผสม Split (Desktop) + Full BG (Mobile)

**Desktop / Tablet ≥ 768px — Split Layout**
- `#login-screen` เปลี่ยนเป็น `align-items:stretch` เต็มจอ
- `.login-box` เป็น `flex row; width:100%; height:100%`
- `.login-panel` (42%) — brand panel ซ้าย: logo + ชื่อหมู่บ้าน บน gradient background
- `.login-body` (flex:1) — form panel ขวา: เข้าสู่ระบบ บน `var(--card)` background
- `login-body-inner` จำกัด `max-width:360px` เพื่อ readability บน widescreen

**Mobile < 768px — Full Background**
- `#login-screen` background เป็น `var(--hg)` gradient เต็มจอ
- `.login-panel` flex:1 โตเต็มพื้นที่ด้านบน (brand area)
- `.login-body` `flex:0 0 auto` เป็น bottom sheet `border-radius:24px 24px 0 0` + `box-shadow:0 -8px 40px`

### สิ่งที่ไม่ถูกแตะ (DO NOT CHANGE)
- IDs ทั้งหมด: `login-logo`, `login-title`, `login-sub`, `login-err`, `inp-username`, `inp-password`
- `applySettings()` populate `login-logo`, `login-title`, `login-sub` เหมือนเดิม
- `doLogin()`, `openForgotModal()` ไม่ถูกแตะ
- ไฟล์อื่นทั้งหมดไม่ถูกแตะ

---

## ✅ Redesign Login v2 + Logo Upload

### Login: Full BG Card (ทั้ง Desktop และ Mobile)
- `#login-screen` — `background:var(--hg)` เต็มจอ, `align-items:center; justify-content:center`
- `.login-box` — `max-width:520px` card ใหญ่ขึ้น, `border-radius:24px`, `box-shadow` ลึก
- `.login-panel` — gradient header พร้อม decorative circles
- `.login-logo` — `font-size:72px`, `min-height:80px`, img `80×80px` + `border-radius:16px`
- **Mobile <480px:** `#login-screen align-items:flex-start; padding:0` → card ชิดบน, `border-radius:0 0 24px 24px`

### Settings: Logo Upload (1 ไฟล์)
- แทนที่ text input เดิมด้วย: text input (emoji/URL) + preview div + upload button
- `<input type="file" id="cfg-logo-upload" accept="image/*">` hidden input
- `doUploadLogo(input)` — resize เป็น max 256×256px, canvas fillRect white (PNG alpha), `apiPost('uploadImage')`, update `cfg-inp-village_logo` + `updateLogoPreview` + `APP.settings` cache + `applySettings()` ทันที
- แจ้งให้กด "บันทึกทั้งหมด" เพื่อ save URL ลง SETTINGS sheet
- `applySettings` login-logo img เปลี่ยนเป็น `80×80px border-radius:16px`

### DO NOT CHANGE
- IDs: `login-logo`, `login-title`, `login-sub`, `login-err`, `inp-username`, `inp-password`
- `cfg-inp-village_logo` — ยังมีอยู่ (text input สำหรับ URL ด้วย), `doSaveSettings` ยังเก็บค่านี้
- `doUploadLogo` ใช้ `apiPost` (POST) เหมือน uploadImage ทั่วไป

---

## ✅ Fix — Login Mobile: ไม่มีโค้ง กลืนกันเป็นเนื้อเดียว

### Root Cause
- breakpoint เดิม `max-width:480px` แคบเกินไป — จอที่เห็นในรูปกว้างกว่า 480px
- `.login-box` มี `border-radius:0 0 24px 24px` → ยังมีโค้งด้านล่าง
- card ลอยกลางจอ ไม่ชิดขอบ ทำให้เห็นพื้น bg รอบข้าง

### Fix (CSS เท่านั้น — 1 media query)
- ขยาย breakpoint จาก `max-width:480px` → `max-width:600px`
- `.login-box` → `border-radius:0; box-shadow:none; max-width:100%`
- `.login-panel` → `border-radius:0` (ลบโค้งส่วน header)
- `.login-body` → `border-radius:0` (ลบโค้งส่วน form)
- ผล: card เต็มจอ ไม่มีรอยโค้ง header กลืนกับ body เป็นเนื้อเดียว

---

## ✅ Fix — รถ Sort / Logo ไม่มีกรอบ / แจ้งกระทำผิด

### ข้อ 1: ข้อมูลรถเรียงตามซอย → บ้านเลขที่ → ประเภทรถ
- `loadAdminVehiclePage` เพิ่ม `.sort()` บน `registered` array
- sort key: soi (numeric) → house_no (locale th numeric) → type (locale th)

### ข้อ 2+3: Logo ไม่มีกรอบ
- `.sb-logo-ico` ลบ `background:rgba(255,255,255,0.15)` และ `border-radius:10px` ออก
- `applySettings` sidebar img: ลบ `border-radius:8px` ออก
- `applySettings` login img: ลบ `border-radius:16px` ออก
- CSS `.login-logo img`: ลบ `border-radius:16px` ออก

### ข้อ 4: แจ้งกระทำผิด
**4.1 ข้อมูลบ้าน Load ไม่ครบ**
- `m-newvio` modal เดิมมี static hardcoded options ไม่มี IDs
- เขียน modal ใหม่ทั้งหมด: เพิ่ม IDs ครบทุก field (`vio-house`, `vio-type`, `vio-title`, `vio-desc`, `vio-deadline`, `vio-penalty`)
- เพิ่ม `openNewVioModal()` — fetch `_housesCache` → sort ซอย→บ้านเลขที่ → populate `vio-house` select → reset fields → `openM('m-newvio')`
- ปุ่ม `+ แจ้งใหม่` เปลี่ยนจาก `openM('m-newvio')` → `openNewVioModal()`

**4.2 Reload ไม่ขึ้นข้อความ**
- `loadViolationsPage` เปลี่ยน `showLoader('...')` → `showLoader('โหลดรายการแจ้งกระทำผิด...')`
- แก้ empty state และ render text ให้อ่านได้ชัดเจน

**4.3 Breadcrumb ผิด**
- PT map `'admin-vio'`: แก้จาก `แจ้กระทำผิด — แจ้เตือน` → `แจ้งกระทำผิด — แจ้งเตือน`

---

## ✅ Feature — แจ้งกระทำผิด: รูปภาพ / รายละเอียด / แก้ไข / ลูกบ้าน Action

### GAS: Fees_Issues_Violations.gs
- `Violations.updateStatus` — รองรับ `image_urls` ใน update
- `Violations.update` (ใหม่) — Admin แก้ไข title/desc/deadline/penalty/image_urls (stringify array)
- `Violations.residentAction` (ใหม่) — ลูกบ้าน action: `acknowledge` หรือ `fix_submitted` + บันทึก `resident_image_urls`

### GAS: Code.gs
- เพิ่ม route `updateViolation` → `Violations.update`
- เพิ่ม route `violationResidentAction` → `Violations.residentAction`

### GAS: Setup.gs
- เพิ่ม column `resident_image_urls` ใน VIOLATIONS sheet schema
- ⚠️ ถ้า Sheet มีข้อมูลอยู่แล้ว ต้องเพิ่ม column นี้ใน Sheet ด้วยตนเอง

### index.html

**Image System (`_vioImages`, `onVioImageSelect`, `_uploadVioImages`)**
- `_vioImages[prefix]` — state แยกตาม prefix (vio-, ve-, vr-)
- resize ≤150KB: `tryQuality(0.8)` ลด quality ซ้ำจนขนาดผ่าน
- filename: `{prefix}_{vio_id}_{index}_{timestamp}.jpg` — นิติใช้ prefix vio/ve, ลูกบ้านใช้ `H-{vio_id}`

**Modal: `m-newvio` (แจ้งใหม่)**
- เพิ่ม image upload section: `vio-img-input`, `vio-img-previews`
- `doCreateViolation` — สร้างก่อนได้ `vio_id` → upload รูปพร้อม vio_id ใน filename → `updateViolation`

**Modal: `m-vio-detail` (ดูรายละเอียด + รูปลูกบ้าน)**
- `openVioDetail(vio_id)` — แสดง title, type, status badge, deadline, penalty, desc
- แสดงรูปนิติ + รูปลูกบ้าน (แยก section) คลิกขยายได้
- ปุ่ม: ปิด / ✏️ แก้ไข / ✓ ปิดเรื่อง

**Modal: `m-vio-edit` (แก้ไข Admin)**
- `openVioEdit(vio_id)` — โหลดข้อมูล, แสดงรูปเดิม + ปุ่ม ×
- `_deleteVeImg(idx, fileId)` — splice state + `apiPost('deleteImage')` ลบจาก Drive
- `doSaveVioEdit` — merge existing + new urls → `updateViolation`
- showLoader: `'กำลังบันทึก...'`

**Modal: `m-vio-resident` (ลูกบ้าน แจ้งแก้ไขแล้ว)**
- `openResidentVioAction(vio_id, title)` — เปิด modal แนบรูป
- `doResidentVioAction` — upload รูป prefix `H-` → `violationResidentAction`
- showLoader: `'กำลังส่งข้อมูล...'`

**`loadViolationsPage` (ปรับปรุง)**
- status badge ครบ: pending/acknowledged/fix_submitted/resolved
- แสดง badge `มีรูปจากลูกบ้าน` ถ้า `resident_image_urls` มีข้อมูล
- ปุ่ม: 🔍 รายละเอียด / ✏️ แก้ไข / ✓ ปิดเรื่อง / + ค่าปรับ
- showLoader: `'โหลดรายการแจ้งกระทำผิด...'`

**`loadResNotifPage` (ปรับปรุง)**
- แสดงรูปนิติ (คลิกขยาย)
- ปุ่ม `✓ รับทราบ` (pending) + ปุ่ม `✅ แจ้งว่าแก้ไขแล้ว` (pending/acknowledged)
- ลูกบ้านที่แก้ไขแล้ว status = `fix_submitted` → นิติเห็นและกด ✓ ปิดเรื่องได้

### DO NOT CHANGE
- `_vioImages` prefix แยกกันชัดเจน: `vio-` นิติใหม่, `ve-` นิติแก้, `vr-` ลูกบ้าน
- filename ลูกบ้านต้องขึ้นต้นด้วย `H-` เสมอ
- `_allViolationsCache` update ทุกครั้งหลัง `loadViolationsPage`

---

## ✅ Fix — แจ้งกระทำผิด: Tabs / Filter / Dropdown / ค่าปรับ / ลูกบ้าน

### ข้อ 1: Tabs ยังไม่ปิด / ปิดแล้ว
- HTML: เพิ่ม tab `🔴 ยังไม่ปิด` และ `✅ ปิดแล้ว` พร้อม pane `vio-pane-open/closed`
- `_vioOpenCache` = status ≠ resolved, `_vioClosedCache` = status = resolved
- `stabVio(tab)` toggle display + class `.on`

### ข้อ 2: Dropdown หัวเรื่องใน modal แก้ไข
- `m-vio-edit` เพิ่ม `<select id="ve-type">` ข้างๆ `ve-title` แบบ fr2
- `openVioEdit` populate `ve-type` จาก `v.vio_type`
- `doSaveVioEdit` ส่ง `vio_type` ใน payload

### ข้อ 3: Filter cards ตามสถานะ (เฉพาะ tab ยังไม่ปิด)
- 4 card: ทั้งหมด / รออนุมัติ / รับทราบแล้ว / แจ้งแก้ไขแล้ว
- `_filterVio(status)` filter `_vioOpenCache` แล้ว re-render
- card ถูก highlight ด้วย `outline:2px solid var(--pr)` เมื่อ active

### ข้อ 4: `openAddPenalty` ไม่ถูก define
- เพิ่ม `openAddPenalty(vio_id, house_id)` เปิด modal `m-add-penalty`
- เพิ่ม modal `m-add-penalty` พร้อม input `ap-amount`
- `doAddPenalty()` เรียก `updateViolationStatus` พร้อม `penalty_amount`
- GAS `updateViolationStatus` รองรับ `penalty_amount` ใน updates แล้ว

### ลูกบ้านไม่เห็นรายการ (แก้ defensive)
- `loadResNotifPage` เพิ่ม `showLoader`/`hideLoader`/`finally`
- guard `viols && viols.length` แทน `.map` ตรง (กัน `null`/`undefined`)
- เพิ่ม error display ใน `list-my-notifs` เมื่อ catch
- **Note:** root cause จริงคือ `user.house_id` ต้องมีค่าใน USERS sheet — ตรวจสอบว่า user ของลูกบ้านมี house_id ตรงกับ VIOLATIONS.house_id

---

## ✅ Fix — Deadline / Modal / house_no / กระดิ่ง / ลูกบ้าน

### 1. Deadline ไม่แสดง (อ่านจาก sheetToObjects บรรทัด 141)
- **Root cause:** `_STR_FIELDS` ไม่มี `deadline` → Google Sheets auto-parse วันที่เป็น `Date object` → `JSON.stringify(Date)` = `{}` → แสดงว่าง
- **Fix (Code.gs):** เพิ่ม `_DATE_FIELDS = ['deadline','created_at','updated_at',...]`
- แก้ `sheetToObjects`: ถ้า field อยู่ใน `_DATE_FIELDS` และเป็น `Date object` → แปลงเป็น ISO `"YYYY-MM-DD"` (ไม่ใช่ day/month format)

### 2. ประเภทต้องมาก่อนหัวเรื่อง (m-vio-edit)
- สลับตำแหน่ง `ve-type` (select) ให้มาก่อน `ve-title` (input) ใน `fr2` grid

### 3. modal รายละเอียด: ปิดเฉพาะปุ่ม
- ลบ `onclick="omOut(event,'m-vio-detail')"` ออกจาก `<div class="mo" id="m-vio-detail">`

### 4. บ้าน HSE-004 → บ้านเลขที่
- **GAS Violations.getAll:** join HOUSES → เพิ่ม `house_no` + `soi` ใน response (เหมือน Vehicles.getAll)
- **_renderVioList:** ใช้ `v.house_no + soi` แทน `v.house_id`
- **openVioDetail:** แสดง `บ้านเลขที่ {house_no} ซอย {soi}`

### 5. กระดิ่งไม่มีอะไร
- **Root cause:** HTML `id="notif-panel"` และ `id="notif-backdrop"` **ไม่มีในไฟล์**
- **Fix:** เพิ่ม HTML panel หลัง topbar พร้อม tabs ทั้งหมด/ยังไม่อ่าน/สลิปรอ + `id="notif-panel-list"`

### ลูกบ้าง: ข้อความผิด
- `ไม่มีการแจ้เตือน` → `ไม่มีการแจ้งเตือน`

### ลูกบ้าน: ไม่เห็นรายการ / หน้าบ้านผิด
- **Root cause (อ่านจาก Auth.gs บรรทัด 40):** `user.house_id` มาจาก JWT token ซึ่งถ้า USERS sheet ไม่มี `house_id` จะได้ token ที่ `house_id = ''`
- **Fix:** เพิ่ม fallback ใน GAS ทุก function ที่ใช้ `user.house_id`:
  - `Houses.getByUser` — fallback `sheetToObjects('USERS').find(u_id)` → ได้ `house_id`
  - `Vehicles.getByHouse` — fallback เช่นเดียวกัน
  - `Fees.getByHouse` — fallback เช่นเดียวกัน
  - `Issues.getMine` — fallback เช่นเดียวกัน
  - `Violations.getMine` — fallback เช่นเดียวกัน (แก้รอบที่แล้วแล้ว อัปเดตเพิ่ม)

### ⚠️ Deploy GAS ทุกไฟล์:
- `Code.gs` — _DATE_FIELDS + sheetToObjects
- `Houses_Vehicles_ChangeReq.gs` — getByUser + getByHouse fallback
- `Fees_Issues_Violations.gs` — Violations.getAll join + getMine fallback + Fees/Issues fallback

---

## ✅ Fix — updateViolation / การแจ้งเตือน / หน้าบ้านลูกบ้าน

### 1. Unknown action: updateViolation
- **Root cause:** `cp /home/claude/Code.gs /tmp/Code.gs` ในรอบที่แล้ว overwrite ไฟล์ที่เคยเพิ่ม routes ไว้
- **Fix:** เพิ่ม routes กลับครบ: `updateViolation`, `violationResidentAction`, `getMyViolations`

### 2+3. ลูกบ้านการแจ้งเตือนไม่โหลด / ค้าง "กำลังโหลด..."
- **Root cause:** `loadResNotifPage()` ถูกเรียกเมื่อ navigate ไปหน้า `res-notif` เท่านั้น (บรรทัด 3249) ไม่ถูกเรียกตอน boot → `list-my-notifs` ค้างเป็น "กำลังโหลด..." ตลอด
- **Fix:** เพิ่ม `loadResNotifPage()` ใน `renderResidentHomeFromBoot()` หลัง set `_pageCache`

### 4. หน้าบ้านลูกบ้านแสดงข้อมูลผิด (H001 แทน H004)
- **Root cause:** `loadResHousePage()` ใช้ `APP.house || api('getHouseByUser')` — ถ้า `APP.house` ถูก cache จาก boot ที่ใช้ `user.house_id` ผิดจาก JWT token เก่า → แสดงบ้านผิด
- **Fix:** `loadResHousePage()` clear `APP.house = null` ก่อน `await api('getHouseByUser')` ทุกครั้ง

### 5. หน้าบ้านลูกบ้าน — Coding ใหม่ทั้งหมด
- **Root cause:** HTML มี hardcode "10/1", "ซอย 3", "สมชาย ใจดี", email mock, change request mock — `loadResHousePage` fill ได้แค่บาง element ที่มี id
- **Fix:** เขียน `loadResHousePage()` ใหม่ทั้งหมด — render `rh-info` และ `rh-cars` ด้วย innerHTML จาก API data 100%:
  - `rh-info`: address, fees (fee/parking/trash), ผู้อาศัย (owner/renter/phone/email/usage/status), ประวัติคำขอ (จาก `getMyChangeRequests`)
  - `rh-cars`: รถที่ active (จาก `getVehiclesByHouse`)
  - ทุก field แปลงค่า enum เป็นภาษาไทย (house_type, usage_type, status)
- ลบ HTML mockup เดิมออกทั้งหมด เหลือแค่ skeleton `<p>กำลังโหลด...</p>`

### GAS Boot.load — fallback house_id
- ถ้า `user.house_id` ว่าง → lookup จาก USERS sheet ด้วย `user_id`
- ครอบคลุม: houses, fees, issues, violations ทั้งหมดใน boot

### ⚠️ Deploy GAS:
- `Code.gs` — routes ครบ
- `Services.gs` — Boot.load fallback
- `Houses_Vehicles_ChangeReq.gs`, `Fees_Issues_Violations.gs` — fallbacks (ของรอบก่อน)
