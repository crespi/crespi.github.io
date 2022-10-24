class DescriptionText extends HTMLElement{
    constructor() {
        super();
        this.innerHTML = `
            <p>${this.getAttribute('name')}</p>
        `;
    }
}

window.customElements.define('introduction-text', DescriptionText);