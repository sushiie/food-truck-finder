import { Component, OnInit, ViewChildren, AfterViewInit, QueryList } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgmInfoWindow } from '@agm/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Food-Truck-Finder';
  lat = 37.7875398934675;
  lng = -122.397726709152;
  data;
  draggingStart = false;
  dragTimeout;
  updatedMapCenter;
  rerender = true;
  selectedTruck;
  @ViewChildren('infoWindow') infoWindows: QueryList<AgmInfoWindow>;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.fetchOutlets(this.lat, this.lng);
  }

  ngAfterViewInit() {
    console.log(this.infoWindows)

  }

  handleMapClick() {
    this.closeInfoWindows();
  }

  handleMapCenterChange($event) {
    this.updatedMapCenter = $event;
    this.draggingStart = true;
    clearTimeout(this.dragTimeout);
    this.dragTimeout = setTimeout(() => {
     this.fetchOutlets(this.updatedMapCenter.lat, this.updatedMapCenter.lng);
      this.draggingStart = false
    }, 1500);
  }

  fetchOutlets(lat, lng) {
    if (this.rerender) {
      const url = `https://data.sfgov.org/resource/rqzj-sfat.json?$where=within_circle(location,${lat},${lng}, 500)`;
      this.http.get(url).subscribe((res) => {
        this.data = res;
      });
    }
  }

  openMarker(item) {
    this.rerender = false;
    this.selectedTruck = item;
    this.infoWindows.forEach((infoWindow) => {
      if (infoWindow.content['children'][infoWindow.content['children'].length-1].innerText.split(' ')[1] === item.objectid) {
        infoWindow.open();
      } else {
        infoWindow.close();
      }
    })
    setTimeout(() => {
      this.rerender = true;
    }, 2000);
  }

  closeInfoWindows() {
    this.infoWindows.forEach((infoWindow) => {
      infoWindow.close()
    });
  }
}
