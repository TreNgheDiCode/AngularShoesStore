import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ElementRef,
} from '@angular/core';
import { UtilityService } from '../services/utility.service';
import { Product, User } from '../models/models';
import { NavigationService } from '../services/navigation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trangchu',
  templateUrl: './trangchu.component.html',
  styleUrls: ['./trangchu.component.css'],
})
export class TrangchuComponent implements OnInit {
  @ViewChild('modalTitle') modalTitle!: ElementRef;
  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;
  users: User[] = [];
  view: 'grid' = 'grid';
  sortby: 'default' | 'htl' | 'lth' = 'default';
  products: Product[] = [];

  onClick(item: any) {
    // Đảo ngược trạng thái clicked của phần tử được click
    item.clicked = !item.clicked;
  }

  constructor(
    private navigationService: NavigationService,
    public utilityService: UtilityService,
    public router: Router
  ) {}

  ngOnInit(): void {
    if (!this.utilityService.isLoggedIn()) this.router.navigate(['/login']);

    this.navigationService.getAlls().subscribe((res: any) => {
      this.products = res;
    });
  }
  sortByPrice(sortKey: string) {
    this.products.sort((a, b) => {
      if (sortKey === 'default') {
        return a.id > b.id ? 1 : -1;
      }
      return (
        (sortKey === 'htl' ? 1 : -1) *
        (this.utilityService.applyDiscount(a.price, a.offer.discount) >
        this.utilityService.applyDiscount(b.price, b.offer.discount)
          ? -1
          : 1)
      );
    });
  }

  openCreate() {
    this.router.navigate(['/them']);
  }
}
