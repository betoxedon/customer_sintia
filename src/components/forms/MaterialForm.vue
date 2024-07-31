<script lang="ts" setup>
import { ref, computed } from 'vue';
import { materiaStore } from '@/stores/materialStore'
import { useInterfaceStore } from '@/stores/interfaceStore'
const interfaceStore = useInterfaceStore()

const useMaterialStore = materiaStore()

interface MediaType {
  value: string;
  label: string;
  icon: string;
  accept?: string;
}

const props = defineProps({
  botId: {
    type: String,
    required: true,
  },
});

// onMounted(() => {
//   if 
// })

const mediaTypes = ref<MediaType[]>([
  { value: 'url', label: 'URL', icon: 'link-outline' },
  // { value: 'instagram', label: 'URL do Instagram', icon: 'logo-instagram' },
  // { value: 'youtube', label: 'URL do YouTube', icon: 'logo-youtube' },
  // { value: 'audio', label: 'Arquivo de Áudio', icon: 'musical-notes-outline', accept: '.mp3,.wav' },
  // { value: 'csv', label: 'CSV', icon: 'document-outline', accept: '.csv' },
  { value: 'pdf', label: 'PDF', icon: 'document-outline', accept: '.pdf' },
  { value: 'doc', label: 'DOC', icon: 'document-outline', accept: '.doc,.docx' },
]);

const loading = ref(false);
const selectedType = ref<string>('url');
const mediaInput = ref<string>('');
const file = ref<File | null>(null);
const isdragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const state = ref('default'); // default, loading, error, success

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const getIconFromSelectedType = computed(() => {
  const selected = mediaTypes.value.find(type => type.value === selectedType.value);
  return selected ? selected.icon : '';
});

const isUrlInput = computed(() => ['url', 'instagram', 'youtube'].includes(selectedType.value));

const fileAccept = computed(() => {
  const selected = mediaTypes.value.find(type => type.value === selectedType.value);
  return selected ? selected.accept : '';
});

const selectType = (type: string) => {
  selectedType.value = type;
  mediaInput.value = '';
  file.value = null;
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    file.value = target.files[0];
  }
};

const handleSubmit = () => {
  loading.value = true;
  if (isUrlInput.value) {
    console.log(`Enviando ${selectedType.value}:`, mediaInput.value);
    // Adicione lógica para enviar o link para o endpoint correspondente
    console.log('botId', props.botId)
    console.log('selectedType', selectedType.value)
    console.log('mediaInput', mediaInput.value)
    
    useMaterialStore.createMaterial(props.botId,selectedType.value, mediaInput.value ).then((response) => {
      console.log('response', response)
      resetState();
      loading.value = false;
      interfaceStore.notificationMessage = `Material enviado com sucesso`
      interfaceStore.notificationType = 'success'
      interfaceStore.showNotification = true
    }).catch((error) => {
      console.log('error', error)
      loading.value = false;
      interfaceStore.notificationMessage = `Erro ao tentar enviar o material`
      interfaceStore.notificationType = 'alert'
      interfaceStore.showNotification = true

    })
    
    
  } else if (file.value) {
    console.log(`Enviando ${selectedType.value} arquivo:`, file.value)
    // Adicione lógica para enviar o arquivo para o endpoint correspondente
    useMaterialStore.createMaterial(props.botId,selectedType.value, file.value ).then((response) => {
      console.log('response', response)
      resetState();
      loading.value = false;
      interfaceStore.notificationMessage = `Material enviado com sucesso`
      interfaceStore.notificationType = 'success'
      interfaceStore.showNotification = true
    }).catch((error) => {
      console.log('error', error.response.data.error)
      const errorMessage = error.response.data.error || 'Erro ao tentar enviar o material'
      loading.value = false;
      interfaceStore.notificationMessage = errorMessage
      interfaceStore.notificationType = 'alert'
      interfaceStore.showNotification = true

    })

  } else {
    loading.value = false;
    interfaceStore.notificationMessage = `Selecione um arquivo ou cole um link`
    interfaceStore.notificationType = 'alert'
    interfaceStore.showNotification = true
  }
};

const resetState = () => {
  state.value = 'default';
  mediaInput.value = '';
  file.value = null;
};
const stateClass = computed(() => {
  return {
    'upload-default': state.value === 'default',
    'upload-loading': state.value === 'loading',
    'upload-error': state.value === 'error',
    'upload-success': state.value === 'success',
    'is-dragging': isdragging.value,
  };
});
</script>

<template>
  <div class="material-container">
    <span class="text-lg font-medium">Selecione o tipo de mídia</span>
    <div class="options-materia">
      <button
        v-for="type in mediaTypes"
        :key="type.value"
        @click="selectType(type.value)"
        :class="{
          'bg-blue-500 text-white': selectedType === type.value,
          'bg-gray-200': selectedType !== type.value,
          'flex items-center': true
        }"
        class="p-2"
      >
        <ion-icon :name="type.icon" class="w-6 h-6"></ion-icon>
        <span>{{ type.label }}</span>
      </button>
    </div>

    <div class="mt-4" v-if="selectedType">

      <!-- <ion-icon :name="getIconFromSelectedType" class="w-6 h-6"></ion-icon>
      <input
        v-if="isUrlInput"
        v-model="mediaInput"
        type="text"
        placeholder="Cole seu link aqui"
        class="p-2 border rounded w-full"
      /> -->

      <div v-if="isUrlInput" class="input-with-icon border  border-onsurface-10 rounded-lg ">
        <ion-icon :name="getIconFromSelectedType" class="w-6 h-6"></ion-icon>
        <input
          v-model="mediaInput"
          type="text"
          :placeholder="`Cole seu link ${selectedType !== 'url' ? 'do ' +selectedType + ' ': ''}aqui`"
          class="p-2 url-input w-full"
        />
      </div>


      <div v-else :class="['file-upload', stateClass]" @click="triggerFileInput" @dragover.prevent="isdragging = true" @dragleave="isdragging = false" @dragenter.prevent @drop.prevent="handleFileUpload">
        
        <label for="file-upload" class="file-upload-label">
          <ion-icon name="cloud-upload-outline"></ion-icon> Clique ou arraste e solte um arquivo aqui para enviar
        </label>
        <input ref="fileInput" style="display: none" type="file" id="file-upload" class="file-upload-input" @change="handleFileUpload" :accept="fileAccept" multiple />
        <span>
          Arraste e solte seu arquivo 
          <span class="flex-types">
            {{ selectedType }}
          </span>
          aqui ou clique para selecioná-lo.
        </span>
        <div v-if="file" class="mt-2 p-2 bg-gray-100 rounded">
          <span>{{ file.name }}</span>
        </div>
      </div>
    </div>

    <button 
      v-if="selectedType" 
      :disabled="state === 'loading' || !selectedType || (!isUrlInput && !file) || loading" 
      :class="['mt-4', 'p-2', 'bg-blue-500', 'text-white', 'rounded', 'btn-send', stateClass]" 
      @click="handleSubmit" class="mt-4 p-2 bg-blue-500 text-white text-center rounded btn-send">
      <AnimLoadingBtn v-if="loading" />
      <span class="text-white" v-else>Enviar</span>
    </button>
  
  </div>
</template>

<style scoped>
.options-materia {
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 100%;
  border-radius: 8px;
  gap: 10px;
  
}
.options-materia button {
  border-radius: 8px;
  padding: 10px;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  gap: 10px;
}
.material-container {
  padding: 20px;
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  height: max-content;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}
.btn-send {
  cursor: pointer;
  display: flex;
  transition: background-color 0.3s;
  width: 100%;
  max-width: 200px;
  align-self: flex-end;
  justify-content: center;
  color: white;

}
.btn-send:hover {
  background-color: #1a365d;
}
.media-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.media-types {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.flex-types {
  display: inline-block;
  padding: 5px;
  border-radius: 5px;
  text-transform: uppercase;
}

.media-button {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f8f8f8;
  cursor: pointer;
}
.media-button.active {
  background-color: #d3d3d3;
}
.file-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 2px dashed #ccc;
  border-radius: 5px;
  width: 100%;
  text-align: center;
  cursor: pointer;
}
.file-upload-label {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-direction: column;
}
.file-upload-label  ion-icon {
  font-size: 40px;
  color: #ccc;
}
.file-upload-input {
  display: none;
}
.file-upload.is-dragging {
  background-color: #f0f0f0;
  border-color: #4f8aff;
}
.is-dragging ion-icon {
  color: #4f8aff;
}
.file-upload:hover {
  background-color: #f0f0f0;
  border-color: #4f8aff;
}

.input-with-icon {
  display: flex;
  align-items: center;
  /* border: 1px solid #ccc; */
  border-radius: 5px;
  padding: 6px 12px;
}
.input-with-icon ion-icon {
  margin-right: 10px;
  padding: 4px;
    background: cornflowerblue;
    border-radius: 6px;
    color: white;
}

.url-input {
  width: 100%;
  border: none;
  outline: none;
}
.url-input:active, .url-input:focus {
  border: none;
  outline: none;
  box-shadow: none;
}


</style>
