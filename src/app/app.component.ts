import { Component, NgZone } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  endSearch : boolean = false;
  showProgressbar: boolean = false;
  results: string [] = [];
  resultsObserver : Observable<string[]> = new Observable<string[]>();

  public constructor(private ngZone: NgZone){

  }

  search(event: any){
    console.log(event.target);
    event.preventDefault();
    this.showProgressbar = true;
    this.endSearch = true;
    this.results = [];
    this.resultsObserver = this.createEventSourceObserver();
    console.log(this.resultsObserver);
  }

  createEventSourceObserver(): Observable<string[]>{
    console.log("observer");
    return new Observable<string[]>((observer: Observer<string[]>)=>{
      const source = new EventSource(environment.apiUrl);
      source.onmessage = (event)=>{
        console.log(event.data);
        this.results.push(event.data);
        this.results.sort();
        this.ngZone.run(()=> observer.next(this.results));
      };


      source.onopen = (event)=>{
        if(this.endSearch){
          source.close();
          this.ngZone.run(()=>{
            observer.complete();
            this.showProgressbar = false;
          });
        }
        this.endSearch = true;
      };
    }
      
   );


  }

}
