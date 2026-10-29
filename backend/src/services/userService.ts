import prisma from './prisma';
import { RoleType } from '../types';
import bcrypt from 'bcryptjs';
import { checkDbAvailability } from './academicService';

export interface UserRecord {
  id: string;
  phone: string;
  email: string | null;
  passwordHash: string;
  role: RoleType;
  isActive: boolean;
  mustChangePassword: boolean;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  admin?: { id: string; name: string; phone: string; email: string | null } | null;
  teacher?: { id: string; name: string; phone: string; email: string | null; status: string } | null;
  parent?: { id: string; name: string; phone: string; alternatePhone: string | null; address: string | null } | null;
}

// Seed Users for Development / Testing
const SEED_USERS: UserRecord[] = [
  {
    id: 'admin-uuid-1111-2222-333344445555',
    phone: '9800000001',
    email: 'admin@infinite.com',
    passwordHash: bcrypt.hashSync('Admin@123', 10),
    role: 'ADMIN',
    isActive: true,
    mustChangePassword: false,
    name: 'Infinite System Administrator',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    admin: {
      id: 'admin-prof-1',
      name: 'Infinite System Administrator',
      phone: '9800000001',
      email: 'admin@infinite.com',
    },
  },
  {
    id: 'teacher-uuid-2222-3333-444455556666',
    phone: '9800000002',
    email: 'teacher@infinite.com',
    passwordHash: bcrypt.hashSync('Teacher@123', 10),
    role: 'TEACHER',
    isActive: true,
    mustChangePassword: false,
    name: 'Prof. Rajesh Sharma (Physics)',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    teacher: {
      id: 'teacher-prof-1',
      name: 'Prof. Rajesh Sharma (Physics)',
      phone: '9800000002',
      email: 'teacher@infinite.com',
      status: 'ACTIVE',
    },
  },
  {
    id: 'parent-uuid-3333-4444-555566667777',
    phone: '6361085188',
    email: null,
    passwordHash: bcrypt.hashSync('260906', 10), // DOB password: 260906 (Sep 26, 2006)
    role: 'PARENT',
    isActive: true,
    mustChangePassword: false,
    name: 'Mr. Ramesh Kumar (Parent of Rahul)',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    parent: {
      id: 'parent-prof-1',
      name: 'Mr. Ramesh Kumar (Parent of Rahul)',
      phone: '6361085188',
      alternatePhone: null,
      address: 'Bangalore, Karnataka',
    },
  },
  {
    id: 'parent-uuid-4444-5555-666677778888',
    phone: '9823445566',
    email: 'venkat.nair@infinite.com',
    passwordHash: bcrypt.hashSync('250112', 10), // DOB password: 250112 (Jan 25, 2012 - Priya Nair)
    role: 'PARENT',
    isActive: true,
    mustChangePassword: false,
    name: 'Mr. Venkat Nair (Parent of Priya - Class 9)',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    parent: {
      id: 'parent-prof-2',
      name: 'Mr. Venkat Nair (Parent of Priya - Class 9)',
      phone: '9823445566',
      alternatePhone: null,
      address: 'Jayanagar, Bangalore, Karnataka',
    },
  },
  {
    id: 'parent-uuid-5555-6666-777788889999',
    phone: '9834556677',
    email: 'santosh.patil@infinite.com',
    passwordHash: bcrypt.hashSync('141111', 10), // DOB password: 141111 (Nov 14, 2011 - Rohan Patil)
    role: 'PARENT',
    isActive: true,
    mustChangePassword: false,
    name: 'Mr. Santosh Patil (Parent of Rohan - Class 10 KSB)',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    parent: {
      id: 'parent-prof-3',
      name: 'Mr. Santosh Patil (Parent of Rohan - Class 10 KSB)',
      phone: '9834556677',
      alternatePhone: null,
      address: 'Rajajinagar, Bangalore, Karnataka',
    },
  },
  {
    id: 'parent-uuid-6666-7777-888899990000',
    phone: '9834556688',
    email: 'vikas.sharma@infinite.com',
    passwordHash: bcrypt.hashSync('180512', 10), // DOB password: 180512 (May 18, 2012 - Ananya Sharma)
    role: 'PARENT',
    isActive: true,
    mustChangePassword: false,
    name: 'Mr. Vikas Sharma (Parent of Ananya - Class 9 CBSE)',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    parent: {
      id: 'parent-prof-4',
      name: 'Mr. Vikas Sharma (Parent of Ananya - Class 9 CBSE)',
      phone: '9834556688',
      alternatePhone: null,
      address: 'Indiranagar, Bangalore, Karnataka',
    },
  },
];



export const findUserByIdentifier = async (identifier: string): Promise<UserRecord | null> => {
  const clean = identifier.trim();
  const isEmail = clean.includes('@');
  const cleanDigits = clean.replace(/\D/g, '');
  const phone10 = cleanDigits.length >= 10 ? cleanDigits.slice(-10) : cleanDigits;

  const dbOk = await checkDbAvailability();
  if (dbOk) {
    try {
      const user = await prisma.user.findFirst({
        where: isEmail
          ? { email: { equals: clean, mode: 'insensitive' } }
          : {
              OR: [
                { phone: clean },
                { phone: phone10 },
                { phone: `+91${phone10}` },
                { phone: `+91 ${phone10}` },
              ],
            },
        include: {
          admin: true,
          teacher: true,
          parent: true,
        },
      });

      if (user) {
        const name = user.admin?.name || user.teacher?.name || user.parent?.name || 'User';
        return {
          ...user,
          role: user.role as RoleType,
          name,
        };
      }
    } catch {}
  }

  // Fallback to memory seed records
  const match = SEED_USERS.find((u) => {
    if (isEmail) {
      return u.email?.toLowerCase() === clean.toLowerCase();
    }
    const userPhoneDigits = u.phone.replace(/\D/g, '').slice(-10);
    return u.phone === clean || (phone10.length > 0 && userPhoneDigits === phone10);
  });

  return match || null;
};

export const findUserById = async (id: string): Promise<UserRecord | null> => {
  const dbOk = await checkDbAvailability();
  if (dbOk) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          admin: true,
          teacher: true,
          parent: true,
        },
      });

      if (user) {
        const name = user.admin?.name || user.teacher?.name || user.parent?.name || 'User';
        return {
          ...user,
          role: user.role as RoleType,
          name,
        };
      }
    } catch {}
  }

  const match = SEED_USERS.find((u) => u.id === id);
  return match || null;
};

export const updateUserPassword = async (
  userId: string,
  newPasswordHash: string
): Promise<void> => {
  const dbOk = await checkDbAvailability();
  if (dbOk) {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          passwordHash: newPasswordHash,
          mustChangePassword: false,
        },
      });
      return;
    } catch {}
  }

  const match = SEED_USERS.find((u) => u.id === userId);
  if (match) {
    match.passwordHash = newPasswordHash;
    match.mustChangePassword = false;
  }
};
