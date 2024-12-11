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
     * Converte o objeto numa linha de tabela HTML (deve ser implementado pelas subclasses).
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

    constructor(name = "") {
        super();
        this.name = name;
    }

    getId() {
        return this.id;
    }

    toTrTd() {
        return [this.id, this.name];
    }
}

/**
 * Classe Event
 * @class Representação de um evento que estende de uma Structure
 */

class Event extends Structure {
    static columns = ["Id", "Nome", "Data", "Tipo de Evento"];
    name;
    date;
    typeEvent;

    constructor(name = "", date = "", typeEvent = "") {
        super();
        this.name = name;
        this.date = date;
        this.typeEvent = typeEvent;
    }

    getId() {
        return this.id;
    }

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
    constructor(description = "") {
        super();
        this.description = description;
    }

    getId() {
        return this.id;
    }

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

    get members() {
        return this.#members;
    }

    get events() {
        return this.#events;
    }

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

    remove(rowIndex, typeOfData) {
        switch(typeOfData){
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
}

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

console.log(menu.members);
console.log(menu.events);
console.log(menu.typeEvents);

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

document.getElementById("buttonMembers").addEventListener("click", () => {
    selectedTypeObject = "Membro";
    showMainButtons();
    document.getElementById("titleInstance").textContent = "Membros";
    tableMembers.show(document.getElementById("area-list"));
})

document.getElementById("buttonEvents").addEventListener("click", () => {
    selectedTypeObject = "Evento";
    showMainButtons();
    document.getElementById("titleInstance").textContent = "Eventos";
    tableEvents.show(document.getElementById("area-list"));
})

document.getElementById("buttonTypeEvents").addEventListener("click", () => {
    selectedTypeObject = "TipoEvento";
    showMainButtons();
    document.getElementById("titleInstance").textContent = "Tipos de Eventos";
    tableTypeEvents.show(document.getElementById("area-list"));
})

document.getElementById("removeButton").addEventListener("click", () => {
    if (highlightedRow) {
        switch (selectedTypeObject) {
            case "Membro":
                menu.remove(rowIndex-1, 'M');
                break;
            case "Evento":
                menu.remove(rowIndex-1, 'E');
                break;
            case "TipoEvento":
                menu.remove(rowIndex-1, 'T');
                break;
            default:
                console.log("type not removed!, " + menu.length);
        }
        highlightedRow.parentNode.removeChild(highlightedRow);
    } else {
        alert("Selecione uma linha para remover");
    }
})