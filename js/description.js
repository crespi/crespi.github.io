class DescriptionText extends HTMLElement{
    constructor() {
        super();
        this.innerHTML = `
        <style>
            .hero, .about{
                display: flex;
                flex-direction: column;
                justify-content: center;
                width: 40%;
                min-height: 90vh;
                
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
                color: lightgray;
            }

            @media only screen and (max-width: 60em) {
                .hero, .about{
                    display: flex;
                    width: 60%;
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
            <p>${this.getAttribute('intro-content')}</p>
            
            <a class="arrow-icon square-button" href="#work">
                See my work
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 3.33334V12.6667" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12.6663 8L7.99967 12.6667L3.33301 8" stroke="white" stroke-linecap="square" stroke-linejoin="round"/>
                </svg>
            </a>
        </div>
        

        `;
    }
}

window.customElements.define('introduction-text', DescriptionText);