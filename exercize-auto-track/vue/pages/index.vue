<template>
  <div>index</div>
</template>
<script>
export default {
  data() {
    return {
      name_$track: 'xiaoming'
    };
  },

  computed: {
    next_$track() {
      this.$track()
    }

  },
  methods: {
    handleClick_$track() {
      this.$track()
      console.log(11111);
    },

    handleOk_$track() {
      this.$track()
      console.log(2222);
    }

  }
};
</script>