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
