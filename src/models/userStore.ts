export type Preferences = {
  email: boolean;
  sms: boolean;
  [key: string]: boolean;
};

export type User = {
  email: string;
  telephone: string;
  preferences: Preferences;
};

const users = new Map<string, User>(); // KEYED BY email

export const userStore = {
  create(user: User) {
    if (users.has(user.email)) {
      throw new Error('User already exists');
    }
    users.set(user.email, user);
  },

  edit(email: string, newPreferences: Preferences) {
    const user = users.get(email);
    if (!user) throw new Error('User not found');
    user.preferences = { ...user.preferences, ...newPreferences };
    users.set(email, user);
  },

  getByEmail(email: string) {
    return users.get(email);
  },

  getByTelephone(telephone: string) {
    return Array.from(users.values()).find(u => u.telephone === telephone);
  },

  getAll() {
    return Array.from(users.values());
  }
};
