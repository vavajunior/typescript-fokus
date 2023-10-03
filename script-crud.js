"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var estadoAplicacao = {
    tarefas: [
        {
            descricao: 'Tarefa concluída',
            concluida: true
        },
        {
            descricao: 'Tarefa pendente 1',
            concluida: false
        },
        {
            descricao: 'Tarefa pendente 2',
            concluida: false
        }
    ],
    tarefaSelecionada: null
};
var selecionarTarefa = function (estadoAtual, tarefa) {
    return __assign(__assign({}, estadoAtual), { tarefaSelecionada: tarefa });
};
var adicionarTarefa = function (estadoAtual, tarefa) {
    return __assign(__assign({}, estadoAtual), { tarefas: __spreadArray(__spreadArray([], estadoAtual.tarefas, true), [tarefa], false) });
};
var excluirTarefa = function (estadoAtual, tarefa) {
    return {
        tarefas: estadoAtual.tarefas.filter(function (t) { return t != tarefa; }),
        tarefaSelecionada: null
    };
};
var excluirConcluidas = function (estadoAtual) {
    return {
        tarefas: estadoAtual.tarefas.filter(function (t) { return !t.concluida; }),
        tarefaSelecionada: null
    };
};
var atualizarUI = function () {
    var taskIconSvg = "\n        <svg class=\"app__section-task-icon-status\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"\n            fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n            <circle cx=\"12\" cy=\"12\" r=\"12\" fill=\"#FFF\" />\n            <path\n                d=\"M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z\"\n                fill=\"#01080E\" />\n        </svg>\n    ";
    var ulTarefas = document.querySelector('.app__section-task-list');
    if (ulTarefas) {
        ulTarefas.innerHTML = '';
    }
    var inputNovaTarefa = document.querySelector('.app__form-textarea');
    var formAdicionarTarefa = document.querySelector('.app__form-add-task');
    var btnAdicionarTarefa = document.querySelector('.app__button--add-task');
    var btnCancelarTarefa = document.querySelector('.app__form-footer__button--cancel');
    var btnExcluirTarefa = document.querySelector('.app__form-footer__button--delete');
    var btnExcluirConcluidas = document.querySelector('#btn-remover-concluidas');
    if (btnAdicionarTarefa) {
        btnAdicionarTarefa.onclick = function () {
            inputNovaTarefa.value = '';
            estadoAplicacao.tarefaSelecionada = null;
            if (formAdicionarTarefa === null || formAdicionarTarefa === void 0 ? void 0 : formAdicionarTarefa.classList.contains('hidden')) {
                formAdicionarTarefa === null || formAdicionarTarefa === void 0 ? void 0 : formAdicionarTarefa.classList.remove('hidden');
            }
        };
    }
    if (btnExcluirTarefa) {
        btnExcluirTarefa.onclick = function () {
            if (estadoAplicacao.tarefaSelecionada) {
                estadoAplicacao = excluirTarefa(estadoAplicacao, estadoAplicacao.tarefaSelecionada);
                atualizarUI();
            }
        };
    }
    if (btnExcluirConcluidas) {
        btnExcluirConcluidas.onclick = function () {
            estadoAplicacao = excluirConcluidas(estadoAplicacao);
            atualizarUI();
        };
    }
    if (btnCancelarTarefa) {
        btnCancelarTarefa.onclick = function () {
            formAdicionarTarefa === null || formAdicionarTarefa === void 0 ? void 0 : formAdicionarTarefa.classList.toggle('hidden');
        };
    }
    formAdicionarTarefa.onsubmit = function (evento) {
        evento.preventDefault();
        console.log('onsubmit', estadoAplicacao.tarefaSelecionada);
        var descricao = inputNovaTarefa.value;
        if (!estadoAplicacao.tarefaSelecionada) {
            estadoAplicacao = adicionarTarefa(estadoAplicacao, { descricao: descricao, concluida: false });
        }
        else {
            estadoAplicacao.tarefaSelecionada.descricao = descricao;
        }
        formAdicionarTarefa === null || formAdicionarTarefa === void 0 ? void 0 : formAdicionarTarefa.classList.toggle('hidden');
        atualizarUI();
    };
    estadoAplicacao.tarefas.forEach(function (tarefa) {
        var li = document.createElement('li');
        li.classList.add('app__section-task-list-item');
        var svgIcon = document.createElement('svg');
        svgIcon.innerHTML = taskIconSvg;
        var paragraph = document.createElement('p');
        paragraph.classList.add('app__section-task-list-item-description');
        paragraph.textContent = tarefa.descricao;
        var button = document.createElement('button');
        button.classList.add('app_button-edit');
        var editIcon = document.createElement('img');
        editIcon.setAttribute('src', '/imagens/edit.png');
        button.appendChild(editIcon);
        if (tarefa.concluida) {
            button.setAttribute('disabled', 'true');
            li.classList.add('app__section-task-list-item-complete');
        }
        if (tarefa === estadoAplicacao.tarefaSelecionada) {
            var descricaoEmAndamento = document.querySelector('.app__section-active-task-description');
            li.classList.add('app__section-task-list-item-active');
            descricaoEmAndamento.innerHTML = tarefa.descricao;
            inputNovaTarefa.value = tarefa.descricao;
        }
        li.addEventListener("click", function () {
            estadoAplicacao = selecionarTarefa(estadoAplicacao, tarefa);
            atualizarUI();
        });
        button.addEventListener("click", function (evento) {
            evento.stopPropagation();
            formAdicionarTarefa === null || formAdicionarTarefa === void 0 ? void 0 : formAdicionarTarefa.classList.remove('hidden');
            estadoAplicacao = selecionarTarefa(estadoAplicacao, tarefa);
            atualizarUI();
        });
        svgIcon.addEventListener("click", function (evento) {
            evento.stopPropagation();
            tarefa.concluida = !tarefa.concluida;
            estadoAplicacao = selecionarTarefa(estadoAplicacao, tarefa);
            atualizarUI();
        });
        li.appendChild(svgIcon);
        li.appendChild(paragraph);
        li.appendChild(button);
        ulTarefas === null || ulTarefas === void 0 ? void 0 : ulTarefas.appendChild(li);
    });
};
document.addEventListener('TarefaFinalizada', function (detail) {
    if (estadoAplicacao.tarefaSelecionada) {
        estadoAplicacao.tarefaSelecionada.concluida = true;
        atualizarUI();
    }
});
atualizarUI();
//# sourceMappingURL=script-crud.js.map