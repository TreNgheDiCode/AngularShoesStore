import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Product, User } from '../models/models';
import { NavigationService } from '../services/navigation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-them',
  templateUrl: './them.component.html',
  styleUrls: ['./them.component.css'],
})
export class AddComponent implements OnInit {
  addForm!: FormGroup;
  invaildRPWD: boolean = false;
  message = '';
  showMessage: boolean = false;

  constructor(
    private fb: FormBuilder,
    private navigationService: NavigationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.addForm = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.pattern('^[a-zA-ZÀ-ỹ].*'),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern('^[a-zA-ZÀ-ỹ].*'),
        ],
      ],
      offer: ['', [Validators.required]],
      price: [1, Validators.required],
      quantity: [
        1,
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100),
        ],
      ],
    });
  }

  add() {
    let product: Product = {
      id: 0,
      title: this.Title.value,
      description: this.Description.value,
      productCategory: {
        id: 1,
        category: 'ADIDAS',
        subCategory: 'ADIDAS-Canvas',
      },
      offer: {
        id: 1,
        discount: 5,
        title: 'Giảm giá',
      },
      price: this.Price.value,
      quantity: this.Quantity.value,
      imageName: '',
    };

    this.navigationService.addProduct(product).subscribe((res: any) => {
      this.message = res.toString();
      this.showMessage = true; // Set the flag to true to show the message
      setTimeout(() => {
        this.showMessage = false; // Hide the message after a short delay (e.g., 2000ms)
        this.router.navigate(['/trangchu']); // Navigate to '/login' after hiding the message
      }, 1000);
    });
  }

  //#region Getters
  get Title(): FormControl {
    return this.addForm.get('title') as FormControl;
  }
  get Description(): FormControl {
    return this.addForm.get('description') as FormControl;
  }
  get ProductCategory(): FormControl {
    return this.addForm.get('productCategory') as FormControl;
  }
  get Offer(): FormControl {
    return this.addForm.get('offer') as FormControl;
  }
  get Price(): FormControl {
    return this.addForm.get('price') as FormControl;
  }
  get Quantity(): FormControl {
    return this.addForm.get('quantity') as FormControl;
  }
}
