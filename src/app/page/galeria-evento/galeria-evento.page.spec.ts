import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GaleriaEventoPage } from './galeria-evento.page';

describe('GaleriaEventoPage', () => {
  let component: GaleriaEventoPage;
  let fixture: ComponentFixture<GaleriaEventoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GaleriaEventoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
