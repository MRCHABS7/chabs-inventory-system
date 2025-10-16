import type { User } from './types';
import { currentSession, loginLocal, logoutLocal } from './storage';

export const login = (email: string, password: string, role: User['role']) => loginLocal(email, password, role);
export const logout = () => logoutLocal();
export const me = () => currentSession();
