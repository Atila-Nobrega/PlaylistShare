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
    
    document.getElementById("playlist_list").insertBefore(block, document.getElementById("playlist_list").firstChild);
}