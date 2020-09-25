const moment = require('moment')
const axios = require('axios')

const baseUrl = 'http://localhost:3001/tarefas'

// Retorna as tarefas pendentes de acordo com a data passada
const getAgenda = async data => {
    // Passando na url os parametros de ordenação
    const url = `${baseUrl}?_sort=dt_previsao,descricao&_order=asc`
    const res = await axios.get(url)
    /*Verifica se a data de conclusão é nula e se a data de previsão é anterior a data 
    atual*/ 
    const pendente = item => item.dt_conclusao === null
        && moment(item.dt_previsao).isSameOrBefore(data)
    return res.data.filter(pendente)
}

// Traz uma tarefa especifica, baseado no id recebido como parametro
const getTarefa = async id => {

    const resp = await axios.get(`${baseUrl}/${id}`)
    return resp.data
}

// Retorna as tarefas sem nenhuma data definida
const getTarefas = async () => {
    const res = await axios.get(`${baseUrl}?_sort=descricao&_order=asc`)
    return res.data.filter(item => item.dt_previsao === null && item.dt_conclusao === null)
}

// Retorna as tarefas concluidas
const getConcluidas = async () => {
    const res = await axios.get(`${baseUrl}?_sort=dt_previsao,descricao&_order=asc`)
    return res.data.filter(item => item.dt_conclusao !== null)
}

// Adiciona uma tarefa apenas com a descrição passada pelo usuário, usando o post
const incluirTarefa = async desc => {
    const res = await axios.post(`${baseUrl}`, { descricao: desc, dt_previsao: null, dt_conclusao: null, observacao: null })
    return res.data
}

// Adiciona a data de conclusão a tarefa
const concluirTarefa = async id => {
    const tarefa = await getTarefa(id)
    const res = await axios.put(`${baseUrl}/${id}`, { ...tarefa, dt_conclusao: moment().format('YYYY-MM-DD') })
    return res.data
}

// Exclui a tarefa pelo id, usando o metodo delete do axios
const excluirTarefa = async id => {
    await axios.delete(`${baseUrl}/${id}`)
}

// Altera a data de previsão da tarefa

/*O segundo parametro do axios.put é um objeto, que utiliza um spred operator, ele pega
todos os atrubutos da tarefa e altera apenas a dt_previsao, depois é passado esse objeto, 
como atualização*/ 
const atualizarDataTarefa = async (idTarefa, data) => {
    const tarefa = await getTarefa(idTarefa)
    const res = await axios.put(`${baseUrl}/${idTarefa}`,
        { ...tarefa, dt_previsao: data.format('YYYY-MM-DD') })
    return res.data
}

// Atualiza a observação de uma tarefa
const atualizarObsTarefa = async (idTarefa, obs) => {
    const tarefa = await getTarefa(idTarefa)
    const res = await axios.put(`${baseUrl}/${idTarefa}`,
        { ...tarefa, observacao: obs })
    return res.data
}

module.exports = {
    getAgenda,
    getTarefa,
    getTarefas,
    getConcluidas,
    incluirTarefa,
    concluirTarefa,
    excluirTarefa,
    atualizarDataTarefa,
    atualizarObsTarefa
}