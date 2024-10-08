class FooterComponent extends HTMLElement{
    constructor() {
        super();
        this.innerHTML = `

            <style>
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
                        padding-bottom: 16px;
                    }

                    .footer-container p {
                        margin: 8px 0;
                    }
                }

            </style>
            <div class="footer-container">
                <p id="year"></p>
                <p>This website is set on <a href="https://fonts.google.com/specimen/Archivo?query=archivo" class="animated-link">Archivo</a>.</p>
            </div>
            `;
    }
}


window.customElements.define('footer-component', FooterComponent);
