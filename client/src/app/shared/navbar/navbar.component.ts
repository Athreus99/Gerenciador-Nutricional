import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf] // Removido NgFor
})
export class NavbarComponent {
  
  constructor(
    public authService: AuthService
  ) { }
  
  logout(): void {
    this.authService.logout();
  }
}