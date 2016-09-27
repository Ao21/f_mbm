import {Component, Host} from '@angular/core';
import {AccordianComponent} from './accordian';


/**
 *  Accordian Child Component
 *
 *  The Child Component of the Accordian
 *
 *  ### Example of an accordian
 *  ````
 *  <c-accordian>
 *      <c-accordian-panel>
 *          <header>Panel Header</header>
 *          <content>Panel Content</content>
 *      </c-accordian-panel>
 *  </c-accordian>
 *  ````
 *
 *  
 */


@Component({
	selector: 'c-accordian-panel',
	templateUrl: 'accordian_panel.html'
})
export class AccordianPanelComponent {
	// Sets the panel as closed or open
	isCollapsed: boolean;
	isSelected: boolean;

	constructor( @Host() accordian: AccordianComponent) {
		accordian.addPanel(this);
		this.isCollapsed = true;
	}

	toggle() {
		this.isCollapsed = !this.isCollapsed;
	}
}
