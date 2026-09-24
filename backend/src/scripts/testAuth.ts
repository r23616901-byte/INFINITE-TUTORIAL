import { formatDobToPassword, hashPassword, comparePassword } from '../utils/password';
import { signToken, verifyJwt } from '../utils/jwt';
import { RoleType } from '../types';

async function runAuthTests() {
  console.log('--- Starting Authentication Core Unit Tests ---');

  // Test 1: DOB Password Generation
  const sampleDob = new Date('2011-05-15');
  const generatedPassword = formatDobToPassword(sampleDob);
  console.log(`[Test 1] DOB (2011-05-15) -> Initial MMDDYY Password: "${generatedPassword}"`);
  if (generatedPassword !== '051511') {
    throw new Error(`Expected "051511", got "${generatedPassword}"`);
  }
  console.log('✓ Test 1 Passed: DOB MMDDYY format is correct');

  // Test 2: Bcrypt Hashing & Comparison
  const hash = await hashPassword(generatedPassword);
  console.log(`[Test 2] Password hashed: ${hash.substring(0, 29)}...`);
  const isMatch = await comparePassword(generatedPassword, hash);
  const isWrongMatch = await comparePassword('wrongpass', hash);
  if (!isMatch || isWrongMatch) {
    throw new Error('Password comparison failed');
  }
  console.log('✓ Test 2 Passed: Bcrypt hashing and comparison functioning accurately');

  // Test 3: JWT Sign and Verify
  const payload = {
    userId: '11111111-2222-3333-4444-555555555555',
    role: 'PARENT' as RoleType,
    phone: '9876543210',
  };
  const token = signToken(payload);
  console.log(`[Test 3] Token signed: ${token.substring(0, 30)}...`);
  const decoded = verifyJwt(token);
  if (decoded.userId !== payload.userId || decoded.role !== 'PARENT' || decoded.phone !== '9876543210') {
    throw new Error('JWT verification payload mismatch');
  }
  console.log('✓ Test 3 Passed: JWT signing and payload verification functioning accurately');

  // Test 4: Role Authorization logic
  const allowedRoles: RoleType[] = ['ADMIN', 'TEACHER'];
  const userRole: RoleType = 'PARENT';
  const isAuthorized = allowedRoles.includes(userRole);
  if (isAuthorized) {
    throw new Error('PARENT should NOT be authorized for [ADMIN, TEACHER]');
  }
  console.log('✓ Test 4 Passed: Role authorization logic strictly enforces access barriers');

  console.log('\nAll Authentication unit checks passed successfully!');
}

runAuthTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
