
import { defineStore } from 'pinia'
import { ref } from 'vue'
import materialApi from '@/services/materialServiceApi'


interface Materia {
    id: number,
    name: string,
    url: string,
    type: string,
    value: string,
}

/**
 * 
 * 
 * 
 */

export const materiaStore = defineStore('materia', () => {

    const materias = ref<Materia[]>([])

    const getMaterias = async () => {
        try {
            const res = await materialApi.getMaterials()
            materias.value = res.data
        } catch (error) {
            console.error('Erro ao buscar as materias:', error)
            throw error
        }
    }

    const createMaterial = async (botId: string, type: string, value: string | File) => {
        console.log('botId:', botId)
        console.log('type:', type)
        console.log('value:', value)

        try {
            const res = await materialApi.createMaterial(botId, type, value)
            console.log('resXX:', res)
            console.log(typeof res.data)
            
            if (Array.isArray(res.data)) {

                res.data.forEach((item) => {
                    materias.value.push(item)
                })
                return
            }
            materias.value.push(res.data)
        } catch (error) {
            console.error('Erro ao criar a materia: [Store log]', error)
            throw error
        }
        
    }



    const $reset = () => {
        materias.value = []
    }

    return {
        materias,
        $reset,
        getMaterias,
        createMaterial
    }

})