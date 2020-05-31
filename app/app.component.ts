import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnInit
} from "@angular/core";
import { fromEvent, Observable, Subject, combineLatest } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { MatSelect } from "@angular/material";
interface Food {
  value: string;
  viewValue: string;
}
@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements AfterViewInit {
  @ViewChild("textinputelement") textinputelement: ElementRef;
  @ViewChild("textinputelement2") textinputelement2: ElementRef;
  @ViewChild("dropdownelement") dropdownelement: MatSelect;

  foods: Food[] = [
    { value: "steak-0", viewValue: "Steak" },
    { value: "pizza-1", viewValue: "Pizza" },
    { value: "tacos-2", viewValue: "Tacos" }
  ];

  public dropdownvalue$: Subject<string>;
  public dropdownvalue: string;
  public textinput$: Observable<KeyboardEvent>;
  public textinput: string;

  public textinput$2: Observable<KeyboardEvent>;
  public textinput2: string;

  public ngOnInit() {

    this.dropdownvalue$ = new Subject<string>();
  }

  public ngAfterViewInit() {
    // fired when the EVENT is fired from textinputelement
    this.textinput$ = fromEvent<KeyboardEvent>(
      this.textinputelement.nativeElement,
      "keydown"
    ).pipe(debounceTime(300));
    this.textinput$.subscribe(event => {
      console.log("textinput changed");
    });
    // fired when the EVENT is fired from textinputelement2
    this.textinput$2 = fromEvent<KeyboardEvent>(
      this.textinputelement2.nativeElement,
      "keydown"
    ).pipe(debounceTime(300));
    this.textinput$2.subscribe(event => {
      console.log("textinput2 changed");
    });

    // fired ONLY when both events are fired
    combineLatest([this.textinput$, this.textinput$2, this.dropdownvalue$]).subscribe(answers => {
      console.log("combineLatest was fired");
    });

    // here I mock data that came from propery change on angular
    setTimeout(() => {
      console.log("2 sec passed");
      this.textinput = "value after 2 sec"; // textinput$ DOES NOT fired the change event not fired
      //this fired the change event
      let event = new KeyboardEvent("keydown", { bubbles: true });
      this.textinputelement.nativeElement.dispatchEvent(event);

      //  this.dropdownvalue = "tacos-2"; //dropdownvalue$ DOES NOT fired the change event not fired
       this.dropdownvalue="tacos-2";

       //this will emit the CALLBACK change

      this.dropdownelement.selectionChange.emit();
    }, 2000);
  }
//dropdown call back function fired the Subject for the dropdown change
  onFoodSelection() {
    console.log("dropdown change", this.dropdownvalue);
    this.dropdownvalue$.next(this.dropdownvalue);
  }
}
