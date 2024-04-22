<script setup lang="ts">
  import { ref, onUnmounted,onMounted} from 'vue';

  const active = ref(false);
  const activeMenu =ref<HTMLElement | null>(null);
  //import type { Agent } from '@/models/agentModel'
  const emit = defineEmits(['UpdateAgent','copyScriptAgent','deleteAgent','shareAgent']);

  const props = defineProps({

    identify: {
        type: Object,
        required:true
    },
  })

  const toggleMenu = () => {
    active.value = !active.value;
    closeMenus()
  };

  const closeMenu = () => {
    active.value = false;
  };

  const closeMenus = () => {
    // Fecha todos os menus, exceto o menu ativo
   
    document.querySelectorAll('.menu-items').forEach((menu) => {
        
        if (menu instanceof HTMLElement && menu !== activeMenu.value) {            
            menu.style.display ='none'
        }
    });
};

  const update = () => {
    emit('UpdateAgent');
  };

  const shareScript = () => {
    emit('copyScriptAgent')
  }

  const shareAgent = () => {
    emit('shareAgent')
  }

  const deleteAgent = ()=>{
    emit('deleteAgent')
  }

  onMounted(() => {
    
    // Fecha outros menus quando clicado fora
    activeMenu.value = document.querySelector(`#agent-${props?.identify?.id}`)
    
    document.addEventListener('click', (event) => {
        closeMenu()
        if (!(event.target as HTMLElement).closest('.menu-dropdown')) {
            closeMenus();
        }
    });
});

onUnmounted(() => {    
    document.removeEventListener('click', closeMenus);
});


</script>

<template>
  <div class="menu-dropdown" @click.stop >
    <button @click="toggleMenu" class="hover:text-slate-400">
      <MonoEllipsis class="" />      
    </button>
    
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div v-show="active"  class="menu-items" :id="`agent-${identify.id}`" :class="{'show':active}" ref="activeMenu">
        
        <div class="py-2">

          <div class="menu-item">
            <a @click="update()" href="#" class="block px-4 py-2 flex gap-1 items-center"
              ><MonoUpdate class="text-sm" style="width:16px" /> Editar chatbot</a
            >
          </div>

          <div class="menu-item">
            <a @click.stop="shareAgent()" href="#" class="block px-4 py-2 flex gap-1 items-center"
              ><MonoShare class="text-sm" style="width:16px" /> Compartilhar chatbot</a
            >
          </div>


          <div class="menu-item">
            <a @click.stop="shareScript()" href="#" class="block px-4 py-2 flex gap-1 items-center"
              ><MonoScript style="width:16px; " />Script de integração</a
            >
          </div>

          <div class="menu-item hidden">
            <a href="#" class="block px-4 py-2 flex gap-1 items-center">

              <MonoTraining style="width:16px;"  />
              Treinar chatbot</a
            >
          </div>

          <div class="border-t my-1 border-cool-gray-100" />

          <div class="menu-item">
            <a @click="deleteAgent()" href="#" class="block px-4 py-2 flex gap-1 items-center text-red-500"
              ><MonoTrash style="width:16px;" /> Excluir</a
            >
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.menu-dropdown {
  position: relative;
}

.menu-items {
  position: absolute;
  right: 10px;
  background-color: white;
  width: max-content;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 24%);
  z-index: 2;
  margin-top: 5px;
  display: none;
}

.menu-item {
  width: 100%;
  font-size: 14px;
}

.menu-item:hover {
  background: #eae6e6;
}
.show{
    display: block;
}

</style>