class DescriptionText extends HTMLElement{
    constructor() {
        super();
        this.innerHTML = `
        <style>
            .hero, .about{
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                width: 50%;
                padding-top: 21vh;
                
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

            .hero > *, .about > *{
                margin: 16px 0;
            }

            .darktitle{
                color: gray;
            }

            @media only screen and (max-width: 60em) {
                .hero, .about{
                    display: flex;
                    width: 60%;
                    min-height: 30vh;
                }
            }

            @media only screen and (max-width: 30em) {
                .hero, .about{
                    width: 100%;
                }
            }



        </style>

        <div class="hero">
            <h1>${this.getAttribute('h1-content')}</h1>
        </div>
        

        `;
    }
}

window.customElements.define('introduction-text', DescriptionText);