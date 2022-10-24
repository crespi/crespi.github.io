class buttonComponent extends HTMLElement{
    constructor() {
        super();
        this.innerHTML = `
            <style>

                .custom-button{
                    border: solid white 1px;
                    padding: 8px 16px;
                }
                
            </style>
            <div class="custom-button">
                <a href='${this.getAttribute('buttonLink')}'>${this.getAttribute('buttonLabel')}</a>
            </div>
            `;
    }
}

window.customElements.define('button-component', buttonComponent);