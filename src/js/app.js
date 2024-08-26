// TODO: write code here
import { ajax } from 'rxjs/ajax';
import { interval, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

const url = 'https://rxjsback.vercel.app/messages/unread'; //'http://localhost:7070/messages/unread';

const formatDate = (date) => {
  date = new Date(date);
  console.log(date, typeof date);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')} ${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
};

const shortenSubject = (subject) => {
  return subject.length > 15 ? subject.slice(0, 15) + '...' : subject;
};

const updateMessagesTable = (messages) => {
  const messagesBody = document.getElementById('messages-body');
  messages.forEach((message) => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td class="email">${message.from}</td>
        <td class="subject">${shortenSubject(message.subject)}</td>
        <td class="email-date">${formatDate(message.received)}</td>
    `;
    messagesBody.prepend(row);
  });
};

const fetchMessages = () => {
  return ajax.getJSON(url).pipe(
    map((response) => response.messages),
    catchError((error) => {
      console.error('Ошибка при получении сообщений:', error);
      return of([]);
    }),
  );
};

const messageUpdates$ = interval(5000).pipe(switchMap(fetchMessages));

messageUpdates$.subscribe((messages) => {
  if (messages.length > 0) {
    updateMessagesTable(messages);
  }
});
