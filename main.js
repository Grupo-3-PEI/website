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
            color: [245, 49, 5, 1]
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
    
    //mapa 2

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


////////// LISTA DE TROTINETES ///////////

function loadTrots(data){
    var allRows = data.split(/\r?\n|\r/);
    var table = "<table>";
    for(var singleRow=1; singleRow<allRows.length;singleRow++){
        if(singleRow == 0){
            table += "<tr>";
        } else{
            table += "<tr>";
        }

        var rowCells = allRows[singleRow].split(',');
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


// linha com link para + informações




// TABELA DOS USERS
/*
// dar load dos conteúdos do ficheiro provenientes do server
const user = document.querySelector("#tableUser > tbody");


function loadUsers(){
    const request = new XMLHttpRequest();

    request.open("get", "users.json");

    request.onload = () => {
        try{
            const json = JSON.parse(request.responseText); 

            userList(json);
        } catch(e){
            console.warn("Could not load TUCs");
        }

    };

    request.send();
}

function userList(json){
    console.log(json);
    // cleans out existing table data
   while (user.firstChild){
       user.removeChild(user.firstChild);
   }

   // Status table
   json.forEach((row) => {
       const tr = document.createElement("tr");

       row.forEach((cell) => {
           const td = document.createElement("td");
           td.textContent = cell;
           tr.appendChild(td);
       });

       user.appendChild(tr);

   });
}

document.addEventListener("DOMContentLoaded", () => { loadUsers(); });
*/

function loadUsers(data){
    var allRows = data.split(/\r?\n|\r/);
    var table = "<table>";
    for(var singleRow=1; singleRow<allRows.length;singleRow++){
        if(singleRow == 0){
            table += "<tr>";
        } else{
            table += "<tr>";
        }

        var rowCells = allRows[singleRow].split(',');
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
    $("#tableUser2").append(table);
}

$.ajax({
    url:"users.csv",
    dataType:"text",
}).done(loadUsers)



// verificar se o utilizador tem permissao de acesso 
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
}

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
/*$(document).ready(function(){
    $("#add").on('click', function(){
        $("#tableUser2").append('<tr><td>'+$('#fname').val()+'</td><td>'+$('#surname').val()+'</td><td>'+$('#mail').val()+'</td></tr>');
    });
});*/