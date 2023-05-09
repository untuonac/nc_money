<template>
  <TransactionListItemTemplate>
    <template #description>
      <SeamlessInput
        :placeholder="t('money', 'Description')"
        :value="split.description"
        @value-changed="handleDescriptionChanged"
      />
    </template>

    <template #account>
      <AccountSelect
        :account-id="split.destAccountId"
        :excluded-account-ids="excludedAccountIds"
        @account-changed="handleDestinationAccountChanged"
      />
    </template>

    <template #amount>
      <CurrencyInput
        :value="value"
        :placeholder="t('money', 'Value')"
        :inverted-value="invertedValue"
        :enable-convert-rate="enableConvertRate"
        :convert-rate="convertRate / split.convertRate"
        @value-changed="handleValueChanged"
        @convert-rate-changed="handleConvertRateChanged"
      />
    </template>

    <template #actionLast>
      <div
        v-if="showLoadingIcon"
        class="icon-loading-small"
      />
      <div
        v-else
        class="icon-delete"
        @click="handleDeleteSplit"
      />
    </template>
  </TransactionListItemTemplate>
</template>

<script lang="ts">
  import { defineComponent, type PropType } from 'vue';

  import type { Split } from '../stores/splitStore';
  import { useSplitService } from '../services/splitService';

  import { useAccountStore } from '../stores/accountStore';

  import TransactionListItemTemplate from './TransactionListItemTemplate.vue';
  import CurrencyInput from './CurrencyInput.vue';
  import AccountSelect from './AccountSelect.vue';
  import SeamlessInput from './SeamlessInput.vue';

  export default defineComponent({
    props: {
      split: {
        type: Object as PropType<Split>,
        required: true
      },
      excludedAccountIds: {
        type: Array as PropType<Array<number>>,
        default: () => []
      },
      isLoading: {
        type: Boolean,
        default: false
      },
      invertedValue: {
        type: Boolean,
        default: false
      },
      accountId: {
        type: Number
      },
      convertRate: {
        type: Number,
        default: 1.0
      }
    },
    emits: [ 'split-deleted' ],
    data() {
      return {
        showLoadingIcon: false
      };
    },
    computed: {
      sourceAccount() {
        return this.accountId ? this.accountStore.getById(this.accountId) : undefined;
      },
      destAccount() {
        return this.accountStore.getById(this.split.destAccountId);
      },
      enableConvertRate() {
        return !!this.sourceAccount && !!this.destAccount && this.sourceAccount.currency !== this.destAccount.currency;
      },
      value() {
        if (this.enableConvertRate) {
          return this.split.value * this.split.convertRate / this.convertRate;
        } else {
          return this.split.value;
        }
      }
    },
    watch: {
      isLoading() {
        this.showLoadingIcon = this.isLoading;
      }
    },
    methods: {
      async handleValueChanged(value: number) {
        this.split.value = value;
        await this.handleSplitChanged();
      },
      async handleConvertRateChanged(convertRate: number) {
        this.split.convertRate = this.convertRate / convertRate;
        await this.handleSplitChanged();
      },
      handleDeleteSplit() {
        this.showLoadingIcon = true;
        this.$emit('split-deleted', this.split);
      },
      async handleDescriptionChanged(description: string) {
        this.split.description = description;
        await this.handleSplitChanged();
      },
      async handleDestinationAccountChanged(accountId: number|null) {
        if(accountId) {
          this.split.destAccountId = accountId;
          await this.handleSplitChanged();
        } else {
          this.handleDeleteSplit();
        }
      },
      async handleSplitChanged() {
        this.showLoadingIcon = true;
        await this.splitService.updateSplit(this.split);
        this.showLoadingIcon = false;
      }
    },
    mounted() {
      this.showLoadingIcon = this.isLoading;
    },
    setup() {
      return {
        splitService: useSplitService(),
        accountStore: useAccountStore()
      };
    },
    components: { CurrencyInput, AccountSelect, SeamlessInput, TransactionListItemTemplate }
  });
</script>
