import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { DataService, ObjectI } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  map: L.Map;

  center = L.latLng(50.760918, 4.11017);
  zoom = 3;

  options: any = {
    layers: [
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, minZoom: 3, attribution: 'Open Street Map' })
    ],
    zoom: this.zoom,
    center: this.center
  };

  list: ObjectI[];
  selected: number = null;
  hovered: number = null;
  defaultIconUrl = 'assets/marker-icon-2x';

  markers: L.Layer[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
  }

  onMapReady(map: L.Map): void {
    this.map = map;
    this.getListAndMarkers();
  }

  getListAndMarkers(): void {
    this.dataService.getObjectList()
      .subscribe((list: ObjectI[]) => {
        this.list = list;
        this.setMarkers();
      }, err => console.error(err));
  }

  setMarkers(selectedId = null): void {
    this.markers = this.list.map(({ latitude, longitude, id }) => {
      const iconUrl = selectedId === id
        ? this.defaultIconUrl + '-red' : this.defaultIconUrl;
      return L.marker([latitude, longitude], {
        icon: L.icon({
          iconSize: [25, 41],
          iconAnchor: [13, 41],
          iconUrl: iconUrl + '.png',
          shadowUrl: 'assets/marker-shadow.png'
        })
      }).on('click', () => (
        this.setMarkers(id),
        this.selectItem({ latitude, longitude, id }),
        this.cdr.detectChanges()));
    });
  }

  hoverItem(id: number): void {
    this.hovered = id;
  }

  selectItem({ latitude, longitude, id }): void {
    this.hovered = null;
    this.selected = id;
    this.center = L.latLng(latitude, longitude);
    this.zoom = 7;
  }

  onZoomChange(zoom: number): void {
    setTimeout(() => {
      this.zoom = zoom;
    });
  }

}
