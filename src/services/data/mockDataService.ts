import type { Action, CheckIn, Completion, Person } from '@/domain/types';
import { readJson, removeKeys, writeJson } from '@/services/storage';
import type { DataService, DataSnapshot } from '@/services/types';

/**
 * Offline data adapter. Persists private records to AsyncStorage under
 * namespaced keys. V1 does not upload check-ins, labels, or reflections.
 */
function keyFor(userId: string, entity: string): string {
  return `data:${userId}:${entity}`;
}

export class MockDataService implements DataService {
  async load(userId: string): Promise<DataSnapshot> {
    const [persons, checkIns, actions, completions] = await Promise.all([
      readJson<Person[]>(keyFor(userId, 'persons'), []),
      readJson<CheckIn[]>(keyFor(userId, 'checkins'), []),
      readJson<Action[]>(keyFor(userId, 'actions'), []),
      readJson<Completion[]>(keyFor(userId, 'completions'), []),
    ]);
    return { persons, checkIns, actions, completions };
  }

  async addPerson(userId: string, person: Person): Promise<void> {
    const list = await readJson<Person[]>(keyFor(userId, 'persons'), []);
    await writeJson(keyFor(userId, 'persons'), [person, ...list]);
  }

  async addCheckIn(userId: string, checkIn: CheckIn): Promise<void> {
    const list = await readJson<CheckIn[]>(keyFor(userId, 'checkins'), []);
    await writeJson(keyFor(userId, 'checkins'), [checkIn, ...list]);
  }

  async addAction(userId: string, action: Action): Promise<void> {
    const list = await readJson<Action[]>(keyFor(userId, 'actions'), []);
    await writeJson(keyFor(userId, 'actions'), [action, ...list]);
  }

  async addCompletion(userId: string, completion: Completion): Promise<void> {
    const list = await readJson<Completion[]>(keyFor(userId, 'completions'), []);
    await writeJson(keyFor(userId, 'completions'), [completion, ...list]);
  }

  async clearAll(userId: string): Promise<void> {
    await removeKeys([
      keyFor(userId, 'persons'),
      keyFor(userId, 'checkins'),
      keyFor(userId, 'actions'),
      keyFor(userId, 'completions'),
    ]);
  }
}
