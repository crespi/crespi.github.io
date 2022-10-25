class NavigationComponent extends HTMLElement{
    constructor() {
        super();
        this.innerHTML = `
            <style>
                nav{
                    display: block;
                    width: 100%;
                    display: flex;
                    position: fixed;
                    left: 0;
                    top: 0;
                }

                .nav-wrapper{
                    display: flex;
                    justify-content: space-between;
                    flex: 1;
                    padding: 24px 32px;
                    margin: 24px 32px;
                    box-sizing: border-box;
                    align-items: center;
                    backdrop-filter: var(--blur-value);
                    background: var(--background-transparent);
                    border-radius: 24px;

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

                .links-wrapper {
                    display: flex;
                    flex: 2;
                    justify-content: space-between;
                }

                .links-left, .links-right {
                    display: flex;
                    list-style-type: none;
                    padding: 0;
                    margin: 0;
                    flex-wrap: wrap;
                }

                .links-wrapper ul li {
                    margin: 0 16px;
                    width: fit-content;
                }

                .links-wrapper ul li:last-child {
                    margin: 0 0 0 16px;
                    width: fit-content;
                }

                .menu-button{
                    display: none;
                    z-index: 2;
                }

                #hamburger-icon{
                    fill: white;
                }

                #hamburger-icon > *{
                    transition: all .4s cubic-bezier(.645, .045, .355, 1);
                }

                .icon-menu-active > rect:nth-child(1){
                    transform: rotate(45deg) translateX(10px) translateY(-12px);
                }

                .icon-menu-active > rect:nth-child(2){
                    opacity: 0;
                }

                .icon-menu-active > rect:nth-child(3){
                    transform: rotate(-45deg) translateX(-40px);
                }

                .website-name{
                    font-weight: 800;
                    z-index: 2;
                    position: relative;
                    margin-right: 16px;
                }
                
                @media only screen and (max-width: 60em) {
                    nav{
                        padding: 0;
                        margin: 0;
                    }

                    .nav-wrapper{
                        margin: 0;
                        padding: 16px;
                    }

                    .menu-button{
                        display: block;
                        background: none;
                        border: none;
                    }

                    .links-wrapper{
                        position: absolute;
                        top: -100vh;
                        left: 0;
                        height: 100vh;
                        width: 100vw;
                        background: rgba(0,0,0,.9);
                        flex-direction: column;
                        padding: 60px 0 16px 0;
                        box-sizing: border-box;
                        opacity: 0;
                        backdrop-filter: var(--blur-value);
                        background: var(--background-transparent)
                    }

                    .links-wrapper.menu-active{
                        top: 0;
                        opacity: 1;
                    }

                    .links-right, .links-left{
                        flex-direction: column;
                    }

                    .links-wrapper ul li {
                        margin: 16px 16px;
                    }


                }
            </style>
            <nav>
                <div class="nav-wrapper">
                    <div>
                        <a class="website-name" href="https://crespi.design">crespi.design</a>
                    </div>
                    <div id="linksheet" class="links-wrapper">
                        <ul class="links-left">
                            <li class="animated-link">
                                <a onclick="toggleMenu()" href="#shots">Work</a>
                            </li>
                            <li class="animated-link">
                                <a onclick="toggleMenu()" href="#about">About</a>
                            </li>
                        </ul>
                        <ul class="links-right">
                            <li class="animated-link">
                                <a onclick="toggleMenu()" target="_blank" href="https://dribbble.com/fcrespi">Dribbble</a>
                            </li>
                            <li class="animated-link">
                                <a onclick="toggleMenu()" target="_blank" href="https://behance.net/fcrespi">Behance</a>
                            </li>
                            <li class="animated-link">
                                <a onclick="toggleMenu()" target="_blank" href="https://www.linkedin.com/in/franciscocrespi/">LinkedIn</a>
                            </li>
                            <li class="animated-link">
                                <p>crespi.f@gmail.com</p>
                            </li>
                        </ul>
                    </div>
                    <button id="toggle-info" class="menu-button" onclick="toggleMenu()">
                            <svg id="hamburger-icon" class="" viewBox="0 0 100 80" width="20" height="20">
                                <rect width="100" height="5"></rect>
                                <rect y="30" width="100" height="5"></rect>
                                <rect y="60" width="100" height="5"></rect>
                            </svg>                    
                    </button>
                </div>
            </nav>
            `;
    }
}

function toggleMenu(){
    var linksheet = document.getElementById('linksheet');
    var menuIcon = document.getElementById('hamburger-icon')
    linksheet.classList.toggle('menu-active');
    menuIcon.classList.toggle('icon-menu-active');

}

window.customElements.define('header-component', NavigationComponent);