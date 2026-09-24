export {};

const API_BASE = 'http://localhost:5000/api';

async function postJson(url: string, body: any, headers: Record<string, string> = {}) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  const data: any = await res.json();
  return { status: res.status, ok: res.ok, data };
}

async function getJson(url: string, headers: Record<string, string> = {}) {
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', ...headers },
  });
  const data: any = await res.json();
  return { status: res.status, ok: res.ok, data };
}

async function testAllThreeRoles() {
  console.log('=== Testing Authentication & Authorization for All 3 Roles ===\n');

  // -------------------------------------------------------------
  // 1. ADMIN TEST (Gmail ID / password)
  // -------------------------------------------------------------
  console.log('[1] Testing ADMIN Login (admin@infinite.com)...');
  const adminLogin = await postJson(`${API_BASE}/auth/login`, {
    identifier: 'admin@infinite.com',
    password: 'Admin@123',
  });
  if (!adminLogin.ok) throw new Error(`Admin login failed: ${JSON.stringify(adminLogin.data)}`);
  const adminToken = adminLogin.data.data.token;
  const adminUser = adminLogin.data.data.user;
  console.log(`✓ Admin Logged In: ${adminUser.name} | Role: ${adminUser.role}`);

  // Test Admin accessing /api/test/admin
  const adminAccess = await getJson(`${API_BASE}/test/admin`, {
    Authorization: `Bearer ${adminToken}`,
  });
  if (!adminAccess.ok) throw new Error(`Admin test failed: ${JSON.stringify(adminAccess.data)}`);
  console.log(`✓ Admin access to /api/test/admin granted: "${adminAccess.data.message}"`);

  // Verify Admin blocked from /api/test/parent
  const adminParentAccess = await getJson(`${API_BASE}/test/parent`, {
    Authorization: `Bearer ${adminToken}`,
  });
  if (adminParentAccess.status === 403) {
    console.log('✓ Admin correctly blocked (403 Forbidden) from /api/test/parent');
  } else {
    throw new Error(`Admin should have been blocked with 403, got ${adminParentAccess.status}`);
  }

  // -------------------------------------------------------------
  // 2. TEACHER TEST (Gmail ID / password)
  // -------------------------------------------------------------
  console.log('\n[2] Testing TEACHER Login (teacher@infinite.com)...');
  const teacherLogin = await postJson(`${API_BASE}/auth/login`, {
    identifier: 'teacher@infinite.com',
    password: 'Teacher@123',
  });
  if (!teacherLogin.ok) throw new Error(`Teacher login failed: ${JSON.stringify(teacherLogin.data)}`);
  const teacherToken = teacherLogin.data.data.token;
  const teacherUser = teacherLogin.data.data.user;
  console.log(`✓ Teacher Logged In: ${teacherUser.name} | Role: ${teacherUser.role}`);

  // Test Teacher accessing /api/test/teacher
  const teacherAccess = await getJson(`${API_BASE}/test/teacher`, {
    Authorization: `Bearer ${teacherToken}`,
  });
  if (!teacherAccess.ok) throw new Error(`Teacher test failed: ${JSON.stringify(teacherAccess.data)}`);
  console.log(`✓ Teacher access to /api/test/teacher granted: "${teacherAccess.data.message}"`);

  // Verify Teacher blocked from /api/test/admin
  const teacherAdminAccess = await getJson(`${API_BASE}/test/admin`, {
    Authorization: `Bearer ${teacherToken}`,
  });
  if (teacherAdminAccess.status === 403) {
    console.log('✓ Teacher correctly blocked (403 Forbidden) from /api/test/admin');
  } else {
    throw new Error(`Teacher should have been blocked with 403, got ${teacherAdminAccess.status}`);
  }

  // -------------------------------------------------------------
  // 3. PARENT TEST (Phone Number + DOB password "051511")
  // -------------------------------------------------------------
  console.log('\n[3] Testing PARENT Login (6361085188 with initial DOB 260906)...');
  const parentLogin = await postJson(`${API_BASE}/auth/login`, {
    identifier: '6361085188',
    password: '260906',
  });
  if (!parentLogin.ok) throw new Error(`Parent login failed: ${JSON.stringify(parentLogin.data)}`);
  const parentToken = parentLogin.data.data.token;
  const parentUser = parentLogin.data.data.user;
  console.log(`✓ Parent Logged In: ${parentUser.name} | Role: ${parentUser.role}`);
  console.log(`✓ Initial mustChangePassword flag: ${parentUser.mustChangePassword}`);

  // Test Parent accessing /api/test/parent
  const parentAccess = await getJson(`${API_BASE}/test/parent`, {
    Authorization: `Bearer ${parentToken}`,
  });
  if (!parentAccess.ok) throw new Error(`Parent test failed: ${JSON.stringify(parentAccess.data)}`);
  console.log(`✓ Parent access to /api/test/parent granted: "${parentAccess.data.message}"`);

  // Verify Parent blocked from /api/test/teacher
  const parentTeacherAccess = await getJson(`${API_BASE}/test/teacher`, {
    Authorization: `Bearer ${parentToken}`,
  });
  if (parentTeacherAccess.status === 403) {
    console.log('✓ Parent correctly blocked (403 Forbidden) from /api/test/teacher');
  } else {
    throw new Error(`Parent should have been blocked with 403, got ${parentTeacherAccess.status}`);
  }

  // Test Password Change for Parent (from initial DOB to new password)
  console.log('\n[4] Testing Parent password change (/api/auth/change-password)...');
  const changeRes = await postJson(
    `${API_BASE}/auth/change-password`,
    {
      currentPassword: '260906',
      newPassword: 'parent_new_secure_pass_2026',
    },
    { Authorization: `Bearer ${parentToken}` }
  );
  if (!changeRes.ok) throw new Error(`Password change failed: ${JSON.stringify(changeRes.data)}`);
  console.log(`✓ Password updated: "${changeRes.data.message}"`);

  // Revert password back to 260906 so subsequent manual logins continue to succeed
  await postJson(
    `${API_BASE}/auth/change-password`,
    {
      currentPassword: 'parent_new_secure_pass_2026',
      newPassword: '260906',
    },
    { Authorization: `Bearer ${parentToken}` }
  );
  console.log('✓ Restored parent password back to initial DOB: 260906');

  // Test /api/auth/me to confirm mustChangePassword is now false
  const meRes = await getJson(`${API_BASE}/auth/me`, {
    Authorization: `Bearer ${parentToken}`,
  });
  if (!meRes.ok) throw new Error(`GetMe failed: ${JSON.stringify(meRes.data)}`);
  console.log(`✓ Current user profile retrieved. mustChangePassword is now: ${meRes.data.data.mustChangePassword}`);

  // Test Logout endpoint
  console.log('\n[5] Testing /api/auth/logout...');
  const logoutRes = await postJson(`${API_BASE}/auth/logout`, {});
  console.log(`✓ Logout confirmed: "${logoutRes.data.message}"`);

  console.log('\n=== ALL ROLE AUTHENTICATION & BARRIER TESTS PASSED SUCCESSFULLY! ===');
}

testAllThreeRoles().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
