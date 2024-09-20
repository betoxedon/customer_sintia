
import { defineStore } from 'pinia'
import { ref } from 'vue'
import materialApi from '@/services/materialServiceApi'
import { useInterfaceStore } from '@/stores/interfaceStore'




export interface Material {
    id: number,
    name: string,
    url: string,
    urls: string[],
    type: string,
    size:string,
    multiple:boolean,
    timestamp:string,
    value: string,
}

/**
 * 
 * 
 * 
 */

export const materiaStore = defineStore('material', () => {

    const materias = ref<Material[]>([])
    const isLoading = ref(false)

    const getMaterias = async (botId: string,) => {
        try {
            isLoading.value = true
            const res = await materialApi.getMaterials(botId)
            console.log('STATUS:', res.status)
            console.log('RES:', res)

            materias.value = res;

            // if (res.response && res.response.status === 400) {
            //     materias.value = [];
            // } else if (res.status === 200) {
            //     materias.value = res;
            // } else {
            //     materias.value = [];
            // }
            isLoading.value = false
            
        } catch (error) {
            console.error('Erro ao buscar as materias:', error)
            isLoading.value = false
            throw error
        }
    }

    const createMaterial = async (botId: string, type: string, value: string | File) => {
        console.log('botId:', botId)
        console.log('type:', type)
        console.log('value:', value)

        try {
            isLoading.value = true
            const res = await materialApi.createMaterial(botId, type, value)
            console.log('resXX:', res)
            
            await getMaterias(botId)
            isLoading.value = false
            // console.log(typeof res.data)
            
            // if (Array.isArray(res.data)) {

            //     res.data.forEach((item) => {
            //         materias.value.push(item)
            //     })
            //     return
            // }
            // materias.value.push(res.data)

        } catch (error) {
            console.error('Erro ao criar a materia: [Store log]', error)
            isLoading.value = false
            throw error
        }
        
    }

    const deleteMaterial = async (botId: string,url: string) => {
        isLoading.value = true
        try {
            
            const res = await materialApi.deleteMaterial(botId,url)
            console.log('res:', res)

            materias.value.forEach((materia, index) => {
                if (materia.urls.includes(url)) {
                    materias.value.splice(index, 1)
                }
            })
            isLoading.value = false
            useInterfaceStore().notificationMessage = `Material deletado com sucesso!`
            useInterfaceStore().notificationType = 'success'
            useInterfaceStore().showNotification = true

            
        } catch (error) {
            console.error('Erro ao deletar a materia:', error)
            isLoading.value = false
            useInterfaceStore().notificationMessage = `Erro ao deletar material!`
            useInterfaceStore().notificationType = 'error'
            useInterfaceStore().showNotification = true
            throw error
        }
    }

    const deleteAllMaterials = async (botId: string) => {
        try {
            isLoading.value = true
            const res = await materialApi.deleteAllMaterials(botId)
            console.log('res:', res)
            materias.value = []
            useInterfaceStore().notificationMessage = `Materiais deletados com sucesso!`
            useInterfaceStore().notificationType = 'success'
            useInterfaceStore().showNotification = true

            //await getMaterias(botId)
            isLoading.value = false
        } catch (error) {
            console.error('Erro ao deletar todas as materias:', error)
            isLoading.value = false
            useInterfaceStore().notificationMessage = `Erro ao deletar todos os materiais!`
            useInterfaceStore().notificationType = 'error'
            useInterfaceStore().showNotification = true
            
            throw error
        }
    }

    const deleteFileMaterial = async (botId: string, urls:Array<string>) => {
        console.log(urls);  // Verifique o array de URLs gerado
        try {
            isLoading.value = true
            const res = await materialApi.deleteFileMaterial(botId,urls)
            console.log('res:', res)
            
            //materias.value  = materias.value.filter(material => !urls.includes(material.url));
            materias.value = materias.value.filter(m => m.urls !== urls)

            useInterfaceStore().notificationMessage = `Materiais deletados com sucesso!`
            useInterfaceStore().notificationType = 'success'
            useInterfaceStore().showNotification = true

            //await getMaterias(botId)
            isLoading.value = false
        } catch (error) {
            console.error('Erro ao deletar todas as materias:', error)
            isLoading.value = false
            useInterfaceStore().notificationMessage = `Erro ao deletar todos os materiais!`
            useInterfaceStore().notificationType = 'error'
            useInterfaceStore().showNotification = true
            
            throw error
        }
    }


    const $reset = () => {
        materias.value = []
    }

    return {
        materias,
        isLoading,
        $reset,
        getMaterias,
        createMaterial,
        deleteMaterial,
        deleteAllMaterials,
        deleteFileMaterial
    }

})