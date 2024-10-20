import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisEventosPage } from './mis-eventos.page';

describe('MisEventosPage', () => {
  let component: MisEventosPage;
  let fixture: ComponentFixture<MisEventosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MisEventosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
