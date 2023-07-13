class CaseStudyThumbnailComponent extends HTMLElement{
    constructor() {
        super();
        this.innerHTML = `
            <style>
                .case-study-thumbnail{
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    grid-column-gap: 64px;
                    padding: 160px 0;
                }

                .case-study-context{
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }

                .case-study-image{
                    grid-column: 2 / 4;
                }

                .case-study-image a{
                    width: 100%;
                    height: 70vh;
                    border-radius: 8px;
                    cursor: pointer;
                    display: block;
                    background-size: cover !important;
                    background-position: center center !important;
                    background-repeat: no-repeat;
                }

                .case-study-description{
                    margin: 24px 0;
                }

                .case-study-year{
                    font-variation-settings: "wght" 500;
                    color: white;
                }

                .project-tags{
                    margin: 24px 0;
                    display: flex;
                    flex-wrap: wrap;
                }

                .project-tags > .project-tag{
                    margin-left: 0;
                }

                .project-tag{
                    margin: 8px;
                    text-transform: uppercase;
                    color: #fafafa;
                    padding: 12px 16px;
                    border-radius: 100px;
                    font-size: 0.6rem;
                    border: 1px solid #414141;
                    letter-spacing: .7px;
                }

                .project-tag:hover{
                    background: #414141;    
                }

                .cta-container{
                    display: flex;
                    width: 100%;
                    flex-direction: row;
                }

                .cta-container a{
                    margin-right: 16px;
                }


                @media only screen and (max-width: 60em) {
                    .case-study-thumbnail{
                        display: flex;
                        align-items: flex-start;
                        flex-direction: column;
                    }

                    .case-study-thumbnail, .case-study-image{
                        width: 100%;
                    }

                    .case-study-thumbnail{
                        padding: 80px 0;
                    }

                    .case-study-image a{
                        height: 30vh;
                    }    

                    .square-button{
                        margin-top: 24px;
                    }

                    .case-study-context{
                        margin-bottom: 24px;
                    }

                    h2{
                        margin: 0;
                    }

                }

            </style>

            <div class="case-study-thumbnail">
                <div class="case-study-context">
                    <div>
                        <h2>${this.getAttribute('case-study-name')}</h2>
                        <div class="project-tags">${this.getAttribute('project-tags')}</div>
                        <p class="case-study-description">${this.getAttribute('case-study-description')}</p>
                        <p class="case-study-year">${this.getAttribute('case-study-year')}</p>
                    </div>
                    <div class="cta-container">
                        <a href="${this.getAttribute('case-study-link')}" target="_blank" class="square-button">
                            ${this.getAttribute('case-study-CTA')}
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 8.66667V12.6667C12 13.0203 11.8595 13.3594 11.6095 13.6095C11.3594 13.8595 11.0203 14 10.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V5.33333C2 4.97971 2.14048 4.64057 2.39052 4.39052C2.64057 4.14048 2.97971 4 3.33333 4H7.33333" stroke="white" stroke-linecap="square" stroke-linejoin="round"/>
                                <path d="M10 2H14V6" stroke="white" stroke-linecap="square" stroke-linejoin="round"/>
                                <path d="M6.31307 8.97978L5.95952 9.33333L6.66663 10.0404L7.02018 9.68689L6.31307 8.97978ZM14.3535 2.35355C14.5488 2.15829 14.5488 1.84171 14.3535 1.64645C14.1583 1.45118 13.8417 1.45118 13.6464 1.64645L14.3535 2.35355ZM7.02018 9.68689L14.3535 2.35355L13.6464 1.64645L6.31307 8.97978L7.02018 9.68689Z" fill="white"/>
                            </svg>
                        </a>
                        <a href="${this.getAttribute('live-project-link')}" target="_blank" class="square-button">
                            ${this.getAttribute('live-project-CTA')}
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 8.66667V12.6667C12 13.0203 11.8595 13.3594 11.6095 13.6095C11.3594 13.8595 11.0203 14 10.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V5.33333C2 4.97971 2.14048 4.64057 2.39052 4.39052C2.64057 4.14048 2.97971 4 3.33333 4H7.33333" stroke="white" stroke-linecap="square" stroke-linejoin="round"/>
                                <path d="M10 2H14V6" stroke="white" stroke-linecap="square" stroke-linejoin="round"/>
                                <path d="M6.31307 8.97978L5.95952 9.33333L6.66663 10.0404L7.02018 9.68689L6.31307 8.97978ZM14.3535 2.35355C14.5488 2.15829 14.5488 1.84171 14.3535 1.64645C14.1583 1.45118 13.8417 1.45118 13.6464 1.64645L14.3535 2.35355ZM7.02018 9.68689L14.3535 2.35355L13.6464 1.64645L6.31307 8.97978L7.02018 9.68689Z" fill="white"/>
                            </svg>
                        </a>
                    </div>
                </div>
                <div class="case-study-image">
                    <a style="background:url('${this.getAttribute('case-study-image-thumbnail')}') "href="${this.getAttribute('case-study-link')}" target="_blank">
                    </a>
                </div>
            </div>
            `;
    }
}

window.customElements.define('case-study-thumbnail-component', CaseStudyThumbnailComponent);