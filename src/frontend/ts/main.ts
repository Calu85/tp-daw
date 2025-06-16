
class Main implements EventListenerObject{
 
    handleEvent(object: Event): void{
        console.log(object)
        let elementoClick =<HTMLInputElement> object.target;
        if(elementoClick.id=="btnMostrar" && object.type=="click"){
            this.consultarAlServidor();                                    
        } else if(elementoClick.id.startsWith("cb_")){                
            console.log("pase por el check!!", elementoClick.checked, elementoClick.id)
            console.log(elementoClick.id.substring(3, elementoClick.id.length));
            console.log(elementoClick)
            console.log(elementoClick.getAttribute("miIdBd"));
            // TODO para la semana que viene
            // llegar al backend y hacer un update a la tabla devices Con el id y el state;
        }

    }
    
    public consultarAlServidor() {
        let xmlReq = new XMLHttpRequest();

        xmlReq.onreadystatechange = () => {
            if (xmlReq.readyState == 4) {
                if (xmlReq.status == 200) {
                    console.log(xmlReq.responseText);
                    let devices: Array<Device> = JSON.parse(xmlReq.responseText);
                    let div = document.getElementById("lista");
                    div.innerHTML = "";
                    let listado: string = ""
                    
                    for (let o of devices) {
                        
                        listado += "<li class='collection-item avatar'>"
                        if (o.type == 1) {
                            
                            listado += `<img src="./static/images/lightbulb.png" alt="" class="circle">`
                        } else {
                            listado += `<img src="./static/images/window.png" alt="" class="circle">`
                        }
                        listado += `<span class="title">${o.name}</span>`
                        listado += ` <p>${o.description}</p>`
                        if (o.state) {
                            listado += `<a href="#!" class="secondary-content">
                            <div class="switch">
                                <label>
                                Off
                                <input id='cb_${o.id}' miIdBd='${o.id}' checked type="checkbox">
                                <span class="lever"></span>
                                On
                                </label>
                            </div>
                            </a>`
                        } else {
                            listado += `<a href="#!" class="secondary-content">
                            <div class="switch">
                                <label>
                                Off
                                <input id='cb_${o.id}' type="checkbox">
                                <span class="lever"></span>
                                On
                                </label>
                            </div>
                            </a>`
                        }
                        listado += '</li>';
             
                    }
                    div.innerHTML = listado;

                    for (let o of devices) {
                        let checkbox = document.getElementById("cb_" + o.id);
                        checkbox.addEventListener("click", this);
                    }
                } else {
                    
                    alert("fallo la consulta");
                }
            }
        }
   
        xmlReq.open("GET", "http://localhost:8000/devices", true);
        xmlReq.send();

    }
    
}

window.addEventListener("load", () => {
   let main: Main = new Main();
    let btnM = document.getElementById("btnMostrar");
    btnM.addEventListener("click", main);
     let xmlReq = new XMLHttpRequest();
    xmlReq.onreadystatechange = () => {
        if (xmlReq.readyState == 4) {
            if (xmlReq.status == 200) {
                console.log(xmlReq.responseText);
            } else {
                alert(xmlReq.responseText);
            }
        }
    }   
});

