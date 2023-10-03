interface Tarefa {
    descricao: string,
    concluida: boolean
}

interface EstadoAplicacao {
    tarefas: Tarefa[]
    tarefaSelecionada: Tarefa | null
}

let estadoAplicacao: EstadoAplicacao = {
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
}

const selecionarTarefa = (estadoAtual: EstadoAplicacao, tarefa: Tarefa): EstadoAplicacao => {
    return {
        ...estadoAtual,
        tarefaSelecionada: tarefa
    }
}

const adicionarTarefa = (estadoAtual: EstadoAplicacao, tarefa: Tarefa): EstadoAplicacao => {
    return {
        ...estadoAtual,
        tarefas: [...estadoAtual.tarefas, tarefa],
    }
}

const excluirTarefa = (estadoAtual: EstadoAplicacao, tarefa: Tarefa): EstadoAplicacao => {
    return {
        tarefas: estadoAtual.tarefas.filter(t => t != tarefa),
        tarefaSelecionada: null
    }
}

const excluirConcluidas = (estadoAtual: EstadoAplicacao): EstadoAplicacao => {
    return {
        tarefas: estadoAtual.tarefas.filter(t => !t.concluida),
        tarefaSelecionada: null
    }
}

const atualizarUI = () => {
    const taskIconSvg = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
            fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF" />
            <path
                d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
                fill="#01080E" />
        </svg>
    `

    const ulTarefas = document.querySelector('.app__section-task-list')
    if (ulTarefas) {
        ulTarefas.innerHTML = ''
    }

    const inputNovaTarefa = document.querySelector<HTMLTextAreaElement>('.app__form-textarea')
    const formAdicionarTarefa = document.querySelector<HTMLFormElement>('.app__form-add-task')
    const btnAdicionarTarefa = document.querySelector<HTMLButtonElement>('.app__button--add-task')
    const btnCancelarTarefa = document.querySelector<HTMLButtonElement>('.app__form-footer__button--cancel')
    const btnExcluirTarefa = document.querySelector<HTMLButtonElement>('.app__form-footer__button--delete')
    const btnExcluirConcluidas = document.querySelector<HTMLButtonElement>('#btn-remover-concluidas');

    if (btnAdicionarTarefa) {
        btnAdicionarTarefa.onclick = () => {
            inputNovaTarefa!.value = ''
            estadoAplicacao.tarefaSelecionada = null
            if (formAdicionarTarefa?.classList.contains('hidden')) {
                formAdicionarTarefa?.classList.remove('hidden')
            }
        }
    }
    if (btnExcluirTarefa) {
        btnExcluirTarefa.onclick = () => {
            if (estadoAplicacao.tarefaSelecionada) {
                estadoAplicacao = excluirTarefa(estadoAplicacao, estadoAplicacao.tarefaSelecionada)
                atualizarUI()
            }
        }
    }
    if (btnExcluirConcluidas) {
        btnExcluirConcluidas.onclick = () => {
            estadoAplicacao = excluirConcluidas(estadoAplicacao)
            atualizarUI()
        }
    }
    if (btnCancelarTarefa) {
        btnCancelarTarefa.onclick = () => {
            formAdicionarTarefa?.classList.toggle('hidden')
        }
    }

    formAdicionarTarefa!.onsubmit = (evento) => {
        evento.preventDefault()
        console.log('onsubmit', estadoAplicacao.tarefaSelecionada)
        const descricao = inputNovaTarefa!.value
        if (!estadoAplicacao.tarefaSelecionada) {
            estadoAplicacao = adicionarTarefa(estadoAplicacao, { descricao, concluida: false })
        } else {
            estadoAplicacao.tarefaSelecionada.descricao = descricao;
        }
        formAdicionarTarefa?.classList.toggle('hidden')
        atualizarUI()
    }

    estadoAplicacao.tarefas.forEach(tarefa => {
        const li = document.createElement('li')
        li.classList.add('app__section-task-list-item')

        const svgIcon = document.createElement('svg')
        svgIcon.innerHTML = taskIconSvg

        const paragraph = document.createElement('p')
        paragraph.classList.add('app__section-task-list-item-description')
        paragraph.textContent = tarefa.descricao

        const button = document.createElement('button')
        button.classList.add('app_button-edit')

        const editIcon = document.createElement('img')
        editIcon.setAttribute('src', '/imagens/edit.png')

        button.appendChild(editIcon)

        if (tarefa.concluida) {
            button.setAttribute('disabled', 'true')
            li.classList.add('app__section-task-list-item-complete')
        }

        if (tarefa === estadoAplicacao.tarefaSelecionada) {
            const descricaoEmAndamento = document.querySelector('.app__section-active-task-description')
            //li.classList.add('app__section-task-list-item-select')
            li.classList.add('app__section-task-list-item-active')
            descricaoEmAndamento!.innerHTML = tarefa.descricao
            inputNovaTarefa!.value = tarefa.descricao
        }

        li.addEventListener("click", () => {
            estadoAplicacao = selecionarTarefa(estadoAplicacao, tarefa)
            atualizarUI()
        })

        button.addEventListener("click", (evento) => {
            evento.stopPropagation()
            formAdicionarTarefa?.classList.remove('hidden')
            estadoAplicacao = selecionarTarefa(estadoAplicacao, tarefa)
            atualizarUI()
        })

        svgIcon.addEventListener("click", (evento) => {
            evento.stopPropagation()
            tarefa.concluida = !tarefa.concluida
            estadoAplicacao = selecionarTarefa(estadoAplicacao, tarefa)
            atualizarUI()
        })

        li.appendChild(svgIcon)
        li.appendChild(paragraph)
        li.appendChild(button)

        ulTarefas?.appendChild(li)
    })
}

document.addEventListener('TarefaFinalizada', (detail) => {
    if (estadoAplicacao.tarefaSelecionada) {
        estadoAplicacao.tarefaSelecionada.concluida = true
        atualizarUI()
    }
})

atualizarUI()