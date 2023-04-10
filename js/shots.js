class shotsGrid extends HTMLElement{
    constructor() {
        super();
        this.innerHTML = `
            <style>

                .shots-container{
                    margin: 160px 0;
                }

                #shots{
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    grid-column-gap: 64px;
                    grid-row-gap: 64px;
                    align-items: center;
                    justify-items: center;
                }
                
                #shots a.shot{
                    width: 100%;
                }

                #shots a.shot img, #shots a.shot video{
                    border-radius: 6px;
                    width: 100%;
                }

                #shots a.shot img:hover, #shots a.shot video:hover{
                    transform: scale(1.01);
                }

                #shots a.square-button{
                    height: fit-content;
                }

                @media only screen and (max-width: 60em) {
                    #shots{
                        display: flex;
                        flex-direction: column;
                        padding: 0;
                    }
                }
            </style>

            <div class="shots-container">
                <h3>Other samples of work</h3>
                <div id="shots">
                    <a href="https://dribbble.com/fcrespi" target="_blank" class="square-button">See more of these
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 8.66667V12.6667C12 13.0203 11.8595 13.3594 11.6095 13.6095C11.3594 13.8595 11.0203 14 10.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V5.33333C2 4.97971 2.14048 4.64057 2.39052 4.39052C2.64057 4.14048 2.97971 4 3.33333 4H7.33333" stroke="white" stroke-linecap="square" stroke-linejoin="round"/>
                            <path d="M10 2h24V6" stroke="white" stroke-linecap="square" stroke-linejoin="round"/>
                            <path d="M6.31295 8.97978L5.9594 9.33333L6.6665 10.0404L7.02006 9.68689L6.31295 8.97978ZM14.3534 2.35355C14.5487 2.15829 14.5487 1.84171 14.3534 1.64645C14.1581 1.45118 13.8415 1.45118 13.6463 1.64645L14.3534 2.35355ZM7.02006 9.68689L14.3534 2.35355L13.6463 1.64645L6.31295 8.97978L7.02006 9.68689Z" stroke-width="0.5px" fill="white"/>
                        </svg>
                    </a>
                </div>
            </div>
            `;
    }
}

var accessToken = 'b6345a2060e96a5762c657e47777eb8b93f49c1bd3490b453ffb05c3b05d89a0';

// Dribbble API
$.ajax({
    url: 'https://api.dribbble.com/v2/user/shots?access_token='+accessToken,
    dataType: 'json',
    type: 'GET',
    success: function(data) {  
            if (data.length > 0) { 
                $.each(data, function(i, val) {   
                    if(i>4) return false;             
                    if(val.video){
                        $('#shots').prepend(
                            '<a class="shot" target="_blank" href="'+ val.html_url +'" title="' + val.title + '"> <video autoplay="autoplay" muted loop width="100%"> <source src='+val.video.xlarge_preview_url+' type="video/mp4"></video></a>'
                        )
                    } else {
                    $('#shots').prepend(
                        '<a class="shot" target="_blank" href="'+ val.html_url +'" title="' + val.title + '"><img alt="A product design project titled '+ val.title +'" src="'+ val.images.hidpi +'"/></a>'
                        )
                    }

                })
            }
    else {
        $('#shots').append('<p>No shots yet!</p>');
    }
    }
});


window.customElements.define('shots-grid', shotsGrid);