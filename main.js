window.onload = init;

function init(){
    
    // mapa 1
    const map = new ol.Map({
        view: new ol.View({
            center: [-963767.2963970036, 4957997.271053271],
            zoom: 14,
            maxZoom: 50,
        }),
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        target: 'js-map'      
    })

    map.on('click', function(e){
        console.log(e.coordinate);
    })

    map.addControl(new ol.control.FullScreen());

    // vector layers
    const circleStyle = new ol.style.Circle({
        fill: new ol.style.Fill({
            color: 'rgba(244, 164, 96)'
        }),
        radius: 10
    })

    const tucs = new ol.layer.VectorImage({
        source: new ol.source.Vector({
            url: 'map1.geojson',
            format: new ol.format.GeoJSON()
        }),
        visible: true,
        style: new ol.style.Style({
            image: circleStyle
        })
    })
    
    map.addLayer(tucs);

    map.on('click', function(e){
        map.forEachFeatureAtPixel(e.pixel, function(feature, layer){
            console.log(feature);
        })
    })
    
    //mapa 2 - geofencing

    var raster = new ol.layer.Tile({
        source: new ol.source.OSM()
    });

    var source = new ol.source.Vector();
    var vector = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(244, 164, 96, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        })
    });

    // cria o mapa
    const map2 = new ol.Map({
        view: new ol.View({
            center: [-963767.2963970036, 4957997.271053271],
            zoom: 14,
            maxZoom: 50,
        }),
        layers: [raster, vector],
        target: 'js-map2'      
    })

    // obtém coordenadas no click
    map2.on('click', function(e){
        console.log(e.coordinate);
    })

    var modify = new ol.interaction.Modify({source: source});
    map2.addInteraction(modify);

    var draw, snap;

    function addInteractions(){
        draw = new ol.interaction.Draw({
            source: source,
            type: "Polygon"
        });
        map2.addInteraction(draw);
        snap = new ol.interaction.Snap({source: source});
        map.addInteraction(snap);
    }


    addInteractions();


    // permite mapa em fullscreen
    map2.addControl(new ol.control.FullScreen());
}


// TABELA DE TROTINETES

function loadTrots(data){
    var allRows = data.split(/\r?\n|\r/);
    var table = "<table>";
    for(var singleRow=1; singleRow<allRows.length;singleRow++){
        if(singleRow == 0){
            table += "<tr>";
        } else{
            table += "<tr>";
        }

        var rowCells = allRows[singleRow].split(';');
        for(var rowSingleCell=0; rowSingleCell<rowCells.length; rowSingleCell++){
            if(singleRow == 0){
                table += "<th>";
                table += rowCells[rowSingleCell];
                table += "</th>";
            } else{
                table += "<td>";
                table += rowCells[rowSingleCell];
                table += "</td>";
            }
        }

        if(singleRow == 0){
            table += "</tr>";
        } else{
            table += "</tr>";
        }
    }
    $("#trot").append(table);
}

$.ajax({
    url:"trot.csv",
    dataType:"text",
}).done(loadTrots)


// TABELA DE USERS

function loadUsers(data){
    var allRows = data.split(/\r?\n|\r/);
    var table = "<table>";
    for(var singleRow=1; singleRow<allRows.length;singleRow++){
        id_no = singleRow;
        table += "<tr id='row_"+id_no+"' href='/index.html'>";

        var rowCells = allRows[singleRow].split(',');
        for(var rowSingleCell=0; rowSingleCell<rowCells.length; rowSingleCell++){
            if(singleRow == 0){
                table += "<th id='delete_"+id_no+"'>";
                table += rowCells[rowSingleCell];
                table += "</th>";
            } else{
                table += "<td>";
                table += rowCells[rowSingleCell];

                if(rowSingleCell == rowCells.length - 1){
                    table += '<td><input type="submit" class="menos" id="del_'+id_no+'" value="DELETE"/></td>';
                    table += "</td>";
                } else{
                    table += "</td>";
                }
            }
        }

        if(singleRow == 0){
            table += "</tr>";
        } else {
            table += "</tr>"
        }
    }
    $("#tableUser2").append(table);
    
}

$.ajax({
    url:"users.csv",
    dataType:"text",
}).done(loadUsers)

// ELIMINAR UMA ENTRADA DA TABELA

$(document).on('click', '.menos', function(){

    function getId(element){
        var id, idArr;
        // id = 'del_número'
        id = element.attr('id');
        // separa em dois o id: del_ + número
        idArr = id.split("_");
        // retorna o número (da row)
        return idArr[idArr.length-1];
    }

    var currentEle, rowNo;
    // obtém o id da row selecionada
    currentEle = $(this);
    // número da row selecionada
    rowNo = getId(currentEle);
    var id_del = document.getElementById("row_"+rowNo).cells[0].innerHTML;
    console.log(id_del);
    // remove a row correspondente
    $("#row_"+rowNo).remove();

    $.ajax({
        url:'users.csv',
        type:'POST',
        data: id_del,
        success: function() {
        }
    });

});

// pesquisar users
/*$(document).ready(function(){
    $("#search").keyup(function(){
        search_table($(this).val());
    });

    function search_table(value){
        $("#tableUser2 tr td").each(function(){
            var found = 'false';
            $(this).each(function(){
                if($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0){
                    found = 'true';
                }
            });
            if(found == 'true'){
                $(this).show();
            }
            else{
                $(this).hide();
            }
        });
    }
});*/

// adicionar users à tabela
$(document).ready(function(){
    $("#add").on('click', function(){

        $("#id_error_msg").hide();
        $("#name_error_msg").hide();
        $("#mail_error_msg").hide();
    
        var id_error = false;
        var name_error = false;
        var mail_error = false;
    
        $("#idUser").focusout(function(){
            check_id();
        });
    
        $("#name").focusout(function(){
            check_name();
        });
    
        $("#mail").focusout(function(){
            check_mail();
        });
    
        function check_id(){
            var id_length = $("#idUser").val().length;
    
            if($.trim($('#idUser').val())== ''){
                $("#id_error_msg").html("Input cannot be left blank");
                $("#id_error_msg").show();
            } else {
                $("#id_error_msg").hide();
            }
        }
    
        function check_name(){
            var name_length = $("#name").val().length;
    
            if ($.trim($('#name').val())== ''){
                $("#name_error_msg").html("Input cannot be left blank");
                $("#name_error_msg").show();
                name_error = true;
            } else {
                $("#name_error_msg").hide();
            }
        }
    
        function check_mail(){
            var pattern = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/i);
    
            if (pattern.test($("#mail").val())){
                $("#mail_error_msg").hide();
            } else {
                $("#mail_error_msg").html("Invalid e-mail address");
                $("#mail_error_msg").show();
                mail_error = true;
            }
            
        }

        check_id();
        check_name();
        check_mail();

        if(id_error == false && name_error == false && mail_error == false){
            $("#tableUser2 tr:last").after('<tr><td>'+$('#idUser').val()+'</td><td>'+$('#name').val()+'</td><td>'+$('#mail').val()+'</td><td><input type="submit" class="menos" id="remove" value="DELETE"/></td></tr>');
            // hard refresh
            // location.reload(true);
            //return true;
        } else {
            return false;
        }
        
        // valores a ser enviados para o servidor
        var sendData = {
            id: $('#idUser').val(),
            name: $('#name').val(),
            email: $('#mail').val(),
        }
        
        console.log(sendData);

        // limpar valores adicionados dos campos de input
        $('#idUser').val('');
        $('#name').val('');
        $('#mail').val('');
        
        $.ajax({
            url:'users.csv',
            type:'POST',
            data: sendData,
            success: function() {
            }
        });
    });
});

$(document).ready(function($){
    $("#trot tr").click(function(){
        window.location = $(this).data("href");
    });
});



/*// verificar se o utilizador tem permissao de acesso 
$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "users.csv",
        dataType: "text",
        success: function(data) {
            processUser(data);
        }
     });
});

function processUser(allText) {
    //alert(allText);
    var lines = allText.split("\\n");
    //alert(lines);
    var passou = 0;
    var e = document.getElementById('email').value;
    for(var i=1;i<lines.length;i++){
        var email = lines[i].split(",");
        if (email[2] == e){
            passou = 1;
            break;
        }
    }
    if (passou == 0){
        alert("O utilizador não tem permissão.");
        return false;
    } else {
        return true;
    }
}*/