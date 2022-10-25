class CaseStudyThumbnailComponent extends HTMLElement{
    constructor() {
        super();
        this.innerHTML = `
            <style>
                .case-study-thumbnail{
                    display: none;
                    grid-template-columns: 1fr 1fr 1fr;
                    grid-column-gap: 64px;
                    grid-template-rows:    minmax(640px, auto);
                }

                .case-study-context{
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }

                .case-study-image{
                    grid-column: 2 / 4;
                    background: red;
                }

            </style>

            <div class="case-study-thumbnail">
                <div class="case-study-context">
                    <div>
                        <h1>${this.getAttribute('case-study-name')}</h1>
                        <p class="case-study-description">${this.getAttribute('case-study-description')}</p>
                        <p class="case-study-year">${this.getAttribute('case-study-year')}</p>
                    </div>
                    <a href="${this.getAttribute('case-study-link')}" class="square-button">${this.getAttribute('case-study-CTA')}</a>
                </div>
                <div class="case-study-image"></div>
            </div>
            `;
    }
}

window.customElements.define('case-study-thumbnail-component', CaseStudyThumbnailComponent);