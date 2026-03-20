// ============================================================
// Fees.gs
// ============================================================

var Fees = (function() {

  function getAll(body, user) {
    requireAdmin(user);
    let rows = sheetToObjects('FEES');
    if (body.status) rows = rows.filter(r => r.status === body.status);
    if (body.year)   rows = rows.filter(r => String(r.year) === String(body.year));
    // Join house data for invoice display
    const houses = sheetToObjects('HOUSES');
    const houseMap = {};
    houses.forEach(h => { houseMap[h.house_id] = h; });
    return rows.map(r => {
      const h = houseMap[r.house_id] || {};
      return Object.assign({}, r, {
        house_no:    h.house_no    || r.house_id,
        soi:         h.soi         || '',
        owner_name:  h.owner_name  || '',
        area_sqm:    h.area_sqm    || 0,
        fee_per_year: h.fee_per_year || 0,
        parking_fee_year: h.parking_fee_year || 0,
      });
    });
  }

  function getByHouse(body, user) {
    const hid = body.house_id || user.house_id;
    if (user.role !== 'admin' && user.house_id !== hid)
      throw new Error('ไม่มีสิทธิ์');
    let rows = sheetToObjects('FEES').filter(r => r.house_id === hid);
    if (body.year) rows = rows.filter(r => String(r.year) === String(body.year));
    // Join house data
    const houses = sheetToObjects('HOUSES');
    const h = houses.find(h => h.house_id === hid) || {};
    rows = rows.map(r => Object.assign({}, r, {
      house_no:    h.house_no    || r.house_id,
      soi:         h.soi         || '',
      owner_name:  h.owner_name  || '',
      area_sqm:    h.area_sqm    || 0,
      fee_per_year: h.fee_per_year || 0,
      parking_fee_year: h.parking_fee_year || 0,
    }));
    return rows.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return a.period === 'H2' ? 1 : -1;
    });
  }

  function generate(body, user) {
    requireAdmin(user);
    const { year, period } = body;
    if (!year || !period) throw new Error('year และ period (H1/H2) จำเป็น');

    const houses       = sheetToObjects('HOUSES');
    const allFees       = sheetToObjects('FEES');
    const allVehicles   = sheetToObjects('VEHICLES');

    const existing = allFees.filter(
      r => String(r.year) === String(year) && r.period === period
    );
    const existingHids = existing.map(r => r.house_id);

    // หางวดก่อนหน้า: H1/YYYY ← H2/(YYYY-1), H2/YYYY ← H1/YYYY
    const prevPeriod = period === 'H1' ? 'H2' : 'H1';
    const prevYear   = period === 'H1' ? String(Number(year) - 1) : String(year);

    const created = [];
    houses.forEach(h => {
      if (existingHids.includes(h.house_id)) return;

      // คำนวณยอดค้างชำระจากงวดก่อนหน้าโดยตรง (ไม่ใช่ทุกงวดที่ค้าง)
      // รวม: fee_amount + parking_fee + trash_fee + other_fee + penalty_fee
      //       + penalty_10pct + collection_fee - discount (เฉพาะงวดก่อนหน้า ที่ยังไม่จ่าย)
      // รวมยอดค้างชำระทุกรอบที่ยังไม่จ่าย (ไม่รวมรอบที่กำลัง generate)
      // รวม: fee_amount + parking_fee + trash_fee + other_fee + penalty_fee
      //       + penalty_10pct + collection_fee + overdue_carry - discount
      const prevFees = allFees.filter(r =>
        r.house_id === h.house_id &&
        r.status !== 'paid' &&
        !(String(r.year) === String(year) && r.period === period) // ไม่รวมรอบปัจจุบัน
      );
      const overdue_carry = parseFloat(prevFees.reduce((s, r) => {
        const rowTotal =
          (Number(r.fee_amount)     || 0) +
          (Number(r.parking_fee)    || 0) +
          (Number(r.trash_fee)      || 0) +
          (Number(r.other_fee)      || 0) +
          (Number(r.penalty_fee)    || 0) +
          (Number(r.penalty_10pct)  || 0) +
          (Number(r.collection_fee) || 0) +
          (Number(r.overdue_carry)  || 0) - // รวม carry จากรอบก่อนด้วย
          (Number(r.discount)       || 0);
        return s + Math.max(0, rowTotal);
      }, 0).toFixed(2));

      const fee_amount  = parseFloat((Number(h.fee_per_year || 0) / 2).toFixed(2));
      // ค่าจอดรถ = รวม fee_amount ของรถที่ approved ของบ้านนี้
      const houseVehicles = allFees.filter ? [] : []; // placeholder — use vehicles sheet
      const vehicleFees   = (allVehicles || []).filter(v =>
        v.house_id === h.house_id && v.status === 'active' && Number(v.fee_amount||0) > 0
      );
      const parking_fee_from_vehicles = parseFloat(vehicleFees.reduce((s, v) =>
        s + Number(v.fee_amount || 0), 0).toFixed(2));
      // ถ้ามีค่าจอดรถจากรถจริง ใช้นั้น ไม่งั้นใช้ค่าเดิมหาร 2
      const parking_fee = parking_fee_from_vehicles > 0
        ? parking_fee_from_vehicles
        : parseFloat((Number(h.parking_fee_year || 0) / 2).toFixed(2));
      const trash_fee   = parseFloat(Number(h.trash_fee_period || 0).toFixed(2));
      const total_raw   = parseFloat((fee_amount + parking_fee + trash_fee + overdue_carry).toFixed(2));
      const due_date    = period === 'H1' ? year + '-03-31' : year + '-09-30';

      const row = {
        fee_id:           genId('FEE'),
        house_id:         h.house_id,
        year:             year,
        period:           period,
        bill_type:        'half_year',
        fee_amount:       fee_amount,
        parking_fee:      parking_fee,
        trash_fee:        trash_fee,
        other_fee:        0,
        penalty_fee:      0,
        overdue_carry:    parseFloat(overdue_carry.toFixed(2)),
        penalty_10pct:    0,
        collection_fee:   0,
        discount:         0,
        total:            total_raw,
        status:           'pending',
        due_date:         due_date,
        slip_url:         '',
        slip_submitted_at:'',
        receipt_no:       '',
        issued_at:        now(),
        issued_by:        user.user_id,
        other_fee_note:   '',
        penalty_fee_note: ''
      };
      appendRow('FEES', row);
      created.push(row.fee_id);

      Logger.log('Generated FEE for ' + h.house_id +
        ' | period=' + period + '/' + year +
        ' | fee=' + fee_amount + ' parking=' + parking_fee +
        ' trash=' + trash_fee + ' carry=' + overdue_carry +
        ' total=' + total_raw);
    });
    return { success: true, created: created.length };
  }

  function submitSlip(body, user) {
    const { fee_id, slip_url, amount_paid } = body;
    if (!fee_id || !slip_url) throw new Error('fee_id และ slip_url จำเป็น');
    const fee = findRow('FEES', 'fee_id', fee_id);
    if (!fee) throw new Error('ไม่พบใบแจ้งหนี้');
    if (user.role !== 'admin' && fee.house_id !== user.house_id)
      throw new Error('ไม่มีสิทธิ์');

    updateRowById('FEES', 'fee_id', fee_id, {
      slip_url:          slip_url,
      slip_submitted_at: now(),
      status:            'slip_submitted'
    });
    return { success: true };
  }

  function approveSlip(body, user) {
    requireAdmin(user);
    const { fee_id } = body;
    const fee = findRow('FEES', 'fee_id', fee_id);
    if (!fee) throw new Error('ไม่พบใบแจ้งหนี้');

    // Create receipt
    const receipt = Receipts.create({
      fee_id:         fee_id,
      house_id:       fee.house_id,
      amount_paid:    fee.total,
      payment_method: body.payment_method || 'transfer',
      bank_name:      body.bank_name || '',
      slip_url:       fee.slip_url,
      paid_at:        now(),
      note:           body.note || ''
    }, user);

    updateRowById('FEES', 'fee_id', fee_id, {
      status:     'paid',
      receipt_no: receipt.receipt_id
    });

    // Update house status if was overdue
    const house = findRow('HOUSES', 'house_id', fee.house_id);
    if (house && house.status === 'overdue') {
      const remaining = sheetToObjects('FEES').filter(
        r => r.house_id === fee.house_id && r.status !== 'paid' && r.fee_id !== fee_id
      );
      if (remaining.length === 0) {
        updateRowById('HOUSES', 'house_id', fee.house_id, { status: 'normal', updated_at: now() });
      }
    }
    return { success: true, receipt_id: receipt.receipt_id };
  }

  function issueNewBill(body, user) {
    requireAdmin(user);
    const { fee_id } = body;
    const fee = findRow('FEES', 'fee_id', fee_id);
    if (!fee) throw new Error('ไม่พบใบแจ้งหนี้');

    const penalty_10 = Number(fee.total) * 0.1;
    const collection  = 200;
    const new_total   = Number(fee.total) + penalty_10 + collection;

    updateRowById('FEES', 'fee_id', fee_id, {
      penalty_10pct:  penalty_10,
      collection_fee: collection,
      total:          new_total,
      status:         'overdue',
      issued_at:      now()
    });

    // Update house status
    updateRowById('HOUSES', 'house_id', fee.house_id, { status: 'overdue', updated_at: now() });
    return { success: true, new_total };
  }

  function update(body, user) {
    requireAdmin(user);
    const { fee_id, ...updates } = body;
    if (!fee_id) throw new Error('fee_id required');
    // Recalculate total from components
    const feeAmt  = Number(updates.fee_amount    || 0);
    const parking = Number(updates.parking_fee   || 0);
    const trash   = Number(updates.trash_fee     || 0);
    const other   = Number(updates.other_fee     || 0);
    const penalty = Number(updates.penalty_fee   || 0);
    const discount= Number(updates.discount      || 0);
    updates.total = parseFloat((feeAmt + parking + trash + other + penalty - discount).toFixed(2));
    updates.updated_at = now();
    const ok = updateRowById('FEES', 'fee_id', fee_id, updates);
    if (!ok) throw new Error('ไม่พบรายการค่าส่วนกลาง');
    return { success: true, fee_id, total: updates.total };
  }

  
  // ─────────────────────────────────────────
  // generateFullYear: ออกใบแจ้งหนี้เต็มปี
  // ─────────────────────────────────────────
  function generateFullYear(body, user) {
    requireAdmin(user);
    const { year } = body;
    if (!year) throw new Error('year จำเป็น');

    const houses   = sheetToObjects('HOUSES');
    const allFees  = sheetToObjects('FEES');
    const settings = sheetToObjects('SETTINGS');
    const cfg = {};
    settings.forEach(r => { cfg[r.key] = r.value; });
    const discPct = parseFloat(cfg['fee_discount_pct'] || 0);
    const dueDay  = cfg['fee_due_day'] || '31';
    const dueDate = year + '-01-' + String(dueDay).padStart(2, '0');

    const existingFull = allFees
      .filter(r => String(r.year) === String(year) && r.bill_type === 'full_year')
      .map(r => r.house_id);

    const created = [];
    houses.forEach(h => {
      if (existingFull.includes(h.house_id)) return;

      const prevFees = allFees.filter(r =>
        r.house_id === h.house_id &&
        r.status !== 'paid' &&
        String(r.year) !== String(year)
      );
      const overdue_carry = parseFloat(prevFees.reduce((s, r) => {
        const t = (Number(r.fee_amount) || 0) + (Number(r.parking_fee) || 0) +
          (Number(r.trash_fee) || 0) + (Number(r.other_fee) || 0) +
          (Number(r.penalty_fee) || 0) + (Number(r.penalty_10pct) || 0) +
          (Number(r.collection_fee) || 0) + (Number(r.overdue_carry) || 0) -
          (Number(r.discount) || 0);
        return s + Math.max(0, t);
      }, 0).toFixed(2));

      const fee_amount  = parseFloat(Number(h.fee_per_year    || 0).toFixed(2));
      const parking_fee = parseFloat(Number(h.parking_fee_year || 0).toFixed(2));
      const trash_fee   = parseFloat((Number(h.trash_fee_period || 0) * 2).toFixed(2));
      // ส่วนลด: ค่าส่วนกลางเท่านั้น ไม่รวมค่ารถ/ขยะ/ค้าง
      const discount    = parseFloat((fee_amount * discPct / 100).toFixed(2));
      const total_raw   = parseFloat((fee_amount + parking_fee + trash_fee + overdue_carry - discount).toFixed(2));

      const row = {
        fee_id:           genId('FEE'),
        house_id:         h.house_id,
        year:             year,
        period:           'Y',
        bill_type:        'full_year',
        fee_amount:       fee_amount,
        parking_fee:      parking_fee,
        trash_fee:        trash_fee,
        other_fee:        0, penalty_fee: 0,
        overdue_carry:    overdue_carry,
        penalty_10pct:    0, collection_fee: 0,
        discount:         discount,
        total:            total_raw,
        status:           'pending',
        due_date:         dueDate,
        slip_url:         '', slip_submitted_at: '',
        receipt_no:       '',
        issued_at:        now(),
        issued_by:        user.user_id,
        other_fee_note:   '', penalty_fee_note: ''
      };
      appendRow('FEES', row);
      created.push(row.fee_id);
      Logger.log('Full-year FEE ' + h.house_id + ' year=' + year +
        ' fee=' + fee_amount + ' disc=' + discount + ' total=' + total_raw);
    });
    return { success: true, created: created.length };
  }

return { getAll, getByHouse, generate, generateFullYear, submitSlip, approveSlip, issueNewBill, update };
})();


// ============================================================
// Receipts.gs
// ============================================================

var Receipts = (function() {

  function getByHouse(body, user) {
    const hid = body.house_id || user.house_id;
    if (user.role !== 'admin' && user.house_id !== hid) throw new Error('ไม่มีสิทธิ์');
    return sheetToObjects('RECEIPTS')
      .filter(r => r.house_id === hid)
      .sort((a, b) => new Date(b.paid_at) - new Date(a.paid_at));
  }

  function create(body, user) {
    const row = {
      receipt_id:     genId('RC'),
      fee_id:         body.fee_id,
      house_id:       body.house_id,
      amount_paid:    body.amount_paid,
      payment_method: body.payment_method || 'transfer',
      bank_name:      body.bank_name || '',
      slip_url:       body.slip_url || '',
      paid_at:        body.paid_at || now(),
      issued_by:      user.user_id,
      issued_at:      now(),
      note:           body.note || ''
    };
    appendRow('RECEIPTS', row);
    return row;
  }

  return { getByHouse, create };
})();


// ============================================================
// Issues.gs
// ============================================================

var Issues = (function() {

  function getAll(body, user) {
    requireAdmin(user);
    let rows = sheetToObjects('ISSUES');
    if (body.status) rows = rows.filter(r => r.status === body.status);
    return rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  function getMine(body, user) {
    return sheetToObjects('ISSUES')
      .filter(r => r.house_id === user.house_id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  function create(body, user) {
    const hid = body.house_id || user.house_id;
    const row = {
      issue_id:    genId('ISS'),
      house_id:    hid,
      reported_by: user.user_id,
      category:    body.category || 'other',
      title:       body.title || '',
      description: body.description || '',
      image_urls:  JSON.stringify(body.image_urls || []),
      status:      'pending',
      admin_note:  '',
      assigned_to: '',
      resolved_at: '',
      rating:      '',
      rating_comment: '',
      created_at:  now(),
      updated_at:  now()
    };
    appendRow('ISSUES', row);
    return row;
  }

  function updateStatus(body, user) {
    requireAdmin(user);
    const { issue_id, status, admin_note, assigned_to } = body;
    const updates = { status, updated_at: now() };
    if (admin_note)   updates.admin_note  = admin_note;
    if (assigned_to)  updates.assigned_to = assigned_to;
    if (status === 'resolved') updates.resolved_at = now();
    updateRowById('ISSUES', 'issue_id', issue_id, updates);
    return { success: true };
  }

  function rate(body, user) {
    const { issue_id, rating, rating_comment } = body;
    const issue = findRow('ISSUES', 'issue_id', issue_id);
    if (!issue) throw new Error('ไม่พบปัญหา');
    if (user.role !== 'admin' && issue.house_id !== user.house_id)
      throw new Error('ไม่มีสิทธิ์');
    updateRowById('ISSUES', 'issue_id', issue_id, {
      rating, rating_comment: rating_comment || '', updated_at: now()
    });
    return { success: true };
  }

  return { getAll, getMine, create, updateStatus, rate };
})();


// ============================================================
// Violations.gs
// ============================================================

var Violations = (function() {

  function getAll(body, user) {
    requireAdmin(user);
    let rows = sheetToObjects('VIOLATIONS');
    if (body.status)   rows = rows.filter(r => r.status === body.status);
    if (body.house_id) rows = rows.filter(r => r.house_id === body.house_id);
    return rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  function getMine(body, user) {
    return sheetToObjects('VIOLATIONS')
      .filter(r => r.house_id === user.house_id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  function create(body, user) {
    requireAdmin(user);
    const { house_id, title, description, deadline, penalty_amount } = body;
    if (!house_id || !title) throw new Error('house_id และ title จำเป็น');

    const row = {
      vio_id:          genId('VIO'),
      house_id:        house_id,
      notified_by:     user.user_id,
      vio_type:        body.vio_type || 'other',
      title:           title,
      description:     description || '',
      image_urls:      JSON.stringify(body.image_urls || []),
      deadline:        deadline || '',
      penalty_amount:  penalty_amount || 0,
      fee_id:          '',
      status:          'pending',
      resident_ack_at: '',
      resolved_at:     '',
      admin_note:      body.admin_note || '',
      created_at:      now()
    };
    appendRow('VIOLATIONS', row);

    // If penalty > 0, link to fee
    if (Number(penalty_amount) > 0) {
      _linkPenaltyToFee(house_id, row.vio_id, Number(penalty_amount), title, user);
    }
    return row;
  }

  function updateStatus(body, user) {
    requireAdmin(user);
    const { vio_id, status, admin_note } = body;
    const updates = { status, admin_note: admin_note || '' };
    if (status === 'resolved') updates.resolved_at = now();
    // อัปเดต image_urls ถ้ามี
    if (body.image_urls !== undefined) {
      updates.image_urls = Array.isArray(body.image_urls)
        ? JSON.stringify(body.image_urls)
        : body.image_urls;
    }
    updateRowById('VIOLATIONS', 'vio_id', vio_id, updates);
    return { success: true };
  }

  // Admin แก้ไขข้อมูลการแจ้งกระทำผิด (title, desc, deadline, penalty, image_urls)
  function update(body, user) {
    requireAdmin(user);
    const { vio_id, ...updates } = body;
    if (!vio_id) throw new Error('vio_id required');
    const safeUpdates = Object.assign({}, updates);
    if (Array.isArray(safeUpdates.image_urls)) {
      safeUpdates.image_urls = JSON.stringify(safeUpdates.image_urls);
    }
    updateRowById('VIOLATIONS', 'vio_id', vio_id, safeUpdates);
    return { success: true };
  }

  // ลูกบ้าน action: รับทราบ + แนบรูปหลักฐานว่าแก้ไขแล้ว
  function residentAction(body, user) {
    const { vio_id, action, resident_image_urls } = body;
    const vio = findRow('VIOLATIONS', 'vio_id', vio_id);
    if (!vio) throw new Error('ไม่พบการแจ้งเตือน');
    if (user.role !== 'admin' && vio.house_id !== user.house_id) throw new Error('ไม่มีสิทธิ์');
    const updates = {};
    if (action === 'acknowledge') {
      updates.status = 'acknowledged';
      updates.resident_ack_at = now();
    } else if (action === 'fix_submitted') {
      updates.status = 'fix_submitted';
      updates.resident_ack_at = now();
    }
    if (resident_image_urls !== undefined) {
      updates.resident_image_urls = Array.isArray(resident_image_urls)
        ? JSON.stringify(resident_image_urls)
        : resident_image_urls;
    }
    updateRowById('VIOLATIONS', 'vio_id', vio_id, updates);
    return { success: true };
  }

  function acknowledge(body, user) {
    const { vio_id } = body;
    const vio = findRow('VIOLATIONS', 'vio_id', vio_id);
    if (!vio) throw new Error('ไม่พบการแจ้งเตือน');
    if (user.role !== 'admin' && vio.house_id !== user.house_id) throw new Error('ไม่มีสิทธิ์');
    updateRowById('VIOLATIONS', 'vio_id', vio_id, {
      status: 'acknowledged', resident_ack_at: now()
    });
    return { success: true };
  }

  function _linkPenaltyToFee(house_id, vio_id, amount, note, user) {
    // Find pending fee for this house
    const fees = sheetToObjects('FEES').filter(
      r => r.house_id === house_id && (r.status === 'pending' || r.status === 'overdue')
    );
    if (fees.length > 0) {
      const fee = fees[0];
      const new_penalty  = Number(fee.penalty_fee || 0) + amount;
      const new_note     = fee.penalty_fee_note
        ? fee.penalty_fee_note + ',' + vio_id
        : vio_id;
      const new_total    = Number(fee.total) + amount;
      updateRowById('FEES', 'fee_id', fee.fee_id, {
        penalty_fee:      new_penalty,
        penalty_fee_note: new_note,
        total:            new_total
      });
      updateRowById('VIOLATIONS', 'vio_id', vio_id, { fee_id: fee.fee_id });
    }
  }

  return { getAll, getMine, create, update, updateStatus, acknowledge, residentAction };
})();
