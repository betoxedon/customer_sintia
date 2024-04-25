
<script setup lang="ts">
import SideBarItem from '@/components/sidebars/SideBarItem.vue'
import { ref } from 'vue'
import { setDataConfirmation } from '@/utils'
// import ProfileDropdown from '@/components/dropdowns/ProfileDropdown.vue'

//import { useRouter } from 'vue-router'
import { useInterfaceStore } from '@/stores/interfaceStore'
import { useUserStore } from '@/stores/userStore'
import MonoLogo from '../icons/MonoLogo.vue'
import MonoSignOut from '../icons/MonoSignOut.vue'
import MonoUser from '../icons/MonoUser.vue'

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'


const interfaceStore = useInterfaceStore()
//const router = useRouter()
const userStore = useUserStore()

const is_expanded = ref(true)

const ToggleMenu = () => {
	is_expanded.value = !is_expanded.value	
}




const onSignOut = () => {
    setDataConfirmation({
       action: 'handleSignOut',
       message: 'Tem certeza que deseja sair?',
    })
 }

</script>

<template>
	<aside class="" :class="`${is_expanded  ? 'is-expanded' : ''}`">
		
        <div class="logo flex justify-between">
			<!-- <img :src="logoURL" alt="Vue" />  -->
            <div class="flex items-center gap-2"> 
                <MonoLogo class="icon-logo"/>
                <span class="site-name" v-if="is_expanded">SINTIA</span>
            </div>
            <div class="menu-toggle-wrap">
			    <button class="menu-toggle" @click="ToggleMenu">
				    <MonoChevronLeft v-if="is_expanded"/>
                    <MonoChevronRight v-else/>
			    </button>
		    </div>

		</div>		
	
		<div class="menu flex flex-col justify-between h-full mt-3">	
          
            <div class="flex  flex-col">   

                <SideBarItem to="/" icon="dashboard " text="Dashboard" :is_expanded="is_expanded">
                    <template #icon>
                        <MonoDashboard/>
                    </template>
                </SideBarItem>

                <SideBarItem to="/agente" icon="agente " text="Chatbots" :is_expanded="is_expanded">
                    <template #icon>
                        <MonoBot/>
                    </template>
                </SideBarItem>

                <SideBarItem class="" to="/planos" icon="planos " text="Plano" :is_expanded="is_expanded">
                    <template #icon>
                        <MonoBox
                            />
                    </template>
                </SideBarItem>              
            </div>          

            <div class="user-menu">		
                   
                <div class="end hidden">
                    <SideBarItem to="/profile" icon="user " text="Perfil" :is_expanded="is_expanded">
                        <template #icon>
                            <MonoUser/>
                        </template>
                    </SideBarItem>

                    <SideBarItem to="/configuracoes" icon="dashboard " text="Configurações" :is_expanded="is_expanded">
                        <template #icon>
                            <MonoSettings />
                        </template>
                    </SideBarItem>
                </div>            

                <div class="flex w-full items-center gap-x-1 pt-3 border-t-2 ">
                        
                    <div
                        class="m-1 flex aspect-square w-14 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full outline outline-1 outline-offset-2 outline-primary-40"
                        @click="interfaceStore.showDialogUserImage = true">
                        <img
                            v-if="userStore.user.profile_picture"
                            :src="userStore.user.profile_picture"
                            class="object-cover transition duration-700 h-full" />

                        <MonoUser v-else class="h-10 p-1.5 text-primary-30" />
                    </div>
                    
                    

                        <div class="flex w-full flex-col overflow-hidden" v-if="is_expanded">
                            <span class="truncate pl-2 font-bold">
                                {{ userStore.user.first_name }} {{ userStore.user.last_name }}
                            </span>
                            <span class="truncate pl-2 text-base">
                                {{ userStore.user?.email }}
                            </span>                        
                        </div>                                      
                    
               
                    <!-- <ProfileDropdown/> -->

                    <Menu as="div" class="relative ml-3">

                        <MenuButton class="relative flex rounded-full text-sm hover:bg-slate-200">
                            <MonoChevronRight class="" />    
                        </MenuButton>

                        <!-- TRANSITION-->
                        <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                            <MenuItems class="absolute z-10 mt-2 w-48 bottom-0 left-8 origin-left-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <MenuItem v-slot="{ active }">
                                    <a href="#" class="menuItem" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">
                                        <MonoUser class="h-5 w-5 border-rounded  cursor-pointer text-primary-600" />
                                        <span>Perfil</span>
                                    </a>
                                </MenuItem>

                                <MenuItem v-slot="{ active }">
                                    <a href="#" class="menuItem" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">
                                        <MonoSettings class="h-5 w-5 cursor-pointer text-primary-600" />
                                        <span> Configurações</span>
                                    </a>
                                </MenuItem>

                                <hr>

                                <MenuItem v-slot="{ active }">
                                    <a @click="onSignOut" href="#" class="menuItem" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">
                                       <MonoSignOut class="h-5 w-5 cursor-pointer text-red-600" /> 
                                        <span>Sair</span>
                                    </a>
                                </MenuItem>

                            </MenuItems>
                        </transition>

                    </Menu>
                   
                    <div @click="onSignOut" class=" hidden p-1 cursor-pointer text-red-600 hover:bg-slate-200 rounded">
                        <MonoSignOut class="h-6 w-6 cursor-pointer" />
                    </div>

                </div>
		    </div>

		</div>		

	</aside>
</template>


<style  scoped>

.border-rounded{
    border: 1px solid;
    border-radius: 50%;
    padding: 1px;
}

.menuItem {
    display: flex;
    gap: .5rem;
    align-items: center;
    padding: .7rem 1rem;
}

aside {
	display: flex;    
	flex-direction: column;
    gap: 1.5rem;
    width: max-content;		
	/* min-height: 100vh; */
    max-width: 320px;
	padding: 1rem;
	transition: 0.2s ease-in-out;
    border: 1px solid #4f8aff;   
    border-radius: 16px;  
}
aside.is-expanded {   
    width: 320px;
    min-width: 320px;
}

.logo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;    
}
.icon-logo {
    width: 2rem;
    height: 2rem;
    fill: #4f8aff;
    color: #4f8aff;
}
.site-name {
    font-size: 1.25rem;
    font-weight: bold;
    color: #4f8aff;
    letter-spacing: 0.25em;
}
.menu-toggle-wrap {
    position: relative;
    right: auto;
    left: auto;
    z-index: 90;
    background: #4f8aff;
    border-radius: 4px;
    display: flex;
    color: white;
}
@media only screen and (max-width: 768px) {
  /* For mobile phones: */
    aside {
        display: none;
    }
}

</style>