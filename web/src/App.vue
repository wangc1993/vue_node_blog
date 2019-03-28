<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
$columns: 4;
%multiLine-ellipse {
  text-overflow: ellipsis;
  overflow: hidden;
  word-wrap: break-word;
  word-spacing: normal;
  word-break: break-all;
  width: 100%;
  white-space: normal;
  /* autoprefixer: off */
  -webkit-box-orient: vertical;
  display: block;
  display: -webkit-box;
  text-align: left;
}

@mixin multiLine-ellipse-list {
  @for $i from 1 through $columns - 1 {
    .multiLine-ellipse-#{$i} {
      @extend %multiLine-ellipse;
      -webkit-line-clamp: $i;
    }
  }
}

@include multiLine-ellipse-list;
</style>
