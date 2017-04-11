import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../app-backend/auth/auth.service';
import { Channels } from '../../../constants/enums/channels.enum';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

	public userName = '';
	public password = '';

	constructor(private authService: AuthService) { }

	public ngOnInit(): void {
		// implement this
	}

	public login(): void {
		this.authService.authenticateUser(this.userName, this.password);
	}
}
