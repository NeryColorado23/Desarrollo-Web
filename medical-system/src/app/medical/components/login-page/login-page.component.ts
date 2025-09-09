import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { FooterComponent } from "../../../shared/components/footer/footer.component";


@Component({
  selector: 'app-login-page',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {

}
