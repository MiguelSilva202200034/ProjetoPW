"use strict";
/**
 * @file Classe para implementar gestão de Membros, Eventos e Tipo de Eventos
 * @authors Miguel Silva e Rúben ALves
 * @version 1.0.0
 */

let highlightedRow = null;
let rowIndex;
let selectedTypeObject;

/**
 * Classe Viewable
 * @class Elementos HTML que podem ser colocados nas páginas HTML.
 */
class Viewable {
    #element;
    constructor(tag) {
        tag && (this.#element = document.createElement(tag));
    }

    /**
     * @getter que retorna o elemento desse elemente viewable
     */
    get element() {
        return this.#element;
    }


    /**
     * Coloca #element como filho do elemento (parent) HTML da página
     * @param {HTMLElement} parent - elemento HTML onde será colocada o #element.
     */
    show(parent) {
        (parent) && parent.replaceChildren(this.#element);
    }
}

/**
 * Classe Table
 * @class Tabela com informação de Membro, Evento ou Tipo de Evento
 */
class Table extends Viewable {
    #cols;
    #rows;
    info = [];
    typeOfData;
    /**
     * @constructs Table
     * @param {number} rows - número de linhas da tabela.
     * @param {number} columns - número de colunas da tabela.
     * @param {Array} info - dados que a tabela vai ter, ex: TableMember, info=["id", "Nome"]
     * @param {Object} typeOfData - tipo de objeto que se vai criar a tabela: Member, Event, TypeEvent
     * @throws {Error} Se o número de linhas e de colunas não for positivo
     */
    constructor(rows = 0, cols = 0, info, typeOfData) {
        super("table");
        this.#rows = rows;
        this.#cols = cols;
        info && (this.info = info);
        typeOfData && (this.typeOfData = typeOfData);
        this.thead();
        this.tbody();
    }

    /**
     * Gera o cabeçalho da tabela
     */
    thead() {
        const theadElement = document.createElement("thead");
        const headerRow = document.createElement("tr");

        this.typeOfData.columns.forEach(column => {
            const th = document.createElement("th");
            th.textContent = column;
            headerRow.appendChild(th);
        });

        theadElement.appendChild(headerRow);
        this.element.appendChild(theadElement);
    }

    /**
     * Gera o corpo da tabela já com as informações passadas no construtor
     */
    tbody() {
        const tbodyElement = document.createElement("tbody");

        this.info.forEach(item => {
            const tr = document.createElement("tr");
            tr.onclick = () => captureRowIndex(tr);

            const tdValues = item.toTrTd();

            tdValues.forEach(value => {
                const td = document.createElement("td");
                td.textContent = value;
                tr.appendChild(td);
            });

            tbodyElement.appendChild(tr);
        });

        this.element.appendChild(tbodyElement);
    }

    /**
     * Converte cada linha do array para uma linha da tabela
     */
    toTrTd() {
        return this.info.forEach(title => {
            `<tr><td>${title}<tr><td>`
        })
    }
}

/**
 * Classe Form
 * @class Classe form para editar ou adicionar um Membro, Evento ou tipo de evento
 */
class Form extends Viewable {

    /**
     * @constructs Form
     * Apenas chama o construtor da classe superior na hierarquia e cria um elemento html form
     */
    constructor() {
        super("form");
    }

    /**
     * Adiciona outro elemento ao form caso necessário
     */
    appendElementToForm(elem) {
        this.element.appendChild(elem);
    }

    /**
     * Preenche o formulário dependendo do tipo de formulário que é
     * @throws {Error} Se não for implementado pela subclasse.
     */
    fillForm() {
        throw new Error("O método 'fillForm' deve ser implementado na subclasse.");
    }
}

/**
 * Classe FormMember
 * @class Classe form para editar ou adicionar um Membro
 */
class FormMember extends Form {
    elements = {};
    nameInput;
    typeEvents;

    /**
     * @constructs FormMember
     * Instancia os elementos próprios de um form para membros
     */
    constructor(elements) {
        super();
        this.elements = elements;
        this.fillForm();
    }

    /**
     * Preenche o formulário com os campos para um Membro
     */
    fillForm() {
        let nameInputTag = this.elements.name.tag;
        let nameInputType = this.elements.name.type;

        let typeEventsTag = this.elements.typeEvents.tag;
        let typeEventsType = this.elements.typeEvents.type;

        let labelName = document.createElement("label");
        labelName.textContent = Member.columns[1] + ": ";

        this.nameInput = document.createElement(nameInputTag);
        this.nameInput.type = nameInputType;
        this.nameInput.id = this.elements.name.id;

        this.appendElementToForm(labelName);
        this.appendElementToForm(this.nameInput);
        this.appendElementToForm(document.createElement("br"));
        this.appendElementToForm(document.createElement("br"));
        let title = document.createElement("h4");
        title.textContent = "Tipos de eventos preferidos:";
        this.appendElementToForm(title);
        this.appendElementToForm(document.createElement("br"));

        menu.typeEvents.forEach(e => {
            let labelTypeEventDescription = document.createElement("label");
            labelTypeEventDescription.textContent = e.getDescription();
            let typeEventRadio = document.createElement(typeEventsTag);
            typeEventRadio.type = typeEventsType;
            typeEventRadio.textContent = e.getDescription();
            typeEventRadio.value = e.getDescription();
            typeEventRadio.name = this.elements.typeEvents.name;
            this.appendElementToForm(typeEventRadio);
            this.appendElementToForm(labelTypeEventDescription);
            this.appendElementToForm(document.createElement("br"));
        })
    }

}


/**
 * Classe FormEvent
 * @class Classe form para editar ou adicionar um Evento
 */
class FormEvent extends Form {
    elements;
    descriptionInput;
    datePickerDate;
    selectType;

    /**
     * @constructs FormEvent
     * Instancia os elementos próprios de um form para eventos
     */
    constructor(elements) {
        super();
        this.elements = elements;
        this.fillForm();
    }

    /**
     * Preenche o formulário com os campos para um Evento
     */
    fillForm() {
        let descriptionInputTag = this.elements.description.tag;
        let descriptionInputType = this.elements.description.type;

        let datePickerDateTag = this.elements.date.tag;
        let datePickerDateType = this.elements.date.type;

        let selectTypeTag = this.elements.typeEvent.tag;


        let labelDescription = document.createElement("label");
        labelDescription.textContent = Event.columns[1] + ": ";
        this.descriptionInput = document.createElement(descriptionInputTag);
        this.descriptionInput.type = descriptionInputType;
        this.descriptionInput.id = this.elements.description.id;

        this.appendElementToForm(labelDescription);
        this.appendElementToForm(this.descriptionInput);
        this.appendElementToForm(document.createElement("br"));

        let labelDatePicker = document.createElement("label");
        labelDatePicker.textContent = Event.columns[2] + ": ";
        this.datePickerDate = document.createElement(datePickerDateTag);
        this.datePickerDate.type = datePickerDateType;
        this.datePickerDate.id = this.elements.date.id;

        this.appendElementToForm(labelDatePicker);
        this.appendElementToForm(this.datePickerDate);
        this.appendElementToForm(document.createElement("br"));

        let labelSelect = document.createElement("label");
        labelSelect.textContent = Event.columns[3] + ": ";
        this.selectType = document.createElement(selectTypeTag);
        this.selectType.id = this.elements.typeEvent.id;
        for (var i = 0; i < menu.typeEvents.length; i++) {
            var opt = menu.typeEvents[i].getDescription();
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            this.selectType.appendChild(el);
        }
        this.selectType.value = "";

        this.appendElementToForm(labelSelect);
        this.appendElementToForm(this.selectType);
        this.appendElementToForm(document.createElement("br"));
    }
}


/**
 * Classe FormTypeEvent
 * @class Classe form para editar ou adicionar um Tipo de Evento
 */
class FormTypeEvent extends Form {
    elements;
    descriptionInput;

    /**
     * @constructs FormTypeEvent
     * Instancia os elementos próprios de um form para tipos de eventos
     */
    constructor(elements) {
        super();
        this.elements = elements;
        this.fillForm();
    }

    /**
     * Preenche o formulário com os campos para um Tipo de Evento
     */
    fillForm() {
        let labelElement = document.createElement("label");
        labelElement.textContent = TypeEvent.columns[1] + ": ";

        let descriptionInputTag = this.elements.description.tag;
        let descriptionInputType = this.elements.description.type;

        this.descriptionInput = document.createElement(descriptionInputTag);
        this.descriptionInput.type = descriptionInputType;
        this.descriptionInput.id = this.elements.description.id;

        this.appendElementToForm(labelElement);
        this.appendElementToForm(this.descriptionInput);
    }

}

/**
 * Classe Structure
 * @class Estrutura para representar ou um Member, ou um Event ou um TypeEvent
 */
class Structure {
    static lastId = 0;
    id;

    /**
     * @constructs Structure
     * Incrementação do id em mais um em relação ao id do objeto anterior criado
     */
    constructor() {
        this.id = ++this.constructor.lastId;
    }

    /**
     * Retorna o ID do objeto.
     * @returns {number} ID do objeto.
     */
    getId() {
        return this.id;
    }

    /**
     * Gera os cabeçalhos da tabela com base nos metadados da subclasse.
     * @returns {string} Cabeçalhos da tabela em HTML.
     */
    static toTrTh() {
        if (!this.columns) {
            throw new Error(`A classe ${this.name} não definiu o nome das suas 'columns'.`);
        } else {
            return `<tr>
                ${this.columns.map(col => `<th>${col}</th>`).join('')}  
            </tr>`;
        }
    }

    /**
     * Devolve os atributos de um objeto para serem convertidos em linha de tabela
     * @throws {Error} Se não for implementado pela subclasse.
     */
    toTrTd() {
        throw new Error("O método 'toTrTd' deve ser implementado na subclasse.");
    }
}

/**
 * Classe Member
 * @class Representação de um membro que estende de uma Structure
 */
class Member extends Structure {
    static columns = ["Id", "Nome"];
    name;

    /**
     * @constructs Member
     * Incrementação do id em mais um pela chamada do super(), e inicializa o nome com o parametro do construtor
     */
    constructor(name = "") {
        super();
        this.name = name;
    }

    /**
     * Retorna o ID do membro.
     * @returns {number} ID do membro.
     */
    getId() {
        return this.id;
    }

    /**
     * Devolve os seus atributos, id e nome para poderem ser convertidos para linha de uma tabela pelo objeto Table
     * @throws {Error} Se não for implementado pela subclasse.
     */
    toTrTd() {
        return [this.id, this.name];
    }
}

/**
 * Classe Event
 * @class Representação de um evento que estende de uma Structure
 */

class Event extends Structure {
    static columns = ["Id", "Descritivo", "Data", "Tipo de Evento"];
    name;
    date;
    typeEvent;

    /**
     * @constructs Event
     * Incrementação do id em mais um pela chamada do super(), e inicializa o nome, date e typeEvent com os parametros do construtor
     */
    constructor(name = "", date = "", typeEvent = "") {
        super();
        this.name = name;
        this.date = date;
        this.typeEvent = typeEvent;
    }

    /**
     * Retorna o ID do evento.
     * @returns {number} ID do evento.
     */
    getId() {
        return this.id;
    }

    /**
     * Retorna o Nome do evento.
     * @returns {String} Nome do evento.
     */
    getName() {
        return this.name;
    }

    /**
     * Devolve os seus atributos, id, nome, data e tipo de evento para poderem ser convertidos para linha de uma tabela pelo objeto Table
     * @throws {Error} Se não for implementado pela subclasse.
     */
    toTrTd() {
        return [this.id, this.name, this.date, this.typeEvent];
    }

}

/**
 * Classe TypeEvent
 * @class Representação de um tipo de evento que estende de uma Structure
 */
class TypeEvent extends Structure {
    static columns = ["Id", "Descritivo"];
    description;

    /**
     * @constructs Event
     * Incrementação do id em mais um pela chamada do super(), e inicializa o descritivo com o parametro do construtor
     */
    constructor(description = "") {
        super();
        this.description = description;
    }

    /**
     * Retorna o ID do tipo de evento.
     * @returns {number} ID do evento.
     */
    getId() {
        return this.id;
    }

    /**
     * Retorna o descritivo do tipo evento.
     * @returns {String} Descritivo do tipo de evento.
     */
    getDescription() {
        return this.description;
    }

    /**
     * Devolve os seus atributos, id e descritivo para poderem ser convertidos para linha de uma tabela pelo objeto Table
     * @throws {Error} Se não for implementado pela subclasse.
     */
    toTrTd() {
        return [this.id, this.description];
    }
}



/**
 * @class Representa o menu onde são guardados, de forma estática, todos os membros, eventos e tipos de eventos 
 * @constructs Menu
 *
 * @property {Member[]} members - lista de membros
 * @property {Event[]} events - lista de eventos
 * @property {TypeEvents[]} typeEvents - lista de tipo de eventos
 */
class Menu {
    #members;
    #events;
    #typeEvents;
    /**
     * @constructs Menu
     * Instancia os arrays de membros, eventos e tipos de eventos para um array inicialmente vazio
     */
    constructor() {
        this.#members = [];
        this.#events = [];
        this.#typeEvents = [];
    }

    /**
     * Retorna o array de membros
     * @returns {Array} array de membros.
     */
    get members() {
        return this.#members;
    }

    /**
     * Retorna o array de eventos
     * @returns {Array} array de eventos.
     */
    get events() {
        return this.#events;
    }

    /**
     * Retorna o array de tipo de eventos
     * @returns {Array} array de tipo de eventos.
     */
    get typeEvents() {
        return this.#typeEvents;
    }

    /**
     * Passa os dados passados num array para o formato de tabela
     * @param {Array} data array escolhido para converter para tabela, ou Product[], ou Member[], ou TypeEvents[]
     * @returns tabela com os dados formatos
     */
    toTable(data) {
        if (data.length === 0) {
            const noDataTable = document.createElement("table");
            const noDataRow = document.createElement("tr");
            const noDataCell = document.createElement("td");
            noDataCell.textContent = "Não há dados para exibir";
            noDataRow.appendChild(noDataCell);
            noDataTable.appendChild(noDataRow);
            return noDataTable;
        } else {
            let typeOfData;

            if (data[0] instanceof Member) {
                typeOfData = Member;
            } else if (data[0] instanceof Event) {
                typeOfData = Event;
            } else if (data[0] instanceof TypeEvent) {
                typeOfData = TypeEvent;
            } else {
                throw new Error("Tipo de dados desconhecido.");
            }
            const table = new Table(data.length, Object.keys(typeOfData).length, data, typeOfData);
            return table;
        }
    }

    /**
     * Remove um item do array escolhido
     * @param {Number} rowIndex indice do elemento que quer ser retirado
     * @param {CharacterData} typeOfData 'M' seleciona os members, 'E' seleciona os events e 'T' seleciona os tipos de eventos
     * @returns tabela com os dados formatos
     */
    remove(rowIndex, typeOfData) {
        switch (typeOfData) {
            case 'M':
                this.#members.splice(rowIndex, 1);
                break;
            case 'E':
                this.#events.splice(rowIndex, 1);
                break;
            case 'T':
                this.#typeEvents.splice(rowIndex, 1);
                break;
            default:
                throw new Error("Tipo de dados desconhecido.");
        }
    }

    add(typeOfData, ...args) {
        switch (typeOfData) {
            case 'M':
                this.#members.push(new Member(args[0]))
                break;
            case 'E':
                this.#events.push(new Event(args[0], args[1], args[2]));
                break;
            case 'T':
                this.#typeEvents.push(new TypeEvent(args[0]));
                break;
            default:
                throw new Error("Tipo de dados desconhecido.");
        }
    }
}

let area = document.getElementById("area-list");

const menu = new Menu();

menu.members.push(new Member("Joao"));
menu.members.push(new Member("Maria"));
menu.members.push(new Member("Miguel"));
menu.members.push(new Member("Ruben"));

menu.events.push(new Event("Corrida", "2024-12-15", "Competição"));
menu.events.push(new Event("Estudo", "2024-12-05", "Escola"));
menu.events.push(new Event("Aula", "2024-12-12", "Escola"));
menu.events.push(new Event("Concerto", "2024-12-01", "Diversão"));

menu.typeEvents.push(new TypeEvent("Competição"));
menu.typeEvents.push(new TypeEvent("Escola"));
menu.typeEvents.push(new TypeEvent("Diversão"));

let tableMembers = menu.toTable(menu.members);
let tableEvents = menu.toTable(menu.events);
let tableTypeEvents = menu.toTable(menu.typeEvents);

function showMainButtons() {
    document.getElementById("addButton").style = "display: inline-block";
    document.getElementById("editButton").style = "display: inline-block";
    document.getElementById("removeButton").style = "display: inline-block";
    document.getElementById("saveButton").style = "display: none";
    document.getElementById("cancelButton").style = "display: none";
}

function showFormButtons() {
    document.getElementById("addButton").style = "display: none";
    document.getElementById("editButton").style = "display: none";
    document.getElementById("removeButton").style = "display: none";
    document.getElementById("saveButton").style = "display: inline-block";
    document.getElementById("cancelButton").style = "display: inline-block";
}

function captureRowIndex(tr) {
    rowIndex = tr.rowIndex;
    if (highlightedRow === tr) {
        tr.style.backgroundColor = "";
        highlightedRow = null;
    } else {
        if (highlightedRow) {
            highlightedRow.style.backgroundColor = "";
        }
        tr.style.backgroundColor = "#64B5F6";
        highlightedRow = tr;
    }
}

document.querySelectorAll("tbody tr").forEach(tr => {
    tr.addEventListener("click", () => captureRowIndex(tr));
});

document.getElementById("addButton").addEventListener("click", () => {
    let form;
    switch (selectedTypeObject) {
        case "M":
            form = new FormMember({
                name: {
                    tag: "input",
                    type: "text",
                    id: "nameMember"
                },
                typeEvents: {
                    tag: "input",
                    type: "checkbox",
                    name: "typesEvents"
                }
            });
            break;
        case "E":
            form = new FormEvent({
                description: {
                    tag: "input",
                    type: "text",
                    id: "descriptionEvent"
                },
                date: {
                    tag: "input",
                    type: "date",
                    id: "dateEvent"
                },
                typeEvent: {
                    tag: "select",
                    id: "typeEvent"
                }
            });
            break;
        case "T":
            form = new FormTypeEvent({
                description: {
                    tag: "input",
                    type: "text",
                    id: "descriptionTypeEvent"
                }
            });
            break;
        default:
            throw new Error("Tipo de dados desconhecido.");
    }
    form.show(area);
    showFormButtons();
})

document.getElementById("saveButton").addEventListener("click", () => {
    if (selectedTypeObject === "T") {
        const val = document.getElementById("descriptionTypeEvent").value;
        if (val === "") {
            alert("O campo descrição do tipo de evento não pode estar vazio.");
            return;
        }
        menu.add(selectedTypeObject, val);
        tableTypeEvents = menu.toTable(menu.typeEvents);
        tableTypeEvents.show(area);
        showMainButtons();
    } else if (selectedTypeObject === "E") {
        const val = document.getElementById("descriptionEvent").value;
        const date = document.getElementById("dateEvent").value;
        const typeEvent = document.getElementById("typeEvent").value;
        if (val === "" || date === "" || typeEvent === "") {
            alert("Preencha todos os campos.");
            return;
        }
        menu.add(selectedTypeObject, val, date, typeEvent);
        tableEvents = menu.toTable(menu.events);
        tableEvents.show(area);
        showMainButtons();
    } else if (selectedTypeObject === "M") {
        const name = document.getElementById("nameMember").value;
        const checkBoxes = document.querySelectorAll('input[name="typesEvents"]:checked');
        const favTypesEvents = Array.from(checkBoxes).map(checkbox => checkbox.value);
        if (name === "" || favTypesEvents.length === 0) {
            alert("Preencha todos os campos.");
            return;
        }
        menu.add(selectedTypeObject, name, favTypesEvents);
        tableMembers = menu.toTable(menu.members);
        tableMembers.show(area);
        showMainButtons();
    }
})

document.getElementById("cancelButton").addEventListener("click", () => {
    selectedTypeObject === "M" ? tableMembers.show(area)
        : selectedTypeObject === "E" ? tableEvents.show(area) : tableTypeEvents.show(area);
})

document.getElementById("buttonMembers").addEventListener("click", () => {
    selectedTypeObject = "M";
    showMainButtons();
    document.getElementById("titleInstance").textContent = "Membros";
    tableMembers.show(area);
})

document.getElementById("buttonEvents").addEventListener("click", () => {
    selectedTypeObject = "E";
    showMainButtons();
    document.getElementById("titleInstance").textContent = "Eventos";
    tableEvents.show(area);
})

document.getElementById("buttonTypeEvents").addEventListener("click", () => {
    selectedTypeObject = "T";
    showMainButtons();
    document.getElementById("titleInstance").textContent = "Tipos de Eventos";
    tableTypeEvents.show(area);
})

document.getElementById("removeButton").addEventListener("click", () => {
    if (highlightedRow) {
        menu.remove(rowIndex - 1, selectedTypeObject);
        highlightedRow.parentNode.removeChild(highlightedRow);
    } else {
        alert("Selecione uma linha para remover");
    }
})