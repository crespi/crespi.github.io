const headerTemplate = document.createElement('template');
headerTemplate.innerHTML = `

<style>
    @import './css/style.css'; /* Using a string */
</style>

<div class="contact-links-wrapper">
    <ul>
        <li class="animated-link">
            <a target="_blank" href="https://dribbble.com/fcrespi">Dribbble</a>
        </li>
        <li class="animated-link">
            <a target="_blank" href="https://behance.net/fcrespi">Behance</a>
        </li>
        <li class="animated-link">
            <a target="_blank" href="https://www.linkedin.com/in/franciscocrespi/">LinkedIn</a>
        </li>
        <li class="animated-link">
            <p>crespi.f@gmail.com</p>
        </li>
    </ul>
</div>
`


class Header extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();
    }

    connectedCallback() {
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(headerTemplate.content);
    }
}

customElements.define('header-component', Header);
