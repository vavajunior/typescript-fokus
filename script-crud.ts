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
        tarefaSelecionada: tarefa === estadoAtual.tarefaSelecionada ? null : tarefa
    }
}

const adicionarTarefa = (estadoAtual: EstadoAplicacao, tarefa: Tarefa): EstadoAplicacao => {
    return {
        ...estadoAtual,
        tarefas: [...estadoAtual.tarefas, tarefa],
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

    const formAdicionarTarefa = document.querySelector<HTMLFormElement>('.app__form-add-task')
    const btnAdicionarTarefa = document.querySelector<HTMLButtonElement>('.app__button--add-task')
    const inputNovaTarefa = document.querySelector<HTMLTextAreaElement>('.app__form-textarea')

    if (btnAdicionarTarefa) {
        btnAdicionarTarefa.onclick = () => {
            formAdicionarTarefa?.classList.toggle('hidden')
        }
    }

    formAdicionarTarefa!.onsubmit = (evento) => {
        evento.preventDefault()
        const descricao = inputNovaTarefa!.value
        estadoAplicacao = adicionarTarefa(estadoAplicacao, { descricao, concluida: false })
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

        li.addEventListener("click", () => {
            console.log('Tarefa selecionada', tarefa)
            estadoAplicacao = selecionarTarefa(estadoAplicacao, tarefa)
            atualizarUI()
        })

        li.appendChild(svgIcon)
        li.appendChild(paragraph)
        li.appendChild(button)

        ulTarefas?.appendChild(li)
    })
}

atualizarUI()