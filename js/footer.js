class FooterComponent extends HTMLElement{
    constructor() {
        super();
        this.innerHTML = `
            <style>
                @import './css/style.css';

                .footer-container{
                    width: 100%;
                    padding: 48px 0;
                    display: flex;
                    justify-content: space-between;
                }

                @media only screen and (max-width: 60em) {

                    .footer-container{
                        flex-direction: column;
                        justify-content: center;
                        align-items: flex-start;
                        text-align: left;
                    }

                    .footer-container p {
                        margin: 8px 0;
                    }
                }

            </style>
            <div class="footer-container">
                <p id="year"></p>
                <p>This website is <a href="https://github.com/crespi/crespi.github.io" class="animated-link">open source</a> and set on <a href="https://fonts.google.com/specimen/Archivo?query=archivo" class="animated-link">Archivo</a>.</p>
            </div>
            `;
    }
}

window.customElements.define('footer-component', FooterComponent);