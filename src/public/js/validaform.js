var fechaActual = new Date();

var myModalEl = document.getElementById('messageModal')
myModalEl.addEventListener('hidden.bs.modal', function (event) {
    // do something...
    console.log("Se cerro el modal "+this.id);
});

function showMessage(jsonModalMessage){
    $("#messageModalLabel").html(jsonModalMessage.title);
    $("#messageModalBody").html(jsonModalMessage.message);
    $('#messageModal').modal('show');
}

function frmLogin(){
   
    var username = $("#username");
    var password = $("#password");
    var jsonModalMessage ;
    
    if(username.val()==""){
        jsonModalMessage ={"title":"Advertencia",message: "Debe ingresar el nombre de usuario o el email"};
        showMessage(jsonModalMessage);
    }else if(password.val()==""){
        jsonModalMessage ={"title":"Advertencia",message: "Debe ingresar la contraseña"};
        showMessage(jsonModalMessage);
    }else{
        

        $.ajax({
            url: '/login',
            method: 'POST',
            data: {
                username:username.val(),
                password:password.val()
            },
            success: function(response){
                console.log(response);
                if(response.status!=200){
                    jsonModalMessage ={"title":"Error",message:response.message};
                    showMessage(jsonModalMessage);
                }else{
                    sessionStorage.setItem("x-access-token", response.token);
                    console.log(sessionStorage.getItem("x-access-token"));
                    jsonModalMessage ={"title":"Notificación",message:response.message};
                    showMessage(jsonModalMessage);
                    
                    var myHeaders = Headers();
                    myHeaders.append('x-access-token', response.token);
                    console.log(myHeaders.get('Accept-Encoding'));
                    console.log(myHeaders.get('x-access-token'));
                }
            }
        }).fail(function( jqXHR, textStatus, errorThrown ) {
            message = errorThrown;
        });
    }
}