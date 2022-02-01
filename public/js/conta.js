//Botão de deletar:
var modal = document.getElementById("modal");

var deletarBtn = document.getElementById("deletarBtn");
var closeBtn = document.getElementById("close");

deletarBtn.onclick = function() {
    modal.style.display = "block";
}

closeBtn.onclick = function() {
    modal.style.display = "none";
}

async function deletarUsuario() {
    const deleteMethod = {
        method: 'DELETE',
        redirect: 'follow'
    }

    try {
        await fetch('http://localhost:8081/v1/deletarconta', deleteMethod)
        .then(() => {
            location.replace("http://localhost:8081/v1/home/sucessdelete")
        })
    } catch (error) {
        location.replace("http://localhost:8081/v1/conta/fail")
        console.log(error)
    }
}

//botão de mudar senha:
var modal2 = document.getElementById("modalmudar");

var mudarBtn = document.getElementById("mudarBtn");
var closemudarBtn = document.getElementById("closemudar");

mudarBtn.onclick = function() {
    modal2.style.display = "block";
}

closemudarBtn.onclick = function() {
    modal2.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    if (event.target == modal2) {
        modal2.style.display = "none";
    }
}

async function mudarSenhaUsuario() {
    const formData = new FormData();
    novasenha = document.getElementById("password").value
    novasenhaconfirm = document.getElementById("passwordconfirm").value

    if(novasenha == novasenhaconfirm && novasenha != null) {
        formData.append('password', novasenha)
    
        const putMethod = {
            method: 'PUT',
            body: formData,
            redirect: 'follow'
        }
    
        try {
            await fetch('http://localhost:8081/v1/mudarsenha', putMethod)
            .then(() => {
                location.replace("http://localhost:8081/v1/conta/success")
            })
        } catch (error) {
            location.replace("http://localhost:8081/v1/conta/fail")
            console.log(error)
        }
    } else {
        location.replace("http://localhost:8081/v1/conta/fail")
    }

}