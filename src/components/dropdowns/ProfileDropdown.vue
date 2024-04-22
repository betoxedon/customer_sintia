<script setup lang="ts">
  import { ref } from 'vue';
  import { setDataConfirmation } from '@/utils'

  const active = ref(false);

  const toggleMenu = () => {
    active.value = !active.value;
  };

  const onSignOut = () => {
      setDataConfirmation({
         action: 'handleSignOut',
         message: 'Tem certeza que deseja sair?',
      })
   }

</script>

<template>
  <div class="menu-dropdown" @click.stop>
    <button @click="toggleMenu">
      <MonoChevronRight class="mr-1" />    
    </button>

    <transition 
      enter-active-class="transition ease-out duration-100" 
      enter-from-class="transform opacity-0 scale-95" 
      enter-to-class="transform opacity-100 scale-100" 
      leave-active-class="transition ease-in duration-75" 
      leave-from-class="transform opacity-100 scale-100" 
      leave-to-class="transform opacity-0 scale-95"
    >
      <div v-if="active" class="menu-items">
        <div class="">
          <div class="menu-item">
            <a href="#" class="block px-4 py-2 flex gap-2 items-center">
              <MonoProfile  style="width:18px"/>
               Meu Perfil</a>
          </div>

          <div class="menu-item">
            <a href="#" class="block px-4 py-2 flex gap-2 items-center">
              <MonoSettings  style="width:18px; "/>
              Configurações</a>
          </div>

          <div class="menu-item">
            <a href="#" class="block px-4 py-2 flex gap-2 items-center">              
              <MonoUsage style="width:18px; "/>
              Uso</a>
          </div>

          <div class="menu-item">
            <a href="#" class="block px-4 py-2 flex gap-2 items-center">
              <MonoHelp style="width:18px; "  />
              Ajuda</a>
          </div>

          

          <div class="border-t my-1 border-cool-gray-100" />

          <div class="menu-item">
            <a href="#" class="block px-4 py-2 flex gap-2 items-center" @click="onSignOut()">
              <MonoSignOut  style="width:18px;"/>
              Sair</a>
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
  background-color: white;
  top: -168px;
  left: 46px;
  width: max-content;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 24%);
  z-index: 3;
  margin-top: 5px;
  min-width: 200px;
}

.menu-item {
  width: 100%;
  font-size: 16px;
}

.menu-item:hover {
  background: #eae6e6;
}
</style>
