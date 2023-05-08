<template>
  <span class="errorLink"><nuxt-link :to="path">Retourner</nuxt-link></span>
</template>

<script>
export default {
  name: 'GoBackLink',
  data() {
    return {
      path: '/'
    };
  },
  created() {
    if (this.$nuxt?.context?.from?.path)
      this.path = this.$nuxt.context.from.path;
  }
};
</script>
<style lang="scss" scoped>
.errorLink {
  a {
    color: white;
  }
}
</style>
