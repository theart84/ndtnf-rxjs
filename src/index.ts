import {of, from, timer, range, Observable, observable} from 'rxjs';
import {map} from "rxjs/operators";

const o = range(0, 10)

o.subscribe({
  next: (value: any) => console.log('Next:', value),
  complete: () => console.log('Complete!'),
  error: (error) => console.log('Error!', error)
})

const producer = (observer) => {
  fetch('https://api.github.com/search/repositories?q=theart84')
    .then(response => response.json())
    .then(value => observer.next(value));
}
const stream = new Observable(producer);

stream.subscribe((value) => console.log(value));

const o2 = from(fetch('https://api.github.com/search/repositories?q=theart84')); // проверил через from

o2.subscribe(value => console.log(value.json()));


// @ts-ignore
const producers2 = (observer) => {
  fetch('https://jsonplaceholder.typicode.com/users')
    .then(response => response.json())
    .then(value => observer.next(value));
}


// @ts-ignore
const o3 = new Observable(producers2).pipe(map((value) => value.filter((item) => item.id > 5)))

o3.subscribe(value => console.log(value))

const producers3 = (observer) => {
  let id = 1;
  const timerID = setInterval(() => {
    fetch(`http://jsonplaceholder.typicode.com/posts/${id}`)
      .then(response => response.json())
      .then(value => observer.next(value))
      .then(() => id++);

    if (id > 10) {
      observer.complete();
      console.log('Stream ended!')
      clearInterval(timerID);
    }
  }, 1500);

}

const o4 = new Observable(producers3);

o4.subscribe(value => console.log(value));
