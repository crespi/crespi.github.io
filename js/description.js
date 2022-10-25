class DescriptionText extends HTMLElement{
    constructor() {
        super();
        this.innerHTML = `
        <style>
            .hero, .about{
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                grid-column-gap: 64px;
                margin-top: 30vh;
                margin-bottom: 30vh;
                
                -webkit-animation: fadein 1s;
                /* Safari, Chrome and Opera > 12.1 */
                
                -moz-animation: fadein 1s;
                /* Firefox < 16 */
                
                -ms-animation: fadein 1s;
                /* Internet Explorer */
                
                -o-animation: fadein 1s;
                /* Opera < 12.1 */
                
                animation: fadein 1s;
            }
        </style>

        <div class="hero">
            <p>${this.getAttribute('intro-text')}</p>
        </div>
        `;
    }
}

window.customElements.define('introduction-text', DescriptionText);