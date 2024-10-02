<script setup lang="ts">
   // import DrawerDefault from '@/drawer/DrawerDefault.vue'
   import AsidePlan from '@/drawer/AsidePlan.vue'
   import SideBar from '@/components/sidebars/SideBar.vue'
   
   import {useDashboardStore} from '@/stores/dashboardStore'
   //import { usePlanStore } from '@/stores/planStore'  
   import Card from 'primevue/card';
   import { onMounted, ref } from 'vue';
   import Chart from 'primevue/chart';

   const dashboardStore = useDashboardStore()

   const chartData = ref();
   const chartOptions = ref();

   const chartLineData = ref();
   const chartLineOptions = ref();

   onMounted(async () => {
         
      await dashboardStore.fetchDashboardNumbers()
      chartData.value = setChartData();
      chartOptions.value = setChartOptions();

      chartLineData.value = setChartLineData();
      chartLineOptions.value = setChartLineOptions();
   })


   const setChartLineData = () => {
    const documentStyle = getComputedStyle(document.documentElement);

    return {
        labels: dashboardStore.sessions_dates,
        datasets: [
            {
                label: 'Conversas',
                data:  dashboardStore.session_dates_count,
                fill: false,
                borderColor: documentStyle.getPropertyValue('--p-primary-500'),
                tension: 0.4
            },
        ]
    };
};
const setChartLineOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    return {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };
}


   const setChartData = () => {
    return {
        labels: dashboardStore.bots_sessions.map(bot => bot.label),
        datasets: [
            {
                label: 'Conversas',
                data: dashboardStore.bots_sessions.map(bot => bot?.value),
                backgroundColor: ['rgba(249, 115, 22, 0.2)', 'rgba(6, 182, 212, 0.2)', 'rgb(107, 114, 128, 0.2)', 'rgba(139, 92, 246 0.2)'],
                borderColor: ['rgb(249, 115, 22)', 'rgb(6, 182, 212)', 'rgb(107, 114, 128)', 'rgb(139, 92, 246)'],
                borderWidth: 1
            }
        ]
    };
   };

   const setChartOptions = () => {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
      const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

      return {
         plugins: {
               legend: {
                  labels: {
                     color: textColor
                  }
               }
         },
         scales: {
               x: {
                  ticks: {
                     color: textColorSecondary
                  },
                  grid: {
                     color: surfaceBorder
                  }
               },
               y: {
                  beginAtZero: true,
                  ticks: {
                     color: textColorSecondary
                  },
                  grid: {
                     color: surfaceBorder
                  }
               }
         }
      };
   }

</script>

<template>
   <main class="main_home">
      <!-- <<DrawerDefault />> -->
      <SideBar />
      <div class="main-inner grid-rows-[min-content_1fr]">
         <div class="main-top">
            <span class="container-inner page_title">Painel</span>
         </div>

         <div class="main-core">
            <div class="container-inner gap-3">

               <div class="dash_header flex gap-3 mb-5"> 
                  <Card
                  class="col-span-full flex flex-1 h-32 cursor-pointer flex-col rounded-lg border border-l-4 border-l-primary-30 bg-primary-10 px-4 py-4 transition hover:scale-[101%] hover:opacity-90 hover:shadow-lg desk:col-span-6 maxw:col-span-4">

                  >
                     <template #title>
                     <div>
                        Bots
                     </div>
                     </template>
                     <template #content>
                        <div class="flex justify-between items-center">
                           
                           <span>{{ dashboardStore.bots }}</span>
                           <MonoBot />
                        </div>
                     </template>
                  </Card>

                  <Card 
                  class="col-span-full flex flex-1 h-32 cursor-pointer flex-col rounded-lg border border-l-4 border-l-primary-30 bg-primary-10 px-4 py-4 transition hover:scale-[101%] hover:opacity-90 hover:shadow-lg desk:col-span-6 maxw:col-span-4">

                  >
                     <template #title>
                     <div>
                        Conversas
                     </div>
                     </template>
                     <template #content>
                        <div class="flex justify-between items-center">
                           
                           <span>{{ dashboardStore.conversations }}</span>
                           <MonoChats />
                        </div>
                     </template>
                  </Card>
               </div>

               <div class="charts flex flex-col gap-3 justify-center items-center hidden">

                  <Card class="mb-5 h-max w-full ">
                     <template #title>
                     <div>
                        Conversas por data
                     </div>
                     </template>
                     <template #content >
                        <div class="flex justify-center items-center max-w-6xl ">
                           <Chart type="line" :data="chartLineData" :options="chartLineOptions" class="h-[25rem] w-full" />
                        </div>
                     </template>
                  </Card>

                  <div class="flex gap-3 w-full">
                        
                     <Card class="">
                        <template #title>
                        <div>
                           Conversas por bot
                        </div>
                        </template>
                        <template #content>
                           <Chart  type="bar" :data="chartData" :options="chartOptions" />
                     </template>
                     </Card>

                     
                     <Card class="">
                        <template #title>
                        <div>
                           Conversas por bot
                        </div>
                        </template>
                        <template #content>
                           <Chart   type="bar" :data="chartData" :options="chartOptions" />
                     </template>
                     </Card>
                  </div>

            </div>
              
            </div>
         </div>
      </div>

      <AsidePlan />
   </main>
</template>
