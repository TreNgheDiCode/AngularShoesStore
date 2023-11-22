import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NavigationService } from '../services/navigation.service';
import { UtilityService } from '../services/utility.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  message = '';
  constructor(
    private fb: FormBuilder,
    private navigationService: NavigationService,
    private utilityService: UtilityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.utilityService.isLoggedIn()) this.router.navigate(['/trangchu'])
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      pwd: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(15),
        ],
      ],
    });
  }

  login() {
    this.navigationService
      .loginUser(this.Email.value, this.PWD.value)
      .subscribe((res: any) => {
        if (res.toString() == 'no-permission') {
          this.message =
            'Tài khoản bạn dùng không có quyền truy cập vào hệ thống';
        } else if (res.toString() !== 'invalid') {
          this.message = 'Đăng nhập thành công';
          this.utilityService.setUser(res.toString());
          setTimeout(() => {
            this.router.navigate(['/trangchu']).then(() => {
              // Đợi một khoảng thời gian ngắn (ví dụ: 500ms) trước khi tải lại trang
              setTimeout(() => {
                location.reload();
              }, 300);
            });
          }, 1000);
        } else {
          this.message = 'Đăng nhập không thành công';
        }
      });
  }

  get Email(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }
  get PWD(): FormControl {
    return this.loginForm.get('pwd') as FormControl;
  }
}
