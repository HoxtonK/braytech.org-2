
import * as ls from './localStorage';

export default function runOnceTasks() {

  const history = ls.get('history.tasks') || [];

  if (!history.find(t => t.id === 'resetlang_august192019')) {
    if (ls.get('setting.language') === 'en-au') ls.set('setting.language', 'en');
    ls.update('history.tasks', { id: 'resetlang_august192019' });
  }

  if (!history.find(t => t.id === 'reauth_november042019')) {
    ls.del('setting.auth');
    ls.update('history.tasks', { id: 'reauth_november042019' });
  }

}