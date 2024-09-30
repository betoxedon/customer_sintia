import { defineStore } from 'pinia';
import { ref } from 'vue';
import dashboardApi from '@/services/dashboardApi'

export const useDashboardStore = defineStore('dashboard', () => {
  const bots = ref([]);
  const conversations = ref([]);
  const selectedBot = ref<number | null>(null);  // Bot que será selecionado para o filtro
  const filteredConversations = ref([]);  // Conversas filtradas pelo bot selecionado

  // Função para buscar os números do dashboard
  const fetchDashboardNumbers = async () => {
    try {
      const response = await dashboardApi.getData()
      bots.value = response.data.bots_created;
      conversations.value = response.data.total_conversations;
      filteredConversations.value = conversations.value; // Por padrão, mostra todas as conversas
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard', error);
    }
  };

  // Função para filtrar as conversas pelo bot selecionado
  const filterConversationsByBot = (botId: number) => {
    selectedBot.value = botId;
    filteredConversations.value = conversations.value.filter((conv: any) => conv.bot.id === botId);
  };

  return {
    bots,
    conversations,
    selectedBot,
    filteredConversations,
    fetchDashboardNumbers,
    filterConversationsByBot,
  };
});
