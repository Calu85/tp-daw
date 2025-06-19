class Main implements EventListenerObject {
  handleEvent(object: Event): void {
    console.log(object);
    let elementoClick = <HTMLInputElement>object.target;
    if (elementoClick.id == "btnMostrar" && object.type == "click") {
      this.consultarAlServidor();
    } else if (elementoClick.id == "btnAgregar" && object.type == "click") {
      this.agregarDispositivo();
    } else if (elementoClick.id.startsWith("cb_") && object.type=="click") {
      this.cambiarEstado();
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
          let listado: string = "";
          for (let o of devices) {
            listado += "<li class='collection-item avatar'>";
            if (o.type == 1) {
              listado += `<img src="./static/images/lightbulb.png" alt="" class="circle">`;
            } else {
              listado += `<img src="./static/images/window.png" alt="" class="circle">`;
            }
            listado += `<span class="title">${o.name}</span>`;
            listado += ` <p>${o.description}</p>`;
            listado += `<a href="#!" class="secondary-content">
                                        <div class="switch" style="display: inline-block; margin-right: 20px;">
                                            <label> Off`;
            if (o.state) {
              listado += `<input id='cb_${o.id}' checked type="checkbox">`;
            } else {
              listado += `<input id='cb_${o.id}' type="checkbox">`;
            }
            listado += `<span class="lever"></span> On
                                            </label>
                                        </div>
                                        <button class="btn-small red" id="btnEdit_${o.id}">Editar</button>
                                        <button class="btn-small red" id="btnRemove_${o.id}">Eliminar</button>
                                    </a>`;
            listado += "</li>";
          }
          div.innerHTML = listado;

          for (let o of devices) {
            let checkbox = document.getElementById("cb_" + o.id);
            checkbox.addEventListener("click", this);
            let btnRemove = document.getElementById("btnRemove_" + o.id);
            btnRemove.addEventListener("click", this);
            let btnEdit = document.getElementById("btnEdit_" + o.id);
            btnEdit.addEventListener("click", this);
          }
        } else {
          alert("fallo la consulta");
        }
      }
    };

    xmlReq.open("GET", "http://localhost:8000/devices", true);
    xmlReq.send();
  }

  public agregarDispositivo() {}

  public cambiarEstado() {}
}

window.addEventListener("load", () => {
  let main: Main = new Main();
  let btnMostrar = document.getElementById("btnMostrar");
  btnMostrar.addEventListener("click", main);
  let xmlReq = new XMLHttpRequest();
  xmlReq.onreadystatechange = () => {
    if (xmlReq.readyState == 4) {
      if (xmlReq.status == 200) {
        console.log(xmlReq.responseText);
      } else {
        alert(xmlReq.responseText);
      }
    }
  };
});
