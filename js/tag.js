class tag_component extends HTMLElement{
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
                <a href='#'>${this.getAttribute('tag-label')}</a>
            </div>
            `;
    }
}

window.customElements.define('project-tag', tag_component);