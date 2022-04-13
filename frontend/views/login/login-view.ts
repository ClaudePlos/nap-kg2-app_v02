import { appStore } from 'Frontend/stores/app-store';
import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { View } from 'Frontend/views/view';
import { LoginFormLoginEvent } from '@vaadin/login/vaadin-login-form.js';
import '@vaadin/login/vaadin-login-form.js';

@customElement('login-view')
export class LoginView extends View {
    @state()
    private error = false;

    connectedCallback() {
        super.connectedCallback();
        this.classList.add('flex', 'flex-col', 'items-center', 'justify-center');
        appStore.setLoggedIn(false);
    }

    render() {
        return html`<br><br><br><br>
        <p><h2><img style="width: 40px;" src="images/logo.png" />&nbsp;KG-ERP</h2></p>
      <vaadin-login-form
        no-forgot-password
        @login=${this.login}
        .error=${this.error}>
      </vaadin-login-form>
    `;
    }

    async login(e: LoginFormLoginEvent) {
        try {
            await appStore.login(e.detail.username, e.detail.password);
        } catch (err) {
            this.error = true;
        }
    }
}