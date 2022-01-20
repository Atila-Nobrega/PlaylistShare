async function listarPlaylists() {
    try {
        fetch('http://localhost:8081/v1//playlists')
        .then(response => {
            response.json().then((data) => {
                data.forEach(function selectplaylists(playlist) {
                    getPlaylists(playlist.imageURL, playlist.totaltracks, playlist.owner, playlist.name, playlist.collaborative)
                })
            })
        })
    } catch (error) {
        console.log(error)
    }
    
}

listarPlaylists()

function getPlaylists(imageurl, tracksqnt, owner, name, collaborative) {
    
    var block = document.createElement('div');
    block.classList.add('playlist_block');
    block.innerHTML = "<img class=\"album_icon\" src=" + imageurl + " alt=\"Album Cover\">" 
    + "<div class=playlist_item>" + name + "</div>"
    + "<div class=playlist_item>Tracks: "+ tracksqnt +"</div>"
    + "<div class=playlist_item>" + owner +"</div>"
    + "<div class=playlist_item>Collab: "+ collaborative +"</div>"
    
    document.getElementById("playlist_list").insertBefore(block, document.getElementById("playlist_list").firstChild);
}