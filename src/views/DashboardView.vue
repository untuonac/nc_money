<template>
  <NcAppContent>
    <div class="m-8">
      <Chart :title="t('money', 'Equity')">
        <LineChart :data="equityLineChartData" />
      </Chart>

      <Chart :title="`${t('money', 'Assets')}/${t('money', 'Liabilities')}`">
        <LineChart :data="assetsLiabilitiesLineChartData" />
      </Chart>
    </div>
  </NcAppContent>
</template>

<script setup lang="ts">

  import colors from 'tailwindcss/colors';

  import { computed } from 'vue';

  import { useAccountStore } from '../stores/accountStore';
  import { AccountTypeType } from '../stores/accountTypeStore';

  import NcAppContent from '@nextcloud/vue/dist/Components/NcAppContent';

  import LineChart, { type Data as LineChartData } from '../components/charts/LineChart.vue';

  import Chart from '../components/dashboard/Chart.vue';

  import { GraphDataUtils } from '../utils/graphDataUtils';

  const accountStore = useAccountStore();

  const equityLineChartData = computed((): LineChartData => {
    const data = GraphDataUtils.createBarGraphData({
      callback: (date) => {
        return accountStore.getBalanceByType(
          AccountTypeType.ASSET,
          date.year(),
          date.month() + 1
        ).value + accountStore.getBalanceByType(
          AccountTypeType.LIABILITY,
          date.year(),
          date.month() + 1
        ).value;
      }
    });

    return {
      labels: data.map(d => d.label),
      datasets: [
        {
          values: data.map(d => d.value)
        }
      ]
    };
  });

  const assetsLiabilitiesLineChartData = computed((): LineChartData => {
    const assetsData = GraphDataUtils.createBarGraphData({
      callback: (date) => {
        return accountStore.getBalanceByType(
          AccountTypeType.ASSET,
          date.year(),
          date.month() + 1
        ).value;
      }
    });

    const liabilitiesData = GraphDataUtils.createBarGraphData({
      callback: (date) => {
        return accountStore.getBalanceByType(
          AccountTypeType.LIABILITY,
          date.year(),
          date.month() + 1
        ).value;
      }
    });

    return {
      labels: assetsData.map(d => d.label),
      datasets: [
        {
          values: assetsData.map(d => d.value),
          color: colors.lime[500]
        },
        {
          values: liabilitiesData.map(d => d.value),
          color: colors.orange[500]
        }
      ]
    };
  });

</script>
