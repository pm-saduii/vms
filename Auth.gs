// ============================================================
// Auth.gs — JWT Authentication
// ============================================================

var Auth = (function() {

  function login(body) {
    const { username, password } = body;
    if (!username || !password) throw new Error('username/password required');

    const user = findRow('USERS', 'username', username.trim());
    if (!user) throw new Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    if (user.status !== 'active') throw new Error('บัญชีถูกระงับ กรุณาติดต่อ admin');

    const hash = hashPw(password);
    if (user.password_hash !== hash) throw new Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');

    // Update last_login
    updateRowById('USERS', 'user_id', user.user_id, { last_login: now() });

    // Log
    appendRow('LOGIN_LOGS', {
      log_id:     genId('LOG'),
      user_id:    user.user_id,
      username:   user.username,
      role:       user.role,
      login_at:   now(),
      status:     'success',
      fail_reason: ''
    });

    const token = _makeToken(user);
    return {
      token,
      user: {
        user_id:      user.user_id,
        username:     user.username,
        display_name: user.display_name,
        role:         user.role,
        house_id:     user.house_id,
        phone:        user.phone,
        email:        user.email
      }
    };
  }

  function verify(token) {
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = JSON.parse(Utilities.newBlob(
        Utilities.base64Decode(parts[1])).getDataAsString());
      // Check expiry
      if (payload.exp < Date.now()) return null;
      // Verify signature
      const sig = _sign(parts[0] + '.' + parts[1]);
      if (sig !== parts[2]) return null;
      return payload;
    } catch(_) { return null; }
  }

  function changePassword(body, user) {
    const { old_password, new_password } = body;
    if (!old_password || !new_password) throw new Error('ระบุรหัสผ่านให้ครบ');
    if (new_password.length < 6) throw new Error('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');

    const u = findRow('USERS', 'user_id', user.user_id);
    if (!u) throw new Error('User not found');
    if (u.password_hash !== hashPw(old_password)) throw new Error('รหัสผ่านเดิมไม่ถูกต้อง');

    updateRowById('USERS', 'user_id', user.user_id, {
      password_hash: hashPw(new_password)
    });
    return { success: true };
  }

  // ── Private ──────────────────────────────────────────────
  function _makeToken(user) {
    const header  = _b64({ alg: 'HS256', typ: 'JWT' });
    const payload = _b64({
      user_id:  user.user_id,
      username: user.username,
      role:     user.role,
      house_id: user.house_id,
      exp:      Date.now() + 8 * 3600 * 1000   // 8 hours
    });
    const sig = _sign(header + '.' + payload);
    return header + '.' + payload + '.' + sig;
  }

  function _b64(obj) {
    return Utilities.base64EncodeWebSafe(JSON.stringify(obj)).replace(/=+$/, '');
  }

  function _sign(data) {
    const bytes = Utilities.computeHmacSha256Signature(data, JWT_SECRET);
    return Utilities.base64EncodeWebSafe(bytes).replace(/=+$/, '');
  }

  function verifyResetIdentity(body) {
    const { house_no, phone, email } = body;
    if (!house_no || !phone || !email) throw new Error('กรุณากรอกข้อมูลให้ครบ');
    const houses = sheetToObjects('HOUSES');
    const house  = houses.find(h => String(h.house_no).trim() === String(house_no).trim());
    if (!house) throw Object.assign(new Error('ไม่พบบ้านเลขที่นี้ในระบบ'), { httpCode: 404 });
    const ph1 = String(house.phone||'').replace(/[^0-9]/g,'');
    const ph2 = String(phone).replace(/[^0-9]/g,'');
    const em1 = String(house.email||'').toLowerCase().trim();
    const em2 = String(email).toLowerCase().trim();
    if (ph1 !== ph2 || em1 !== em2) {
      throw Object.assign(new Error('ข้อมูลไม่ตรงกัน กรุณาตรวจสอบเบอร์โทรและอีเมล'), { httpCode: 401 });
    }
    const users = sheetToObjects('USERS');
    const user  = users.find(u => u.house_id === house.house_id);
    if (!user) throw Object.assign(new Error('ไม่พบบัญชีผู้ใช้ที่ผูกกับบ้านนี้'), { httpCode: 404 });
    return { user_id: user.user_id, house_no: house.house_no };
  }

  function resetPasswordById(body) {
    const { user_id, new_password } = body;
    if (!user_id || !new_password) throw new Error('ข้อมูลไม่ครบ');
    if (String(new_password).length < 5) throw new Error('รหัสผ่านต้องมีอย่างน้อย 5 ตัวอักษร');
    const ok = updateRowById('USERS', 'user_id', user_id, {
      password_hash: hashPw(String(new_password)),
    });
    if (!ok) throw new Error('ไม่พบผู้ใช้');
    return { success: true };
  }

  return { login, verify, changePassword, verifyResetIdentity, resetPasswordById };
})();
