import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hashes a plaintext password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compares a candidate plaintext password with a stored bcrypt hash
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Formats a Date of Birth into the MMDDYY initial password format
 * Example: May 15, 2011 -> "051511"
 */
export const formatDobToPassword = (dobInput: Date | string): string => {
  const date = new Date(dobInput);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid Date of Birth provided');
  }

  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const yy = String(date.getFullYear()).slice(-2);

  return `${mm}${dd}${yy}`;
};

/**
 * Generates a bcrypt hash of the MMDDYY initial password for parents/students
 * The plain password is never stored
 */
export const hashDobPassword = async (dobInput: Date | string): Promise<string> => {
  const plainDobPass = formatDobToPassword(dobInput);
  return hashPassword(plainDobPass);
};
