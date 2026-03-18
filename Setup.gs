// ============================================================
// Setup.gs — Run ONCE to initialize all sheets
// ============================================================

function setupAllSheets() {
  const ss = SpreadsheetApp.openById(SHEET_ID);

  const SCHEMAS = {
    'USERS': [
      'user_id','username','password_hash','role','house_id',
      'display_name','phone','email','avatar_url','status','last_login','created_at'
    ],
    'LOGIN_LOGS': [
      'log_id','user_id','username','role','login_at',
      'ip_address','user_agent','status','fail_reason'
    ],
    'HOUSES': [
      'house_id','house_no','soi','address','owner_name','renter_name',
      'contact_person','phone','email','area_sqm','house_type','usage_type',
      'fee_per_year','parking_fee_year','trash_fee_period',
      'status','status_note','created_at','updated_at'
    ],
    'VEHICLES': [
      'vehicle_id','house_id','requested_by','type','plate_number',
      'brand','model','color','province','parking_location',
      'fee_required','fee_amount','image_urls','status',
      'approved_by','approved_at','created_at'
    ],
    'CHANGE_REQUESTS': [
      'req_id','house_id','target_type','target_id','field_changes',
      'admin_overrides','requested_by','status','approved_by',
      'reject_reason','note','created_at','resolved_at'
    ],
    'FEES': [
      'fee_id','house_id','year','period','fee_amount','parking_fee',
      'trash_fee','other_fee','penalty_fee','overdue_carry',
      'penalty_10pct','collection_fee','discount','total',
      'status','due_date','slip_url','slip_submitted_at',
      'receipt_no','issued_at','issued_by','other_fee_note','penalty_fee_note'
    ],
    'RECEIPTS': [
      'receipt_id','fee_id','house_id','amount_paid','payment_method',
      'bank_name','slip_url','paid_at','issued_by','issued_at','note'
    ],
    'ISSUES': [
      'issue_id','house_id','reported_by','category','title',
      'description','image_urls','status','admin_note',
      'assigned_to','resolved_at','rating','rating_comment',
      'created_at','updated_at'
    ],
    'VIOLATIONS': [
      'vio_id','house_id','notified_by','vio_type','title',
      'description','image_urls','deadline','penalty_amount',
      'fee_id','status','resident_ack_at','resolved_at',
      'admin_note','created_at'
    ],
    'ANNOUNCEMENTS': [
      'ann_id','title','content','category','image_urls',
      'created_by','created_at','updated_at','is_active','pinned'
    ],
    'MONTHLY_REPORTS': [
      'report_id','month','year','category','title',
      'summary','budget','image_urls','created_by','created_at'
    ],
    'CONTRACTORS': [
      'contractor_id','name','phone','line_id','area','skills',
      'bio','rating_avg','rating_count','image_url',
      'suggested_by','approved_by','status','created_at'
    ],
    'MARKETPLACE': [
      'item_id','house_id','posted_by','listing_type','category',
      'title','description','price','contact_phone','image_urls',
      'status','approved_by','approved_at','closed_by_owner',
      'created_at','updated_at'
    ],
    'SETTINGS': [
      'key','value','label','group','updated_at'
    ]
  };

  // ── Create / Format all sheets ──
  Object.keys(SCHEMAS).forEach(name => {
    let sh = ss.getSheetByName(name);
    if (!sh) {
      sh = ss.insertSheet(name);
      Logger.log('Created: ' + name);
    }
    if (sh.getLastRow() === 0) {
      const headers = SCHEMAS[name];
      sh.appendRow(headers);
      sh.getRange(1, 1, 1, headers.length)
        .setBackground('#1B4F72')
        .setFontColor('#FFFFFF')
        .setFontWeight('bold')
        .setFontSize(11);
      sh.setFrozenRows(1);
      // Auto-resize columns
      sh.autoResizeColumns(1, headers.length);
    }
  });

  // ── Create first admin account ──
  _createFirstAdmin(ss);

  // ── Seed default settings ──
  _seedSettings(ss);

  Logger.log('=== Setup complete ===');
  Logger.log('Login with: username=admin, password=Admin@1234');
  Logger.log('Please change the password after first login!');
  return 'Setup complete. Admin: admin / Admin@1234';
}

// ── Create admin account (only if USERS sheet is empty) ──
function _createFirstAdmin(ss) {
  const sh = ss.getSheetByName('USERS');
  const lastRow = sh.getLastRow();

  // Skip if users already exist (header row = row 1, so > 1 means data exists)
  if (lastRow > 1) {
    Logger.log('USERS already has data — skipping admin creation.');
    return;
  }

  const adminPw   = 'Admin@1234';
  const adminHash = hashPw(adminPw);

  sh.appendRow([
    'USR-ADMIN-001',
    'admin',
    adminHash,
    'admin',
    '',
    'Admin',
    '',
    '',
    '',
    'active',
    '',
    new Date().toISOString()
  ]);

  Logger.log('First admin created.');
  Logger.log('Username: admin');
  Logger.log('Password: Admin@1234');
  Logger.log('IMPORTANT: Change the password immediately after first login!');
}


// ── Seed default SETTINGS (only if empty) ──────────────────
function _seedSettings(ss) {
  const sh = ss.getSheetByName('SETTINGS');
  if (!sh) { Logger.log('SETTINGS sheet not found'); return; }
  // Get existing keys to avoid duplicates
  const existingRows = sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow()-1, 1).getValues().flat().map(String) : [];
  const addMissing = existingRows.length > 0;
  if (addMissing) Logger.log('SETTINGS has data — adding missing keys only.');
  const defaults = [
    // group: village
    ['village_name',        'The Greenfield',              'ชื่อหมู่บ้าน',              'village'],
    ['village_subtitle',    'Village Management System',   'คำบรรยายหมู่บ้าน',          'village'],
    ['village_address',     '',                            'ที่อยู่หมู่บ้าน',             'village'],
    ['village_phone',       '',                            'เบอร์โทรนิติ',              'village'],
    ['village_email',       '',                            'อีเมลนิติ',                 'village'],
    ['village_logo',        '🏘️',                         'Logo (Emoji หรือ URL รูป)', 'village'],
    // group: payment
    ['bank_name',           '',                            'ชื่อธนาคาร',                'payment'],
    ['bank_account_no',     '',                            'เลขบัญชี',                  'payment'],
    ['bank_account_name',   '',                            'ชื่อบัญชี',                 'payment'],
    ['payment_qr_url',      '',                            'URL QR Code ชำระเงิน',      'payment'],
    ['fee_due_day',         '31',                          'วันครบกำหนดชำระ (วันที่)',   'payment'],
    ['fee_period_label',    'H',                           'ตัวย่องวด (H=ครึ่งปี/Q=รายไตรมาส/M=รายเดือน)', 'payment'],
    ['fee_p1_range',        '1/1 - 30/6',                  'งวด 1: ช่วงเวลา',             'payment'],
    ['fee_p1_due',          '31/1',                        'งวด 1: ชำระไม่เกิน',           'payment'],
    ['fee_p1_label',        'H1',                          'งวด 1: ตัวย่อ',               'payment'],
    ['fee_p2_range',        '1/7 - 31/12',                 'งวด 2: ช่วงเวลา',             'payment'],
    ['fee_p2_due',          '31/7',                        'งวด 2: ชำระไม่เกิน',           'payment'],
    ['fee_p2_label',        'H2',                          'งวด 2: ตัวย่อ',               'payment'],
    // group: juristic
    ['juristic_name',       '',                            'ชื่อนิติบุคคล',              'juristic'],
    ['juristic_id',         '',                            'เลขทะเบียนนิติ',             'juristic'],
    ['juristic_address',    '',                            'ที่อยู่นิติบุคคล',            'juristic'],
    // group: fee_calc
    ['fee_rate_per_sqw',    '40',                          'ค่าส่วนกลางต่อตารางวา (บาท/เดือน)', 'fee_calc'],
    ['fee_trash_per_year',  '600',                         'ค่าขยะต่อปี (บาท)',            'fee_calc'],
    ['fee_parking_per_car', '1200',                        'ค่าจอดรถต่อคัน/ปี (บาท)',      'fee_calc'],
    ['fee_discount_pct',    '5',                           '% ส่วนลดชำระเต็มปี',           'fee_calc'],
    // group: invoice
    ['bill_prefix',         'A',                           'Prefix เลขที่ใบแจ้ง (เช่น A)',  'invoice'],
    ['bank_branch',         '',                            'สาขาธนาคาร',                    'invoice'],
    ['line_id',             '',                            'Line Official ID',               'invoice'],
    ['payment_note',        'นิติบุคคลไม่รับชำระเป็นเงินสดทุกกรณี', 'หมายเหตุการชำระ', 'invoice'],
    ['fee_condition_1',     'กรุณาชำระเงินภายในวันที่ที่กำหนด หากชำระล่าช้าจะมีค่าปรับตามข้อบังคับนิติบุคคล', 'เงื่อนไขข้อ 1', 'invoice'],
    ['fee_condition_2',     'ส่วนลดชำระเต็มปี ให้สิทธิ์แค่ค่าส่วนกลาง ไม่รวมค่ารถและหมดเขตตามที่กำหนด', 'เงื่อนไขข้อ 2', 'invoice'],
    ['fee_condition_3',     'ขอให้ท่านส่งหลักฐานการชำระเงินเข้ามาที่ Line Official', 'เงื่อนไขข้อ 3', 'invoice'],
  ];
  const ts = new Date().toISOString();
  var added = 0;
  defaults.forEach(function([key, value, label, group]) {
    if (!existingRows.includes(key)) {
      sh.appendRow([key, value, label, group, ts]);
      added++;
    }
  });
  Logger.log('SETTINGS: added ' + added + ' new keys (' + existingRows.length + ' already existed).');
}

// ── Reset admin password (use if locked out) ──
function resetAdminPassword() {
  const newPw   = 'Admin@1234';
  const newHash = hashPw(newPw);
  updateRowById('USERS', 'username', 'admin', { password_hash: newHash });
  Logger.log('Admin password reset to: Admin@1234');
}

// ── Add new admin user ──
function addAdminUser(username, password, displayName) {
  if (!username || !password) throw new Error('username and password required');
  const row = {
    user_id:       genId('USR'),
    username:      username,
    password_hash: hashPw(password),
    role:          'admin',
    house_id:      '',
    display_name:  displayName || username,
    phone:         '',
    email:         '',
    avatar_url:    '',
    status:        'active',
    last_login:    '',
    created_at:    new Date().toISOString()
  };
  appendRow('USERS', row);
  Logger.log('Admin added: ' + username);
}

// ── Test API: verify GAS is working ──
function testAPI() {
  const result = Auth.login({ username: 'admin', password: 'Admin@1234' });
  Logger.log('Login test: ' + JSON.stringify(result));
}
