import { openDB } from 'idb';

const DB_NAME = 'intimacy-scheduler';
const DB_VERSION = 1;

export interface Appreciation {
  id?: number;
  text: string;
  date: Date;
  isHot: boolean;
}

export interface ScheduledMoment {
  id?: number;
  type: 'affectionate' | 'emotional' | 'sexual' | 'adventurous' | 'spicy' | 'roleplay' | 'exploration';
  description: string;
  date: Date;
  isHot: boolean;
}

export const db = await openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    db.createObjectStore('appreciations', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('scheduled-moments', { keyPath: 'id', autoIncrement: true });
  },
});

export const appreciationsDB = {
  async add(appreciation: Appreciation) {
    return db.add('appreciations', appreciation);
  },
  async getAll() {
    return db.getAll('appreciations');
  },
  async delete(id: number) {
    return db.delete('appreciations', id);
  },
};

export const scheduledMomentsDB = {
  async add(moment: ScheduledMoment) {
    return db.add('scheduled-moments', moment);
  },
  async getAll() {
    return db.getAll('scheduled-moments');
  },
  async delete(id: number) {
    return db.delete('scheduled-moments', id);
  },
};