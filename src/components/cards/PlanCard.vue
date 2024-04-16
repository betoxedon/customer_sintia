<script setup>


import { useUserStore } from '@/stores/userStore'
import { usePlanStore } from '@/stores/planStore'
import { useAgentStore } from '@/stores/agentStore'
import { useInterfaceStore } from '@/stores/interfaceStore'
import { updateUserSchema } from '@/models/userModel'

const userStore = useUserStore()
const planStore = usePlanStore()
const agentStore = useAgentStore()
const interfaceStore = useInterfaceStore()

const emits = defineEmits('onSelectPlan')

const props = defineProps({
    item:{
        type: Object,
        required: false,
    },
    index:{
        type: [Number,String],
        required: false,
    },
    planActive:{
        type: [Number,String],
        required: false,
    },
})

const onSelectPlan = ((index)=>{
    emits('onSelectPlan',index)
})


</script>

<template>
    <div
        class="plan_card col-span-full flex w-full  max-w-[340px] flex-col rounded-lg border border-primary-30 bg-white px-4 py-6 hover:bg-primary-5 maxw:col-span-4 maxw:max-w-[300px]"
        :class="{
        'outline-dotted outline-offset-2 outline-primary-30 hover:bg-white':
            index === planActive,
        }">
        <span
        class="col-span-full mb-6 block border-b border-b-primary-30 font-bold">
        {{ item.planName }}
        </span>

        <div
        class="col-span-8 mb-6 flex items-center justify-center gap-x-1 rounded-lg bg-surface-10 px-3 py-2 maxw:col-span-full">
        <MonoBot class="pb-[1px]" />
        <span v-if="item.features.agentsLimit == 1" class="text-lg">
            {{ item.features.agentsLimit }} Chatbot
        </span>
        <span v-else>{{ item.features.agentsLimit }} Chatbots</span>
        </div>

        <span
        class="col-span-4 flex h-14 justify-center text-[30px] font-bold leading-9 maxw:col-span-full">
        R${{ item.planValue }},
        <span class="text-sm">00</span>
        </span>

        <div
        v-if="index === planActive"
        class="btn btn-p pointer-events-none col-span-full mb-6 bg-primary-30"
        @click="onSelectPlan(index)">
        <span>Seu plano</span>
        </div>

        <div
        v-else
        class="btn btn-p col-span-full mb-6 bg-primary-30"
        :class="{
            'btn-disabled pointer-events-none': userStore.user.planId,
        }"
        @click="onSelectPlan(index)">
        <span>Assinar</span>
        </div>

        <div class="col-span-6 flex flex-col gap-x-3">
        <span
            v-if="item.features.agentsLimit == 1"
            class="flex gap-x-2 truncate">
            <MonoCheck class="text-positive" />
            Disponível:
            {{ item.features.agentsLimit }}
            Chatbot
        </span>

        <span v-else class="flex gap-x-2 truncate">
            <MonoCheck class="text-positive" />
            Disponível: {{ item.features.agentsLimit }} Chatbots
        </span>

        <span class="flex gap-x-2 truncate">
            <MonoCheck class="text-positive" />
            {{ item.features.maxMonthlyMessagesToLocaleString }}
            créditos
        </span>

        <span
            class="mt-5 block truncate rounded-lg py-2 text-center text-sm">
            • Créditos válidos por 30 dias
        </span>
        </div>
    </div>
</template>

<style scoped>

.plan_card{
    min-width: max-content;
    width: 250px;
}

</style>