import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Languages } from '../../../constants/enums/languages.enum';
import { LocalizationService } from '../../../utils/localization/localization.service';
import { ThemeService } from '../../../utils/theme.service';
import { Themes } from '../../../constants/enums/themes.enum';
import { WidgetLoaderService } from '../../widget-util/widget-loader.service';

@Component({
	selector: 'app-side-bar',
	templateUrl: './side-bar.component.html',
})
export class SideBarComponent {
	public tabs: any = [];
	public selectedTab= '';
	public lanTitle = '';
	public themeTitle = '';

	// If this is failing, add the initialisation to the main app component's constructor
	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private widgetLoaderService: WidgetLoaderService,
		public localizationService: LocalizationService,
		public themeService: ThemeService,
	) {
		widgetLoaderService.getTabs().then(layoutObj => {
			this.tabs = layoutObj.model[1].model;
		});

		if (this.localizationService.activeLanguageCode === Languages.EN) {
			this.lanTitle = this.localizationService.getLongDesc(Languages.AR);
		} else {
			this.lanTitle = this.localizationService.getLongDesc(Languages.EN);
		}

		if (this.themeService.selectedTheme === Themes.Light) {
			this.themeTitle = this.themeService.getThemeDesc(Themes.Dark);
		} else {
			this.themeTitle = this.themeService.getThemeDesc(Themes.Light);
		}
	}

	public loadTab(tab: any): void {
		this.selectedTab = tab.id;
		this.widgetLoaderService.loadTab(tab);

		this.hideSideBar();
	}

	public sideBarCloseClicked(event: any): void {
		event.preventDefault();
		this.hideSideBar();
	}

	private hideSideBar(): void {
		const body = document.getElementsByTagName('body')[0];
		body.classList.remove('nav-expanded');
	}

	public changeLanguage(): void {
		this.lanTitle = this.localizationService.getLongDesc();

		if (this.localizationService.activeLanguageCode === Languages.EN) {
			this.localizationService.activeLanguageCode = Languages.AR;
		} else {
			this.localizationService.activeLanguageCode = Languages.EN;
		}

		this.hideSideBar();
	}

	public changeTheme(): void {
		this.themeTitle = this.themeService.getThemeDesc();

		if (this.themeService.selectedTheme === Themes.Light) {
			this.themeService.selectedTheme = Themes.Dark;
		} else {
			this.themeService.selectedTheme = Themes.Light;
		}

		this.hideSideBar();
	}
}
