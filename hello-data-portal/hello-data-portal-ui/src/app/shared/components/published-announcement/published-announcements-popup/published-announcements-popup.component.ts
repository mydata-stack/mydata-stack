import {
  AfterViewInit,
  Component,
  ComponentRef,
  OnInit,
  Renderer2,
  RendererFactory2,
  ViewContainerRef
} from "@angular/core";
import {Observable} from "rxjs";
import {Store} from "@ngrx/store";
import {AppState} from "../../../../store/app/app.state";
import {selectPublishedAndFilteredAnnouncements} from "../../../../store/announcement/announcement.selector";
import {markAnnouncementAsRead} from "../../../../store/announcement/announcement.action";
import {Announcement} from "../../../../store/announcement/announcement.model";
import {DialogService} from "primeng/dynamicdialog";
import {
  PublishedAnnouncementsPopupHeaderComponent
} from "./published-annoucements-popup-header/published-announcements-popup-header.component";
import {selectSelectedLanguage} from "../../../../store/auth/auth.selector";

@Component({
  providers: [DialogService],
  template: `
    <p-divider></p-divider>
    <div *ngIf="(selectedLanguage$ | async) as selectedLanguage">
      <div *ngFor="let announcement of publishedAnnouncements$ | async" id="ghettobox">
        <p-toolbar>
          <div class="p-toolbar-group-start">
            <i class="fas fa-circle-info"></i>
          </div>
          <div class="p-toolbar-group-center" style="width: 65%">
            <p-editor [ngModel]="getMessage(announcement, selectedLanguage)" [disabled]="true" [readonly]="true"
                      [style]="{width: '100%'}">
              <p-header hidden></p-header>
            </p-editor>
          </div>
          <div class="p-toolbar-group-end">
            <div class="published-date" *ngIf="announcement.publishedDate">
              [{{ '@Published date' | transloco }} {{ announcement.publishedDate | date: 'dd.MM.yyyy, HH:mm:ss' }}]
            </div>
          </div>
        </p-toolbar>
        <p-divider></p-divider>
      </div>
    </div>`
})
export class PublishedAnnouncementsPopupComponent implements OnInit, AfterViewInit {

  publishedAnnouncements$: Observable<any>;
  private renderer: Renderer2;
  private headerComponentRef!: ComponentRef<PublishedAnnouncementsPopupHeaderComponent>;
  selectedLanguage$: Observable<string | null>;

  constructor(private store: Store<AppState>, private viewContainerRef: ViewContainerRef, private readonly rendererFactory: RendererFactory2) {
    this.publishedAnnouncements$ = this.store.select(selectPublishedAndFilteredAnnouncements);
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.selectedLanguage$ = store.select(selectSelectedLanguage);
  }

  ngAfterViewInit(): void {
    this.hide = this.hide.bind(this);
  }

  hide(announcement: Announcement): void {
    this.store.dispatch(markAnnouncementAsRead({announcement}));
  }

  ngOnInit(): void {
    this.headerComponentRef = this.viewContainerRef.createComponent(PublishedAnnouncementsPopupHeaderComponent);
    const titleSpan = document.getElementsByClassName('p-dialog-title')[0];
    titleSpan.setAttribute('style', 'width: 100%');
    this.renderer.appendChild(titleSpan, this.headerComponentRef.location.nativeElement)
  }

  getMessage(announcement: Announcement, selectedLanguage: string): string | undefined {
    return announcement?.messages?.[selectedLanguage];
  }

}
