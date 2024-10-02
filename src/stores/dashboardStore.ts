import { defineStore } from 'pinia';
import { ref } from 'vue';
import dashboardApi from '@/services/dashboardApi'

interface BotSession {
  label: string;
  value: number;
}

export const useDashboardStore = defineStore('dashboard', () => {
  const bots = ref(0);
  const conversations = ref(0);
  const selectedBot = ref<number | null>(null);  // Bot que será selecionado para o filtro
  const filteredConversations = ref([]);  // Conversas filtradas pelo bot selecionado

  const sessions_dates = ref([])
  const session_dates_count = ref([])
  const bots_sessions = ref<BotSession[]>([]); 

  // Função para buscar os números do dashboard
  const fetchDashboardNumbers = async () => {
    try {
      const response = await dashboardApi.getData()
      bots.value = response.data.bots_created;
      conversations.value = response.data.total_conversations;
      //filteredConversations.value = conversations.value; // Por padrão, mostra todas as conversas
      sessions_dates.value = response.data.dates_session
      session_dates_count.value = response.data.counts_session
      bots_sessions.value = response.data.bots_sessions

    } catch (error) {
      console.error('Erro ao buscar dados do dashboard', error);
    }
  };

  // Função para filtrar as conversas pelo bot selecionado
  // const filterConversationsByBot = (botId: number) => {
  //   selectedBot.value = botId;
  //   filteredConversations.value = conversations.value.filter((conv: any) => conv.bot.id === botId);
  // };

  return {
    bots,
    conversations,
    selectedBot,
    filteredConversations,
    fetchDashboardNumbers,
    //filterConversationsByBot,
    bots_sessions,
    session_dates_count,
    sessions_dates
  };
});
