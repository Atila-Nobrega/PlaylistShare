async function listarPlaylists() {
    try {
        await fetch('http://localhost:8081/v1/playlists')
        .then(response => {
            response.json().then((data) => {
                data.forEach(function selectplaylists(playlist) {
                    if(playlist.appname == 'spotify') {
                        getPlaylistsSpotify(playlist.appid, playlist.imageURL, playlist.totaltracks, playlist.owner, playlist.name, playlist.collaborative)
                    } else {
                        console.log("Outros aplicativos ainda não adicionados!") // Aqui entra um if else dos outros aplicativos
                    }
                })
            })
        })
    } catch (error) {
        console.log(error)
    }
    
}

listarPlaylists()

function getPlaylistsSpotify(appid, imageurl, tracksqnt, owner, name, collaborative) {
    var block = document.createElement('div');
    block.classList.add('playlist_block');
    block.innerHTML = "<img class=\"album_icon\" src=" + imageurl + " alt=\"Album Cover\">" 
    + "<div class=playlist_item>" + name + "</div>"
    + "<div class=playlist_item>Tracks: "+ tracksqnt +"</div>"
    + "<div class=playlist_item>" + owner +"</div>"
    + "<div class=playlist_item>Collab: "+ collaborative +"</div>"
    
    block.onclick = () => {
        showPlaylistDetails(appid, imageurl, tracksqnt, owner, name, collaborative);
    };
    
    document.getElementById("playlist_list").insertBefore(block, document.getElementById("playlist_list").firstChild);
}

function showPlaylistDetails(appid, imageurl, tracksqnt, owner, name, collaborative) {
    var block = document.createElement("div");
    block.classList.add("playlist-details-background");
    block.id = "playlist-details";
    
    let eAdmin = parseInt(localStorage.getItem("eAdmin"));

    block.innerHTML = "<div class=\"playlist-details-container\">"
    + "<div class=\"playlist-details-top\">"
    + "<img src=\"" + imageurl + "\" alt=\"\" height=\"100%\" class=\"playlist-details-image\"/>"
    + "<div>"
    + "<h2>" + name + "</h2>"
    + "<h4>Nº de músicas: " + tracksqnt + "</h4>"
    + "<h4>Dono: " + owner + "</h4>"
    + ((collaborative === false) ? "<h4>Colaborativa? Não</h4>" : "<h4>Colaborativa? Sim</h4>")
    + "</div>"
    + "<div class=\"playlist-details-trash\">"
    + ((eAdmin >= 1) ? "<button class=\"playlist-details-trash-button\"><img src=\"/assets/images/lixo.png\" alt=\"\" width=\"100%\"/></button>" : "")
    + "</div>"
    + "</div>"
    + "<div class=\"playlist-details-bottom\">"
    + "<a href=\"https://open.spotify.com/playlist/" + appid + "\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"playlist-details-goto-link\"><button class=\"playlist-details-goto-button\"><h3>Ir para a playlist!</h3></button></a>"
    + "</div>"
    + "<button class=\"playlist-details-close-button\" onclick=\"hidePlaylistDetails()\">X</button>"
    + "</div>";

    document.getElementById("playlist-details-parent").insertBefore(block, document.getElementById("playlist-details-parent").firstChild);
}

function hidePlaylistDetails() {
    document.getElementById("playlist-details").remove();
}