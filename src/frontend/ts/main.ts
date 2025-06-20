var M;

const endpointDevices: string = "http://localhost:8000/devices";
class Main implements EventListenerObject {
  handleEvent(object: Event): void {
    console.log(object);
    let elementoClick = <HTMLInputElement>object.target;
    if (elementoClick.id == "btnMostrar" && object.type == "click") {
      this.consultarAlServidor();
      console.log("click mostrar", elementoClick.checked, elementoClick.id);
    } else if (elementoClick.id.startsWith("cb_") && object.type == "click") {
      console.log("click checkbox", elementoClick.checked, elementoClick.id);
      const deviceId = elementoClick.id.substring(3);
      console.log(deviceId);
      this.cambiarEstado(deviceId);
    } else if (
      elementoClick.id.startsWith("btnRemove_") &&
      object.type == "click"
    ) {
      console.log("click eliminar", elementoClick.id);
      const deviceId = elementoClick.id.substring(10);
      this.eliminarDispositivo(deviceId);
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
            listado += `<p>${o.description}</p>`;
            listado += `<a href="#!" class="secondary-content">
                          <div class="switch" style="display: inline-block; margin-right: 20px;">
                            <label> Off`;
            if (o.state) {
              listado += `<input id='cb_${o.id}' checked type="checkbox">`;
            } else {
              listado += `<input id='cb_${o.id}' type="checkbox">`;
            }
            listado += `<span class="lever"></span> On</label>
                          </div>`;
            listado += `<button class="btn-small modal-trigger red" id="btnEdit_${o.id}" data-target="modalEditar_${o.id}">Editar</button>
                          <button class="btn-small red" id="btnRemove_${o.id}">Eliminar</button>
                        </a>`;
            listado += `<div id="modalEditar_${o.id}" class="modal">
                          <div class="modal-content">
                              <h4>Editar dispositivo</h4>
                              <div class="input-field">
                                  <label for="iNombre">Nombre</label>
                                  <input type="text" placeholder="Juan" id="iNombre">
                              </div>
                              <div class="input-field">
                                  <label for="iDescripcion">Descripción</label>
                                  <input type="text" placeholder="desc" id="iDescripcion">
                              </div>
                          </div>
                          <div class="modal-footer">
                              <a href="#!" class="modal-close btn-flat">Cancelar</a>
                              <a href="#!" class="modal-close waves-effect waves-green btn-flat"
                                  onclick="editarDispositivo(${o.id})">Aceptar</a>
                          </div>
                        </div>`;
            listado += "</li>";
          }
          div.innerHTML = listado;

          for (let o of devices) {
            let modal = document.getElementById("modalEditar_" + o.id);
            M.Modal.init(modal);
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
    xmlReq.open("GET", endpointDevices, true);
    xmlReq.send();
  }

  public agregarDispositivo() {
    const form = document.getElementById("modalAgregar") as HTMLFormElement;
    const nameInput = form.querySelector<HTMLInputElement>("#iNombre");
    const descInput = form.querySelector<HTMLInputElement>("#iDescripcion");
    console.log(nameInput.value);
    const body = JSON.stringify({
      name: nameInput.value,
      description: descInput.value,
      type: 1,
    });
    let xmlReq = new XMLHttpRequest();
    xmlReq.open("POST", endpointDevices, true);
    xmlReq.setRequestHeader("Content-Type", "application/json");
    xmlReq.send(body);
    this.consultarAlServidor();
  }

  public editarDispositivo(id: string) {
    const numeric_id = Number(id);
    const form = document.getElementById(
      "modalEditar_" + id
    ) as HTMLFormElement;
    if (!form) {
      console.error("Form no encontrado");
      return;
    }
    const nameInput = form.querySelector<HTMLInputElement>("#iNombre");
    const descInput = form.querySelector<HTMLInputElement>("#iDescripcion");
    const body = JSON.stringify({
      id: numeric_id,
      name: nameInput.value,
      description: descInput.value,
      type: 1,
    });
    let xmlReq = new XMLHttpRequest();
    xmlReq.open("PUT", endpointDevices, true);
    xmlReq.setRequestHeader("Content-Type", "application/json");
    xmlReq.send(body);
    this.consultarAlServidor();
  }

  public cambiarEstado(id: string) {
    let xmlReq = new XMLHttpRequest();
    xmlReq.open("PUT", "http://localhost:8000/devices/" + id, true);
    xmlReq.send();
  }

  //Elimina el dispositivo que recibe como parámetro y actualiza la lista para que se vea el cambio.
  public eliminarDispositivo(id: string) {
    let xmlReq = new XMLHttpRequest();
    const numeric_id = Number(id);
    const body = JSON.stringify({ id: numeric_id });
    xmlReq.open("DELETE", endpointDevices, true);
    xmlReq.setRequestHeader("Content-Type", "application/json");
    xmlReq.send(body);
    this.consultarAlServidor();
  }
}

window.addEventListener("load", () => {
  var elems = document.querySelectorAll(".modal");
  var instances = M.Modal.init(elems, null);
  let main: Main = new Main();
  let btnMostrar = document.getElementById("btnMostrar");
  btnMostrar.addEventListener("click", main);
  (window as any).editarDispositivo = (id: string) =>
    main.editarDispositivo(id);
  (window as any).agregarDispositivo = () => main.agregarDispositivo();
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
